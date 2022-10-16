<template>
  <div>
    <!-- 学习任务 -->
    <!-- 任务指标 -->
    <FormItem
      v-if="addData.taskType === 2"
      label="任务指标："
      prop="taskStandard"
    >
      <Select v-model="addData.taskStandard" :disabled="isDetail">
        <Option
          v-for="item in taskStandardForStudyOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </FormItem>
    <!-- 学习任务 -->
    <!-- 学习资料包 -->
    <!-- 完成学习 -->
    <FormItem
      v-if="addData.taskType === 2 && addData.taskStandard"
      :label="addData.taskStandard === 1 ? '学习资料包：' : '考试资料包'"
      prop="taskStudy"
    >
      <div class="line">
        <Button
          v-if="addData.selectedList['study'].length === 0"
          type="primary"
          @click="$emit('selectStudy')"
          :disabled="isDetail"
        >
          选择课程
        </Button>
        <Button
          v-if="addData.selectedList['study'].length > 0"
          type="primary"
          @click="$emit('selectStudy')"
          :disabled="isDetail"
        >
          新增课程
        </Button>
      </div>
      <div v-if="addData.selectedList['study'].length > 0" class="line">
        <div class="fence_list">
          <div
            v-for="item in addData.selectedList['study']"
            :key="item.uuid"
            class="item"
          >
            <span class="name">{{ item.name }}</span>
            <span class="delete" v-if="!isDetail && item.name" @click="$emit('handleDeleteSelected', item)"
              >X</span
            >
          </div>
        </div>
      </div>
    </FormItem>
  </div>
</template>

<script>
import {
  taskStandardForStudyOptions
} from "../../../../config/fields"

export default {
  name: "step1_study",
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
      taskStandardForStudyOptions,
    }
  },
  created () {
    console.log('this.addData', this.addData)
  }
}
</script>

<style lang="less" scoped>
</style>
