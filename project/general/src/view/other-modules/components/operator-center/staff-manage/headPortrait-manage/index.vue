<!--
  群组管理
  backEnd: 华付-李志桐
-->
<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></SearchList>
    <Button
      v-hasAuth="'headPortrait-manage-newly'"
      type="primary"
      style="margin-right: 50px;"
      @click="openNew"
    >
      新增群组
    </Button>
    <VTable
      :total="total"
      :current="currPage"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      class="top15"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <Modal
      v-model="isModal"
      :width="600"
      :mask-closable="false"
      footer-hide
    >
      <p
        slot="header"
        style="color:#666;text-align:center"
      >
        <span>{{ modalTitle }}</span>
      </p>
      <div style="text-align:center">
        <Form
          v-if="daoru"
          ref="payQSData"
          class="pay-editor"
          :model="payQSData"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem
            label="群组名称："
            prop="question"
          >
            <Input
              v-model="payQSData.question"
              :maxlength="30"
              placeholder="请输入"
            ></Input>
          </FormItem>
          <FormItem
            label="群组头像："
            prop="headPortrait"
          >
            <img-upload
              :defaultImg="payQSData.headPortrait"
              :action="actionUrl"
              :params="{imgType:1}"
              :maxSize="500"
              accept="image/png, image/jpeg"
              :format="['jpg','png']"
              @on-change="getImgUrl"
            ></img-upload>
          </FormItem>
          <FormItem class="right-flex">
            <Button
              type="primary"
              @click="addSubmit('payQSData')"
            >
              保存
            </Button>
            <Button
              style="margin-left: 8px"
              @click="isModal = false"
            >
              取消
            </Button>
          </FormItem>
        </Form>
        <div v-if="importTables">
          <Alert
            type="warning"
            :style="{color: error === true ? 'red' : ''}"
          >
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
              :data="parameter"
              type="drag"
              :action="importFileUrl_"
              class="file-box"
              :headers="header"
              :before-upload="beforeUpHandle"
              :show-upload-list="false"
              :on-success="importSuccess"
              :on-error="importFiled"
              :format="['xlsx']"
              accept=".xlsx"
              :on-format-error="formatError"
            >
              <div style="padding: 20px 0">
                <Icon
                  type="ios-cloud-upload"
                  size="52"
                  style="color: #3399ff"
                ></Icon>
                <p>点击(拖拽)上传文件</p>
              </div>
              <Progress
                v-show="isShowUpBar"
                :percent="upPercent"
              />
            </Upload>
          </div>
          <div class="buttons">
            <Button
              type="primary"
              @click="addSubmit"
            >
              保存
            </Button>
            <Button
              style="margin-left: 8px"
              @click="isModal = false"
            >
              取消
            </Button>
          </div>
        </div>
        <div
          v-if="tables"
          class="indetail"
        >
          <p
            v-if="message.failMsg"
            :style="{color: 'red', 'margin-bottom': '8px'}"
          >
            {{ message.failMsg }}
          </p>
          <p>
            导入总数{{ message.uploadNum }}, 成功:{{ message.successNum }}条，失败:{{ message.failNum }}条（失败的信息默认不导入）
          </p>
          <p v-if="message.canDownloadFail">
            错误及重复信息汇总
          </p>
          <div
            v-if="message.canDownloadFail"
            style="text-align:center"
          >
            <ExportFile
              exportUrl="/admin/driverGroupMember/exportFail"
              exportFileName="错误信息.xlsx"
              :queryData="importFailData"
              :btnText="deriveText"
            ></ExportFile>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getToken } from "@/libs/util.js";
import { returnFields, inputList } from "./fields.js";
import VTable from "_a/v-table/v-table";
import imgUpload from "_a/img-upload/index.vue";
import ExportFile from "_a/export-file/exportFile";
import {
  headPortraitIncrease,
  headPortraitList,
  headPortraitCompile,
  headPortraitStartUsing,
  headPortraitDisuse,

} from "_o/api/driver.js";
import downloadBtn from "_a/download-btn/index.vue"
// import { columns } from "../../carrier-management/carrier/operation/basic/basic-info";

export default {
  components: {
    VTable,
    imgUpload,
    ExportFile,
    downloadBtn
  },
  data() {
    const name = (rule, value, callback) => {
      // 特殊字符验证
      let nameValue = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
      if (value === "") {
        callback(new Error("请输入群名"));
      }
      else if (nameValue.test(value)) {
        callback(new Error("群组名不能为特殊字符"));
      }
      else {
        callback();
      }
    };
    return {
      deriveText: "下载错误信息",
      modalTitle: "新增群组",
      isModal: false, // 弹出框
      inputList,
      returnFields,
      queryAjaxPramas: {},
      total: 0, // 分页数据总数
      currPage: 1, // 页数
      pageSize: 10, // 条数
      editorModal: false, // 是否为编辑，否则为新建
      parColumns: [], // 表格的配置
      daoru: false, // 新增编辑判断隐藏显示
      importTables: false, // 导入
      tables: false, // 导入结果详情
      importFailData: {}, // 导入失败结果详情数据
      parameter: "", // 导入时附带的uuid参数
      payQSData: {
        // 新增或编辑数据
        question: "",
        headPortrait: "",
        uuid: ""
      },
      message: {
        uploadNum: 0,
        successNum: 0,
        failNum: 0,
        canDownloadFail: false,
        failMsg: ""
      },
      actionUrl: this._baseUrl4CommonWeb + "/common/uploadImg", // 图片上传地址
      ruleValidate: {
        question: [
          {
            validator: name,
            required: true,
            trigger: "blur"
          },
          {
            min: 1,
            max: 10,
            message: "输入不能超过10个汉字",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      upPercent: 0,
      header: { Authorization: getToken() },
      isShowUpBar: false,
      sameMessage: "请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！",
      importMessage: "请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！",
      importFileUrl_: this._baseUrl + "/admin/driverGroupMember/importExcel", // 导入路径地址
      toDownTemplateUrl: "/download/driver_group_member.xlsx", // 导入下载模板路径
      error: false
    };
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
    this.getList();
  },
  methods: {

    getList() {
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      headPortraitList(obj).then(res => {
        this.total = res.data.data.totalCount;
        this.pageSize = res.data.data.pageSize;
        this.tableData = res.data.data.list;
      });
    },
    /** 启用 */
    startUsing(id) {
      headPortraitStartUsing(id).then(res => {
        this.$Message.success(res.data.msg);
        this.getList();
      });
    },
    /** 停用 */
    outOfService(id) {
      headPortraitDisuse(id).then(res => {
        this.getList();
      });
    },
    // TODO /common/uploadImg改造
    getImgUrl(url) {
      this.payQSData.headPortrait = url;
    },
    /** 新增群组弹出框触发 */
    openNew() {
      this.modalTitle = "新增群组";
      this.payQSData = {
        question: "",
        headPortrait: ""
      };
      this.daoru = true;
      this.isModal = true;
      this.editorModal = false;
      this.importTables = false;
      this.tables = false;
    },
    queryData(data) {
      this.currPage = 1;
      this.queryAjaxPramas = data;
      this.getList();
    },
    clearQueryData() {
      this.queryAjaxPramas = {};
      this.currPage = 1;
      this.getList();
    },
    changePage: function (val) {
      this.currPage = val;
      this.getList();
    },
    changePageSize: function (val) {
      this.pageSize = val;
      this.getList();
    },
    /** 弹出框 */
    addSubmit(name) {
      if (this.upPercent === 0) {
        this.isModal = true;
      }
      if (this.importTables) {
        // 导入
        if (this.upPercent === 0) {
          this.isModal = true;
          this.importMessage = "请上传文件"
        } else {
          this.daoru = false;
          this.importTables = false;
          this.tables = true;
          this.modalTitle = "导入结果详情";
        }
      } else {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.editorModal) {
              // 编辑
              let obj = {
                uuid: this.payQSData.uuid,
                name: this.payQSData.question,
                headPortrait: this.payQSData.headPortrait
              };
              headPortraitCompile(obj).then(res => {
                this.$Message.success(res.data.msg);
                this.isModal = false;
                this.getList();
              });
            } else if (this.daoru) {
              // 新增
              if (this.payQSData.headPortrait === "") {
                this.$Message.error("请插入群头像");
              } else {
                let params = {
                  name: this.payQSData.question,
                  headPortrait: this.payQSData.headPortrait,
                  recordStatus: 3
                };
                headPortraitIncrease(params).then(res => {
                  this.$Message.success(res.data.msg);
                  this.isModal = false;
                  this.getList();
                });
              }
            }
          } else {
            this.$Message.error("群名不能为空");
          }
        });
      }
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
          successNum: res.data.successNum || 0,
          failNum: res.data.failNum || 0,
          canDownloadFail: res.data.failNum > 0,
          failMsg: ""
        }
      } else {
        if (res.data === null && res.msg.indexOf("导入内容为空") > -1) {
          this.importMessage = res.msg
          this.upPercent = 0;
          this.isShowUpBar = false;
          this.message.canDownloadFail = false
          this.importTables = true
          this.editorModal = false;
          this.tables = false;
          this.error = true
          return false
        }
        if (res.data === null && res.msg.indexOf("系统异常") > -1) {
          this.importMessage = "文件不合法，请下载模板"
          this.upPercent = 0;
          this.isShowUpBar = false;
          this.message.canDownloadFail = false
          this.importTables = true
          this.editorModal = false;
          this.tables = false;
          this.error = true
          return false
        }
        // 没有具体错误行数，不能展示下载错误信息按钮
        if (res.data === null) {
          this.upPercent = 0;
          this.isShowUpBar = false;
          this.message.canDownloadFail = false
          this.importTables = false
          this.editorModal = false;
          this.error = false
          this.tables = true;
          this.message.failMsg = res.msg === "导入失败" ? "导入失败：请下载错误信息查看" : res.msg
          return false
        } else {
          // 有具体错误行数，优先展示msg，并且可以下载错误信息
          this.isShowUpBar = false;
          this.editorModal = false;
          this.importTables = false
          this.tables = true;
          this.error = false
          let ts = (res.data && res.data.failRowTypeMapJsonStr) || ""
          let obj = (new Function("return " + ts))();
          let arr = Object.keys(obj);
          this.importFailData = {
            "failRowTypeMapJsonStr": ts
          }
          this.message = {
            uploadNum: res.data.doUploadExcelNum || 0,
            successNum: res.data.successNum || 0,
            canDownloadFail: arr.length > 0,
            failNum: res.data.failNum || 0,
            failMsg: res.msg === "导入失败" ? "导入失败：请下载错误信息查看" : res.msg
          }
          return false
        }
      }
      // 用于取消定时器
      this.upPercent = 100;
      this.daoru = false;
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
      }
    },
    formatError(file, fileList) {
      this.$Message.warning("文件格式不正确");
      this.isShowUpBar = false;
    }
  }
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
    margin-bottom: 15px;
  }
}
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
.buttons {
  margin-top: 15px;
}
</style>
