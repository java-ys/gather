<template>
  <div>
    <div style="display:flex">
      <img
        v-if="fileType === 1"
        :src="lookFileUrl"
        alt=""
        style="cursor:pointer;width:85px;height:85px"
        @click="lookIt(1)"
      />
      <Button v-if="fileType === 2" type="success" @click="lookIt(2)"
        >查看视频</Button
      >
    </div>
    <lookImage ref="lookImage" />
    <videoModal ref="videoModal" />
  </div>
</template>
<script>
import lookImage from "./upload-img-video/lookImage";
import videoModal from "./upload-img-video/videoModal";

export default {
  props: {
    // 预览图地址
    defaultUrl: {
      type: String,
      default() {
        return "";
      }
    }, 
    fileType: {
      type: Number,
      default() {
        return 0;
      }
    },
   
  },
  components: {
    lookImage,
    videoModal
  },
  data() {
    return {
      lookFileUrl: this.defaultUrl,
    };
  },
  watch: {
    defaultUrl() {
      this.lookFileUrl = this.defaultUrl;
    }
  },

  methods: {
    lookIt(res) {
      if (res === 1) {
        this.$refs.lookImage.init(this.lookFileUrl);
      }
      if (res === 2) {
        this.$refs.videoModal.init(this.lookFileUrl);
      }
    }
  }
};
</script>
<style lang="less"></style>
