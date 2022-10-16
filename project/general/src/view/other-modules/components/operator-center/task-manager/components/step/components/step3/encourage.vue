<template>
  <div class="step3-dispatch_wrap">
    <!-- 激励任务 -->
    <!-- 产品线 -->
    <FormItem
      v-if="addData.taskType === 3"
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
    <!-- 激励任务 -->
    <!-- 激励任务 -->
    <FormItem
      v-if="addData.taskType === 3"
      label="任务指标："
      prop="taskStandardList"
      class="ivu-form-item-required"
    >
      <CheckboxGroup
        v-model="addData.taskStandardList"
        class="check-box"
        :disabled="isDetail"
        @on-change="taskStandardChange"
      >
        <Checkbox
          v-for="item in taskStandardForAwardOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
          :disabled="(item.value == 64 && isHasOnlineDay)|| (item.value == 128 && isHasOnlineHour) || isDetail"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
    </FormItem>

    <div class="time-wrap ivu-form-item" v-if="isHasOnlineHour">
      <div>
        在线时长定义：<em>*</em>司机在如下时段在线时间合计：(在线时长折合成小时)
      </div>
      <div class="inner-box">
        <!-- 时段配置 -->
        <timePeriod
          :addData="addData"
          @handleDeleteModule="handleDeleteModule"
          @handleAddModule="handleAddModule"
          @startTimeChange="startTimeChange"
          @endTimeChange="endTimeChange"
          :isDetail="isDetail"
          parentItem="onlineDurations"
          startTime="startTimeInterval"
          endTime="endTimeInterval"
        ></timePeriod>
      </div>
    </div>
    <div class="time-wrap ivu-form-item" v-if="isHasOnlineDay">
      <div class="line_wrap inner-time-online">
        在线1天定义：<em>*</em>司机在如下时段的在线时长合计长等于
        <InputNumber
          v-model="addData.onlineDaysConfig.enableHour"
          placeholder=""
          type="number"
          :min="0"
          :max="23"
          class="hour_input"
          :disabled="isDetail"
        />
        <div class="unit">小时</div>
        <InputNumber
          v-model="addData.onlineDaysConfig.enableMin"
          placeholder=""
          type="number"
          :min="0"
          :max="59"
          class="nin_input"
          :disabled="isDetail"
        />
        <div class="unit">分钟</div>
        <InputNumber
          v-model="addData.onlineDaysConfig.enableSec"
          placeholder=""
          type="number"
          :min="0"
          :max="59"
          class="nin_input"
          :disabled="isDetail"
        />
        <div class="unit">秒</div>
      </div>
      <div class="inner-box">
        <!-- 时段配置 -->
        <timePeriod
          :addData="addData.onlineDaysConfig"
          @handleDeleteModule="handleDeleteModule"
          @handleAddModule="handleAddModule"
          @startTimeChange="startTimeChange"
          @endTimeChange="endTimeChange"
          :isDetail="isDetail"
          parentItem="onlineDaysDurations"
          startTime="startTimeInterval"
          endTime="endTimeInterval"
        ></timePeriod>
      </div>
    </div>
    <FormItem
      label="订单命中任务配置："
      prop="orderFlowHitRule"
      class="ivu-form-item-required"
      v-if="isHasOrder||isHasFlow"
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
    <awardModuleNew
        :addData="addData"
        @handleDeleteModule="(index) => $emit('handleDeleteModule', index)"
        @handleAddModule="() => $emit('handleAddModule')"
        @handleDeleteAward="
          (index, ci, cci) => $emit('handleDeleteAward', index, ci, cci)
        "
        @addSetUp="(index, ci) => $emit('addSetUp', index, ci)"
        @setUp="(index) => $emit('setUp', index)"
        :isDetail="isDetail"
        :ruleValidate="ruleValidate"
        :isHasOrder="isHasOrder"
        :isHasFlow="isHasFlow"
        :isHasOnlineHour="isHasOnlineHour"
        :isHasOnlineDay="isHasOnlineDay"
        style="margin-bottom:24px"
    ></awardModuleNew>
  </div>
</template>

<script>
import {
  businessLineOptions,
  orderFlowMap,
  taskStandardForAwardOptions,
  orderFlowHitRuleOptions,
} from "../../../../config/fields";
import award_module from "./award-module";
import awardModuleNew from "./award-module-new";

import addicon from "_o/assets/add_icon.png";
import deleteicon from "_o/assets/delete_icon.png";
import timePeriod from "./timePeriod.vue"

export default {
  name: "step3_dispatch",
  components: {
    "award-module": award_module,
    timePeriod,
    awardModuleNew
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
      businessLineOptions,
      orderFlowMap,
      addicon,
      deleteicon,
      taskStandardForAwardOptions,
      orderFlowHitRuleOptions,
      isHasOrder:false,
      isHasFlow:false,
      isHasOnlineHour:false,
      isHasOnlineDay:false,
    };
  },
  created() {
    console.log("addData", this.addData);
    this.taskStandardChange(this.addData.taskStandardList)
  },
  watch: {
    addData: {
      immediate: true,
      handler(newValue) {
        console.log("newValue", newValue);
        this.addData = newValue;
        console.log("this.addData.flowAwardList", this.addData.flowAwardList);
        console.log(
          "展示",
          !(
            this.addData.taskType === 3 &&
            this.addData.taskStandard === 5 &&
            this.addData.awardCalculate === 4
          )
        );
      },
    },
  },
  methods: {
    taskStandardChange(value){
      if(value){
        this.isHasOrder = value.includes(16)
        this.isHasFlow = value.includes(32)
        this.isHasOnlineHour = value.includes(64)
        this.isHasOnlineDay = value.includes(128)
      }
    },
     // 删除到达围栏的奖励模块
    handleDeleteModule (index) {
      this.addData.timePeriodList.splice(index, 1)
    },
    // 添加到达围栏的奖励模块
    handleAddModule () {
      this.addData.timePeriodList.push({
        startTime: '00:00:00',
        endTime: '23:59:59'
      })
    },
    startTimeChange (startTime, type, index) {
      console.log(startTime)
      this.addData.timePeriodList[index].startTime = startTime
    },
    endTimeChange (endTime, type, index) {
      console.log(endTime)
      this.addData.timePeriodList[index].endTime = endTime
    },
  },
};
</script>

<style lang="less" scoped>
.step3-dispatch_wrap {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  /deep/ .ivu-input-number {
    width: 220px;
  }
}
.line_wrap {
  // width: ~"calc(100vw - 300px)";
  // margin-left: -60%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
  /deep/ .ivu-input-number {
    width: 220px;
  }
  /deep/ .ivu-form-item-content {
    margin-bottom: 16px;
  }
  .left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
  }
  .item {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    flex-direction: row;
  }
  .delete {
    font-size: 16px;
    color: red;
    margin-left: 4px;
    font-weight: 600;
    cursor: pointer;
    width: 20px;
    height: 20px;
    background-color: red;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    margin-top: 4px;
    .delete_icon {
      font-size: 30px;
      height: 2px;
      color: #fff;
      z-index: 10;
      border-top: 1px solid #fff;
      width: 60%;
    }
  }
  .add {
    font-size: 16px;
    color: #2fc809;
    margin-left: 4px;
    font-weight: 600;
    cursor: pointer;
    width: 20px;
    height: 20px;
    background-color: #2fc809;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    margin-top: 4px;
    position: relative;
    margin-right: 4px;
    .add_horizontal_icon {
      font-size: 30px;
      height: 2px;
      color: #fff;
      z-index: 10;
      border-top: 1px solid #fff;
      width: 60%;
      position: absolute;
    }
    .add_vertical_icon {
      font-size: 30px;
      height: 60%;
      color: #fff;
      z-index: 10;
      border-right: 1px solid #fff;
      width: 1px;
      // margin-left: 50%;
      position: absolute;
    }
  }
}
.adForm {
  .line {
    display: flex;
    justify-content: flex-start;
    // margin-top: 4px;
    .item {
      margin-right: 4px;
      .name {
        font-size: 15px;
      }
      .name {
        font-size: 15px;
      }
      .delete_award {
        font-size: 16px;
        color: red;
        margin-left: 4px;
        font-weight: 600;
        cursor: pointer;
        width: 20px;
        height: 20px;
      }
    }
    .fence_list {
      display: flex;
      justify-content: flex-start;
      margin-top: 4px;
    }
  }
  /deep/ .ivu-input-wrapper {
    input {
      width: 220px;
    }
  }
  /deep/ .ivu-select {
    width: 220px;
  }
  /deep/ .operator {
    .ivu-input-wrapper {
      input {
        width: 100%;
      }
    }
  }
  .cancel_btn {
    margin-left: 8px;
  }
  .taskAwardType {
    /deep/ .ivu-form-item-content {
      margin-left: 0px !important;
    }
  }
  .finishOrderConfig {
    /deep/ .ivu-form-item-label {
      font-size: 16px;
    }
  }
  .flowPercent_wrap {
    /deep/ .ivu-form-item-content {
      white-space: nowrap;
      display: flex;
    }
  }
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
.time-wrap {
  font-size: 12px;
  border: 1px solid #ddd;
  padding: 12px;
  width: 650px;
  border-radius: 2px;
  margin-left: 131px;
  em {
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
  .inner-box {
    margin-left: 19px;
  }
}
.inner-time-online{
   align-items: center;
  .ivu-input-number {
    width: 64px;
    margin: 0 8px;
  }
}
</style>
