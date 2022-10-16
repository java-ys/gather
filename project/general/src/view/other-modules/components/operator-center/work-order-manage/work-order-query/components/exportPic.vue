<template>
  <div>
    <Upload
      :action="upBaseUrl"
      :headers="headerSet"
      :format="['jpg', 'jpeg', 'png']"
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
        <img :src="item.picUrl" />
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
    <Modal title="预览图片" v-model="visible" width="800">
      <Carousel :imgList="picUrl" v-if="visible"></Carousel>
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
import { getImgUrl } from "_o/api/work-order/common.js";
import config from "@/config/config";
const headersObject = config.headers;
export default {
  components: { Carousel, Progress },
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
    imgType: {
      type: Number,
      default: () => {
        return 2;
      }
    }
  },
  data() {
    return {
      upBaseUrl: this._baseUrl4CommonWeb + "/common/uploadImg",
      headerSet: {
        Authorization: getToken("agent_token"),
        ...headersObject
      },
      uploadParams: {
        imgType: this.imgType
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
  },
  methods: {
    getDefaultList() {
      if (this.defaultShow) {
        // this.uploadList[0] = this.defaultImg
      }
    },
    handleSuccess(res, file) {
      clearInterval(this.timer);
      this.uploadPercent = 100;
      // setTimeout(()=>{
      // 	this.loading = false
      // },2000)
      // TODO /common/uploadImg改造
      if (res.success) {
        this.$emit("up-success", res);
        this.file.imgUuid = res.data.uuid;

        if (this.uploadList.length < this.maxLength) {
          this.uploadList.push(res.data);
          this.$Message.success("上传成功");
        } else {
          this.$Message.error(`上传不得大于${this.maxLength}张`);
          return;
        }
        this.$forceUpdate();
      }
    },
    handleFiled(res, file) {
      this.$Message.error("上传失败!");
    },
    uploading(event, file) {
      this.loading = true;
    },
    handleBeforeUpload(file) {
      // 文件小于50M，否则提示文件过大
      const isSize = file.size / 1024 / 1024 < 10;
      console.log(file);
      if (!isSize) {
        this.$Message.error({
          content: "上传图片不能大于10M",
          duration: 3
        });
        return false;
      }
    },
    handleFormatFiled() {
      this.$Message.error({
        content: "只能上传jpg,png格式图片",
        duration: 3
      });
    },
    // 预览图片
    handleView(item) {
      let data = {
        attachmentUrlUuid: [item.uuid]
      };
      getImgUrl(data).then(res => {
        this.picUrl = res.data.data.attachmentUrl.toString();
        this.visible = true;
      });
    },
    handleRemove(item) {
      const fileList = this.uploadList;
      this.uploadList.splice(fileList.indexOf(item), 1);
      this.$emit("deleteItem", item);
      // console.log(this.uploadList, item)
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
