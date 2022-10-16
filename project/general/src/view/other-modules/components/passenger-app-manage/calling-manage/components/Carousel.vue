<template>
  <div>
    <div
      v-for="(item, index) in list"
      :key="index"
      class="input-content"
    >
      <Input
        v-model="list[index].startTip"
        placeholder="叫车小tips：取消订单重新呼叫并不能让你更快被派到车哦！"
        class="input-width"
        :maxlength="17"
        :readonly="readonly"
        @change="handleChange"
      />

      <Button
        v-if="!readonly && index > 0"
        type="error"
        shape="circle"
        icon="md-close"
        size="small"
        class="circle-btn"
        @click="deleteItem(index)"
      />
      <Button
        v-if="!readonly && list.length < maxLength && index === list.length - 1"
        type="primary"
        shape="circle"
        icon="md-add"
        size="small"
        class="circle-btn"
        @click="addItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      maxLength: 3,
    }
  },
  computed: {
    list() {
      return this.value || []
    }
  },
  methods: {
    handleChange() {
      this.$emit("input", this.value)
    },
    deleteItem(index) {
      this.list.splice(index, 1)
    },
    addItem() {
      this.list.push({
        startTip: ""
      })
    }
  }
}
</script>

<style scoped lang="less">
.input-content {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-width {
  width: 300px;
  margin-right: 10px;
}

.circle-btn {
  margin-right: 10px;
}
</style>
