<template>
  <Modal
    title="导入数据"
    :value="batchInsertVisible"
    @on-cancel="closeDialog"
    width="60%"
  >
    <div class="tips" v-if="isBondManage">
      导入数据示例模板&nbsp;&nbsp;
      <span style="font-size: 13px; color: gray"
        >(导入的数据超过<span style="color: red">500条</span>的，系统只会对<span
          style="color: red"
          >前500条</span
        >进行验证及录入处理，超过的部分将跳过所有处理环节)
      </span>
    </div>
    <div class="tips" v-if="importRule">
      导入数据示例模板&nbsp;&nbsp;
      <span style="font-size: 13px; color: gray"
        >(导入的数据超过<span style="color: red">2000条</span
        >的，系统只会对<span style="color: red">前2000条</span
        >进行验证及录入处理，超过的部分将跳过所有处理环节)
      </span>
    </div>
    <div class="tips" v-if="importInterview">
      导入数据示例模板&nbsp;&nbsp;
      <span style="font-size: 13px; color: gray"
        >(导入的数据超过<span style="color: red">200条</span>的，系统只会对<span
          style="color: red"
          >前200条</span
        >进行验证及录入处理，超过的部分将跳过所有处理环节)
      </span>
    </div>
    <template v-for="srcPath in notePictureArr" v-if="batchInsertVisible">
      <img :src="srcPath.src" width="100%" @click="dialogVisible = true" />
    </template>

    <Row>
      <Col :span="12">
        <a :href="templateDownloadUrl" style="margin-left: 30px;" target="_blank">
          <Button type="primary">下载模板</Button>
        </a>
        <div style="margin: 15px 0 0 30px">
          <Upload
            :action="action"
            :headers="header"
            :format="fileType"
            :on-preview="onPreview"
            :on-error="uploadError"
            :on-success="handleUploadSuccess"
            type="drag"
          >
            <div class="upload-drag">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>将文件拖到此处,或<span>点击上传</span></p>
              <p>只能上传Excel文件,最多导入500条数据</p>
          </div>
          </Upload>
        </div>
      </Col>
    </Row>
  </Modal>
</template>

<script>
import vUpload from "_a/v-upload/v-upload.vue";
import { getToken } from "@/libs/util.js";

export default {
  components: { vUpload },
  props: {
    batchInsertVisible: { type: Boolean, required: false },
    notePictureArr: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    isBondManage: {
      type: Boolean,
      default: false,
    },
    importRule: {
      type: Boolean,
      default: false,
    },
    importInterview: {
      type: Boolean,
      default: false,
    },
    templateHref: { type: String, required: false, default: "" },
    importAction: { type: String, required: false, default: "" },
  },
  data() {
    return {
      excelAction: "",
      fileType: ['xlsx','xls'],
      dialogVisible: false,
      header: { Authorization: getToken() },
      baseURL__: this['_baseResourceRecruit']
    };
  },
  computed: {
    action() {
      return  this.baseURL__ + this.importAction
    },
    templateDownloadUrl() {
      return this.baseURL__ + this.templateHref
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "batchAdd");
    },
    uploadError(error, file, fileList) {
      console.log(error, file, fileList);
    },
    onPreview(file) {
      console.log(file)
    },
    handleUploadSuccess(response, file, fileList) {

      // 文件上传成功时的钩子
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      const json = {
        value: fileList,
        type: this.fileType,
        method: "upload",
        response: response
      };

      this.$emit("successReload", json);
    },
  },
};
</script>

<style lang="less" scoped>
.upload-drag{
  padding: 20px 0;
  span{ 
    color: #2d8cf0;
  }
}
.tips {
  font-weight: bold;
  color: gray;
  margin: 15px;
  font-size: 16px;
}
</style>
