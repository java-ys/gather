<template>
  <div>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="batchInsertVisible" width="50%" style="font-weight: bold" @close="closeDialog">
      <el-row>
        <el-col :span="24">
          <p>导入数据示例模板（导入得数据超过20000条得，系统只会对前20000条进行验证及录入处理，超过得部分将跳过所有处理环节）</p>
        <!-- <img :src="'@/assets/driverSalary/'+ buttonType +'.jpg'" alt width="100%" height="100%"> -->
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <span style="font-size: 13px; color: gray;margin:10px 0 0 24%">1.请下载导入模板，并按模板示例填写</span>
          <a :href="templateHref">
            <el-button type="primary" size="small" :disabled="downloadBtn" style="width: 50%; margin-top: 30px; margin:20% 0 0 25%">下载模板
            </el-button>
          </a>
        </el-col>
        <el-col :span="12">
          <span style="font-size: 13px; color: gray;margin:10px 0 0 25%">2.上传填写好的内容列表</span>
          <div style="margin: 15px 20px 0 0" @click="handlePreUpload">
            <upload type="excel" :action="action" :params="uploadParams" :buttonText="'点击(拖拽)上传excel文件'" :draggable="true" :disabled="showUpload" :interface="interface" :showFileList="false" :flag="true" @handleUploadSuccess="handleUploadSuccess" />
          </div>
        </el-col>
      </el-row>
      <div v-if="resultVisible">

        <el-tabs v-model="activeName" type="card">
          <!-- 成功展示 -->
          <el-tab-pane label="成功" name="success">
            <p class="detail-text">共{{successCount}}条数据上传成功</p>
            <m2-el-table v-loading="loading" element-loading-text="上传中" :tableData="successData" :columns="columns" :pageObj="successPageObj" :options="options" height="450" @on-pagesize-change="pageSizeChange" @on-sort-change="sortChange" @pagesizeChange="sizeChange">
              <el-table-column slot="salaryAuditFlag" label="是否核算" min-width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.salaryAuditFlag | formatStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column slot="salaryStatus" label="发放结果" min-width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.salaryStatus | salaryStatusFormat}}</span>
                </template>
              </el-table-column>
            </m2-el-table>
            <div class="upload-buttons">
              <el-button v-preventReClick="3000" :type="btnType" :disabled="importBtn" size="small" @click="handleImport">确认导入</el-button>
              <el-button v-preventReClick="3000" type="info" size="small" @click="closeDialog">取消</el-button>
            </div>
          </el-tab-pane>
          <!-- 失败展示 -->
          <el-tab-pane label="失败" name="failure">
            <p class="detail-text">共{{failedCount}}条数据上传失败</p>
            <m2-el-table v-loading="loading" element-loading-text="上传中" :tableData="failedData" :columns="columns" :pageObj="failedPageObj" :options="options" height="450" @on-pagesize-change="pageSizeChange" @on-sort-change="sortChange" @pagesizeChange="sizeChange">
              <el-table-column slot="remarks" label="失败原因" min-width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.remarks}}</span>
                </template>
              </el-table-column>
            </m2-el-table>
            <div class="upload-buttons">
              <el-button v-preventReClick="3000" :type="btnType" :disabled="importDriverBtn" size="small" @click="handleDriverImport">添加司机至薪酬列表</el-button>
              <el-button v-preventReClick="3000" type="primary" :disabled="downloadBtn" size="small" @click="exportFailedData">下载失败数据</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 添加至薪酬列表 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="添加司机至薪酬列表" :visible="showDriverModal" width="50%" style="font-weight: bold" @close="closeDriver">
      <m2-el-table v-loading="loading" :tableData="driverSalaryData" :columns="columns" :pageObj="driverSalaryPageObj" :options="options" height="450" @on-pagesize-change="driverpageSizeChange" @on-sort-change="sortChange" @pagesizeChange="driverSizeChange">
        <el-table-column slot="action" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button v-preventReClick="3000" type="text" size="mini" @click="deleteDriverInfo(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </m2-el-table>
      <span slot="footer" style="display: flex;justify-content:center">
        <el-button @click="closeDriver">取 消</el-button>
        <el-button type="primary" @click="confirmDriverImport">确认导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from "_o/components/operator-center/salary-modules/common/upload";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import { handleUploadConfirm, delNotExists, confirmNotExists } from "_o/api/salary/salaryRule";
import {
  modeApreTaxColumns,
  modeAafterTaxColumns,
  modeAperTaxColumns,
  modeAAccountTaxColumns,
  modeUPperTaxColumns,
  monthPerTaxColumns
} from "./fields";
import {
  toResult,
  deepClone,
  falsy,
  isEmptyFieldExist
} from "_o/common/salaryMixin";
import { excelDownload } from "_o/common/common";
import {
  deleteEmptyProps
} from "_o/common/common";
import { UploadCacheData, downloadErrorMessage } from "_o/api/salary/common";
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
let queryDataInterval = null;
export default {
  components: { upload, m3elTable },
  filters: {
    formatStatus(val) {
      switch (val) {
        case "1":
          return "是";
          break;
        case "2":
          return "否";
          break;
      }
    },
    salaryStatusFormat(val) {
      switch (val) {
        case "0":
          return "初始";
          break;
        case "1":
          return "已发放";
          break;
        case "2":
          return "未发放";
          break;
      }
    }
  },
  props: {
    title: { type: String, required: true, default: "" },
    accountingType: { type: Number, required: false, default: null },
    importParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    upLoadType: { type: Number },
    batchInsertVisible: { type: Boolean },
    importAction: { type: String, default: "" },
    interface: { type: Function },
    templateHref: { type: String, default: "" }, // 模板地址
  },
  data() {
    return {
      modeApreTaxColumns,
      modeAafterTaxColumns,
      modeAperTaxColumns,
      modeAAccountTaxColumns,
      modeUPperTaxColumns,
      monthPerTaxColumns,
      action: apiUrl + "/salary-web-api" + this.importAction,
      successData: [],
      failedData: [],
      driverSalaryData: [],  // 添加至薪酬列表数据
      loading: false,
      activeName: "success",
      columns: [],
      successPageObj: {
        size: 10,
        total: 0,
        currentPage: 1
      },
      failedPageObj: {
        size: 10,
        total: 0,
        currentPage: 1
      },
      driverSalaryPageObj: {
        size: 10,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false,
        sequence: true
      },
      taxParams: {
        batchNo: "",
        timeSchemaId: "",
        taxType: "",
        currPage: 1,
        pageSize: 10
      },
      activeName: "success",
      successCount: 0,
      failedCount: 0,
      driverSalaryCount: 0,
      downloadBtn: false,
      resultVisible: false,
      btnType: "primary",
      uploadParmars: {},
      importBtn: false,
      importDriverBtn: false,
      showDriverModal: false
    }
  },
  computed: {
    uploadParams() {
      return this.importParams;
    },
    showUpload() {

    }
  },
  created() {
    this.setColumns();
  },
  methods: {
    deleteDriverInfo(row) {
      this.$confirm(
        "确定将该司机从添加列表中移除吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          delNotExists({ batchNo: this.uploadParmars.bathNo, driverNo: row.driverCode }).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.getResultData();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    handleImport() {
      handleUploadConfirm({ batchNo: this.uploadParmars.bathNo, businessType: this.importParams.importType, salaryType: this.importParams.salaryType }).then(res => {
        if (res.data.success) {
          this.$alert("导入成功,请稍后刷新列表数据查看导入结果");
        } else {
          this.$alert(res.data.msg);
        }
      });
      this.$emit("handleSuccessImport");
    },
    // 添加至薪酬列表
    handleDriverImport() {
      this.showDriverModal = true;
    },
    confirmDriverImport() {
      let params = {};
      if (this.importParams.firstDayOfWeek) {
        params = { batchNo: this.uploadParmars.bathNo, accountingType: this.accountingType, cityCode: this.importParams.cityCode, firstDayOfWeek: this.importParams.firstDayOfWeek, businessType: this.importParams.importType, operationType: this.importParams.operationType, salaryType: this.importParams.salaryType };
      } else {
        params = { batchNo: this.uploadParmars.bathNo, cityCode: this.importParams.cityCode, salaryIndex: this.importParams.salaryIndex, salaryYear: this.importParams.salaryYear, businessType: this.importParams.importType, operationType: this.importParams.operationType, salaryType: this.importParams.salaryType };
      }
      confirmNotExists(deleteEmptyProps(params)).then(res => {
        if (res.data.success) {
          this.showDriverModal = false;
          this.importDriverBtn = true;
          this.$message.success(res.data.msg);
          this.getResultData();
          this.$emit("closeDialogHandle", "confirmDriverImport");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    setColumns() {
      switch (this.upLoadType) {
        case 1:
          this.columns = deepClone(this.modeApreTaxColumns);
          break;
        case 2:
          this.columns = deepClone(this.modeAafterTaxColumns);
          break;
        case 3:
          this.columns = deepClone(this.modeAperTaxColumns);
          break;
        case 4:
          this.columns = deepClone(this.modeAAccountTaxColumns);
          break;
        case 5:
          this.columns = deepClone(this.modeUPperTaxColumns);
          break;
      }
    },
    handlePreUpload() {

    },
    exportFailedData() {
      downloadErrorMessage({ batchNo: this.uploadParmars.bathNo, currPage: 1, pageSize: 20 }).then(res => {
        excelDownload(res.data, "上传失败数据");
      });
    },
    sizeChange(v) {
      let flag = this.activeName === "success" ? true : false;
      flag ? (this.successPageObj.size = v) : (this.failedPageObj.size = v);
      this.taxParams.currPage = 1;
      this.getResultData();
    },
    driverSizeChange(v) {
      this.driverSalaryPageObj.size = v;
      this.getResultData();
    },
    sortChange(v) {

    },
    pageSizeChange(v) {
      let flag = this.activeName === "success" ? true : false;
      this.taxParams.currPage = v;
      flag
        ? (this.successPageObj.currentPage = v)
        : (this.failedPageObj.currentPage = v);
      this.getResultData();
    },
    // 添加至薪酬列表
    driverpageSizeChange(v) {
      this.driverSalaryPageObj.currentPage = v;
      this.getResultData();
    },
    // 上传结束后放开按钮操作
    handleFreeBtn() {
      if (this.successData.length) {
        this.btnType = "primary";
        this.importBtn = false;
      }
      this.downloadBtn = false;
      this.uploadDisable = false;
      this.importDriverBtn = false;
    },
    // 清除定时器
    clearQueryInterval() {
      queryDataInterval && clearInterval(queryDataInterval);
      queryDataInterval = null;
    },
    handleUploadSuccess(json) {
      if (json.response.success && json.response.data) {
        let data = json.response.data;
        this.resultVisible = true;
        this.loading = true;
        this.successPageObj.size = 10;
        this.failedPageObj.size = 10;
        this.successPageObj.currentPage = 1;
        this.failedPageObj.currentPage = 1;
        this.successCount = 0;
        this.failedCount = 0;
        this.handleLimitBtn();
        this.taxParams.currPage = 1;
        this.taxParams.pageSize = 10;
        this.taxParams.taxType = this.importParams.salaryType;
        this.taxParams.batchNo = data.bathNo;
        this.taxParams.timeSchemaId = data.timeSchemaId;
        queryDataInterval = setInterval(() => {
          this.getResultData(json.response.data);
          this.uploadParmars = json.response.data;
        }, 5000);
      } else {
        this.$alert(json.response.msg);
      }
    },
    handleLimitBtn() {
      this.btnType = "info";
      this.downloadBtn = true;
      this.importBtn = true;
      this.uploadDisable = true;
      this.importDriverBtn = true;
    },
    async getResultData() {
      const [err, upLoadData] = await toResult(UploadCacheData({ ...this.taxParams }));
      // if (upLoadData.status == 1) {
      this.loading = false;
      this.successData = upLoadData.pageResultSuccessList.list;
      this.failedData = upLoadData.pageResultFailureList.list;
      this.successCount = upLoadData.pageResultSuccessList.totalCount;
      this.successPageObj.total = upLoadData.pageResultSuccessList.totalCount;
      this.failedCount = upLoadData.pageResultFailureList.totalCount;
      this.failedPageObj.total = upLoadData.pageResultFailureList.totalCount;
      this.driverSalaryData = upLoadData.pageResultNotExistsDriverList.list;
      this.driverSalaryCount = upLoadData.pageResultNotExistsDriverList.totalCount;
      this.driverSalaryPageObj.total = upLoadData.pageResultNotExistsDriverList.totalCount;
      this.handleFreeBtn();
      this.clearQueryInterval();
      // }
    },
    closeDriver() {
      this.showDriverModal = false;
    },
    closeDialog() {
      if (this.successData.length || this.loading) {
        this.$confirm(
          "存在上传完成的数据未导入，离开后数据将清除，确认关闭窗口吗？",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$emit("closeDialogHandle", "batchAdd");
          })
          .catch(() => {});
      } else {
        this.$emit("closeDialogHandle", "batchAdd");
      }
    },
  }
};
</script>

<style scoped>
.upload-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
