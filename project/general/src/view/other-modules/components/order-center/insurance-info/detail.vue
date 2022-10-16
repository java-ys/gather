<template>
  <Modal v-model="showModal" :title="title" width="1000px" :z-index="9999" :footer-hide="true">
    <div class="newPage">
      <iframe
        :src="src"
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="auto"
      ></iframe>
    </div>
  </Modal>
</template>

<script>
import axios from "axios";
export default {
  name: "detail",
  data() {
    return {
      showModal: false,
      title: "查看保单",
      src: ""
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.src = "";
      axios({
        url: this._uploadUrl + "/file/url/" + val.fileId,
        method: "get",
        headers: {
          token: val.token
        }
      }).then(res => {
        this.src = res.data.data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.newPage {
  width: 100%;
  height: 500px;
  padding-bottom: 10px;
}
</style>