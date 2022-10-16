<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="600px"
    :z-index="1"
    footer-hide
  >
    <img :src="img" alt="" />
  </Modal>
</template>

<script>
export default {
  name: "lookImage",
  data() {
    return {
      showModal: false,
      title: "图片",
      img: ""
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.img = val;
    }
  }
};
</script>
<style lang="less" scoped>
img {
  width: 100%;
  height: auto;
}
</style>
