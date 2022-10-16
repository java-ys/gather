<template>
  <div>
    <Upload
      ref="upload"
      :action="actionUrl"
      :headers="headers"
      :max-size="maxSize"
      :accept="accept"
      :format="format"
      :before-upload="beforeUpload"
      :on-exceeded-size="outOfRange"
      :on-format-error="formatError"
      :on-success="uploadSuccess"
      :on-error="uploadError"
    >
      <Button>上传图片</Button>
    </Upload>
  </div>
</template>

<script>
// 未使用
import config from "@/config/config";
import { getToken } from "@/libs/util.js";
export default {
  name: "upload-img",
  props: {
    maxSize: {
      type: Number,
      default: 999999
    },
    accept: {
      type: String,
      defulat: ""
    },
    format: {
      type: Array,
      default() {
        return [];
      }
    },
    imgSize: {
      type: Object
    }
  },
  data() {
    return {
      actionUrl: this._baseUrl + "/common/uploadFile",
      headers: {
        Authorization: getToken(),
        ...config.headers
      },
      file: ""
    };
  },
  methods: {
    beforeUpload(file) {
      this.file = file;
      return true;
    },
    // 文件大小超出范围
    outOfRange() {
      this.$Message.error("图片过大");
    },
    // 文件格式验证失败
    formatError() {
      this.$Message.error("请上传正确格式图片");
    },
    // TODO /common/uploadFile改造
    uploadSuccess(res) {
      let _this = this;

      if (this.imgSize) {
        if (!this.imgSize.width || !this.imgSize.height) {
          throw new Error("参数imgSize必须包含width和height");
        } else {
          this.limitImgSize()
            .then(() => {
              this.$emit("uploadSuccess", res.data);
            })
            .catch(() => {
              this.$Message.error({
                content: `上传图片尺寸应为${_this.imgSize.width} * ${_this.imgSize.height}`,
                duration: 2
              });
            });
        }
      } else {
        this.$emit("uploadSuccess", res.data);
      }

      this.$refs.upload.clearFiles();
    },
    limitImgSize() {
      let _this = this;
      let reader = new FileReader();
      reader.readAsDataURL(this.file);
      return new Promise((reslove, reject) => {
        reader.onload = function(e) {
          let data = e.target.result;
          let image = new Image();
          image.src = data;
          image.onload = function() {
            let width = image.width;
            let height = image.height;
            if (
              width !== _this.imgSize.width ||
              height !== _this.imgSize.height
            ) {
              // _this.$Message.error({ content: `上传图片尺寸应为${_this.imgSize.width} * ${_this.imgSize.height}`, duration: 2 });
              // eslint-disable-next-line prefer-promise-reject-errors
              reject();
            } else {
              reslove();
              // _this.$emit('uploadSuccess', res.data);
            }
          };
        };
      });
    },
    uploadError(err) {
      this.$emit("uploadError", err);
    }
  }
};
</script>

<style lang="less"></style>
