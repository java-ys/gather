<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-07-14 11:33:00
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-27 16:25:15
-->
<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="batchInsertVisible" width="50%" style="font-weight: bold" @close="closeDialog">
    <el-form v-if="type == 'week' || type == 'month'" ref="queryForm" inline :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
      <el-row>
        <el-form-item v-if="importantType == 1" label="奖励/扣款" label-width="100px">
          <el-select v-model="querytype" placeholder="请选择" style="width: 200px">
            <el-option label="奖励" value="0"></el-option>
            <el-option label="扣款" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 'week' && importantType == 1" label="类目" label-width="100px">
          <el-select v-model="queryForm.code" placeholder="请选择" style="width: 200px">
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-service-week')" label="司机服务奖励" value="11"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-marketing-week')" label="营销（税前）" value="12"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-driver-week')" label="推荐司机" value="13"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-passenger-week')" label="推荐乘客" value="14"></el-option>
            <!-- <el-option label="城市补发" value="15" v-if="querytype == '0' && hasPermission('offlineRewards-reissue-week')"></el-option> -->
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-care-week')" label="司机关怀" value="16"></el-option>
            <el-option v-if="querytype == '1' && hasPermission('offlineRewards-violation-week')" label="司机服务违规扣款" value="41"></el-option>
            <el-option v-if="querytype == '1' && hasPermission('offlineRewards-risk-week')" label="风控（税前）" value="42"></el-option>
            <el-option v-if="querytype == '1' && hasPermission('offlineRewards-deduction-week')" label="城市扣减" value="44"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-discussion-week')" label="司机座谈会补贴" value="8"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-offline-week')" label="线下活动奖励" value="18"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-rent-week')" label="租金返还补贴" value="19"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-aToUp-week')" label="A转UP补贴" value="7"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-other-week')" label="其他" value="9"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 'week'" label="奖励周" label-width="100px">
          <el-date-picker v-model="week" type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="pickerOptions" style="width: 200px">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="type == 'month'" label="类目" label-width="100px">
          <el-select v-model="queryForm.code" placeholder="请选择" style="width: 200px">
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-service-month')" label="司机服务奖励" value="21"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-driver-month')" label="推荐司机" value="23"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-passenger-month')" label="推荐乘客" value="24"></el-option>
            <el-option v-if="querytype == '0' && hasPermission('offlineRewards-reissue-month')" label="城市补发" value="25"></el-option>
            <el-option v-if="querytype == '1' && hasPermission('offlineRewards-violation-month')" label="司机服务违规扣款" value="31"></el-option>
            <el-option v-if="querytype == '1' && hasPermission('offlineRewards-risk-month')" label="风控（税前）" value="32"></el-option>
            <el-option v-if="querytype == '1' && hasPermission('offlineRewards-deduction-month')" label="城市扣减" value="33"></el-option>
            <!-- <el-option label="司机座谈会补贴" value="8" v-if="querytype == '0' && hasPermission('offlineRewards-discussion-month')"></el-option>
            <el-option label="线下活动奖励" value="18" v-if="querytype == '0' && hasPermission('offlineRewards-offline-month')"></el-option>
            <el-option label="租金返还补贴" value="19" v-if="querytype == '0' && hasPermission('offlineRewards-rent-month')"></el-option>
            <el-option label="A转UP补贴" value="7" v-if="querytype == '0' && hasPermission('offlineRewards-aToUp-month')"></el-option>
            <el-option label="其他" value="9" v-if="querytype == '0' && hasPermission('offlineRewards-other-month')"></el-option>             -->
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 'month'" label="薪酬月份" label-width="100px">
          <el-date-picker v-model="month" type="month" placeholder="选择月" style="width: 200px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="城市" label-width="100px">
          <el-select v-model="queryForm.cityCode" placeholder="城市" style="width: 200px" filterable>
            <template v-for="(cityObj, index) in cities">
              <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <hr class="tophr" />
    <el-row v-if="importantType == 2">
      <el-col :span="24">
        <p>导入数据示例模板（导入得数据超过10000条得，系统只会对前10000条进行验证及录入处理，超过得部分将条过所有处理环节）</p>
        <img src="_o/assets/rent.jpg" alt width="100%" height="100%">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <span style="font-size: 13px; color: gray;margin:10px 0 0 20%">1.请下载导入模板，并按模板示例填写</span>
        <a :href="templateHref">
          <el-button type="primary" size="small" :disabled="downloadBtn" style="width: 50%; margin-top: 30px; margin:20% 0 0 25%">下载模板
          </el-button>
        </a>
      </el-col>
      <el-col :span="12">
        <span style="font-size: 13px; color: gray;margin:10px 0 0 25%">2.上传填写好的内容列表</span>
        <!-- <div style="margin: 15px 20px 0 0" @click="handlePreUpload" v-if="false">
          <upload type="excel" @handleUploadSuccess="handleUploadSuccess" :action="action" :params="uploadParams" :buttonText="'点击(拖拽)上传excel文件'" :draggable="true" :disabled="true" :showFileList="false" :flag="true" />
        </div> -->
        <div style="margin: 15px 20px 0 0" @click="handlePreUpload">
          <upload type="excel" :action="action" :params="uploadParams" :buttonText="'点击(拖拽)上传excel文件'" :draggable="true" :disabled="showUpload" :interface="interface" :showFileList="false" :flag="true" @handleUploadSuccess="handleUploadSuccess" />
        </div>
      </el-col>
    </el-row>
    <div v-if="resultVisible">
      <hr class="tophr" />
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="成功" name="success">
          <p class="detail-text">共{{successCount}}条数据上传成功</p>
          <m2-el-table v-loading="loading" element-loading-text="上传中" :tableData="successData" :columns="columns" :pageObj="successPageObj" :options="options" height="450" @on-pagesize-change="pageSizeChange" @on-sort-change="sortChange" @pagesizeChange="sizeChange">
          </m2-el-table>
          <div class="upload-buttons">
            <el-button v-preventReClick="3000" :type="btnType" :disabled="importBtn" size="small" @click="handleImport">确认导入</el-button>
            <el-button v-preventReClick="3000" type="info" size="small" @click="closeDialog">取消</el-button>
          </div>
        </el-tab-pane>
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
            <el-button v-preventReClick="3000" type="primary" :disabled="downloadBtn" size="small" @click="exportFailedData">下载失败数据</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import upload from "_o/components/operator-center/salary-modules/common/upload";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import {
  weekColumns,
  monthColumns,
  weekTaxColumns,
  monthTaxColumns
} from "./fields";
import {
  toResult,
  deepClone,
  isEmptyFieldExist
} from "_o/common/salaryMixin";
import { excelDownload } from "_o/common/common";
import { parseTime } from "@/libs/util";
import {
  queryUploadData,
  queryFailedUploadData,
  queryOfflineUploadData,
  queryOfflineFailedUploadData,
  handleUpload,
  handleOfflineUpload,
  UploadCacheData,
  importData,
  downloadErrorMessage,
} from "_o/api/salary/salaryRule";
import { queryCitiesWithAgent } from "_o/api/salary/common";
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
const currentPath = "/resumePage";
const pageObj = {
  size: 10,
  total: 0,
  currentPage: 1
};
let queryDataInterval = null;

export default {
  components: { upload, m3elTable },
  props: {
    batchInsertVisible: { type: Boolean },
    importParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    templateHref: { type: String, default: "" },
    importAction: { type: String, default: "" },
    type: { type: String, default: "" },
    title: { type: String, required: true, default: "" },
    importantType: { type: Number, default: 1 },
    interface: { type: Function }
  },
  data() {
    return {
      weekColumns,
      weekTaxColumns,
      monthColumns,
      monthTaxColumns,
      action: apiUrl + "/salary-web-api" + this.importAction,
      excelAction: "",
      activeName: "success",
      pickerOptions: {
        firstDayOfWeek: 1
      },
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
      awardParams: {
        batchNo: "",
        timeSchemaId: "",
        salaryType: "",
        currPage: 1,
        pageSize: 10
      },
      successCount: 0,
      failedCount: 0,
      querytype: "",
      week: "",
      month: "",
      columns: [],
      successData: [],
      failedData: [],
      queryForm: {
        code: "",
        salaryYear: "",
        salaryType: "",
        salaryIndex: "",
        cityCode: ""
      },
      sunccessData: [],
      cities: [],
      dialogVisible: false,
      resultVisible: false,
      downloadBtn: false,
      importBtn: false,
      uploadDisable: false,
      loading: false,
      btnType: "primary",
    };
  },
  computed: {
    showUpload() {
      if ((this.type == "weekTax" || this.type == "monthTax") && this.importantType == 1) {
        return this.uploadDisable;
      }
      return isEmptyFieldExist(this.queryForm) || this.uploadDisable;
    },
    uploadParams() {
      if (this.type === "weekTax" || this.type === "monthTax") {
        return { ...this.importParams };
      }
      if (this.importantType == 2) {
        this.queryForm.code = 43;
      }
      return {
        ...this.queryForm
      };
    }
  },
  watch: {
    querytype: {
      handler(val) {
        if (val) {
          this.queryForm.code = "";
        }
      }
    },
    week: {
      handler(val) {
        if (val) {
          this.queryForm.salaryIndex = parseTime(
            new Date(val.getTime() - 86400000),
            "{y}-{m}-{d}"
          );
          this.queryForm.salaryYear = new Date(val).getFullYear();
        }
      },
      immediate: true
    },
    month: {
      handler(val) {
        if (val) {
          this.queryForm.salaryIndex = new Date(val).getMonth() + 1;
          this.queryForm.salaryYear = new Date(val).getFullYear();
        }
      },
      immediate: true
    }
  },
  created() {
    this.getCitiesWithAgent();
    this.setColumns();
  },
  methods: {
    setColumns() {
      switch (this.type) {
        case "week":
          this.columns = deepClone(this.weekColumns);
          this.queryForm.salaryType = 2;
          break;
        case "weekTax":
          this.columns = deepClone(this.weekTaxColumns);
          break;
        case "month":
          this.columns = deepClone(this.monthColumns);
          this.queryForm.salaryType = 1;
          break;
        case "monthTax":
          this.columns = deepClone(this.monthTaxColumns);
          break;
      }
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
    // 获取上传后列表数据
    async getResultData() {
      let params;
      if (this.type === "weekTax" || this.type === "monthTax") {
        params = this.taxParams;
      } else {
        params = this.awardParams;
      }
      const [err, upLoadData] = await toResult(this.requestType(params));
      if (err) {
        this.$alert(err.message);
        this.clearQueryInterval();
        return;
      }
      if (upLoadData.status == 1) {
        this.loading = false;
        this.successData = upLoadData.pageResultSuccessList.list;
        this.failedData = upLoadData.pageResultFailureList.list;
        this.successCount = upLoadData.pageResultSuccessList.totalCount;
        this.successPageObj.total = upLoadData.pageResultSuccessList.totalCount;
        this.failedCount = upLoadData.pageResultFailureList.totalCount;
        this.failedPageObj.total = upLoadData.pageResultFailureList.totalCount;
        this.handleFreeBtn();
        this.clearQueryInterval();
      }
    },
    requestType(data) {
      if (this.type === "weekTax" || this.type === "monthTax") {
        return queryUploadData(data);
      } else if (this.importantType == 2) {
        return UploadCacheData(data);
      } else {
        return queryOfflineUploadData(data);
      }
    },
    handlePreUpload(event) {
      if (this.importantType == 2) {
        this.queryForm.code = 43;
      }
      if (this.importantType == 2 && (this.queryForm.cityCode == "" || this.queryForm.salaryIndex == "" || this.queryForm.salaryYear == "")) {
        return this.$alert("请先选择导入搜索项");
      }
      if (
        isEmptyFieldExist(this.queryForm) &&
        (this.type == "week" || this.type == "month") && this.importantType == 1
      ) {
        return this.$alert("请先选择导入搜索项");
      }
    },
    // 上传成功后回调
    async handleUploadSuccess(json) {
      if (json.response.success && json.response.data) {
        this.resultVisible = true;
        this.loading = true;
        this.successPageObj.size = 10;
        this.failedPageObj.size = 10;
        this.successPageObj.currentPage = 1;
        this.failedPageObj.currentPage = 1;
        this.successCount = 0;
        this.failedCount = 0;
        this.handleLimitBtn();
        let data = json.response.data;
        if (this.type === "weekTax" || this.type === "monthTax") {
          this.taxParams.currPage = 1;
          this.taxParams.pageSize = 10;
          this.taxParams.taxType = this.importParams.taxType;
          this.taxParams.batchNo = data.bathNo;
          this.taxParams.timeSchemaId = data.timeSchemaId;
        } else {
          this.awardParams.currPage = 1;
          this.awardParams.pageSize = 10;
          this.awardParams.salaryType = String(this.importParams.salaryType);
          this.awardParams.batchNo = data.bathNo;
          this.awardParams.timeSchemaId = data.timeSchemaId;
        }
        queryDataInterval = setInterval(() => {
          this.getResultData();
        }, 5000);
      } else {
        this.$alert(json.response.msg);
      }
    },
    // 上传期间按钮禁止操作
    handleLimitBtn() {
      this.btnType = "info";
      this.downloadBtn = true;
      this.importBtn = true;
      this.uploadDisable = true;
    },
    // 上传结束后放开按钮操作
    handleFreeBtn() {
      if (this.successData.length) {
        this.btnType = "primary";
        this.importBtn = false;
      }
      this.downloadBtn = false;
      this.uploadDisable = false;
    },
    // 清除定时器
    clearQueryInterval() {
      queryDataInterval && clearInterval(queryDataInterval);
      queryDataInterval = null;
    },
    async getCitiesWithAgent() {
      const [err, data] = await toResult(queryCitiesWithAgent({}));
      if (err) {
        this.$alert(err.message);
        return;
      }
      if (data.cities.length > 1) {
        data.cities.unshift({ orgName: "全国", orgCode: -1 });
      }
      this.cities = data.cities;
    },
    pageSizeChange(v) {
      let flag = this.activeName === "success" ? true : false;
      let type =
        this.type === "weekTax" || this.type === "monthTax" ? true : false;
      type ? (this.taxParams.currPage = v) : (this.awardParams.currPage = v);
      flag
        ? (this.successPageObj.currentPage = v)
        : (this.failedPageObj.currentPage = v);
      this.getResultData();
    },
    sizeChange(v) {
      let flag = this.activeName === "success" ? true : false;
      let type =
        this.type === "weekTax" || this.type === "monthTax" ? true : false;
      type ? (this.taxParams.pageSize = v) : (this.awardParams.pageSize = v);
      flag ? (this.successPageObj.size = v) : (this.failedPageObj.size = v);
      this.taxParams.currPage = 1;
      this.awardParams.currPage = 1;
      this.getResultData();
    },
    sortChange() {},
    handleImport() {
      if (this.type === "weekTax" || this.type === "monthTax") {
        handleUpload(this.taxParams).then(res => {
          if (res.data.success) {
            this.$alert("导入成功,请稍后刷新列表数据查看导入结果");
          } else {
            this.$alert(res.data.msg);
          }
        });
      } else if (this.importantType == 2) {
        importData(this.awardParams).then(res => {
          if (res.data.success) {
            this.$alert("导入成功,请稍后刷新列表数据查看导入结果");
          } else {
            this.$alert(res.data.msg);
          }
        });
      } else {
        handleOfflineUpload(this.awardParams).then(res => {
          if (res.data.success) {
            this.$alert("导入成功,请稍后刷新列表数据查看导入结果");
          } else {
            this.$alert(res.data.msg);
          }
        });
      }
      this.$emit("handleSuccessImport");
    },
    exportFailedData() {
      let params;
      if (this.type === "weekTax" || this.type === "monthTax") {
        params = this.taxParams;
        queryFailedUploadData(params).then(res => {
          excelDownload(res.data, "上传失败数据");
        });
      } else if (this.importantType == 2) {
        params = this.awardParams;
        downloadErrorMessage(params).then(res => {
          excelDownload(res.data, "上传失败数据");
        });
      } else {
        params = this.awardParams;
        queryOfflineFailedUploadData(params).then(res => {
          excelDownload(res.data, "上传失败数据");
        });
      }
    }
  }
};
</script>

<style scoped>
.uploadBox {
}
.tips {
  font-weight: bold;
  color: gray;
  margin: 15px;
  font-size: 16px;
}
.upload-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
