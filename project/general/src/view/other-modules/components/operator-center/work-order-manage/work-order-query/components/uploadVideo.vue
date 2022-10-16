<template>
  <div>
    <Upload
      :action="upBaseUrl"
      :headers="headerSet"
      :format="['mp4']"
      :show-upload-list="false"
      :on-error="handleFiled"
      :default-file-list="[]"
      :on-success="handleSuccess"
      :on-progress="uploading"
      :on-format-error="handleFormatFiled"
      :before-upload="handleBeforeUpload"
      :data="uploadParams"
      multiple
      type="drag"
      ref="upload"
      style="display: inline-block;width:58px;"
    >
      <!-- <Button icon="ios-cloud-upload-outline" @click="loading =true">点击上传</Button> -->
      <div
        style="width: 58px;height:58px;line-height: 58px;"
        @click="loading = true"
      >
        <Icon type="logo-youtube" size="20" />
      </div>
    </Upload>
    <div
      class="demo-upload-list"
      v-for="(item, index) in uploadList"
      :key="index"
      v-show="showUploadList"
    >
      <div v-show="uploadList.length">
        <Icon type="logo-youtube" />
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
    <Modal title="视频" v-model="visible">
      <ViewVideo :videoUrl="picUrl" v-if="visible"></ViewVideo>
    </Modal>
    <div></div>
    <!-- <Progress :percent="uploadPercent" v-show="loading"  style="width:120px"/> -->
  </div>
</template>
<script>
import { getToken } from "@/libs/util";
import { Progress } from "element-ui";
import ViewVideo from "./ViewVideo";
import "element-ui/lib/theme-chalk/index.css";
import {
  getImgUrl,
  fileToken,
  getConstantUrl
} from "_o/api/work-order/common.js";
import config from "@/config/config";
const headersObject = config.headers;
const uploadUrl =
  process.env.NODE_ENV === "development"
    ? config.uploadUrl.dev
    : config.uploadUrl.pro; //获取资源请求链接
export default {
  components: { ViewVideo },
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
    }
  },
  data() {
    return {
      // upBaseUrl: this._baseUrl + '/m2-manager-web/api/upload/uploadImg',
      // upBaseUrl: uploadUrl+ "/file/media/upload/public",
      upBaseUrl: uploadUrl + "/file/upload/public",
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
      picUrl: ""
    };
  },
  mounted() {
    this.getDefaultList();
    this.getToken();
  },
  methods: {
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
      if (res.success) {
        this.loading = false;
        this.$Message.success("上传成功");
        this.$emit("up-success", res);
        this.file.imgUuid = res.data.uuid;
        this.uploadList.push(res.data);
        if (this.uploadList.length > 1) {
          this.uploadList.splice(0, 1);
        }
        this.$forceUpdate();
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
      // 文件小于50M，否则提示文件过大
      const isSize = file.size / 1024 / 1024 < 50;
      if (!isSize) {
        this.$Message.error({
          content: "上传文件不能大于50M",
          duration: 3
        });
        return false;
      }
      this.$Message.warning("上传中 请稍后");
    },
    handleFormatFiled() {
      this.$Message.error({
        content: "只能上传MP4格式视频",
        duration: 3
      });
    },
    // 预览视频
    handleView(item) {
      let params = { uuid: item.uuid };
      // getConstantUrl(params,this.headerSet.token).then(res=>{
      //     if(res.data.success){
      //         this.picUrl = res.data.data
      //         this.visible = true
      //     }else {
      //         this.$Message.error('获取视频失败!');
      //     }
      // })
      this.picUrl = item.publicUrl;
      this.visible = true;
    },
    handleRemove(item) {
      const fileList = this.uploadList;
      this.uploadList.splice(fileList.indexOf(item), 1);
      this.$emit("deleteItem", item);
    }
  }
};
</script>
<style lang="less" scoped>
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
  margin-left: 10px;
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
