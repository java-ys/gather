<template>
  <div>
    <face-upload
      type="image"
      :prop="propName"
      :action="imageAction"
      :miniButton="true"
      :showFileList="false"
      @handleUploadSuccess="handleUpload"
      @handleRemove="handleRemove"
    />
    <!-- 拍照 -->
    <photo
      :propName="propName"
      :camera="camera"
      @resolveImgUrl="resolveImgUrl"
    />
    <!-- 图片预览 -->
    <img
      v-if="showValue && showValue.length > 0"
      width="80"
      height="80"
      :src="showValue"
      @click="handlePreview(showValue)"
    />
    <el-button
      v-if="showValue && showValue.length > 0"
      id="image-component-remove"
      size="small"
      type="text"
      @click="handleRemove({ prop: propName })"
    >移除照片
    </el-button>
    <!-- 图片预览弹层 -->
    <el-dialog
      id="image-component-dialog"
      :visible.sync="dialogVisible"
      append-to-body
      class="dialog-size"
    >
      <img
        id="image-component-dialog-img"
        width="100%"
        :src="dialogImageUrl"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<script>
// import faceUpload from "_o/components/operator-center/salary-modules/components/faceUpload";
// import photo from "_o/components/operator-center/salary-modules/components/photo";

import faceUpload from "./faceUpload";
import photo from "./photo";

export default {
  name: "faceImageComponent",
  components: { faceUpload, photo },
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    propName: { type: String, required: true },
    imageAction: { type: String, required: true },
    camera: { type: String, required: false, default: "0" },
    extraMsg: { type: Object, required: false },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      showValue: "",
    };
  },
  created() {
    if (this.value) {
      this.showValue = this.value[0];
    }
  },
  methods: {
    handleUpload(json) {
      // console.info("---===component upload json: %o", json)
      const { value } = json
      if (value && value.length > 0 && value[0] && value[0].response) {
        this.showValue = value[0].response.data ? value[0].response.data.privateUrl : "";
      }
      json.extraMsg = this.extraMsg;
      this.$emit("handleUploadSuccess", json);
    },
    handleRemove(json) {
      // console.info("---===component remove json: %o", json)
      this.showValue = "";
      json.extraMsg = this.extraMsg;
      this.$emit("handleRemove", json);
    },
    resolveImgUrl(json) {
      // console.info("===---component resolveImgUrl json: %o", json)
      if (json.imgUrl) {
        this.showValue = json.imgUrl;
      }
      json.extraMsg = this.extraMsg;
      this.$emit("resolveImgUrl", json);
    },
    handlePreview(url) {
      console.log("url", url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
  },
};
</script>
