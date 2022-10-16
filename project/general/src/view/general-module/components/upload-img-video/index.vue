<template>
  <div>
    <div style="display:flex" :style="{ width: width + 'px' }">
      <img
        v-if="fileType === 1"
        :src="lookFileUrl"
        alt=""
        style="cursor: pointer;width:80px;height:80px"
        @click="lookIt(1)"
      />
      <Button
        v-if="fileType === 2"
        style="width:80px;cursor: pointer;height:30px;margin-top:2px"
        type="primary"
        @click="lookIt(2)"
        >查看视频</Button
      >
      <Button
        v-if="fileType === 3"
        style="width:80px;cursor: pointer;height:30px;margin-top:2px"
        type="primary"
        @click="lookIt(2)"
        >下载附件</Button
      >
      <Upload
        v-if="isShowUpload"
        style="margin-left:10px"
        ref="UploadFile"
        :action="actionUrl"
        :data="uploadFiles"
        :on-success="res => uploadSuccess(res)"
        :on-error="err => uploadError(err)"
        :headers="header"
        :format="formatData"
        :on-format-error="formatError"
      >
        <Button>{{ uploadtitle }}</Button>
      </Upload>
    </div>
    <lookImage ref="lookImage" />
    <videoModal ref="videoModal" />
  </div>
</template>
<script>
import { getToken, timeFormat } from "@/libs/util.js";
import lookImage from "./lookImage";
import videoModal from "./videoModal";
import ExportFile from "_a/export-file/exportFile";

export default {
  props: {
    uploadtitle: {
      type: String,
      default() {
        return "文件上传";
      }
    },
    // 预览图地址
    defaultUrl: {
      type: String,
      default() {
        return "";
      }
    },
    width: {
      type: String,
      default() {
        return "300";
      }
    },
    // 是否展示上传按钮
    isShowUpload: {
      type: Boolean,
      default() {
        return true;
      }
    },
    format: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    lookImage,
    videoModal,
    ExportFile
  },
  data() {
    return {
      actionUrl: this._baseUrl + "/common/uploadFile",
      uploadFiles: {},
      filesData: [],
      header: { Authorization: getToken() },
      fileType: "",
      lookFileUrl: this.defaultUrl,
      formatData:[]
    };
  },
  watch: {
    defaultUrl() {
      this.lookFileUrl = this.defaultUrl;
    },
    format(){
      this.format
    }
  },
  mounted() {
    if (!this.lookFileUrl) return;
    if (
      this.lookFileUrl.indexOf(".jpg") != -1 ||
      this.lookFileUrl.indexOf(".png") != -1 ||
      this.lookFileUrl.indexOf(".gif") != -1
    ) {
      this.fileType = 1;
    }

    if (this.lookFileUrl.indexOf(".mp4") != -1) {
      this.fileType = 2;
    }

    if (
      this.lookFileUrl.indexOf(".xlsx") != -1 ||
      this.lookFileUrl.indexOf(".xls") != -1 ||
      this.lookFileUrl.indexOf(".doc") != -1
    ) {
      this.fileType = 3;
    }
  },
  methods: {
    // TODO /common/uploadFile改造
    uploadSuccess(res) {
      console.log("res", res);
      if (res.data) {
        this.showUpload = false;
        let newData = res.data || {};
        let currentTime = timeFormat(new Date().getTime());
        let curts = currentTime
          .split(" ")[0]
          .split("-")
          .join("");
        newData.fileName = curts + newData.fileName;
        this.lookFileUrl = newData.fileUrl;
        if (
          this.lookFileUrl.indexOf(".jpg") != -1 ||
          this.lookFileUrl.indexOf(".png") != -1 ||
          this.lookFileUrl.indexOf(".gif") != -1
        ) {
          this.fileType = 1;
        }

        if (this.lookFileUrl.indexOf(".mp4") != -1) {
          this.fileType = 2;
        }
        if (
          this.lookFileUrl.indexOf(".xlsx") != -1 ||
          this.lookFileUrl.indexOf(".xls") != -1 ||
          this.lookFileUrl.indexOf(".doc") != -1 ||
          this.lookFileUrl.indexOf(".docx") != -1 ||
          this.lookFileUrl.indexOf(".text") != -1
        ) {
          this.fileType = 3;
        }
        this.$emit("uploadSuccess", newData);
      }
    },
    formatError() {
      this.$Message.error("请上传正确格式");
    },
    uploadError(error) {
      this.$emit("uploadError", error);
    },
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
