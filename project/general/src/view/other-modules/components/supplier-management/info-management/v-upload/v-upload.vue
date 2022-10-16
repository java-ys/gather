<template>
  <div>
    <div
      class="demo-upload-list"
      v-for="(item, index) in uploadListArr"
      :key="index"
      v-show="multiFile || defaultList.length"
    >
      <!-- <template v-show="item.status === 'finished'"> -->
      <img v-if="fileType === 'img'" :src="item.url" style="display: block;" />
      <span v-if="fileType === 'pdf'">合同{{index+1}}</span>
      <div class="demo-upload-list-cover">
        <Icon
          type="ios-eye-outline"
          @click.native="handleView(item.url)"
        ></Icon>
        <Icon
          v-if="!isDetail"
          type="ios-trash-outline"
          @click.native="handleRemove(item)"
        ></Icon>
      </div>
      <!-- </template> -->
      <!-- <template v-else>
        <Progress v-show="item.showProgress" :percent="item.percentage" hide-info></Progress>
      <fileTtemplate> -->
    </div>
    <Upload
      v-show="(multiFile || !defaultList.length) &&　defaultList.length < maxUpLoadCount"
      v-if="!isDetail"
      ref="upload"
      :data="params"
      :headers="header"
      :default-file-list="defaultList"
      :max-size="maxSize"
      :show-upload-list="false"
      :upLoadCount="maxUpLoadCount"
      :on-success="handleSuccess"
      :on-error="handleFiled"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      type="drag"
      :format="fileRange"
      :action="action"
      style="display: inline-block;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-cloud-upload-outline" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
<!--      <img :src="imgUrl" style="width: 100%" />-->
      <el-image :src="imgUrl" :preview-src-list="[imgUrl]"></el-image>
    </Modal>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";

export default {
  name: "VUpload",
  props: {
    fileType: {
      type: String,
      default: 'img' // pdf
    },
    maxUpLoadCount: {
      // 上传图片的最大数量
      type: Number,
      default: 1
    },
    limitSize: {
      type: Object,
      default: () => {
        return {
          width: "",
          height: ""
        };
      }
    },
    action: {
      // 上传图片的地址
      type: String,
      default: ""
    },
    defaultList: {
      // 图片上传成功后返回图片列表
      type: [Array],
      default: () => {
        return [];
      }
    },
    maxSize: {
      // 限制文件上传的大小
      type: Number,
      default: 4000
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    fileRange: {
      type: Array,
      default: () => {
        return ["jpg", "jpeg", "png"];
      }
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    multiFile: {
      type: Boolean,
      default: true
    },
    // 默认kb，sizeType为1，
    // sizeType===2，单位是M
    sizeType: {
      type: Number,
      default: 1
    }
  },
  data() {
    // 'Content-Type': 'multipart/form-data',
    return {
      visible: false,
      header: { Authorization: getToken() },
      imgUrl: "",
      uploadListArr: []
    };
  },
  mounted() {
    this.$refs.upload && (this.uploadListArr = this.$refs.upload.fileList);
  },
  methods: {
    handleView(url) {
      if (this.fileType === 'pdf') {
        return window.open(url)
      }
      this.imgUrl = url;
      this.visible = true;
    },
    handleRemove(file) {
      const i = this.$refs.upload.fileList.indexOf(file);
      this.uploadListArr.splice(i, 1);
      this.$refs.upload.fileList.splice(i, 1);
      this.$emit("on-remove");
    },
    handleSuccess(res, file) {
      if (res.success) {
        this.$emit("on-upsuccess", res);
        this.$Message.success("上传成功!");
        file.url = res.data.picUrl;
        this.imgUrl = res.data.picUrl;
      } else {
        this.$Message.error(res.msg);
      }
    },
    handleFiled(res, file) {
      this.$emit("on-uperror", res);
      this.$Message.error("上传失败!");
    },
    handleFormatError(file) {
      this.$Message.error(`文件类型有误！仅支持${this.fileRange.join('/')}格式`);
    },
    handleMaxSize(file) {
      let msg = `上传的文件太大！请将上传的文件大小限制在${this.maxSize}kb以内`
      if(this.sizeType===2){
        msg=`文件不能超过${this.maxSize/1024}M`
      }
      this.$Message.warning(msg);
    },
    handleBeforeUpload(file) {
      this.$emit("before-upload", file);
      const check = this.uploadListArr.length >= this.maxUpLoadCount;
      if (check) {
        this.$Message.error(`最多只能上传${this.maxUpLoadCount}个文件！`);
        return false
      }
      if (this.limitSize.width !== "" && this.limitSize.height !== "") {
        return this.checkImageWH(
          file,
          this.limitSize.width,
          this.limitSize.height
        );
      }
      return !check;
    },
    checkImageWH(file, width, height) {
      let self = this;
      return new Promise(function(resolve, reject) {
        let filereader = new FileReader();
        filereader.onload = e => {
          let src = e.target.result;
          const image = new Image();
          image.onload = function() {
            if (this.width === width && this.height === height) {
              resolve();
            } else {
              self.$Message.warning(`请上传${width}X${height},格式为png的图片`);
              reject();
            }
          };
          image.onerror = reject;
          image.src = src;
        };
        filereader.readAsDataURL(file);
      });
    }
  },
  watch: {
    defaultList(value) {
      this.uploadListArr = value;
      // let files = this.$refs.upload.fileLists
    }
  }
};
</script>
<style scoped lang="less">
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
