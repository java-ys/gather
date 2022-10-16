<!--
 * @Author: NapierPLUS
 * @Date: 2021-07-14 16:35:15
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-24 14:11:24
 * @Description:
-->
<template>
  <div>
    <Modal
      ref="addmodal"
      v-model="showModal"
      :title="type === 0 ? '新建' : type === 1 ? '编辑' : '查看'"
      :width="1200"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="form" :model="form" :rules="formRule" :label-width="120">
        <FormItem label="工单类型" prop="woType">
          <Select
            v-model="form.woType"
            clearable
            style="width:200px"
            :disabled="type === 2"
          >
            <Option
              v-for="(item, index) in woTypeList"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="城市" prop="cityJson">
          <Select
            v-model="form.cityJson"
            clearable
            multiple
            filterable
            style="width:400px"
            :disabled="type === 2"
          >
            <Option
              v-for="(item, index) in cityList"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <div v-if="form.woType === 'DP'" class="type-container">
          <label class="ivu-form-item-label" style="width: 120px;"
            >司机类型：</label
          >
          <Card
            class="box-card"
            :class="driverType === 'A' ? 'checked' : 'uncheck'"
            @click.native="toggleDriverType('A')"
          >
            <div class="type-warp">
              <span class="type-top">A模式</span>
              <br />
            </div>
          </Card>
          <Card
            class="box-card"
            :class="driverType === 'UP' ? 'checked' : 'uncheck'"
            @click.native="toggleDriverType('UP')"
          >
            <div class="type-warp">
              <span class="type-top">UP模式</span>
              <br />
            </div>
          </Card>
        </div>
        <div v-if="form.woType === 'DP'" class="subtype-container">
          <label class="ivu-form-item-label" style="width: 120px;"
            >类型：</label
          >
          <div
            v-for="(item, idx) in driverAMap"
            v-show="driverType === 'A'"
            :key="'A' + idx"
          >
            <Card
              class="box-card"
              :class="
                activeAIdx === idx && driverType === 'A' ? 'checked' : 'uncheck'
              "
              @click.native="toggleDriverSubType(idx)"
            >
              {{ item.illegalType }}
            </Card>
          </div>
          <div
            v-for="(item, idx) in driverUPMap"
            v-show="driverType === 'UP'"
            :key="'up' + idx"
          >
            <Card
              class="box-card"
              :class="
                activeUPIdx === idx && driverType === 'UP'
                  ? 'checked'
                  : 'uncheck'
              "
              @click.native="toggleDriverSubType(idx)"
            >
              {{ item.illegalType }}
            </Card>
          </div>
        </div>
        <template v-if="form.woType === 'DP'">
          <div
            v-for="(item, idx) in driverAMap"
            v-show="activeAIdx === idx && driverType === 'A'"
            :key="'subA' + idx"
          >
            <FormItem label="">
              <Checkbox
                v-model="item.choosed"
                :disabled="type === 2"
                @on-change="checked => toggleDriverSubTypeState(checked)"
                >启用</Checkbox
              >
            </FormItem>
            <FormItem label="服务状态：">
              <CheckboxGroup
                v-model="item.serviceStatus"
                class="check-box"
                :disabled="type === 2 || item.state !== 1"
                @on-change="checkAllGroupChange"
              >
                <Checkbox
                  v-for="itm in serviceStatusOptions"
                  :key="itm.value"
                  :label="itm.value"
                  :value="itm.value"
                  :disabled="type === 2 || item.state !== 1"
                >
                  {{ itm.label }}
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
            <Row class="radio-row">
              <FormItem label="同步数据：">
                <RadioGroup
                  v-model="item.sync"
                  :disabled="item.state !== 1 || type === 2"
                >
                  <Radio
                    :key="'all'"
                    :label="'all'"
                    :disabled="type === 2 || item.state !== 1"
                    >全部</Radio
                  >
                  <Radio
                    :key="'top'"
                    :label="'top'"
                    :disabled="type === 2 || item.state !== 1"
                    >TOP</Radio
                  >
                </RadioGroup>
              </FormItem>
              <FormItem
                v-if="item.sync === 'top'"
                :label-width="10"
                :error="handleErrorMsg(item, 'TOP')"
              >
                <Input
                  v-model="item.top"
                  style="width:300px;"
                  placeholder="请输入"
                  :disabled="item.state !== 1 || type === 2"
                  type="number"
                />
              </FormItem>
            </Row>
            <FormItem label="工单生成规则：">
              <div style="display:flex">
                <span>报警次数&nbsp;&nbsp;&nbsp;&nbsp;</span
                ><Input
                  v-model="item.warnTimes"
                  type="number"
                  style="width:200px"
                  placeholder="请输入"
                  :disabled="item.state !== 1 || type === 2"
                />
                <span
                  >&nbsp;&nbsp;&nbsp;&nbsp;说明：自然日内报警次数大于等于X，生成一个违规工单，填写正整数</span
                >
              </div>
            </FormItem>
          </div>
          <div
            v-for="(item, idx) in driverUPMap"
            v-show="activeUPIdx === idx && driverType === 'UP'"
            :key="'subUP' + idx"
          >
            <FormItem label="">
              <Checkbox
                v-model="item.choosed"
                :disabled="type === 2"
                @on-change="checked => toggleDriverSubTypeState(checked)"
                >启用</Checkbox
              >
            </FormItem>
            <FormItem label="服务状态：">
              <CheckboxGroup
                v-model="item.serviceStatus"
                class="check-box"
                :disabled="item.state !== 1 || type === 2"
                @on-change="checkAllGroupChange"
              >
                <Checkbox
                  v-for="itm in serviceStatusOptions"
                  :key="itm.value"
                  :label="itm.value"
                  :value="itm.value"
                  :disabled="type === 2 || item.state !== 1"
                >
                  {{ itm.label }}
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
            <Row class="radio-row">
              <FormItem label="同步数据：">
                <RadioGroup
                  v-model="item.sync"
                  :disabled="item.state !== 1 || type === 2"
                >
                  <Radio
                    :key="'all'"
                    :label="'all'"
                    :disabled="item.state !== 1 || type === 2"
                    >全部</Radio
                  >
                  <Radio
                    :key="'top'"
                    :label="'top'"
                    :disabled="item.state !== 1 || type === 2"
                    >TOP</Radio
                  >
                </RadioGroup>
              </FormItem>
              <FormItem
                v-if="item.sync === 'top'"
                :label-width="10"
                :error="handleErrorMsg(item, 'TOP')"
              >
                <Input
                  v-model="item.top"
                  style="width:300px;"
                  placeholder="请输入"
                  :disabled="item.state !== 1 || type === 2"
                  type="number"
                />
              </FormItem>
            </Row>
            <FormItem label="工单生成规则：">
              <div style="display:flex">
                <span>报警次数&nbsp;&nbsp;&nbsp;&nbsp;</span
                ><Input
                  v-model="item.warnTimes"
                  type="number"
                  style="width:200px"
                  placeholder="请输入"
                  :disabled="item.state !== 1 || type === 2"
                  :error="handleErrorMsg(item, 'Warn')"
                />
                <span
                  >&nbsp;&nbsp;&nbsp;&nbsp;说明：自然日内报警次数大于等于X，生成一个违规工单，填写正整数</span
                >
              </div>
            </FormItem>
          </div>
        </template>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="onOk">
          <span>确定</span>
        </Button>
        <Button v-if="type !== 2" type="primary" ghost @click="onCancel"
          >取消</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  formRule,
  categoryMap,
  driverMap,
  serviceStatusOptions
} from "../fields";
import { addAxios, editAxios } from "_o/api/work-order/opencity.js";
import { getWoTypeList } from "_o/api/work-order/common.js";
import { toResult } from "_o/api/cityOpen";
export default {
  props: {
    type: {
      type: Number,
      default: 0
    },
    cityList: {
      type: Array,
      default: []
    },
    detailData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tableData: [],
      tableSelectRow: [],
      form: {},
      formRule: formRule(this),
      showModal: false,
      woTypeList: categoryMap,
      driverType: "A",
      driverAMap: [],
      driverUPMap: [],
      driverMap: [],
      serviceStatusOptions,
      activeAIdx: 0,
      activeUPIdx: 0,
      showCancelModal: false
    };
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.resetFields();
      } else {
        this.init();
      }
    }
  },
  mounted() {},
  methods: {
    async init() {
      let params = {
        appid: "520315b4d7524001a27a3bde5d052c51",
        level: 2,
        parentUuid: "WGGD"
      };
      const [err, data] = await toResult(getWoTypeList(params));
      let driverMap = data.map(it => {
        return {
          illegalCode: it.uuid,
          illegalType: it.name
        };
      });
      if (this.type === 0) {
        this.driverAMap = this.handleDataMap(
          JSON.parse(JSON.stringify(driverMap))
        );
        this.driverUPMap = this.handleDataMap(
          JSON.parse(JSON.stringify(driverMap))
        );
        this.form = {};
      } else {
        if (this.detailData.woType === "DP") {
          //兼容老数据
          let aList = this.detailData.driverA.map(it => it.illegalCode);
          let upList = this.detailData.driverUp.map(it => it.illegalCode);
          let driverAMap = JSON.parse(JSON.stringify(driverMap));
          let driverUPMap =  JSON.parse(JSON.stringify(driverMap));
          driverAMap = driverAMap.map(item => {
            let newitem = {
              ...item
            };
            if (aList.indexOf(item.illegalCode) > -1) {
              let tmpList = this.detailData.driverA.find(
                it => it.illegalCode === item.illegalCode
              );
              newitem = {
                ...tmpList,
                illegalType:item.illegalType
              };
            }
            return newitem;
          });
          driverUPMap = driverUPMap.map(item => {
            let newitem = {
              ...item
            };
            if (upList.indexOf(item.illegalCode) > -1) {
              let tmpList = this.detailData.driverUp.find(
                it => it.illegalCode === item.illegalCode
              );
              newitem = {
                ...tmpList,
                illegalType:item.illegalType
              };
            }
            return newitem;
          });
          this.driverAMap = this.handleDataMap(driverAMap);
          this.driverUPMap = this.handleDataMap(driverUPMap);
        } else {
          this.driverAMap = this.handleDataMap(
            JSON.parse(JSON.stringify(driverMap))
          );
          this.driverUPMap = this.handleDataMap(
            JSON.parse(JSON.stringify(driverMap))
          );
        }
        this.form = {
          woType: this.detailData.woType,
          cityJson: Object.keys(this.detailData.cityJson)
        };
      }
    },
    resetFields() {
      this.$refs["form"].resetFields();
      this.form = {};
      this.driverAMap = [];
      this.driverUPMap = [];
      this.activeAIdx = 0;
      this.activeUPIdx = 0;
      this.driverType = "A";
    },
    handleErrorMsg(item, type) {
      switch (type) {
        case "TOP":
          if (!item.top) {
            return "需要输入TOP数据";
          }
          if (item.top && item.top <= 0) {
            return "TOP数据必须是正整数";
          }
          break;
      }
      return "";
    },
    handleDataMap(list) {
      return list.map(it => {
        return {
          illegalCode: it.illegalCode,
          illegalType: it.illegalType,
          serviceStatus: it.serviceStatus || [],
          state: it.state || 0,
          sync: it.sync,
          warnTimes: it.warnTimes,
          top: it.top || "",
          choosed: !!it.state
        };
      });
    },
    handleMapParams(data) {
      return data.map(it => {
        return {
          illegalCode: it.illegalCode,
          illegalType: it.illegalType,
          serviceStatus: it.serviceStatus || [],
          state: it.state || 0,
          sync: it.sync,
          warnTimes: it.state == 1 ? it.warnTimes || 1 : it.warnTimes,
          top: it.top || ""
        };
      });
    },
    validateTop() {
      let pass = true;
      // 大屏工单才校验类型与司机类型
      if (this.form.woType !== "DP") {
        return true;
      }
      this.driverAMap.forEach(it => {
        if (it.sync === "top" && (!it.top || (it.top && it.top <= 0))) {
          pass = false;
        }
      });
      this.driverUPMap.forEach(it => {
        if (it.sync === "top" && (!it.top || (it.top && it.top <= 0))) {
          pass = false;
        }
      });
      return pass;
    },
    async onOk() {
      if (this.type === 2) {
        this.showModal = false;
        this.resetFields();
        return;
      }
      this.showModal = true;
      this.$refs.addmodal.visible = true;
      try {
        const res = await this.$refs["form"].validate();
        const subRes = this.validateTop();
        if (res && subRes) {
          let cityJson = {};
          this.form.cityJson.forEach(it => {
            cityJson[it] = this.cityList.find(that => that.value === it).label;
          });
          let formParams = {
            ...this.form,
            cityJson
            // driverA: this.handleMapParams(this.driverAMap),
            // driverUp: this.handleMapParams(this.driverUPMap)
          };
          // 大屏工单入参
          if (this.form.woType === "DP") {
            formParams.driverA = this.handleMapParams(this.driverAMap);
            formParams.driverUp = this.handleMapParams(this.driverUPMap);
          }
          //   编辑带入id
          if (this.type === 1) {
            formParams.id = this.detailData.id;
          }
          const {
            data: { success, msg }
          } = !this.type
            ? await addAxios(formParams)
            : await editAxios(formParams);
          if (success) {
            this.$Message.success("提交成功");
            this.showModal = false;
            this.resetFields();
            this.$emit("confirmed");
          } else {
            this.$Message.error(msg);
          }
        } else {
          this.$Message.error("请检查输入项");
        }
      } catch (error) {
        console.log(error);
      }
    },
    changeShowModal() {
      this.showModal = !this.showModal;
    },
    // 切换司机类型
    toggleDriverType(val) {
      this.driverType = val;
    },
    // 切换类型
    toggleDriverSubType(idx) {
      this[`active${this.driverType}Idx`] = idx;
    },
    toggleDriverSubTypeState(result) {
      this.$nextTick(() => {
        this.$set(
          this[`driver${this.driverType}Map`][
            this[`active${this.driverType}Idx`]
          ],
          "state",
          result ? 1 : 0
        );
        this.$set(
          this[`driver${this.driverType}Map`][
            this[`active${this.driverType}Idx`]
          ],
          "choosed",
          result
        );
      });
    },
    checkAllGroupChange() {
      console.log(this.currentServiceStatus);
    },
    onCancel() {
      this.$Modal.confirm({
        title: "确定取消操作吗？",
        onOk: async () => {
          this.showModal = false;
          this.resetFields();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
.type-container {
  display: flex;
  justify-content: flex-start;
  /deep/.Card__body {
    padding: 10px !important;
  }
  .box-card {
    width: 200px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    .type-warp {
      text-align: center;
      .type-top {
        font-size: 12px;
      }
    }
  }
  .checked {
    background-color: #4eaff5;
    color: #fff;
  }
  .unCheak {
    background-color: #fff;
    color: #000;
  }
}
.subtype-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  flex-wrap: wrap;
  /deep/.Card__body {
    padding: 10px !important;
  }
  .box-card {
    width: 200px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
    line-height: 32px;
    text-align: center;
    white-space: nowrap;
  }
  .checked {
    background-color: #4eaff5;
    color: #fff;
  }
  .unCheak {
    background-color: #fff;
    color: #000;
  }
}
.radio-row {
  display: flex;
  align-items: center;
}
</style>
