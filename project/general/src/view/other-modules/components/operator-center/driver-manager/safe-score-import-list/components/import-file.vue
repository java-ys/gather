<template>
  <div>
    <!-- 数据导入 -->
    <Button :type="type" :disabled="disabled" :size="size" @click="importFile">
      {{ btnText }}
    </Button>
    <Modal
      v-model="isShowUpModal"
      title="导入数据"
      :mask-closable="false"
      width="600"
      @on-visible-change="statusChange">
      <Alert type="warning" :style="{ color: error === true ? 'red' : '' }">
        {{ importMessage }}
      </Alert>
      <div class="down-container">
        <download-btn
          :toUrl="toDownTemplateUrl"
          style="display: inline-block;width:150px;"
        ></download-btn>
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
          :on-format-error="formatError">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" />
            <p>点击(拖拽)上传文件</p>
            <p v-if="otherMsg" style="color:#bbb">( {{otherMsg}} )</p>
          </div>
          <Progress v-show="isShowUpBar" :percent="upPercent" />
        </Upload>
      </div>
      <div class="err-empty"> {{showUnUpload ? '请上传文件':''}}</div>
      <div slot="footer">
        <Button type="primary" :loading="submitLoading"  @click="handleOk">
          <span v-if="!submitLoading">确定</span>
          <span v-else>提交中...</span>
        </Button>
        <Button type="text" @click="isShowUpModal = false">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showErrorInfo"
      :title="errorModalTitle"
      :mask-closable="false"
      width="600"
      class="err-modal">
      <div class="err-info">
        <Icon type="md-close-circle" />
        {{errorInfo}}
      </div>
      <Table border size="small" :columns="errColumns" :data="errData"></Table>
      <div slot="footer">
        <Button type="primary" @click="downLoadExcel">下载错误说明</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
let timer = null;
import { getToken } from "@/libs/util.js";
import { exportFile } from '@/libs/tools.js'//post data下载】
import {
  axiosSafeScoreImportBatch
} from "_o/api/driver.js";
import downloadBtn from "_a/download-btn/index.vue"
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
    disabled:{
      default:false
    },
    size:{
      default:'default'
    },
    type:{
      default:'primary'
    },
    sameMessage :{
      type: String,
      default:'请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！' 
    },
    otherMsg :{
      type: String,
      default:'' 
    },
    baseUrlName:{
      default:'_baseUrl'
    },
    successMsg:{
      type: String,
      default:'' 
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
      // 是否上传文件
      isUpload: false,
      // 是否显示请上传文件错误提示
      showUnUpload: false,
      // 全部错误或者部分错误弹窗
      showErrorInfo: false,
      // 失败提示信息
      errorInfo: '',
      errorModalTitle: '校验失败',
      errColumns: [
        {
          title: '校验总数',
          key: 'total'
        },
        {
          title: '成功数',
          key: 'successNumber'
        },
        {
          title: '失败数',
          key: 'failNumber'
        },
      ],
      // 部分错误数据
      errData: [],
      // 下载错误数据url
      failUrl: '/api/securityPoint/import/downFailMsg',
      validInfo: {},
      submitLoading: false
    };
  },
  components:{
    downloadBtn
  },
  computed: {
    toDownTemplateUrl_() {
      return this[this.baseUrlName] + this.toDownTemplateUrl;
    }
  },
  methods: {
    importFile() {
      if(this.disabled){
        return false
      }
      this.upPercent = 0;
      this.isShowUpBar = false;
      this.importMessage = this.sameMessage;
      this.isShowUpModal = true;
      this.isUpload = false
      this.showUnUpload = false
      this.submitLoading = false
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
      this.isUpload = true
      if (res.success) {
        let data = res.data||{}
        this.validInfo = data
        this.error = false;
        if(data.status === 0){
          // 全部校验成功
          this.$Message.success('导入成功')
        }else{
          // 部分或全部校验失败
          if(data.status===1){
            this.errorInfo = '所有数据全部校验失败（失败信息默认不导入）。'
            this.errorModalTitle = '校验失败'
          }else{
            this.errorInfo = '部分数据校验失败（失败信息默认不导入）。'
            this.errorModalTitle = '校验错误'
          }
          this.errData = [data]
          this.showErrorInfo = true
        }
      } else {
        let errormsg = res.msg || "服务器错误!";
        this.error = true;
        this.importMessage = errormsg;
        this.isShowUpBar = false;
      }
      // 用于取消定时器
      this.upPercent = 100;
    },
    importFiled(res, file, fileList) {
      this.isUpload = true
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
      }
    },
    statusChange(flag) {
      if(!flag){
        this.isShowUpModal = false
      }else{
        this.validInfo = {}
        this.errData = []
      }
    },
    formatError(file, fileList) {
      this.$Message.warning("文件格式不正确");
      this.isShowUpBar = false;
    },
    // 点击确定
    handleOk(){
      // 如果未上传，提示上传
      if(!this.isUpload){
        this.showUnUpload = true
      }else{
        // 已上传，如果全部错误，报错。
        if(this.validInfo.status === 1){
          this.$Message.error('导入失败')
          this.statusChange(false)
        }else{
          this.submitLoading = true
          axiosSafeScoreImportBatch({successMsg: this.validInfo.successMsg}).then(res => {            
            this.$Message.success('导入成功')
            this.$emit('refresh')
            this.statusChange(false)
          })
        }
        // 已上传，如果部分错误或者成功，调用保存接口
      }
    },
    // 点击下载错误信息
    downLoadExcel(){
      // 接口请求下载
      exportFile({ failMsg: this.validInfo.failMsg }, this.failUrl,  '错误说明','post','.xlsx')
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
.err-empty{
  padding: 8px 0 2px 220px;
  color: #ed4014;
  font-size: 13px;
  height:16px;
  line-height: 1;
}
.err-info{
  font-size: 14px;
  height:50px;
  line-height: 1;
  .ivu-icon{
    color:#ed4014;
    font-size: 30px;
    margin-right: 5px;
  }
}
.err-modal .ivu-modal-body{
  padding-bottom:40px;
}
</style>
