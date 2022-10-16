<!-- 此组件废弃。移动到 setp3 encourage.vue了 2021-5-14 -->
<template>
  <div>
    <!-- 激励任务 -->
    <FormItem
      v-if="addData.taskType === 3"
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
          v-for="item in taskStandardForAwardOptions"
          :key="item.value"
          :value="item.value"
          :disabled="isDetail"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
  </div>
</template>

<script>
import {
  taskStandardForAwardOptions
} from "../../../../config/fields"

export default {
  name: "step1_award",
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
      taskStandardForAwardOptions
    }
  }
}
</script>

<style lang="less" scoped>
</style>
