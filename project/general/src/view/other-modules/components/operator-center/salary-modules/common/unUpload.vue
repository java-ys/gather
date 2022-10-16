<template>
  <div>
    <el-upload :action="imageAction" :headers="headers" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handleError"
               :disabled="disabled" :show-file-list="false"
    >
      <el-button size="small" type="text">点击上传</el-button>
    </el-upload>
    <img v-if="imageURL" width="80" height="80" :src="imageURL" @click="handlePreview(imageURL)" />
    <el-button v-if="imageURL" size="small" type="text" @click="handleRemove">移除照片</el-button>
    <el-dialog id="image-component-dialog" :visible.sync="dialogVisible" append-to-body class="dialog-size">
      <img id="image-component-dialog-img" width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from "_o/api/salary/common.js";
export default {
  name: "unUpload",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    imageAction: {
      type: String,
      default: ""
    },
    headers: {
      type: Object,
      required: false,
      default: {}
    },
    imageURL: {
      type: String,
      default: ""
    },
    uploadShow: {
      type: Boolean,
      default: false
    },
    beforeUpHandle: {
      type: Function,
      default() {
        return () => true;
      }
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    beforeUpload(file) {
      return this.beforeUpHandle(file);
    },
    handleSuccess(res, file) {
      this.$emit("handleSuccess", res, file);
    },
    handleError(err) {
      this.$emit("handleError");
    },
    handlePreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.$emit("handleRemove");
    }
  }
};
</script>
