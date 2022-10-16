<template>
  <Modal :value="value" :width="width" :title="title" :footer-hide="footHide" @on-cancel="onCancel">
    <slot></slot>
    <div v-if="!footHide" slot="footer">
      <Button @click="onCancel">取消</Button>
      <Button type="primary" @click="$emit('on-ok')">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "ModalWrapWrap",
  model: {
    event: "change",
    prop: "value",
  },
  props: {
    title: String,
    value: Boolean,
    width: [String, Number],
    footHide: Boolean,
  },
  methods: {
    onCancel() {
      this.$emit("change", false)
    }
  }
};
</script>