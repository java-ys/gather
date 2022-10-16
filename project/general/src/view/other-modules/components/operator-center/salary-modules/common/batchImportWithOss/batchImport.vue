<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="导入数据"
    :visible="batchInsertVisible"
    width="75%"
    @close="closeDialog"
  >
    <div v-if="otherTips && otherTips.trim()" class="tips" :style="otherTipsStyle || ''">
      {{otherTips}}
    </div>
    <slot name="otherInfos"></slot>
    <el-row>
      <el-col :span="12">
        <a :href="templateHref">
          <el-button type="primary" size="small" style="width: 67%; margin-top: 30px; margin-left: 30px">下载模板
          </el-button>
        </a>
        <div style="margin: 15px 0 0 30px">
          <upload type="excel"
                  :action="useOss ? uploadUrl : importAction"
                  :interface="interface"
                  :params="otherParams"
                  :showFileList="showFileList"
                  :before-upload="beforeUploadFn"
                  :buttonText="'点击(拖拽)上传excel文件'"
                  :draggable="true"
                  @handleUploadSuccess="handleUploadSuccess"
          />
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import upload from "_o/components/operator-center/salary-modules/components/upload";
// import {getTemplate} from "_o/api/salary/resume";
// import { apiUrl, uploadUrl } from "_o/common/envConstant";
import base from "_o/api/salary/base"
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
const uploadUrl = isDev ? config.uploadUrl.dev : config.uploadUrl.pro

// const currentPath = "/resumePage";

export default {
  components: { upload },
  props: {
    batchInsertVisible: { type: Boolean, required: false },
    otherTips: {
      type: String,
      default: ""
    },
    otherTipsStyle: {
      type: String,
      default: ""
    },
    beforeUpload: {
      type: Function
    },
    useOss: {
      type: Boolean,
      default: false,
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    templateHref: { type: String, required: false, default: "" },
    importAction: { type: String, required: false, default: "" },
    interface: { type: Function },
    otherParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      action: apiUrl + "/m2-driver-resume-web" + this.importAction,
      excelAction: "",
      uploadUrl,
      dialogVisible: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "batchAdd");
    },
    beforeUploadFn(file) {
      if (this.beforeUpload && typeof this.beforeUpload === "function") {
        return this.beforeUpload(file);
      }
      return true;
    },
    handleUploadSuccess(json) {
      if (!this.useOss) {
        return this.$emit("successReload", json);
      }
      let ossUrl;
      if (json && json.success) {
        ossUrl = json.data.url;
      }
      if (!ossUrl) {
        return this.$alert("上传失败，请重试！");
      }
      base.mainRequest(this.action, {
        url: ossUrl,
        params: { ...this.otherParams }
      }).then(res => {
        if (res.data && res.data.success) {
          this.$emit("successReload", json);
        } else {
          this.$alert("导入失败！" + res.data.msg || "");
        }
      });
    },
  }
}
</script>

<style scoped>
  .tips {
    font-weight: bold;
    color: gray;
    margin: 15px;
    font-size: 16px;
  }
</style>
