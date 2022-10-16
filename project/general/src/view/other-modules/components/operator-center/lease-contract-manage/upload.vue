<!--
 * @Author: NapierPLUS
 * @Date: 2021-11-09 09:57:46
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-10 10:13:25
 * @Description: 
-->

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
        :on-success="(res,file) => uploadSuccess(res,file)"
        :on-error="err => uploadError(err)"
        :on-remove="res => removefile(res)"
        :multiple="multiple"
        :paste="true"
        :headers="header"
      >
        <Button type="primary">{{ uploadtitle }}</Button>
      </Upload>
    </div>
  </div>
</template>
<script>
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
    },
    multiple: {
      type: Boolean,
      default() {
        return false;
      }
    }
    // clearfiles: {
    //   type: Function,
    //   default: () => {}
    // }
  },
  data() {
    return {
      actionUrl: this._Asset + "/api/upload/uploadFile",
      uploadFiles: {},
      filesData: [],
      header: { Authorization: getToken() }
    };
  },
  mounted() {},
  methods: {
    // TODO /common/uploadFile改造
    uploadSuccess(res,file) {
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
        this.$emit("uploadSuccess", res.data,file);
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
