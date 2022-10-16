<template>
  <div>
    <Modal v-show="!visible" :value="show" :title="title" @on-ok="onOk" @on-cancel="onCancel">
      <Row :gutter="16">
        <Col span="4">图片选择：</Col>
        <Col span="20">
          <div v-if="img" class="upload-list">
            <img :src="img.url">
            <div class="upload-list-cover">
              <Icon type="ios-eye-outline" @click="visible = true"></Icon>
              <Icon type="ios-trash-outline" @click="img = null"></Icon>
            </div>
          </div>
          <Upload
            v-else
            name="file"
            :action="serverUrl"
            :headers="header"
            :on-error="uploadError"
            :on-format-error="handleFormatError"
            :on-success="uploadSuccess"
            :on-exceeded-size="handleMaxSize"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="maxSize"
            :data="{ imgType: 1 }"
            :before-upload="onBeforeUpload"
            style="display: inline-block;border:1px dashed #dcdee2;border-radius:4px;text-align: center;"
          >
            <div style="width: 300px;height:100px;line-height: 100px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p style="margin: 10px 0;color: #999;">图片格式支持JPG、PNG，图片尺寸不能大于1M</p>
          <div v-show="img" style="margin: 10px 0;color: #999;">
            <Checkbox v-model="isScale">
              缩放为原来的<InputNumber v-model="scale" :max="100" :min="1" />%
            </Checkbox>
          </div>
        </Col>
      </Row>
    </Modal>
    <Modal v-if="img" v-model="visible" title="图片预览" foot-hide>
      <img :src="img.url" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
export default {
  name: "ImageModal",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    title: String,
    maxSize: {
      type: Number,
      default: 2048
    },
    value: String,
    show: Boolean,
  },
  data() {
    return {
      serverUrl: this._baseUrl.replace("m2-admin", "common-web-api") + "/common/nps/uploadImg",
      header: {
        Authorization: getToken()
      },
      img: null,
      visible: false,
      isScale: false,
      scale: 1,
    }
  },
  methods: {
    onBeforeUpload(file) {
      const url = URL.createObjectURL(file);
      const image = new Image()
      return new Promise((resolve, reject) => {
        image.onload = () => {
          if (image.width > 2240 || image.height > 2240) {
            this.$Message.warning("图片尺寸不能超过2240x2240")
            reject(Error("尺寸过大"));
          }
          resolve();
          URL.revokeObjectURL(url);
        }
        image.src = url;
      })
    },
    handleFormatError() {
      this.$Message.error("上传文件格式不正确");
    },
    handleMaxSize() {
      this.$Message.error("上传文件过大");
    },
    uploadError() {
      this.$Message.error("图片上传失败");
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.img = {
          url: res.data.picUrl,
          uuid: res.data.uuid,
        };
      } else {
        this.$Message.error("图片插入失败");
      }
    },
    onOk() {
      if (!this.img) return this.$Message.warn("请上传图片");
      this.$emit("confirm", { ...this.img, width: this.isScale ? this.scale : 100 });
      this.onCancel();
    },
    onCancel() {
      this.$emit("cancel");
      this.img = null;
    }
  }
};
</script>

<style lang="less" scoped>
.upload-list{
  display: inline-block;
  width: 300px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.upload-list img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.upload-list:hover .upload-list-cover{
  display: block;
}
.upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>