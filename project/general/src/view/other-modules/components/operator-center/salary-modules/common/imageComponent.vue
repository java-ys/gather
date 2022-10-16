<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-02-28 15:26:29
 * @LastEditors: wangp
 * @LastEditTime: 2020-06-09 11:26:46
-->
<template>
  <div class="image-component-upload">
    <upload
      type="image"
      :prop="propName"
      :action="imageAction"
      :interface="interface"
      :miniButton="true"
      :showFileList="false"
      @handleUploadSuccess="handleUpload"
      @handleRemove="handleRemove"
    />
    <photo v-if="needPhoto" :propName="propName" :camera="camera" @resolveImgUrl="resolveImgUrl" />
    <!-- <img width="80" height="80" v-if="showValue && showValue.length > 0"
         :src="showValue" @click="handlePreview(showValue)" /> -->
    <!--     v-if="showValue && showValue.length > 0"-->
    <el-image
      :src="showValue"
      class="el-image-er-default"
      style="width: 200px; height: 200px; padding-bottom: 30px"
      @click="showImg"
    >
      <div slot="error" class="image-slot">
        暂无照片
        <!--        <i class="el-icon-picture-outline"></i>-->
      </div>
    </el-image>

    <el-button v-if="showValue && showValue.length > 0" size="small" type="text"
               @click="handleRemove({ prop: propName })"
    >移除照片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body class="dialog-size">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import upload from "_o/components/operator-center/salary-modules/components/upload";
import photo from "_o/components/operator-center/salary-modules/components/photo";

export default {
  name: "imageComponent",
  components: { upload, photo },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    showPicList: {
      type: Array,
      default: () => {
        return []
      }
    },
    propName: { type: String, required: true },
    imageAction: { type: String, required: true },
    interface: { type: Function },
    camera: { type: String, required: false, default: "0" },
    extraMsg: { type: Object, required: false },
    needPhoto: { type: Boolean, default: true }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      showValue: ""
    }
  },
  watch: {
    value: {
      handler(value) {
        if (value && value.length) {
          this.showValue = value[0]
        }
      },
      deep: true
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.showValue = this.value[0]
    }
  },
  methods: {
    handleUpload(json) {
      console.info("---===component upload json: %o", json)
      if (json.value && json.value.length > 0 && json.value[0].response && json.value[0].response.success) {
        console.log(json, json.value)
        this.showValue = json.value[0].response.data.picUrl;
      }
      json.extraMsg = this.extraMsg;
      this.$emit("handleUploadSuccess", json)
    },
    handleRemove(json) {
      // // console.info("---===component remove json: %o", json)
      this.showValue = ""
      json.extraMsg = this.extraMsg;
      this.$emit("handleRemove", json)
    },
    resolveImgUrl(json) {
      // // console.info("===---component resolveImgUrl json: %o", json)
      if (json.imgUrl) {
        this.showValue = json.imgUrl;
      }
      json.extraMsg = this.extraMsg;
      this.$emit("resolveImgUrl", json);
    },
    handlePreview(url) {
      console.log("url", url)
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    showImg() {
      let imgList = [this.showValue] // 图片列表
      let index = 0 // 定位下标
      // 如果有props的showPicList 用showPicList 的多图预览
      if (this.showPicList && this.showPicList.length > 0) {
        imgList = this.showPicList.filter(item => {
          return item !== ""
        })
        index = imgList.findIndex(item => {
          return item == this.showValue
        })
      }
      if (imgList.length == 1) {
        this.$hevueImgPreview({
          url: imgList[0]
        })
      } else {
        this.$hevueImgPreview({
          multiple: true,
          nowImgIndex: index,
          imgList: imgList
        })
      }

    }
  }
}
</script>
<style lang="scss" scoped>
  .image-component-upload {
    min-width: 300px;
  }
  ::v-deep .el-icon-refresh-left{
    background: url("../../icons/menu/ico_refresh_left.png") center center no-repeat;
    background-size: 20px 20px;
  }
  ::v-deep .el-icon-refresh-left:before{
    visibility: hidden;
  }
  ::v-deep .el-icon-refresh-right{
    background: url("../../icons/menu/ico_refresh_right.png") center center no-repeat;
    background-size: 20px 20px;
  }
  ::v-deep .el-icon-refresh-right:before{
    visibility: hidden;
  }
  ::v-deep .el-icon-full-screen{
    background: url("../../icons/menu/ico_origin.png") center center no-repeat;
    background-size: 20px 20px;
  }
  ::v-deep .el-icon-full-screen:before{
    visibility: hidden;
  }
  ::v-deep .el-icon-c-scale-to-original{
    background: url("../../icons/menu/ico_origin.png") center center no-repeat;
    background-size: 20px 20px;
  }
  ::v-deep .el-icon-c-scale-to-original::before{
    visibility: hidden;
  }

</style>
