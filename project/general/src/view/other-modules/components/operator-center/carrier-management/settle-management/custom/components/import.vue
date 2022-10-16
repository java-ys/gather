<template>
  <div>
    <Modal
      v-model="visible"
      :width="900"
      :mask-closable="false"
      :title="modalTitle"
      :closable="false"
    >
      <!-- <p slot="header" style="color: #666; text-align: center">
        <span>{{ modalTitle }}</span>
      </p> -->
      <div>
        <div>
          <Form
            ref="_form"
            :model="addForm"
            :label-width="100"
            :rules="importFormRule"
          >
          <Row>
            <Col span="12">
              <FormItem label="指标名称：" prop="indexUuid">
                <Select
                  v-model="addForm.indexUuid"
                  class="input-width item-width"
                  filterable
                  label-in-value
                >
                  <Option
                    v-for="(item, index) in indicatorList"
                    :value="item.value"
                    :key="index"
                  >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="运营模式：" prop="operateType">
                <Select
                  v-model="addForm.operateType"
                  class="input-width item-width"
                  filterable
                  multiple
                  label-in-value
                >
                  <Option
                    v-for="(item, index) in operateTypeEnum"
                    :value="item.value"
                    :key="index"
                  >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="产品线：" prop="businessType">
                <Select
                  v-model="addForm.businessType"
                  class="input-width item-width"
                  filterable
                  multiple
                  label-in-value
                >
                  <Option
                    v-for="(item, index) in productLineEnum"
                    :value="item.value"
                    :key="index"
                  >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
                <FormItem
                  label="考核月份："
                  prop="assessTime"
                  style="text-align: left"
                >
                  <DatePicker
                    type="month"
                    format="yyyy-MM"
                    style="width: 240px"
                    placeholder="请选择月份"
                    v-model="addForm.assessTime"
                    @on-change="dateChange"
                  >
                  </DatePicker>
                </FormItem>
            </Col>
          </Row>
          </Form>
        </div>
        <Divider />
        <div>
          <!-- <Alert type="warning" :style="{ color: error === true ? 'red' : '' }">
            {{ importMessage }}
          </Alert> -->
          <div class="down-container">
            <!-- <download-btn
              :toUrl="toDownTemplateUrl"
              style="display: inline-block; width: 150px"
            ></download-btn> -->
            <div class="c1">
              <p class="t">1. 下载模板,批量填写信息</p>
              <div class="border-dashed d-b" style="margin-right: 6px">
                <!-- <ExportFile
                  exportUrl="/download/考核得分模板.xlsx"
                  exportFileName="考核得分模板.xlsx"
                  :queryData="{}"
                  btnText="下载模板"
                  ajaxMethod="get"
                ></ExportFile> -->

                <export-file
                  exportUrl="/api/operate/assess/score/exportAgentAssessScoreTemplate"
                  exportFileName="考核得分模板.xlsx"
                  :queryData="{
                    indexUuid: addForm.indexUuid,
                    assessTime: addForm.assessTime,
                    operateTypeList: addForm.operateType,
                    businessTypeList: addForm.businessType,
                  }"
                  btnText="下载模板"
                  messageTips="下载模板"
                  :exportCheckBefore="exportCheckBefore"
                ></export-file>
              </div>
            </div>
            <div class="c2">
              <p class="t t2">2. 上传信息表</p>
              <div class="border-dashed d-b" style="margin-left: 6px">
                <f-upload
                  :headerParams="headerParams"
                  :action="actionUrl"
                  :params="{}"
                  :maxSize="500"
                  :format="['xlsx']"
                  accept=".xlsx"
                  @on-success="uploadChange"
                >
                  <Icon type="ios-cloud-upload-outline" class="up-icon" />
                </f-upload>
              </div>
            </div>
          </div>
          <Progress v-show="isShowUpBar" :percent="upPercent" />

          <ul class="ivu-upload-list export-list" v-if="file.name">
            <li class="ivu-upload-list-file ivu-upload-list-file-finish">
              <div class="file-info">
                <p>
                  {{ file.name }} <span>{{ file.size }}</span>
                </p>
              </div>
              <i
                class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove"
                @click="fileRemove"
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="isImported">
        <Divider />
        <import-result :pData="importResultData"></import-result>
      </div>
      <div slot="footer">
        <Button type="primary" :disabled="!file.url" @click="addSubmit"> 保存 </Button>
        <Button style="margin-left: 8px" @click="(e) => close()">
          {{isImported ? '关闭' : '取消'}}
        </Button>
      </div>
    </Modal>

<!--    <upload-error-->
<!--      v-if="errorVisible"-->
<!--      :visible="errorVisible"-->
<!--      :uploadInfo="uploadInfo"-->
<!--      @close="closeUploadError"-->
<!--    ></upload-error>-->

    <!-- <Modal
      v-model="errorVisible"
      :width="600"
      :mask-closable="false"
      footer-hide
      title="导入数据"
      :closable="false"
    >
      <div class="indetail">
        <p
          v-if="message.failMsg"
          :style="{ color: 'red', 'margin-bottom': '8px' }"
        >
          {{ message.failMsg }}
        </p>
        <p v-if="message.failMsg && message.failNum">
          导入总数{{ message.uploadNum }}, 成功:{{
            message.successNum
          }}条，失败:{{ message.failNum }}条（失败的信息默认不导入）
        </p>
      </div>
    </Modal> -->

    <!-- <p v-if="message.canDownloadFail">错误及重复信息汇总</p> -->
    <!-- <div v-if="message.canDownloadFail" style="text-align: center">
              <ExportFile
                exportUrl="/admin/driverGroupMember/exportFail"
                exportFileName="错误信息.xlsx"
                :queryData="importFailData"
                :btnText="errorText"
              ></ExportFile>
            </div> -->
  </div>
</template>

<script>
/*
批量导入
1.字段说明：
指标名称，必填，单选，仅可选择自定义考核指标；；
考核月份，必填，单选；
运营模式，必填，可多选，可选项为A、UP、带车加盟、巡网出租车；
产品线，必填，可多选，可选项来源于资产平台产品线；
2.导入模板：
字段为：运营商名称、考核得分；
3.上传文件导入目标值时，需要校验运营商是否存在，不存在则导入失败；
   需要校验考核得分，必填，整数，不可为0，支持两位小数；不符合规则则导入失败；
4.可查看导入成功和失败的数据，展示字段：
序号，运营商名称、考核得分；
*/
import ExportFile from "_a/export-file/exportFile";
import downloadBtn from "_a/download-btn/index.vue";
import { getToken } from "@/libs/util.js";
import {operateTypeEnum, productLineEnum} from "@/config";
import fUpload from "./upload.vue";
import { tool } from "_o/api/baseMixin.js";
import uploadError from "./uploadError";
import ImportResult from './importResult'
import {importFormRule} from '../fields';
import { freeze } from "@/mixins/base";
import { importAgentService } from "_o/api/settle/goal";

export default {
  components: {
    ExportFile,
    downloadBtn,
    fUpload,
    uploadError,
    ImportResult
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tool],
  inject: ["getIndicatorList"],
  computed: {
    indicatorList() {
      return this.getIndicatorList()
    },
    isImported({importResultData}) {
      return importResultData?.successList?.length || importResultData?.failList?.length
    },
    exportCheckBefore() {
      return this.addForm.indexUuid !== "" &&
        this.addForm.operateType.length > 0 &&
        this.addForm.businessType.length > 0 &&
        this.addForm.assessTime !== ""
    }
  },
  data() {
    return {
      importResultData: {},
      operateTypeEnum,
      productLineEnum,
      importFormRule: freeze(importFormRule),
      errorVisible: false,
      modalTitle: "导入数据",
      addForm: {
        assessTime: '',
        indexUuid: '',
        businessType: [],
        operateType: []
      },
      targetNameList: [],
      file: {
        name: "",
        size: "",
        url: "", // 保存的是uuid
      },

      uploadInfo: {},

      headerParams: {},
      actionUrl: this._uploadUrl + "/file/upload/private", // 公共文件上传服务

      message: {
        uploadNum: 0,
        successCount: 0,
        failureCount: 0,
        canDownloadFail: false,
        failMsg: "",
      },

      parameter: { billingDate: "2021-05" }, // 导入时附带的uuid参数

      importFailData: {}, // 导入失败结果详情数据
      errorText: "下载错误信息",

      upPercent: 0,

      header: { Authorization: getToken() },
      isShowUpBar: false,
      importMessage:
        "请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！",
      importFileUrl: this._baseUrl + "/api/operate/billing/batchImport", // 导入路径地址
      toDownTemplateUrl: "/download/driver_group_member.xlsx", // 导入下载模板路径

      error: false,
    };
  },
  methods: {
    uploadChange(res) {
      this.file.name = res.fileName;
      this.file.url = res.uuid;
      this.file.size = res.fileSize + "KB";
      this.importResultData.successList = []
      this.importResultData.failList = []
    },
    fileRemove() {
      this.file.name = "";
      this.file.size = "";
      this.file.url = "";
    },
    dateChange(v, a) {
      if (!v) return;
      const [year, month] = v.split("-");
      this.addForm.assessTime = `${year}-${month}`;
    },
    async addSubmit() {
      // this.$refs["_form"].validate(async (valid) => {
      // if (!valid) return;
      if (!this.file.url) {
        this.$Message.warning(`请${this.isImported ? "重新上传" : "上传"}信息表`);
        return;
      }
      let p = {
        fileName: this.file.name,
        fileUuid: this.file.url
      };
      const [err, data] = await this.toResult(importAgentService(p));
      if (err) {
        return;
      }
      if (data) {
        this.importResultData = {
          failList: data?.failureAssessScoreList || [],
          successList: data?.successAssessScoreList || []
        }
        this.file.url = ""
        this.$emit("confirm")
      }
    },
    close(b) {
      this.$emit("close", b);
    },
    beforeUpHandle(res, file) {
      this.upPercent = 0;
      this.isShowUpBar = true;
    },
    importSuccess(res, file, fileList) {
      if (res.success) {
        // 导入成功
        let successmsg = res.msg || "导入成功!";
        this.error = false;
        this.importMessage = successmsg;
        this.message = {
          uploadNum: res.data.doUploadExcelNum || 0,
          successNum: res.data.successCount || 0,
          failNum: res.data.failureCount || 0,
          canDownloadFail: res.data.failureCount > 0,
          failMsg: "",
        };
      } else {
        if (res.data === null) {
          this.message.canDownloadFail = false;
          this.isShowUpBar = false;
          this.upPercent = 0;

          if (res.msg.indexOf("导入内容为空") > -1) {
            this.importMessage = res.msg;
            this.error = true;
          } else if (res.msg.indexOf("系统异常") > -1) {
            this.importMessage = "文件不合法，请下载模板";
            this.error = true;
          } else {
            this.error = false;
            this.message.failMsg =
              res.msg === "导入失败" ? "导入失败：请下载错误信息查看" : res.msg;
          }
        } else {
          // 有具体错误行数，优先展示msg，并且可以下载错误信息
          this.isShowUpBar = false;
          this.error = false;
          let ts = (res.data && res.data.failRowTypeMapJsonStr) || "";
          let obj = new Function("return " + ts)();
          let arr = Object.keys(obj);
          this.importFailData = {
            failRowTypeMapJsonStr: ts,
          };
          this.message = {
            uploadNum: res.data.doUploadExcelNum || 0,
            successNum: res.data.successCount || 0,
            canDownloadFail: arr.length > 0,
            failNum: res.data.failureCount || 0,
            failMsg:
              res.msg === "导入失败" ? "导入失败：请下载错误信息查看" : res.msg,
          };
        }
      }
      // 用于取消定时器
      this.upPercent = 100;
      this.daoru = false;
    },
    importFailed(res, file, fileList) {
      if (!res.success) {
        // 用于取消定时器
        this.upPercent = 100;
        this.isShowUpBar = false;
        let errormsg = res.msg || "服务器错误!";
        this.error = true;
        this.$Notice.error({
          desc: errormsg,
          duration: 10,
        });
      }
    },
    formatError(file, fileList) {
      this.$Message.warning("文件格式不正确");
      this.isShowUpBar = false;
    },
    closeUploadError() {
      this.errorVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
/deep/ .ivu-form-item-content {
  margin-right: 100px;
}
.indetail {
  p {
    margin: 15px 0;
  }
}
.down-container {
  display: flex;
  align-items: center;
  flex-direction: row;
  text-align: center;
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
  .c1,
  .c2 {
    flex: 1;
  }
  .t {
    text-align: left;
  }
  .t2 {
    margin: 0 10px;
  }
  .d-b {
    height: 110px;
    line-height: 110px;
  }
}
.buttons {
  margin-top: 15px;
}
.border-dashed {
  border: 1px dashed #dcdee2;
  border-radius: 4px;
}

.export-list .ivu-upload-list-file {
  display: flex;
  align-items: center;
  padding: 0 0 0 25px;
  height: 80px;
  background: rgba(243, 243, 247, 0.5);
}

.ivu-upload-list-file:hover .ivu-upload-list-remove {
  position: absolute;
  right: 16px;
}

.file-info {
  p {
    font-size: 14px;
    color: #000000;
  }
  span {
    margin-left: 10px;
    color: #666;
  }
}

.export-list .file-inco {
  width: 35px;
  height: 35px;
  margin-right: 8px;
}

.up-icon {
  font-size: 60px;
  // border: 1px dashed #e3e3e3;
  cursor: pointer;
  padding: 5px;
  color: #c3c3c3;
  text-align: center;
}
</style>
