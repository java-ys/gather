<template>
  <div>
    <!-- 保底策略-指定人群包 -->
    <el-form-item
      label="司机人群包"
      prop="driverGroupObject"
      :class="{
        'ivu-form-item-required': addData.crowdCodeList && addData.crowdCodeList.length > 0 && isEdit,
      }"
    >
      <div class="line">
        <el-button
          size="mini"
          :disabled="isEdit"
          v-if="addData.crowdCodeList.length === 0"
          type="primary"
          @click="$emit('selectDriverGroup')"
        >
          选择司机人群包
        </el-button>
        <el-button
          size="mini"
          :disabled="isEdit"
          v-if="addData.crowdCodeList.length > 0"
          type="primary"
          @click="$emit('selectDriverGroup')"
        >
          新增司机人群包
        </el-button>
      </div>
      <div v-if="addData.crowdCodeList.length > 0" class="line">
        <div class="driverGroup_list">
          <div v-for="item in addData.crowdCodeList" :key="item.crowdCode" class="item">
            <span class="name">{{ item.crowdName }}</span>
            <span class="delete" v-if="!isEdit" @click="$emit('handleDeleteDriverGroup', item)">X</span>
          </div>
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'selectDriverGroup',
  props: {
    addData: {
      type: Object,
      default() {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.delete {
  color: red;
  cursor: pointer;
}
</style>
