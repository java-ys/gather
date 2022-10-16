<template>
  <div>
    <Upload
      :action="upBaseUrl"
      :headers="headerSet"
      :format="['mp4']"
      :show-upload-list="false"
      :on-error="handleFiled"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :on-progress="uploading"
      :on-format-error="handleFormatFiled"
      :before-upload="handleBeforeUpload"
      :data="uploadParams"
      multiple
      type="drag"
      ref="upload"
      style="display: inline-block;width:80px;"
    >
      <!-- <Button icon="ios-cloud-upload-outline" @click="loading =true">点击上传</Button> -->
      <div style="width: 80px;line-height: 80px;" @click="loading = true">
        <Icon type="ios-videocam" size="20" />
      </div>
    </Upload>
    <div
      class="demo-upload-list"
      v-for="(item, index) in uploadList"
      :key="index"
      v-show="showUploadList"
    >
      <div v-show="uploadList.length">
        <span class="icon"></span>
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon
            type="ios-trash-outline"
            v-if="showRemove"
            @click.native="handleRemove(item)"
          ></Icon>
        </div>
      </div>
      <progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="uploadPercent"
        v-show="loading"
      ></progress>
    </div>
    <a v-show="file.imgUuid"></a>
    <Modal title="视频" v-model="visible" :width="500">
      <VideoPreview :videoUrl="currentFileUrl" v-if="visible"></VideoPreview>
    </Modal>
    <div></div>
    <!-- <Progress :percent="uploadPercent" v-show="loading"  style="width:120px"/> -->
  </div>
</template>
<script>
import VideoPreview from "./videoPreview/index.vue";
import "element-ui/lib/theme-chalk/index.css";
import {
  fileToken,
  fetchVideoUrl,
  uploadVideoUrl
} from "_o/api/work-order/common.js";
import { queryFileInfo } from "_o/api/work-order/wo-detail";

import config from "@/config/config";
const uploadUrl =
  process.env.NODE_ENV === "development"
    ? config.uploadUrl.dev
    : config.uploadUrl.pro; //获取资源请求链接

export default {
  components: { VideoPreview },
  props: {
    showPreview: {
      type: Boolean,
      default: true
    },
    maxLength: {
      type: Number,
      default: 5
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    showRemove: {
      type: Boolean,
      default: false
    },
    defaultShow: {
      type: Boolean,
      default: false
    },
    defaultImg: {
      type: String,
      default: () => {
        return "";
      }
    },
    defaultList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // upBaseUrl: this._baseUrl + '/m2-manager-web/api/upload/uploadImg',
      // upBaseUrl: uploadUrl+ "/file/media/upload/public",
      upBaseUrl: uploadVideoUrl,
      headerSet: {
        // Authorization: getToken('agent_token'),
        // ...headersObject
        token: ""
      },

      uploadParams: {
        // imgType: '2'
      },
      loading: false,
      file: {
        url: "",
        imgUuid: ""
      },
      uploadPercent: 0,
      visible: false,
      timer: null,
      uploadList: [],
      currentFileUrl: ""
    };
  },

  watch: {
    defaultList(val) {
      if (val.length) {
        const list = val.filter(item =>
          this.uploadList.every(i => i.fileId !== item.fileId)
        );
        this.uploadList = [...list, ...this.uploadList];
      } else {
        this.uploadList = this.uploadList.filter(item => !item.type);
      }
    }
  },

  created() {
    this.busEvents.$on("syncVideo", val => {
      const { type, data, isList } = val
      const item = {
        fileId: data,
        fileUrl: "" // 视频 url 有过期时间，播放需实时获取
      };
      if (type) {
        this.uploadList.push(item);
        this.$emit("upload-success", item);
      } else {
        this.handleRemove(item, isList)
      }
    })
  },

  mounted() {
    this.getDefaultList();
    this.getToken();
  },

  methods: {
    clearFiles() {
      this.uploadList = [];
    },

    getToken() {
      fileToken({doType: 1}).then(res => {
        this.headerSet.token = res.data.data;
      });
    },
    getDefaultList() {
      if (this.defaultShow) {
        // this.uploadList[0] = this.defaultImg
      }
    },
    handleSuccess(res, file) {
      clearInterval(this.timer);
      this.uploadPercent = 100;
      const { success, data } = res;
      if (success) {
        const { uuid, publicUrl } = data;
        const item = {
          fileId: uuid,
          fileUrl: publicUrl
        };
        this.loading = false;
        this.file.imgUuid = res.data.uuid;
        this.uploadList.push(item);
        this.$Message.success("上传成功");
        this.$forceUpdate();
        this.$emit("upload-success", item);
      }
      this.loading = false;
    },
    handleFiled(res, file) {
      this.loading = false;
      this.$Message.error("上传失败!");
    },
    uploading(event, file) {
      this.loading = true;
    },
    handleBeforeUpload(file) {
      if (this.uploadList.length >= this.maxLength) {
        this.$Message.error(`上传文件不得大于${this.maxLength}个`);
        return false;
      }
      // 文件小于50M，否则提示文件过大
      const isSize = file.size / 1024 / 1024 > 50;
      if (isSize) {
        this.$Message.error({
          content: "上传文件不能大于50M"
        });
        return false;
      }
      this.$Message.warning("上传中，请稍后");
    },
    handleFormatFiled() {
      this.$Message.error({
        content: "只能上传MP4格式视频"
      });
    },
    // 预览视频
     handleView(item) {
      const { fileId, fileUrl } = item
      if (fileUrl) {
        this.currentFileUrl = fileUrl;
        this.visible = true;
      } else {
        this.getVideoUrl(fileId)
      }
    },
    handleRemove(item, isList) {
      const { fileId, fileUrl } = item
      const index = this.uploadList.findIndex(item => item.fileId === fileId)
      if (index > -1) {
        this.uploadList.splice(index, 1);
        this.$emit("delete", item);
        if (!fileUrl && !isList) {
          this.busEvents.$emit("delSyncVideo", fileId)
        }
      }
    },

    async getVideoUrl(fileId) {
      const {
        data: { success, msg, data }
      } = await queryFileInfo({ uuid: fileId });
      if (success) {
        if (data) {
          this.currentFileUrl = data.url
          this.visible = true;
        } else {
          this.$Message.info(msg);
        }
      }
    },
  }
};
</script>
<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-right: 4px;
  margin-left: 10px;
  text-align: center;
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  cursor: pointer;
  .icon {
    display: inline-block;
    width: 80px;
    height: 80px;
    background-size: 80px 80px;
    background-repeat: no-repeat;
    background-image: url(./assets/car-bg@3x.png);
  }
}
.demo-upload-list img {
  width: 100%;
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
