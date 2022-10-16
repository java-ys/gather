<template>
  <div>
    <!-- 调度任务 -->
    <!-- 任务围栏 -->
    <FormItem
      label="司机人群包："
      prop="driverGroupObject"
      :class="{ 'ivu-form-item-required': addData.selectedDriverGroupList && addData.selectedDriverGroupList.length > 0 && isDetail }"
    >
      <div class="line">
        <Button
          :disabled="disabled || isDetail"
          v-if="addData.selectedDriverGroupList.length === 0"
          type="primary"
          @click="$emit('selectDriverGroup')"
        >
          选择司机人群包
        </Button>
        <Button
          :disabled="disabled || isDetail"
          v-if="addData.selectedDriverGroupList.length > 0"
          type="primary"
          @click="$emit('selectDriverGroup')"
        >
          新增司机人群包
        </Button>
      </div>
      <div
        v-if="addData.selectedDriverGroupList.length > 0"
        class="line"
      >
        <div class="driverGroup_list">
          <div
            v-for="item in addData.selectedDriverGroupList"
            :key="item.uuid"
            class="item"
          >
            <span class="name">{{ item.crowdName }}</span>
            <span
              class="delete"
              v-if="!isDetail"
              @click="$emit('handleDeleteDriverGroup', item)"
            >X</span>
          </div>
        </div>
      </div>
    </FormItem>
  </div>
</template>

<script>

export default {
  name: "step2_selectDriverGroup",
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
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
</style>
