<template>
  <div>
    <!-- 数据导入 -->
    <Button :type="type" :disabled="disabled" :size="size" @click="importFile">
      {{ btnText }}
    </Button>
    <Modal
      v-model="isShowUpModal"
      :title="'导入数据'"
      :mask-closable="true"
      width="600"
      @on-visible-change="statusChange"
    >
      <Alert type="warning" :style="{ color: error === true ? 'red' : '' }">
        {{ importMessage }}
      </Alert>
      <div class="down-container">
        <Button
          type="primary"
          style="display: inline-block;"
          :to="toDownTemplateUrl_"
          target="_blank"
        >
          <Icon type="ios-cloud-download-outline" size="20" />下载模板
        </Button>
        <Upload
          ref="importFile"
          multiple
          type="drag"
          :data="data"
          :action="importFileUrl_"
          class="file-box"
          :headers="header"
          :before-upload="beforeUpHandle"
          :show-upload-list="false"
          :on-success="importSuccess"
          :on-error="importFiled"
          :format="['zip', 'xlsx']"
          accept=".zip, .xlsx"
          :on-format-error="formatError"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" />
            <p>点击(拖拽)上传文件</p>
            <p v-if="otherMsg" style="color:#bbb">( {{ otherMsg }} )</p>
          </div>
          <Progress v-show="isShowUpBar" :percent="upPercent" />
        </Upload>
      </div>
      <div slot="footer">
        <Button @click="isShowUpModal = false">取消</Button>
        <Button type="primary" v-lazy-click="saveData">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
let timer = null;
import { getToken } from "@/libs/util.js";
export default {
  name: "ImportFile",
  props: {
    importFileUrl: {
      type: String,
      required: true
    },
    btnText: {
      type: String,
      default: "导入数据"
    },
    toDownTemplateUrl: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: false
    },
    disabled: {
      default: false
    },
    size: {
      default: "default"
    },
    type: {
      default: "primary"
    },
    sameMessage: {
      type: String,
      default: "请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！"
    },
    otherMsg: {
      type: String,
      default: ""
    },
    baseUrlName: {
      default: "_baseUrl"
    },
    successMsg: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // toDownTemplateUrl_: this[baseUrlName] + this.toDownTemplateUrl,
      upPercent: 0,
      header: { Authorization: getToken() },
      isShowUpBar: false,
      importMessage:
        "请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！",
      isShowUpModal: false,
      importFileUrl_: this[this.baseUrlName] + this.importFileUrl,
      error: false,
      successData: {},
      totalCount: 0,
      successCount: 0,
      failCount: 0
    };
  },
  computed: {
    toDownTemplateUrl_() {
      return this[this.baseUrlName] + this.toDownTemplateUrl;
    }
  },
  watch: {
    isShowUpModal(val) {
      if (val) {
        this.successData = {};
      }
    }
  },
  methods: {
    importFile() {
      if (this.disabled) {
        return false;
      }
      this.upPercent = 0;
      this.isShowUpBar = false;
      this.importMessage = this.sameMessage;
      this.isShowUpModal = true;
    },
    beforeUpHandle(res, file) {
      this.upPercent = 0;
      this.isShowUpBar = true;
      timer = setInterval(() => {
        if (this.upPercent < 91) {
          this.upPercent = this.upPercent + parseInt(Math.random() * 10, 10);
        } else {
          clearInterval(timer);
        }
      }, 1000);
    },
    importSuccess(res, file, fileList) {
      if (res.success) {
        let successmsg = res.msg || "导入成功!";
        this.totalCount = res.data.totalCount || 0;
        this.successCount = res.data.successCount || 0;
        this.failCount = res.data.failCount || 0;
        this.error = false;
        this.importMessage = this.successMsg || successmsg;
        this.importMessage = `总条数: ${this.totalCount}  成功条数: ${this.successCount}  失败条数: ${this.failCount}`;
        this.$emit("on-success", { ...res, fileName: file.name });
        this.successData = { ...res, fileName: file.name };
      } else {
        let errormsg = res.msg || "服务器错误!";
        this.error = true;
        this.importMessage = errormsg;
        this.isShowUpBar = false;
        this.$emit("on-error", res);
      }
      // 用于取消定时器
      this.upPercent = 100;
    },
    importFiled(res, file, fileList) {
      if (!res.success) {
        // 用于取消定时器
        this.upPercent = 100;
        this.isShowUpBar = false;
        let errormsg = res.msg || "服务器错误!";
        this.error = true;
        this.$Notice.error({
          desc: errormsg,
          duration: 10
        });
        this.$emit("on-error", res);
      }
    },
    statusChange(flag) {
      this.$emit("on-change", flag);
    },
    formatError(file, fileList) {
      this.$Message.warning("文件格式不正确");
      this.isShowUpBar = false;
    },
    saveData() {
      if (this.successData && this.successData.code === 200) {
        this.isShowUpModal = false;
        this.$emit("on-sure", { ...this.successData });
      } else {
        this.$Message.warning("请上传文件");
      }
    }
  }
};
</script>
<style lang="less">
.down-container {
  display: flex;
  align-items: center;
  a {
    width: 150px;
    height: 35px;
    flex: 1;
    margin: 0 10px 0 0;
  }
  .file-box {
    flex: 2;
    margin: 0 10px;
  }
}
</style>
