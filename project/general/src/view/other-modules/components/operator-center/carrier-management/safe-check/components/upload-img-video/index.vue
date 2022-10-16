<template>
  <div>
    <div style="display:flex" :style="{ width: width + 'px' }">
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
      <Upload
        v-if="isShowUpload"
        style="margin-left:10px"
        ref="UploadFile"
        :headers="header"
        :format="format"
        :on-format-error="formatError"
        :action="actionUrl"
        :data="uploadFiles"
        :show-upload-list="false"
        :before-upload="res => beforeUpload(res)"
        :on-success="res => uploadSuccess(res)"
        :on-error="err => uploadError(err)"
      >
        <Button :loading="uploadLoading" type="primary">
          <span v-if="!uploadLoading">{{ uploadtitle }}</span>
          <span v-else>上传中...</span></Button
        >
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
        return "250";
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
      default: () => {
        return ["jpg", "jpeg", "png"];
      }
    },
    maxImgSize: {
      // 限制图片上传的大小,单位KB
      type: Number,
      default: 0
    },
    maxVideoSize: {
      // 限制视频上传的大小,单位KB
      type: Number,
      default: 0
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
      uploadLoading: false,
      maxSize: 0
    };
  },
  watch: {
    defaultUrl() {
      this.lookFileUrl = this.defaultUrl;
    }
  },
  mounted() {
    if (!this.lookFileUrl) return;
    this.fileType = this.getFileType(this.lookFileUrl).fileType;
  },
  methods: {
    // 处理上传格式
    getFileType(url) {
      let fileObj = {fileType: 1};
      if (
        url.indexOf(".jpg") != -1 ||
        url.indexOf(".png") != -1 ||
        url.indexOf(".gif") != -1
      ) {
        fileObj = {
          fileType: 1
        };
      }
      if (
        url.indexOf(".mp4") != -1 ||
        url.indexOf(".avi") != -1 ||
        url.indexOf(".rmvb") != -1 ||
        url.indexOf(".mpeg") != -1
      ) {
        fileObj = {
          fileType: 2
        };
      }
      return fileObj;
    },
    beforeUpload(file) {
      let isAllow = true;
      let msg = "";
      let that = this;
      this.file = file;
      let flagPV = "";
      let maxSize = 0;
      let fileType = this.getFileType(this.file.name).fileType;
      if (fileType === 2) {
        maxSize = this.maxVideoSize;
        flagPV = "视频";
      }
      if (fileType === 1) {
        maxSize = this.maxImgSize;
        flagPV = "图片";
      }
      // 文件的大小
      if (maxSize) {
        isAllow = file.size / 1024 > maxSize ? false : true;
        if (maxSize < 1024) {
          msg = `请上传大小在 ${maxSize}KB 以内${flagPV}`;
        } else {
          msg = `请上传大小在 ${maxSize / 1024}M 以内${flagPV}`;
        }

        if (!isAllow) {
          that.$Message.error(msg);
          return false;
        } else {
          this.uploadLoading = true;
        }
      }
      if (this.mixMsg) {
        // result:{isSuccess:是否满足验证，msg：不满足验证的提示信息}
        let result = this.imgInfo.mixValid(file);
        if (!result.isSuccess) {
          that.$Message.error(result.msg);
          return false;
        } else {
          this.uploadLoading = true;
        }
      }
      return true;
    },
    uploadSuccess(res) {
      console.log("res", res);
      this.uploadLoading = false;
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
        this.fileType = this.getFileType(this.lookFileUrl).fileType;
        newData.fileType = this.fileType;
        this.$emit("uploadSuccess", newData);
      }
    },
    formatError() {
      this.uploadLoading = false;
      this.$Message.error(`请上传 ${this.format.join(", ")} 格式`);
    },
    uploadError(error) {
      this.$Message.error(res.msg);
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
