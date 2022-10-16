<template>
  <div>
    <div :style="{ width: width + 'px' }">
      <Upload
        ref="UploadFile"
        :action="actionUrl"
        :data="uploadFiles"
        :default-file-list="defaultList"
        :show-upload-list="showUpload"
        :before-upload="res => beforeUpload(res)"
        :on-success="res => uploadSuccess(res)"
        :on-error="err => uploadError(err)"
        :on-remove="res => removefile(res)"
        :multiple="true"
        :paste="true"
        :headers="header"
      >
        <Button>{{ uploadtitle }}</Button>
      </Upload>
    </div>
  </div>
</template>
<script>
// 未使用
import { getToken, timeFormat } from "@/libs/util.js";
export default {
  props: {
    uploadtitle: {
      type: String,
      default() {
        return "文件上传";
      }
    },
    defaultList: {
      type: Array,
      default() {
        return [];
      }
    },
    showUpload: {
      type: Boolean,
      default() {
        return true;
      }
    },
    width: {
      type: String,
      default() {
        return "300";
      }
    },
    dispose: {
      type: Boolean,
      default() {
        return true;
      }
    }
    // clearfiles: {
    //   type: Function,
    //   default: () => {}
    // }
  },
  data() {
    return {
      actionUrl: this._baseUrl + "/common/uploadFile",
      uploadFiles: {},
      filesData: [],
      header: { Authorization: getToken() }
    };
  },
  mounted() {},
  methods: {
    // TODO /common/uploadFile 改造
    uploadSuccess(res) {
      if (this.dispose) {
        if (res.data) {
          let newData = res.data || {};
          let currentTime = timeFormat(new Date().getTime());
          let curts = currentTime
            .split(" ")[0]
            .split("-")
            .join("");
          newData.fileName = curts + newData.fileName;

          this.$emit("uploadSuccess", newData);
        }
      } else {
        this.$emit("uploadSuccess", res.data);
      }
    },
    clearFiles() {
      this.$refs.UploadFile.clearFiles();
    },
    uploadError(error) {
      this.$emit("uploadError", error);
    },
    beforeUpload(res) {
      this.$emit("beforeUpload", res);
    },
    removefile(res) {
      this.$emit("removefile", res);
    }
  }
};
</script>
<style lang="less"></style>
