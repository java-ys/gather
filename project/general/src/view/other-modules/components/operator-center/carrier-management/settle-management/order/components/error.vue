<template>
  <div>
    <Modal
      v-model="visible"
      title="提交结果"
      width="1080"
      :mask-closable="false"
    >
      <p>提交成功<span>xx</span>条, 提交失败<span>xx</span>条</p>
      <p>提交失败的申请单明细:</p>
      <p>1111:</p>
      <p>222:</p>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "batch-error",
  data() {
    return {};
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {},
};
</script>

<style scoped lang="less">
</style>