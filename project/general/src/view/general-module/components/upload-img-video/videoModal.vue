<template>
  <div>
    <Modal
      v-model="isShow"
      :width="600"
      :title="title"
      :mask-closable="false"
      class="big-img-modal"
      :footer-hide="true"
      :z-index="999999"
    >
      <div v-if="videoUrl">
        <video :src="videoUrl" controls width="560"></video>
      </div>
      <div v-else>
        <span>暂无数据</span>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "carousel-modal",
  props: {
    title: {
      default: "查看视频"
    }
  },
  data() {
    return {
      isShow: false,
      videoUrl: ""
    };
  },
  methods: {
    init(val) {
      this.isShow = true;
      this.videoUrl = val;
    }
  }
};
</script>
<style lang="less">
.big-img-modal {
  .ivu-carousel-item {
    text-align: center;
  }
  .img-out {
    width: 600px;
    height: 600px;
    background: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
