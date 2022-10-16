<template>
  <div>
    <Modal
      v-model="visible"
      :width="700"
      :mask-closable="false"
      :title="modalTitle"
      :closable="false"
    >
      <!-- <p slot="header" style="color: #666; text-align: center">
        <span>{{ modalTitle }}</span>
      </p> -->
      <div style="text-align: center">
        <div>
          <Form
            ref="_form"
            :model="addForm"
            :label-width="100"
            :rules="validateRules"
          >
            <FormItem
              label="结算月份："
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
          </Form>
        </div>
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
                <ExportFile
                  exportUrl="/download/结算账单补发补扣模板.xlsx"
                  exportFileName="结算账单补发补扣模板.xlsx"
                  :queryData="{}"
                  btnText="下载模板"
                  ajaxMethod="get"
                ></ExportFile>
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
          <div v-if="isImported">
            <Divider />
            <import-result :pData="importResultData"></import-result>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="addSubmit"> 保存 </Button>
        <Button style="margin-left: 8px" @click="(e) => close()"> 取消 </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ExportFile from "_a/export-file/exportFile";
import downloadBtn from "_a/download-btn/index.vue";
import { getToken } from "@/libs/util.js";
import fUpload from "../upload.vue";
import { deductBatchImportService } from "_o/api/settle";
import { tool } from "_o/api/baseMixin.js";
import ImportResult from "./importResult";

export default {
  components: {
    ExportFile,
    downloadBtn,
    fUpload,
    ImportResult,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tool],
  computed: {
    isImported({ importResultData }) {
      return (
        importResultData?.successList?.length ||
        importResultData?.failList?.length
      );
    },
  },
  data() {
    return {
      importResultData: {}, // 导入的数据
      modalTitle: "导入数据",
      addForm: {
        assessTime: "",
      },
      file: {
        name: "",
        size: "",
        url: "", // 保存的是uuid
      },
      headerParams: {},
      actionUrl: this._uploadUrl + "/file/upload/private", // 公共文件上传服务
      validateRules: {
        assessTime: [{ required: true, message: "请选择月份" }],
      },

      upPercent: 0,

      header: { Authorization: getToken() },
      isShowUpBar: false,
      importMessage:
        "请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！",
      error: false,
    };
  },
  methods: {
    uploadChange(res) {
      this.file.name = res.fileName;
      this.file.url = res.uuid;
      this.file.size = res.fileSize + "KB";
    },
    fileRemove() {
      this.file.name = "";
      this.file.size = "";
      this.file.url = "";
    },
    dateChange(v, a) {
      if (!v) return;
      const [year, month] = v.split("-");
      this.addForm.assessTime = `${year}${month}`;
    },
    addSubmit() {
      this.$refs["_form"].validate(async (valid) => {
        if (!valid) return;
        if (!this.file.url) {
          this.$Message.warning("请上传附件");
          return;
        }
        let p = {
          assessTime: this.addForm.assessTime,
          fileUuid: this.file.url,
          fileName: this.file.name,
        };
        const [err, data] = await this.toResult(deductBatchImportService(p));
        console.log(err, data);
        if (data) {
          this.importResultData = {
            failList: data?.failureDtoList || [],
            successList: data?.successDtoList || [],
          };
          this.file.url = "";
        }
      });
    },
    close(b) {
      this.$emit("close", b);
    },
    beforeUpHandle(res, file) {
      this.upPercent = 0;
      this.isShowUpBar = true;
    },
    importSuccess(res, file, fileList) {
      console.log(res, "res");
      if (res.success) {
        // 导入成功
        let successmsg = res.msg || "导入成功!";
        this.error = false;
        this.importMessage = successmsg;
      } else {
        if (res.data === null) {
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
          }
        } else {
          // 有具体错误行数，优先展示msg，并且可以下载错误信息
          this.isShowUpBar = false;
          this.error = false;
          let ts = (res.data && res.data.failRowTypeMapJsonStr) || "";
          let obj = new Function("return " + ts)();
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
.ivu-upload-list-remove {
  position: absolute;
  right: 16px;
}
.ivu-upload-list-file:hover .ivu-upload-list-remove {
  font-size: 24px;
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
