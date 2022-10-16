<template>
  <Modal v-model="show" width="1200" footer-hide title="视频" :mask-closable="false">
    <related-video :basic-info="basicInfo"></related-video>
  </Modal>
</template>

<script>
import relatedVideo from "../../components/relatedVideo";
export default {
  name: "video-c", // 视频
  components: {relatedVideo},
  data() {
    return {
      show: false,
      basicInfo: {}
    };
  },
  methods: {
    init(p = {}, row={}) {
      this.basicInfo = p
      this.show = true;
      this.basicInfo.woCode = row.woNo
    },
  },
};
</script>

<style scoped>

</style>
