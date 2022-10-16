<template>
  <div>
    <ul class="videos">
      <li
        v-for="(item, index) in data"
        :key="index"
        @click="view(item)"
        class="item"
      >
        <span class="icon"></span>
      </li>
    </ul>
    <Modal title="视频" v-model="showModal" :width="350">
      <VideoPreview
        :videoUrl="currentFileUrl"
        v-if="showModal"
        class="ctx"
      ></VideoPreview>
    </Modal>
  </div>
</template>

<script>
import VideoPreview from "./videoPreview/index.vue";
import { queryFileURLById } from "_o/api/work-order/wo-detail";
export default {
  components: {
    VideoPreview
  },

  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showModal: false,
      currentFileUrl: ""
    };
  },

  created() {},

  methods: {
    view(item) {
      queryFileURLById(item.key).then(res => {
        this.currentFileUrl = res.data.data;
        this.showModal = !this.showModal;
      })
    }
  }
};
</script>

<style lang="less" scoped>
.videos {
  display: flex;
  .item {
    flex: 0 0 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 10px 0 0;
    text-align: center;
    border: 1px dashed #dcdee2;
    border-radius: 4px;
    cursor: pointer;
    img {
      width: 100%;
    }
    .icon {
      display: inline-block;
      width: 80px;
      height: 80px;
      background-size: 80px 80px;
      background-repeat: no-repeat;
      background-image: url(./assets/car-bg@3x.png);
    }
  }
}

.ctx {
  min-height: 300px;
  display: flex;
  align-items: center;
}

/deep/ .ivu-modal-body {
  text-align: center;
}
</style>
