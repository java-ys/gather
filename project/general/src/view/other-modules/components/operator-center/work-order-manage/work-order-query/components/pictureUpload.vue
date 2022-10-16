<template>
  <div @click="refreshToken">
    <Upload
      :action="upBaseUrl"
      :headers="headerSet"
      :format="['jpg', 'jpeg', 'png']"
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
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <div
      class="demo-upload-list"
      v-for="(item, index) in uploadList"
      :key="index"
      v-show="showUploadList"
    >
      <div v-show="uploadList.length">
        <img :src="item.fileUrl" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon
            type="ios-trash-outline"
            v-if="showRemove"
            @click.native="handleRemove(item)"
          ></Icon>
        </div>
      </div>
      <!-- <progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="uploadPercent"
        v-show="loading"
      ></progress> -->
    </div>
    <a v-show="file.imgUuid"></a>
    <Modal title="图片" v-model="visible" :width="1000">
      <div>
        <img class="large" :src="currentFileUrl" />
      </div>
      <!-- <Carousel :imgList="currentFileUrl" v-if="visible"></Carousel> -->
    </Modal>
    <div></div>

    <!-- <Progress :percent="uploadPercent" v-show="loading" /> -->
  </div>
</template>
<script>
import { getToken } from "@/libs/util";
import { Progress } from "element-ui";
import Carousel from "./carouselPic/carousel.vue";
import "element-ui/lib/theme-chalk/index.css";
import config from "@/config/config";
import oss from "@/mixins/oss";
import { fileToken } from "_o/api/work-order/common";

const headersObject = config.headers;
export default {
  components: { Carousel, Progress },
  props: {
    source: String,
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
    imgType: {
      type: Number,
      default: () => {
        return 2;
      }
    },
    defaultList: {
      type: Array,
      default: () => []
    }
  },
  mixins: [oss],
  data() {
    return {
      upBaseUrl: this.source == 'GD' ? config.uploadUrl.pro + '/file/upload/image/private' : (this._baseUrl4CommonWeb + "/common/uploadImg"),
      headerSet: this.source == 'GD' ? {
        token: '',
      } : {
        Authorization: getToken("agent_token"),
        ...headersObject
      },
      uploadParams: {
        imgType: this.imgType,
        ...(this.source == 'GD' ? { expire: 30*24*60*60*1000 } : {})
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
      // defaultList: [
      //   {
      //     type: 1,
      //     fileId: "a42bdcc1178e62b4694c830f028db5c0",
      //     fileUrl:
      //       "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3413581055,4053282087&fm=26&gp=0.jpg"
      //   }
      // ]
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
    this.refreshToken();
  },
  methods: {
    async refreshToken() {
      if (this.source !== 'GD') return;
      let params = { doType: 2 }
      const {
        data: { data, success }
      } = await fileToken(params);
      if (success) {
        this.headerSet.token = data;
      }
    },
    
    clearFiles() {
      // this.$refs["upload"].clearFiles();
      this.uploadList = [];
    },

    getDefaultList() {
      if (this.defaultShow) {
      }
    },
    async handleSuccess(res, file) {
      clearInterval(this.timer);
      this.uploadPercent = 100;
      // setTimeout(()=>{
      // 	this.loading = false
      // },2000)
      // TODO /common/uploadImg改造
      const { success, data } = res;
      if (success) {
        const { uuid, picUrl } = data;
        const [err, v] = await this.getOssFile({uuid})
        if(err || !v) return
        const item = { fileId: uuid, fileUrl: v || picUrl || "" };
        this.file.imgUuid = res.data.uuid;
        this.uploadList.push(item);
        this.$Message.success("上传成功");
        this.$forceUpdate();
        this.$emit("upload-success", item);
      }
    },
    handleFiled(res, file) {
      this.$Message.error("上传失败!");
    },
    uploading(event, file) {
      this.loading = true;
    },
    handleBeforeUpload(file) {
      if (this.uploadList.length >= this.maxLength) {
        this.$Message.error(`上传图片不得大于${this.maxLength}张`);
        return false;
      }
      // 文件小于50M，否则提示文件过大
      const isSize = file.size / 1024 / 1024 > 10;
      // const isSize = file.size / 1024 > 1;
      if (isSize) {
        this.$Message.error({
          content: "上传图片不能大于10M"
        });
        return false;
      }
      this.$Message.warning("上传中，请稍后");
    },
    handleFormatFiled() {
      this.$Message.error({
        content: "只能上传jpg,png格式图片"
      });
    },
    // 预览图片
    handleView(item) {
      this.currentFileUrl = item.fileUrl;
      this.visible = true;
    },
    handleRemove(item) {
      const fileList = this.uploadList;
      this.uploadList.splice(fileList.indexOf(item), 1);
      this.$emit("delete", item);
    }
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
  overflow: hidden;
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

.large {
  width: 100%;
}

/deep/ .ivu-modal-body {
  text-align: center;
}
</style>
