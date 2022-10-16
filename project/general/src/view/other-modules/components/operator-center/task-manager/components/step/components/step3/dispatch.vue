<template>
  <div class="step3-dispatch_wrap">
    <!-- 调度任务 -->
    <!-- 到达围栏且接单展示车辆 -->
    <FormItem
      v-if="addData.taskType === 1"
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
          v-for="item in taskStandardOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
    <!-- 调度任务 -->
    <!-- 到达围栏展示车辆状态 -->
    <FormItem
      v-if="addData.taskType === 1 && addData.taskStandard === 6"
      label="车辆状态："
      prop="carStatus"
    >
      <CheckboxGroup
        v-model="addData.carStatus"
        class="check-box"
        @on-change="(data) => $emit('checkAllGroupChange', data)"
        :disabled="isDetail"
      >
        <Checkbox
          v-for="item in carStatusOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
          :disabled="isDetail"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
    </FormItem>
    <!-- 任务指标为到达围栏且接单 -->
    <FormItem
      v-if="addData.taskType === 1 && addData.taskStandard === 7"
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
    <!-- 调度任务 -->
    <!-- 任务指标为到达围栏且接单 -->
    <FormItem
      v-if="addData.taskType === 1 && addData.taskStandard === 7"
      label="订单来源渠道："
      prop="orderSourceList"
      class="ivu-form-item-required"
    >
      <Select
        v-model="addData.orderSourceList"
        multiple
        :disabled="isDetail"
        @on-change="(value) => $emit('orderSourceChange', value)"
      >
        <Option
          v-for="item in orderSourceOptions"
          :key="item.value"
          :value="item.value"
          :disabled="item.value!==34 && addData.hasSelectAllOrderSource"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
    <!-- 调度任务 -->
    <!-- 任务指标为到达围栏且接单 -->
    <FormItem
      v-if="addData.taskType === 1 && addData.taskStandard === 7"
      label="奖励计算方式："
      prop="awardCalculate"
      class="ivu-form-item-required"
    >
      <Select
        v-model="addData.awardCalculate"
        :disabled="isDetail"
      >
        <Option
          v-for="item in awardCalculateOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
     <FormItem
      label="设置奖励"
      class="finishOrderConfig"
    >
     </FormItem>
    <!-- 奖励模块 -->
    <award-module
      :addData="addData"
      @handleDeleteModule="(index) => $emit('handleDeleteModule', index)"
      @handleAddModule="() => $emit('handleAddModule')"
      @handleDeleteAward="(index, ci,cci) => $emit('handleDeleteAward', index, ci,cci)"
      @addSetUp="(index, ci) => $emit('addSetUp', index, ci)"
      @setUp="(index) => $emit('setUp', index)"
      :isDetail="isDetail"
    ></award-module>
  </div>
</template>

<script>
import {
  orderSourceOptions,
  awardCalculateOptions,
  businessLineOptions,
  carStatusOptions,
  taskStandardOptions
} from "../../../../config/fields"
import award_module from './award-module'

export default {
  name: "step3_dispatch",
  components: {
    'award-module': award_module
  },
  props: {
    addData: {
      type: Object,
      default () {
        return {}
      }
    },
    isDetail: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      orderSourceOptions,
      awardCalculateOptions,
      businessLineOptions,
      carStatusOptions,
      taskStandardOptions
    }
  },
  mounted () {
  },
  created () {
    console.log('11111')
    console.log('this.addData', this.addData)
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
  methods: {
  }
}
</script>

<style lang="less" scoped>
.step3-dispatch_wrap {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.finishOrderConfig {
    /deep/ .ivu-form-item-label {
      font-size: 16px;
    }
  }
.line_wrap {
  // width: ~"calc(100vw - 300px)";
  // margin-left: -60%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  .line {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    .item {
      display: flex;
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
}
</style>
