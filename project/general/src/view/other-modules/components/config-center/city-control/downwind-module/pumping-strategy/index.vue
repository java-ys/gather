<template>
  <div>
    <Form
      ref="topFormValidate"
      :model="topParams"
      :rules="topRules"
      :label-width="110"
      class="top-form"
    >
      <div class="flex-box">
        <FormItem label="所选城市 :">
          {{ parentParams.cityName }}
        </FormItem>
        <FormItem label="业务线 :">
          {{ typeModuleMap[parentParams.businessType] }}
        </FormItem>
      </div>
      <FormItem
        label="策略名称 :"
        prop="name"
      >
        <Input
          v-if="addViewStatus || popDownwindAccountViewAction === 'edit'"
          v-model="topParams.name"
          :maxlength="15"
          placeholder="请输入策略名称"
          style="width: 200px"
        />
        <span v-else>{{ topParams.name }}</span>
      </FormItem>
      <FormItem
        label="生效时间 :"
        prop="effectiveTime"
      >
        <DatePicker
          v-if="addViewStatus || popDownwindAccountViewAction === 'edit'"
          v-model="topParams.effectiveTime"
          type="datetime"
          placeholder="请选择生效时间"
          style="width: 200px"
        />
        <span v-else>{{ topParams.effectiveTime }}</span>
      </FormItem>
      <FormItem
        label="抽成阶梯 :"
        prop="number"
      >
        <div
          v-if="addViewStatus || popDownwindAccountViewAction === 'edit'"
          class="pumping-detail-list"
        >
          <list
            :formDynamic="formDynamic"
            :eventEmitterInstance="eventEmitterInstance"
            @addTypeItem="addTypeItem"
            @delTypeItem="delTypeItem"
          />
        </div>
        <div
          v-else
          class="pumping-detail-list"
        >
          <div
            v-for="(item, key) in formDynamic.column"
            :key="key"
          >
            <span>阶梯{{ `${key + 1}` }}：</span>
            <span>{{
              `${item.min}${item.status == 0 ? "至" : "元以上"}`
            }}</span>
            <span>{{ `${item.max}` }}</span>
            <span v-show="item.max">元</span>
            <span>抽成方式：</span>
            <span>{{
              item.type == 0
                ? "固定金额"
                : item.type == 1
                  ? "固定比列"
                  : "固定金额+固定比例"
            }}</span>
            <span>抽成标准：</span>
            <span>{{ `${item.fixModel}` }}</span>
            <span v-show="item.fixModel">元</span>
            <span>{{ `${item.ExtraRatio}` }}</span>
            <span v-show="item.ExtraRatio">%</span>
          </div>
        </div>
      </FormItem>
    </Form>
    <div class="popView-footer-wrap">
      <Button
        size="large"
        type="text"
        style="margin-right: 8px;"
        @click="commit(0)"
      >
        取消
      </Button>
      <Button
        size="large"
        type="primary"
        @click="commit(1)"
      >
        确定
      </Button>
    </div>
  </div>
</template>

<script>
  import list from "./list";
  import { typeModuleMap } from "_g/config/status-map";
  import { errorCaptured, findComponentsDownward, eventEmitter } from "../utils";
  import moment from "moment";
  import {
    addCutPolicy,
    cutPolicySelectDetails,
    cutPolicyUpdateCutPolicy,
    toResult
  } from "_o/api/cityOpen";

  export default {
    components: {
      list
    },
    props: {
      parentParams: {
        type: Object,
        default: null
      },
      value: Boolean,
      popDownwindAccountViewAction: String
    },
    data() {
      return {
        topRules: {
          name: [
            { required: true, validator: this.validatorName, trigger: "change" }
          ],
          effectiveTime: [
            { required: true, trigger: "change", validator: this.validatorEffectiveTime }
          ],
          number: [{ required: true, validator: this.effectiveNum }],
          effectiveType: [
            {
              required: true,
              type: "string",
              message: "请选择订单类型",
              trigger: "change"
            }
          ]
        },
        addViewStatus: "",
        topParams: {},
        typeModuleMap,
        eventEmitterInstance: null,
        formDynamic: {
          column: [
            {
              max: 0,
              min: 0,
              status: 0,
              type: 0,
              fixModel: 0, // 金额
              ExtraRatio: 0 // 比例
            }
          ]
        },
        uuid: ""
      };
    },
    computed: {
      addParams() {
        return {
          cityUuid: this.parentParams.cityUuid,
          ruleName: this.topParams.name,
          ruleType: 2, // (1:取消策略,2:抽成策略,3:提成策略)
          productType: 1, // 业务线类型(1: 顺风车)
          effectiveTime: moment(this.topParams.effectiveTime).format("YYYY-MM-DD HH:mm:ss"),
          cityName: this.parentParams.cityName,
          province: this.parentParams.provinceName,
          pumpingLadderDtoList: this.pumpingLadderDtoList,
        }
      },
      pumpingLadderDtoList() {
        let params = [];
        this.formDynamic.column.forEach(item => {
          if (item.type === 0) { // 固定金额
            if (Number(item.status === 1)) { // 以上
              params.push({
                pumpingMoney: Number(item.fixModel),
                startMoney: Number(item.min),
                pumpingWay: 1
              })
            } else {
              params.push({
                pumpingMoney: Number(item.fixModel),
                endMoney: Number(item.max),
                startMoney: Number(item.min),
                pumpingWay: 1
              })
            }
          } else if (item.type === 1) {
            if (Number(item.status === 1)) {
              params.push({
                pumpingProportion: Number(item.ExtraRatio),
                startMoney: Number(item.min),
                pumpingWay: 2
              })
            } else {
              params.push({
                pumpingProportion: Number(item.ExtraRatio),
                endMoney: Number(item.max),
                startMoney: Number(item.min),
                pumpingWay: 2
              })
            }
          } else if (item.type === 2) {
            if (Number(item.status === 1)) {
              params.push({
                pumpingProportion: Number(item.ExtraRatio),
                pumpingMoney: Number(item.fixModel),
                startMoney: Number(item.min),
                pumpingWay: 3
              })
            } else {
              params.push({
                pumpingProportion: Number(item.ExtraRatio),
                pumpingMoney: Number(item.fixModel),
                endMoney: Number(item.max),
                startMoney: Number(item.min),
                pumpingWay: 3
              })
            }

          }
        })
        return params;
      }
    },
    watch: {
      async value() {
        if (this.value) {
          if (this.popDownwindAccountViewAction === "add") {
            this.addViewStatus = true;
            this.$refs.topFormValidate.resetFields();
            this.topParams = {};
            this.formDynamic = {
              column: [
                {
                  max: "",
                  min: 0,
                  status: 0,
                  type: 0,
                  fixModel: "",
                  ExtraRatio: ""
                }
              ]
            };
          } else if (this.popDownwindAccountViewAction === "detail") {
            this.addViewStatus = false;
            this.$refs.topFormValidate.resetFields();
          } else {
            this.addViewStatus = false;
          }
          this.clearList()
        }
      }
    },
    mounted() {
      this.eventEmitterInstance = new eventEmitter();
      let self = this;

      this.eventEmitterInstance.on("del", function(i) {
        if (self.formDynamic.column[i + 1]) self.formDynamic.column[i + 1].min = self.formDynamic.column[i].min;
      });

      this.eventEmitterInstance.on("update", function(i, val) {
        if (self.formDynamic.column[i + 1]) self.formDynamic.column[i + 1].min = val;
      });
      this.$once("hook:beforeDestory", function() {
        this.eventEmitterInstance.off();
        this.eventEmitterInstance = null;
      });
    },
    methods: {
      validatorName(rule, value, callback) {
        if (!this.topParams.name) {
          callback(new Error("请输入策略名称"))
        } else {
          callback()
        }
      },
      validatorEffectiveTime(rule, value, callback) {
        let date = this.topParams.effectiveTime
        if (!date) { callback(new Error("请选择生效时间")) }
        else {
          let timestamp = new Date(date).getTime()
          if (timestamp < Date.now()) {
            callback(new Error("生效时间不得小于当前时间"))
          } else { callback() }
        }
      },
      clearList() {
        this.$nextTick(() => {
          let refsArr =  findComponentsDownward(this, "list");
          refsArr.map((item) => {
            item.$refs.myRef && item.$refs.myRef.resetFields()
          })
        })
      },
      effectiveNum(rule, value, callback) {
        if (this.formDynamic.column.length === 0) return;
        if (this.formDynamic.column[this.formDynamic.column.length - 1].status !== 1) {
          callback(new Error("请将阶梯价格填写完整"))
        }
        callback();
      },
      async goDetail(params) {
        this.uuid = params; // 编辑到的uuid
        const [err, data] = await toResult(cutPolicySelectDetails({ uuid: params }));
        if (!data) return;
        let resData = data.pumpingLadderDtoList;
        this.topParams.name = data.ruleName;
        this.topParams.effectiveTime = data.effectiveTime;
        this.formDynamic.column = [];
        resData.forEach(item => {
          this.formDynamic.column.push({
            max: item.endMoney || "",
            min: item.startMoney,
            status: item.endMoney === null ? 1 : 0,
            type: item.pumpingWay - 1,
            fixModel: item.pumpingMoney || "",
            ExtraRatio: item.pumpingProportion || ""
          })
        })
        this.clearList();
      },
      async addTypeItem() {
        this.formDynamic.column.push({
          max: "",
          min: this.formDynamic.column[this.formDynamic.column.length - 1].max,
          status: this.formDynamic.column.length === 4 ? 1 : 0,
          type: 0,
          fixModel: "",
          ExtraRatio: ""
        });
      },

      async delTypeItem(i) {
        await this.eventEmitterInstance.trigger("del", i);
        await this.formDynamic.column.splice(i, 1);
      },
      async commit(o) {
        let context = this;
        if (o) {
          if (this.popDownwindAccountViewAction === "detail") {
            context.$emit("input", false);
            return;
          }
          await context.$refs.topFormValidate.validate(async valid => {
            if (valid) {
              let refsArr = await findComponentsDownward(context, "list");

              let refArr = [];
              refsArr.map(item => {
                refArr.push(new Promise((resolve, reject) => {
                  item.$refs.myRef.validate(async valid => {
                    if (valid) {
                      resolve(true);
                    } else {
                      reject(false);
                      // this.$Message.error('表单验证不通过')
                    }
                  });
                }));
              });
              let [err, res] = await errorCaptured(() => Promise.all(refArr));
              if (err !== null) return this.$Message.error("表单验证不通过");
              if (context.popDownwindAccountViewAction === "add") {
                await context.toAddCutPolicy(this.addParams)
              } else {
                await context.toCutPolicyUpdateCutPolicy({ uuid: context.uuid, ...this.addParams })
              }
            } else {
              this.$Message.error("表单验证不通过");
            }
          });
        } else {
          context.$emit("input", false);
        }
      },
      async toAddCutPolicy(params) {
        const [err, data] = await toResult(addCutPolicy(params));
        if (err) {
          this.$Message.error(err.msg);
          return;
        }
        this.$Message.success("新建成功");
        this.$emit("input", false);
        this.$emit("on-confirm");
      },
      async toCutPolicyUpdateCutPolicy(params) {
        const [err, data] = await toResult(cutPolicyUpdateCutPolicy(params));
        if (err) {
          this.$Message.error(err.msg);
          return;
        }
        this.$Message.success("编辑成功");
        this.$emit("input", false);
        this.$emit("on-confirm");
      }
    }
  };
</script>
<style lang="less" scoped>
  .pumping-detail-list {
    border: 1px solid #eee;
    padding: 20px;
    & span {
      font-size: 14px;
      &:nth-child(0) {
        margin-right: 20px;
      }
      &:nth-child(1) {
        margin-right: 20px;
      }
      &:nth-child(2) {
        margin-right: 0;
      }
      &:nth-child(3) {
        margin-right: 0;
      }
      &:nth-child(5) {
        margin-left: 20px;
      }
      &:nth-child(6) {
        margin-right: 20px;
      }
      &:nth-child(10) {
        margin-left: 20px;
      }
    }
  }
</style>
