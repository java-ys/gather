<template>
  <div class="step3-bonus_wrap">
    <!-- 奖励瓜分任务 -->
    <FormItem
      label="产品线："
      prop="businessLineList"
      class="ivu-form-item-required"
    >
      <Select
        v-model="addData.businessLineList"
        placeholder="请选择"
        :disabled="isDetail"
        multiple
      >
        <Option
          v-for="item in businessLineOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
    <FormItem
      label="奖金池（元）"
      prop="rewardTotalAmount"
      class="ivu-form-item-required"
    >
      <InputNumber
        v-model="addData.rewardTotalAmount"
        placeholder="请输入奖金池（元）"
        class="num_input"
        :disabled="isDetail"
        type="number"
        :min="0"
        :max="99999999"
      />
    </FormItem>
    <FormItem
      label="任务指标："
      prop="taskStandard"
      class="ivu-form-item-required"
    >
      <Select
        v-model="addData.taskStandard"
        :disabled="isDetail"
        @on-change="() => $emit('taskStandardChange')"
      >
        <Option
          v-for="item in taskStandardForBonusOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
    <FormItem
      label="订单命中任务配置："
      prop="orderFlowHitRule"
      class="ivu-form-item-required"
    >
      <Select
        v-model="addData.orderFlowHitRule"
        placeholder="请选择"
        :disabled="isDetail"
      >
        <Option
          v-for="item in orderFlowHitRuleOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
      <Tooltip
        placement="right"
        class="radio-group-text"
        max-width="400"
        theme="light"
      >
        <Icon type="md-help" class="md-help" />
        <div slot="content">
          <p>接单时间：则在进行任务奖励计算时只统计接单时间在任务有效期内且完单的订单；</p>
          <p>完单时间：则在进行任务奖励计算时只统计完单时间在任务有效期内的订单</p>
        </div>
      </Tooltip>
    </FormItem>
    <FormItem label="奖励配置" class="finishOrderConfig"> </FormItem>
    <div v-for="(item, index) in addData.setRewardList" :key="index" class="reward-wrap">
      <FormItem
        v-if="addData.taskStandard == 4"
        label="完单量门槛"
        :prop="'setRewardList.' + index + '.completeCount'"
        class="ivu-form-item-required"
        :rules="ruleValidate.completeCount"
      >
        <InputNumber
          v-model="addData.setRewardList[index].completeCount"
          placeholder="请输入"
          class="num_input"
          :disabled="isDetail"
          type="number"
          :min="1"
          :max="100000"
        />
      </FormItem>

      <div class="reward-tips"  v-if="addData.taskStandard == 4">每个司机的奖励计算公式：奖励金额=（司机完单量/达到完单量门槛司机的完单量总和）*奖金池金额</div>
      <FormItem
        v-if="addData.taskStandard == 5"
        label="流水金额门槛："
        :prop="'setRewardList.' + index + '.shareStartAmount'"
        :rules="ruleValidate.shareStartAmount"
        class="ivu-form-item-required"
      >
        <Input
          v-model="addData.setRewardList[index].shareStartAmount"
          placeholder="请输入"
          class="num_input"
          :disabled="isDetail"
          type="number"
        />
      </FormItem>
      <div class="reward-tips"  v-if="addData.taskStandard == 5">每个司机的奖励计算公式：奖励金额=（司机流水金额/达到流水金额门槛司机的流水总和）*奖金池金额</div>
    </div>
  </div>
</template>

<script>
import {
  orderSourceOptions,
  awardCalculateOptions,
  businessLineOptions,
  carStatusOptions,
  taskStandardForBonusOptions,
  orderFlowHitRuleOptions
} from "../../../../config/fields";
import award_module from "./award-module";

export default {
  name: "step3_dispatch",
  components: {
    "award-module": award_module,
  },
  props: {
    addData: {
      type: Object,
      default() {
        return {};
      },
    },
    isDetail: {
      type: Boolean,
      default() {
        return false;
      },
    },
    ruleValidate: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      orderSourceOptions,
      awardCalculateOptions,
      businessLineOptions,
      carStatusOptions,
      taskStandardForBonusOptions,
      orderFlowHitRuleOptions
    };
  },
  mounted() {},
  created() {
    console.log("4444444");
    console.log("this.addData", this.addData);
  },
  watch: {
    // addData: {
    //   immediate: true,
    //   handler (newValue) {
    //     console.log("newValue", newValue)
    //     this.addData = newValue
    //   }
    // }
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.step3-bonus_wrap {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.finishOrderConfig {
  /deep/ .ivu-form-item-label {
    font-size: 16px;
  }
}
/deep/ .ivu-input-number {
  width: 220px;
}
.radio-group-wrapper, /deep/ .radio-group-wrapper{
  display: flex;
  align-items: center;
}
.radio-group-text , /deep/ .radio-group-text{
  margin-left: 10px;
  font-size: 14px !important;
}
.md-help, /deep/ .md-help{
  background: red;
  border-radius: 50%;
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reward-tips{
    font-size: 12px;
    color: #515a6e;
    margin-left: 130px;
    margin-bottom: 24px;
}
</style>
