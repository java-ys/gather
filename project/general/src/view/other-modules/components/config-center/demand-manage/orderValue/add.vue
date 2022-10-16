<template>
  <Modal v-model="showModal" :title="title" width="800px" :z-index="1">
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <FormItem label="省/市" prop="cityCodeArr">
        <Cascader
          v-model="formData.cityCodeArr"
          :data="cityList"
          style="width: 200px;"
          filterable
          trigger="hover"
          :disabled="isDetail"
          @on-change="editCascaderChange"
          @on-clear="clearCascader"
        ></Cascader>
      </FormItem>
      <FormItem label="产品线" prop="businessType">
        <Select
          v-model="formData.businessType"
          clearable
          style="width: 150px;"
          placeholder="请选择产品线"
          :disabled="isDetail"
        >
          <Option value="4">快享</Option>
          <Option value="2">专享</Option>
          <Option value="1">出租车</Option>
        </Select>
      </FormItem>
      <div class="title">满足以下条件必为高价值订单</div>
      <Checkbox
        :disabled="isDetail"
        v-model="formData.ismembershipLevels"
        style="margin-left: 50px;"
        >会员等级&nbsp;&nbsp;&nbsp;</Checkbox
      >
      <FormItem
        label=""
        prop="membershipLevels"
        v-if="formData.ismembershipLevels"
        style="margin-left: -80px; margin-top: -10px;"
      >
        <Select
          v-model="formData.membershipLevels"
          clearable
          style="width: 300px;"
          placeholder="请选择会员等级"
          class="star"
          multiple
          :disabled="isDetail"
        >
          <Option :value="5">黑金用户</Option>
          <Option :value="4">铂金用户</Option>
          <Option :value="3">黄金用户</Option>
          <Option :value="2">白银用户</Option>
        </Select>
      </FormItem>
      <br />
      <Checkbox
        v-model="formData.isorderAmount"
        :disabled="isDetail"
        style="margin-left: 50px; margin-top: 20px;"
        >订单金额&nbsp;&nbsp;&nbsp;</Checkbox
      >
      <FormItem
        v-if="formData.isorderAmount"
        label=""
        prop="orderAmount"
        style="margin-left: -80px; margin-top: 12px;"
      >
        <div class="star">
          订单金额大于
          <Input
            :disabled="isDetail"
            clearable="clearable"
            style="width: 150px;"
            v-model="formData.orderAmount"
            placeholder="请输入订单金额"
            :maxlength="12"
          />
        </div>
      </FormItem>
      <div class="title" style="margin-top: 20px;">
        启用以下条件以计算订单价值分级:
      </div>
      <Checkbox
        :disabled="isDetail"
        v-model="formData.isorderAmountRule"
        style="margin-left: 50px;"
        >订单金额&nbsp;&nbsp;&nbsp;</Checkbox
      >
      <FormItem
        label=""
        prop="orderAmountRuleWeight"
        v-if="formData.isorderAmountRule"
        style="margin-left: -50px;"
      >
        <div class="star">
          权重占比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Select
            :disabled="isDetail"
            v-model="formData.orderAmountRuleWeight"
            clearable
            style="width: 150px;"
            placeholder="请选择权重占比"
          >
            <Option
              :disabled="isDetail"
              :value="index"
              v-for="(item, index) in persentQz"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </div>
      </FormItem>
      <div
        v-if="formData.isorderAmountRule"
        v-for="(item, index) in formData.orderAmountLevels"
        :key="index"
        style="margin-left: 80px;"
      >
        <Icon
          v-if="formData.orderAmountLevels.length > 1 && !isDetail"
          type="ios-remove-circle-outline"
          size="20"
          style="cursor: pointer;"
          color="red"
          @click="deleteMine(index)"
        />
        <FormItem :label="`档位${index + 1}:`" prop="gears">
          订单大于等于 &nbsp;
          <Input
            :disabled="isDetail"
            clearable="clearable"
            style="width: 60px;"
            v-model="item.minAmount"
            :maxlength="4"
          />&nbsp;元&nbsp;&nbsp; 小于
          <Input
            :disabled="isDetail"
            clearable="clearable"
            style="width: 60px;"
            v-model="item.maxAmount"
            :maxlength="4"
          />&nbsp;元&nbsp;&nbsp; 权重分值:&nbsp;
          <Select
            :disabled="isDetail"
            v-model="item.score"
            clearable
            style="width: 150px;"
            placeholder="请选择权重分值"
          >
            <Option
              :value="item"
              v-for="(item, index) in personWeight"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
      </div>
      <br />
      <Button
        style="margin-left: 110px; margin-bottom: 20px;"
        v-if="
          formData.isorderAmountRule &&
          formData.orderAmountLevels.length < 3 &&
          !isDetail
        "
        type="primary"
        @click="addMine"
        >添加档位</Button
      >
      <br />
      <Checkbox
        :disabled="isDetail"
        style="margin-left: 50px;"
        v-model="formData.ismembershipRule"
        >会员等级&nbsp;&nbsp;&nbsp;</Checkbox
      >
      <br />
      <FormItem
        label=""
        prop="membershipRuleWeight"
        v-if="formData.ismembershipRule"
      >
        <div class="star">
          权重占比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Select
            :disabled="isDetail"
            v-model="formData.membershipRuleWeight"
            clearable
            style="width: 150px;"
            placeholder="请选择权重占比"
          >
            <Option
              :value="index"
              v-for="(item, index) in persentQz"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </div>
      </FormItem>
      <div v-if="formData.ismembershipRule">
        <FormItem label="" prop="membershipScoreMap1">
          <div class="star">
            大众会员 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.membershipScoreMap1"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
        <br />

        <FormItem label="" prop="membershipScoreMap2">
          <div class="star">
            白银会员 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.membershipScoreMap2"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
        <br />

        <FormItem label="" prop="membershipScoreMap3">
          <div class="star">
            黄金会员 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.membershipScoreMap3"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
        <br />

        <FormItem label="" prop="membershipScoreMap4">
          <div class="star">
            铂金会员 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.membershipScoreMap4"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
        <br />

        <FormItem label="" prop="membershipScoreMap5">
          <div class="star">
            黑金会员 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.membershipScoreMap5"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
      </div>

      <Checkbox
        :disabled="isDetail"
        style="margin-left: 50px; margin-top: 20px;"
        v-model="formData.isenterpriseUserRule"
        >企业用户&nbsp;&nbsp;&nbsp;</Checkbox
      >
      <div v-if="formData.isenterpriseUserRule">
        <FormItem label="" prop="enterpriseUserRuleweight" v-if="">
          <div class="star">
            权重占比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.enterpriseUserRuleweight"
              clearable
              style="width: 150px;"
              placeholder="请选择权重占比"
            >
              <Option
                :value="index"
                v-for="(item, index) in persentQz"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
        <br />
        <FormItem label="" prop="isEnterpriseUserScore">
          <div class="star">
            是企业用户 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.isEnterpriseUserScore"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
        <br />
        <FormItem label="" prop="isNotEnterpriseUserScore">
          <div class="star">
            不是企业用户 权重分值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Select
              :disabled="isDetail"
              v-model="formData.isNotEnterpriseUserScore"
              clearable
              style="width: 150px;"
              placeholder="请选择权重分值"
            >
              <Option
                :value="item"
                v-for="(item, index) in personWeight"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
        </FormItem>
      </div>
      <br />
      <Checkbox
        :disabled="isDetail"
        style="margin-left: 50px; margin-top: 20px;"
        v-model="formData.isnewUserFirstAddScore"
        >新用户首单&nbsp;&nbsp;&nbsp;</Checkbox
      >
      <br />
      <FormItem
        label=""
        prop="newUserFirstAddScore"
        v-if="formData.isnewUserFirstAddScore"
      >
        <div class="star">
          对首单用户进行一次性分值加成&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Select
            :disabled="isDetail"
            v-model="formData.newUserFirstAddScore"
            clearable
            style="width: 150px;"
            placeholder="请选择"
          >
            <Option
              :value="item"
              v-for="(item, index) in personWeight"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </div>
      </FormItem>
    </Form>
    <div slot="footer" v-if="isDetail">
      <Button @click="showModal = false">关闭</Button>
    </div>
    <div slot="footer" v-else>
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { formValidate, persentQz, personWeight } from "./fields";
import { highLowAdd, highLowDetail, highLowUpdate } from "_o/api/configData.js";

export default {
  name: "add",
  data() {
    let self = this;
    return {
      showModal: false,
      title: "新增策略",
      cityList: [],
      formData: {},
      formValidate: formValidate,
      persentQz: persentQz,
      personWeight: personWeight,
      uuid: "",
      isDetail: false,
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.cityList = val.cityList;
      this.formData = {
        cityUuid: "",
        businessType: "",
        //  满足以下条件必为高价值订单
        // 会员等级
        ismembershipLevels: false,
        membershipLevels: [],
        // 订单金额
        isorderAmount: false,
        orderAmount: "",

        // 启用以下条件以计算订单价值分级
        // 订单金额
        isorderAmountRule: false,
        orderAmountRuleWeight: "",
        orderAmountLevels: [
          {
            minAmount: "",
            maxAmount: "",
            score: "",
            id: 0,
          },
        ],
        // 会员等级
        ismembershipRule: false,
        membershipRuleWeight: "",
        membershipScoreMap1: "",
        membershipScoreMap2: "",
        membershipScoreMap3: "",
        membershipScoreMap4: "",
        membershipScoreMap5: "",
        // 企业用户
        isenterpriseUserRule: false,
        enterpriseUserRuleweight: "",
        isEnterpriseUserScore: "", // 是企业用户权重分值
        isNotEnterpriseUserScore: "", //不是企业用户权重分值
        // 新用户
        isnewUserFirstAddScore: false,
        newUserFirstAddScore: "",

        gears: "1",
      };

      this.from = val.from;
      this.isDetail = false;
      this.title = "新增策略";
      if (val.from === "detail" || val.from === "edit") {
        this.uuid = val.uuid;
        if (val.from === "detail") {
          this.isDetail = true;
          this.title = "详情";
        } else {
          this.title = "编辑";
        }
        highLowDetail({
          uuid: val.uuid,
          businessType: val.businessType,
        }).then((res) => {
          let data = res.data.data;
          this.formData.cityUuid = data.cityUuid;
          // 处理省市选择
          this.cityList.forEach((item) => {
            item.nodes.forEach((yItem) => {
              if (data.cityUuid === yItem.cityUuid) {
                this.formData.cityCodeArr = [yItem.provinceID, yItem.cityID];
              }
            });
          });
          this.formData.businessType = String(data.businessType);
          let highFigureCondition = data.highFigureCondition || {};
          let orderScoreRule = data.orderScoreRule || {};

          let orderAmountRule = orderScoreRule.orderAmountRule || {};
          let membershipRule = orderScoreRule.membershipRule || {};
          let enterpriseUserRule = orderScoreRule.enterpriseUserRule || {};

          let newUserFirstAddScore;
          if (orderScoreRule.newUserFirstAddScore) {
            newUserFirstAddScore = String(orderScoreRule.newUserFirstAddScore);
          }

          if (
            highFigureCondition &&
            highFigureCondition.membershipLevels &&
            highFigureCondition.membershipLevels.length > 0
          ) {
            this.formData.ismembershipLevels = true;
            this.formData.membershipLevels =
              highFigureCondition.membershipLevels;
          }
          if (highFigureCondition && (highFigureCondition.orderAmount || highFigureCondition.orderAmount===0)) {
            this.formData.isorderAmount = true;
            this.formData.orderAmount = String(highFigureCondition.orderAmount);
          }
          if (orderAmountRule.weight) {
            this.formData.isorderAmountRule = true;
            this.formData.orderAmountRuleWeight = String(
              orderAmountRule.weight
            );
            this.formData.orderAmountLevels = orderAmountRule.orderAmountLevels.map(
              (item) => {
                item.score = String(item.score);
                item.maxAmount = String(item.maxAmount);
                item.minAmount = String(item.minAmount);
                return item;
              }
            );
          }
          if (membershipRule.weight) {
            this.formData.ismembershipRule = true;
            this.formData.membershipRuleWeight = String(membershipRule.weight);
            this.formData.membershipScoreMap1 = String(
              membershipRule.membershipScoreMap[1]
            );
            this.formData.membershipScoreMap2 = String(
              membershipRule.membershipScoreMap[2]
            );
            this.formData.membershipScoreMap3 = String(
              membershipRule.membershipScoreMap[3]
            );
            this.formData.membershipScoreMap4 = String(
              membershipRule.membershipScoreMap[4]
            );
            this.formData.membershipScoreMap5 = String(
              membershipRule.membershipScoreMap[5]
            );
          }
          if (enterpriseUserRule.weight) {
            this.formData.isenterpriseUserRule = true;
            this.formData.enterpriseUserRuleweight = String(
              enterpriseUserRule.weight
            );
            this.formData.isEnterpriseUserScore = String(
              enterpriseUserRule.isEnterpriseUserScore
            );
            this.formData.isNotEnterpriseUserScore = String(
              enterpriseUserRule.isNotEnterpriseUserScore
            );
          }
          console.log(999, newUserFirstAddScore);
          if (newUserFirstAddScore === "0" || newUserFirstAddScore) {
            this.formData.isnewUserFirstAddScore = true;
            this.formData.newUserFirstAddScore = newUserFirstAddScore;
          }
          console.log(this.formData);
        });
      }
    },
    saveData() {
      console.log("校验前", this.formData);
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit();
        }
      });
    },
    clearCascader() {
      this.formData.cityCodeArr = [];
      this.formData.cityUuid = "";
    },
    editCascaderChange(value, selectedData) {
      console.log(selectedData);
      if (value && value.length) {
        this.formData.cityUuid =
          selectedData[selectedData.length - 1]["cityUuid"];
      } else {
        this.formData.cityUuid = "";
      }
    },
    deleteMine(val) {
      this.formData.orderAmountLevels.splice(val, 1);
    },
    addMine() {
      let obj = {
        minAmount: "",
        maxAmount: "",
        score: "",
        id: this.formData.orderAmountLevels.length,
      };
      this.formData.orderAmountLevels.push(obj);
    },
    submit() {
      // 判断遍历的表单是否勾上了
      let flag = true;
      if (this.formData.isorderAmountRule) {
        let orderAmountLevelsArr = JSON.parse(
          JSON.stringify(this.formData.orderAmountLevels)
        );
        orderAmountLevelsArr.forEach((item) => {
          item.minAmount = Number(item.minAmount);
          item.maxAmount = Number(item.maxAmount);
          if (!flag) {
            return;
          }
          console.log(item.minAmount)
          if (!item.minAmount && item.minAmount!=0 ) {
            this.$Message.warning("订单金额不能为空");
            flag = false;
            return;
          } 
          if (!item.maxAmount && item.maxAmount!=0 ) {
            this.$Message.warning("订单金额不能为空");
            flag = false;
            return;
          }
          if (!item.score) {
            this.$Message.warning("请选择订单金额权重分值");
            flag = false;
            return;
          }
          if (
            item.minAmount < 0 ||
            item.minAmount > 1000 ||
            item.maxAmount < 0 ||
            item.maxAmount > 1000
          ) {
            this.$Message.warning("订单金额范围0-1000整数");
            flag = false;
            return;
          }
          if (item.minAmount >= item.maxAmount) {
            this.$Message.warning("订单金额范围不正确");
            flag = false;
            return;
          }
          if (
            !/(^[0-9]\d*$)/.test(item.minAmount) ||
            !/(^[0-9]\d*$)/.test(item.maxAmount)
          ) {
            this.$Message.warning("订单金额范围0-1000整数");
            flag = false;
            return;
          }
        });
      }

      if (flag) {
        console.log("校验成功", this.formData);
        let params = {
          cityUuid: this.formData.cityUuid,
          businessType: this.formData.businessType,
          highFigureCondition: {},
          orderScoreRule: {
            orderAmountRule: {},
            membershipRule: {},
            enterpriseUserRule: {},
            newUserFirstAddScore: {},
          },
        };
        // 处理数据格式
        // 满足以下条件必为高价值订单
        if (this.formData.ismembershipLevels) {
          params.highFigureCondition.membershipLevels = this.formData.membershipLevels;
        }
        if (this.formData.isorderAmount) {
          params.highFigureCondition.orderAmount = this.formData.orderAmount;
        }
        // 启用以下条件以计算订单价值分级
        if (this.formData.isorderAmountRule) {
          params.orderScoreRule.orderAmountRule = {
            weight: this.formData.orderAmountRuleWeight,
            orderAmountLevels: this.formData.orderAmountLevels,
          };
        }
        if (this.formData.ismembershipRule) {
          params.orderScoreRule.membershipRule = {
            weight: this.formData.membershipRuleWeight,
            membershipScoreMap: {
              1: this.formData.membershipScoreMap1,
              2: this.formData.membershipScoreMap2,
              3: this.formData.membershipScoreMap3,
              4: this.formData.membershipScoreMap4,
              5: this.formData.membershipScoreMap5,
            },
          };
        }
        if (this.formData.isenterpriseUserRule) {
          params.orderScoreRule.enterpriseUserRule = {
            weight: this.formData.enterpriseUserRuleweight,
            isEnterpriseUserScore: this.formData.isEnterpriseUserScore,
            isNotEnterpriseUserScore: this.formData.isNotEnterpriseUserScore,
          };
        }
        if (this.formData.isnewUserFirstAddScore) {
          params.orderScoreRule.newUserFirstAddScore = this.formData.newUserFirstAddScore;
        }
        if (!this.formData.ismembershipLevels && !this.formData.isorderAmount) {
          delete params.highFigureCondition;
        }
        if (!this.formData.isorderAmountRule) {
          delete params.orderScoreRule.orderAmountRule;
        }
        if (!this.formData.ismembershipRule) {
          delete params.orderScoreRule.membershipRule;
        }
        if (!this.formData.isenterpriseUserRule) {
          delete params.orderScoreRule.enterpriseUserRule;
        }
        if (!this.formData.isnewUserFirstAddScore) {
          delete params.orderScoreRule.newUserFirstAddScore;
        }
        if (
          !this.formData.isorderAmountRule &&
          !this.formData.ismembershipRule &&
          !this.formData.isenterpriseUserRule &&
          !this.formData.isnewUserFirstAddScore
        ) {
          delete params.orderScoreRule;
        }
        console.log("params", params);
        if (this.from === "add") {
          highLowAdd(params).then((res) => {
            this.showModal = false;
            this.$emit("reload");
            this.$Message.success(res.data.msg);
          });
        }
        if (this.from === "edit") {
          params.uuid = this.uuid;
          highLowUpdate(params).then((res) => {
            this.showModal = false;
            this.$emit("reload");
            this.$Message.success(res.data.msg);
          });
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.title {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30px;
}
.star {
  position: relative;
  display: inline-block;
}
.star::before {
  content: "*";
  display: inline-block;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
  position: absolute;
  top: 10px;
  left: -10px;
}
</style>
