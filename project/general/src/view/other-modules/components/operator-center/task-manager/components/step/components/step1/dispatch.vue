<!-- 此组件废弃。移动到 setp3 dispatch.vue了 2021-5-14 -->
<template>
  <div>
    
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
  </div>
</template>

<script>
import {
  carStatusOptions,
  taskStandardOptions
} from "../../../../config/fields"

export default {
  name: "step1_dispatch",
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
      carStatusOptions,
      taskStandardOptions
    }
  }
}
</script>

<style lang="less" scoped>
</style>
