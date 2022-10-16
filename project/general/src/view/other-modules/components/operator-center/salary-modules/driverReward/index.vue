<template>
  <div class="app-container">


    <SearchBox>
      <div slot="content">
        <el-form
          ref="queryForm"
          inline
          :model="queryForm"
          class="demo-form-inline"
          size="mini"
          :rules="queryRules"
          label-position="right"
        >
          <el-form-item label="城市" label-width="100px">
            <el-select
              v-model="queryForm.cityCode"
              placeholder="城市"
              style="width: 200px"
              filterable
              @change="getAgentName"
            >
              <el-option label="全部" value="-1"></el-option>
              <template v-for="(cityObj, index) in cities">
                <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织" label-width="100px">
            <el-select
              v-model="queryForm.agentUuid"
              placeholder="运营商"
              style="width: 200px;"
              filterable
              @change="changeValue"
            >
              <el-option label="全部" value="-1"></el-option>
              <template v-for="agentObj in agents">
                <el-option :key="agentObj.value" :label="agentObj.name" :value="agentObj.uuid"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" label-width="100px">
            <el-input
              v-model="queryForm.name"
              placeholder="姓名"
              maxlength="32"
              style="width: 200px"
              @keydown.enter.native="paramSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" label-width="180px">
            <el-input
              v-model="queryForm.mobile"
              placeholder="手机号"
              maxlength="12"
              style="width: 200px"
              @keydown.enter.native="paramSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="identityCard" label-width="100px">
            <el-input
              v-model="queryForm.identityCard"
              placeholder="身份证号"
              maxlength="20"
              style="width: 200px"
              @keydown.enter.native="paramSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="奖励状态" label-width="100px">
            <el-select v-model="queryForm.rewardStatus" placeholder="奖励状态" style="width: 200px">
              <el-option label="初始" value="0"></el-option>
              <el-option label="已奖励" value="1"></el-option>
              <el-option label="已取消" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖励日期" label-width="100px">
            <el-date-picker
              v-model="rewardPayDataArr"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 200px"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="被推荐司机缴纳履约金日期" label-width="180px">
            <el-date-picker
              v-model="payDataArr"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 200px"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footerRight">
        <el-button
          v-if="hasPermission('driverReward-query')"
          v-preventReClick="3000"
          type="primary"
          size="mini"
          @click="paramSelect"
        >搜索</el-button>
        <el-button
          v-if="hasPermission('driverReward-query')"
          v-preventReClick="3000"
          type="info"
          size="mini"
          @click="reset"
        >重置</el-button>
      </div>
    </SearchBox>


    <div class=" buttons export_btn_fl">
      <el-button
        v-if="hasPermission('driverReward-batch')"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="batchReward"
      >批量奖励</el-button>
      <!-- <el-button
        type="primary"
        v-if="hasPermission('driverReward-export')"
        v-preventReClick="3000"
        @click="rewardExportExcel"
        size="small"
      >批量导出</el-button> -->
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="driverReward-export"
        @fatherExport="rewardExportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
      <el-button v-preventReClick="3000" type="primary" size="small" @click="importExcel">批量奖励导入</el-button>
    </div>

    <div style="margin-top: 60px">
      <el-table

        :row-style="{ backgroundColor: 'transparent' }"
        :data="tableData"
        size="mini"
        :header-cell-style="{ background: '#F5F4F2' }"
        fit
        highlight-current-row
        height="515"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <!-- <el-table-column prop="agentName" label="所属组织" min-width="110"></el-table-column> -->
        <el-table-column prop="cityName" label="城市" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <!-- <el-table-column prop="channelName" label="奖励来源" min-width="85"></el-table-column> -->
        <el-table-column prop="rewardStatus" label="奖励状态" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="Number(scope.row.rewardStatus) == 0" style="color: red">初始</span>
            <span v-if="Number(scope.row.rewardStatus) == 1" style="color: green">已奖励</span>
            <span v-if="Number(scope.row.rewardStatus) == 2" style="color: green">已取消</span>
          </template>
        </el-table-column>
        <el-table-column prop="rewardTime" label="奖励日期" min-width="150" :show-overflow-tooltip="true" sortable="custom"></el-table-column>
        <el-table-column prop="byName" label="被推荐司机姓名" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="byMobile" label="被推荐司机手机号" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="byIdCard" label="被推荐司机身份证号" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="depositTime" label="被推荐司机缴纳履约金日期" sortable="custom" min-width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="rewardAmount" label="奖励金额(元)" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.rewardAmount | rounding}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作项" min-width="160" fixed="right" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button
              v-if="hasPermission('driverReward-batch') && Number(scope.row.rewardStatus) == 2 || Number(scope.row.rewardStatus) == 0"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="isReward(scope.row, 1)"
            >奖励</el-button>
            <el-button
              v-if="hasPermission('driverReward-batch') && Number(scope.row.rewardStatus) == 1"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="isReward(scope.row, 2)"
            >取消奖励</el-button>
            <el-button
              v-if="hasPermission('driverReward-detail')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="getDetails(scope.row.recordId)"
            >详情</el-button>
            <el-button
              v-if="hasPermission('driverReward-log')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="getLogs(scope.row.recordId, scope.row.name)"
            >日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <e-pagination
        :currPage="queryForm.currPage"
        :pageSize="queryForm.pageSize"
        :total="totalCount"
        @currentChange="handleCurrentChange"
        @pagesizeChange="handleSizeChange"
      ></e-pagination>
    </div>
    <driver-reward-add
      ref="rewardAdd"
      :driverUuidList="driverUuidList"
      :isShowAmount="isShowAmount"
      :driverRewardVisable="driverRewardVisable"
      :driverRewardForm="driverRewardForm"
      @closeDialogHandle="closeDialogHandle"
      @addSuccessHandle="addSuccessHandle"
    ></driver-reward-add>

    <driver-reward-detail
      :driverRewardDetailVisable="driverRewardDetailVisable"
      :rewardDetailData="rewardDetailData"
      @closeDialogHandle="closeDialogHandle"
    ></driver-reward-detail>

    <logs
      v-if="logVisible"
      :logVisible="logVisible"
      :logTableData="logTableData"
      :logTotalCount="logTotalCount"
      :currentLog="currentLog"
      :currentId="currentId"
      @closeDialogHandle="closeDialogHandle"
      @handleLogsPage="handleLogsPage"
    ></logs>
    <batch-import
      v-if="batchInsertVisible"
      :batchInsertVisible="batchInsertVisible"
      :importRule="importRule"
      :notePictureArr="notePictureArr"
      :templateHref="templateHref"
      :importAction="importAction"
      :interface="recommendImport"
      @successReload="importSuccessReload"
      @closeDialogHandle="closeImportDialogHandle"
    ></batch-import>
    <batch-add-result
      v-if="resultVisible"
      :batchAddResultData="batchAddResultData"
      :resultVisible="resultVisible"
      @closeDialogHandle="closeImportDialogHandle"
      @errorImport="errorImport"
    ></batch-add-result>
  </div>
</template>

<script>
import {
  dateTimeFormat,
  deleteEmptyProps,
  validateIdCardQuery,
  validatePhoneQuery
} from "_o/common/common";
import {
  cityListByAll,
  queryCompanyByCity,
  queryWaterMark,
  queryCitiesWithAgent
} from "_o/api/salary/common";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import {
  batchRewardOrCancel,
  operateLog,
  recommendDetails,
  recommendRecord,
  recommendImport
} from "_o/api/salary/driverReward";
import { rewardExport } from "_o/api/salary/exportApi";
import { excelDownload } from "_o/common/common";
import batchImport from "_o/components/operator-center/salary-modules/common/batchImport";
import batchAddResult from "_o/components/operator-center/salary-modules/common/batchImportResult";
import driverRewardAdd from "./driverRewardAdd";
import driverRewardDetail from "./driverRewardDetail";
import config from "@/config/config";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
import SearchBox from "_o/components/operator-center/salary-modules/searchForm/Form/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import { isDev } from "@/micro/registerApp/appEntry";
export default {
  name: "driverReward",
  components: {
    driverRewardAdd,
    driverRewardDetail,
    logs,
    batchImport,
    batchAddResult,
    SearchBox,
    exportButton,
    EPagination
  },
  filters: {
    rounding(value) {
      if (value == "" || value == null) {
        value = 0;
      }
      return Number(value).toFixed(2);
    }
  },
  data() {
    return {
      recommendImport,
      exportLoading: false,
      WaterMarkInfo: "",
      importRule: true,
      queryForm: {
        name: "",
        mobile: "",
        identityCard: "",
        cityCode: "",
        cityName: "",
        agentUuid: "",
        agentName: "",
        rewardStatus: "",
        startPayTime: "",
        endPayTime: "",
        rewardTimeStart: "",
        rewardTimeEnd: "",
        currPage: 1,
        pageSize: 10,
        isDesc: "true"
      },
      payDataArr: [],
      rewardPayDataArr: [],
      driverRewardVisable: false,
      driverRewardDetailVisable: false,
      isShowAmount: false,
      driverRewardForm: {},
      rewardDetailData: {
        talent: {},
        talentScout: {}
      },
      driverUuidList: [],
      cities: [],
      agents: [],
      selectedRows: [],
      currPage: 1,
      pageSize: 10,
      logPageSize: 10,
      sortColumnName: "operate_time",
      totalCount: 0,
      tableData: [],
      currentLog: "",
      currentId: "",
      batchInsertVisible: false,
      resultVisible: false,
      batchAddResultData: {},
      // 批量导入提示图片数组
      notePictureArr: [],
      // 导入模板下载链
      templateHref: apiUrl + "/m2-driver-resume-web" + "/downloadExcel/sjtjjldr.xlsx",
      // 上传excel的api地址
      importAction: "/api/driver/recommend/import",
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      queryRules: {
        identityCard: [{ validator: validateIdCardQuery, trigger: "blur" }],
        mobile: [{ validator: validatePhoneQuery, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCitiesWithAgent();
    this.getPage(this.queryForm);
    this.getWaterMarkInfo();
  },
  methods: {
    importExcel() {
      this.batchInsertVisible = true;
    },
    importSuccessReload(json) {
      if (json.response.success) {
        this.batchInsertVisible = false;
        this.batchAddResultData = json;
        this.resultVisible = true;
        this.paramSelect();
      } else {
        this.$message({
          type: "error",
          message: json.response.msg
        });
      }
    },
    errorImport() {
      this.resultVisible = false;
      this.$alert("导入失败，请检查导入的excel是否符合模板要求");
    },
    closeImportDialogHandle(type) {
      switch (type) {
        case "batchAdd":
          this.batchInsertVisible = false;
          break;
        case "result":
          this.resultVisible = false;
          break;
      }
    },
    getWaterMarkInfo() {
      queryWaterMark()
        .then(res => {
          if (res.data.success && res.data.data) {
            this.WaterMarkInfo = res.data.data;
          }
        })
        .catch(err => {
          this.$alert("获取水印数据信息失败，请刷新页面重试");
        });
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({})
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.cities.length === 0) {
              this.$alert("暂无开通城市数据信息，请先联系相关运营人员进行开通城市操作");
            } else {
              this.cities = res.data.data.cities;
            }
            if (res.data.data.agentInfoVos.length === 0) {
              this.$alert("获取代理商下拉选择列表数据失败，请刷新页面重试");
            } else {
              this.agents = res.data.data.agentInfoVos;
            }
          }
        })
        .catch(err => {
          this.$alert("获取数据信息失败，请刷新页面重试");
        });
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    // 带参数查询
    paramSelect() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          if (this.payDataArr && this.payDataArr.length > 0) {
            this.queryForm.startPayTime = this.payDataArr[0];
            let date = new Date(this.payDataArr[1]);
            date.setDate(date.getDate());
            this.queryForm.endPayTime = dateTimeFormat(
              date.toDateString(),
              "yyyy-MM-dd"
            );
          } else {
            this.queryForm.startPayTime = "";
            this.queryForm.endPayTime = "";
          }
          if (this.rewardPayDataArr && this.rewardPayDataArr.length > 0) {
            this.queryForm.rewardTimeStart = this.rewardPayDataArr[0];
            let date = new Date(this.rewardPayDataArr[1]);
            date.setDate(date.getDate());
            this.queryForm.rewardTimeEnd = dateTimeFormat(
              date.toDateString(),
              "yyyy-MM-dd"
            );
          } else {
            this.queryForm.rewardTimeStart = "";
            this.queryForm.rewardTimeEnd = "";
          }
          this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
          this.currPage = 1;
          this.queryForm.currPage = 1;
          this.queryForm.pageSize = 10;
          this.getPage(this.queryForm);
        }
      });
    },
    isReward(params, status) {
      this.$refs.rewardAdd.getData(params, status);
      if (status == 2) {
        this.$confirm("确定取消奖励?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        })
          .then(() => {
            this.$refs.rewardAdd.cancelReward();
            return;
          })
          .catch(err => {
            this.$message({
              type: "err",
              message: "系统错误"
            });
          });
      } else {
        this.$refs.rewardAdd.changeStatus(true);
      }
    },
    getDetails(recordId) {
      this.driverRewardDetailVisable = true;
      recommendDetails({ recommendId: recordId })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.rewardDetailData = res.data.data;
            this.rewardDetailData.talent = res.data.data.talent;
            this.rewardDetailData.talentScout = res.data.data.talentScout;
          } else {
            this.$alert(res.data.message);
          }
        })
        .catch(error => {
          this.$alert("获取司机奖励发放详情失败，请稍后重试");
        });
    },
    getAgentName(val) {
      if (val == -1) {
        this.queryForm.cityName = "";
        val = null;
      }
      queryCitiesWithAgent({ cityCode: val })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.agents = res.data.data.agentInfoVos;
            this.queryForm.agentUuid = "";
            let obj = {};
            obj = this.cities.find(item => {
              return item.orgCode === val; // 筛选出匹配数据
            });
            if (obj === undefined) {
              return;
            }
            this.queryForm.cityName = obj.orgName;
            this.queryForm.cityCode = obj.orgCode;
            if (this.agents.length === 0) {
              this.$alert("暂无开通运营商数据信息，请先联系相关运营人员进行开通城市操作");
            }
          } else {
            this.$alert("获取开通运营商数据信息失败，请刷新页面重试");
          }
        })
        .catch(err => {
          this.$alert("获取开通运营商数据信息失败，请刷新页面重试");
        });
    },
    changeValue(value) {
      let obj = {};
      obj = this.agents.find(item => {
        return item.uuid === value; // 筛选出匹配数据
      });
      this.queryForm.agentName = obj ? obj.name : "";
    },
    getLogs(id, name, hasOpenLogDialog) {
      operateLog({
        recommendId: id,
        currPage: this.currPage,
        pageSize: this.logPageSize,
        isDesc: this.isDesc,
        sortColumnName: this.sortColumnName
      })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.logTableData = res.data.data.list;
            this.logTotalCount = res.data.data.totalCount;
          } else {
            this.logTableData = [];
            this.logTotalCount = 0;
          }
          if (!hasOpenLogDialog) {
            this.currentId = String(id);
            this.currentLog = "当前司机奖励发放";
            this.logVisible = true;
          }
        })
        .catch(error => {
          this.$alert("查看司机奖励发放详情失败，请稍后重试");
        });
    },
    handleLogsPage(params) {
      this.currPage = params.currPage;
      this.getLogs(params.currentId, params.currentLog, true);
    },
    // 重置
    reset() {
      this.queryForm = {
        name: this.name,
        mobile: this.mobile,
        identityCard: this.identityCard,
        agentUuid: this.agentUuid,
        rewardStatus: this.rewardStatus,
        cityCode: this.cityCode
      };
      this.payDataArr = [];
      this.rewardPayDataArr = [];
      this.currPage = 1;
      this.getPage({
        currPage: 1,
        pageSize: 10,
        isDesc: "false"
      });
      this.getCitiesWithAgent();
    },
    // 批量奖励
    batchReward() {
      this.isShowAmount = false;
      let driverRewardList = [];
      if (this.selectedRows.length === 0) {
        this.$alert("请至少选中一行数据");
      } else {
        this.$refs.rewardAdd.getData(this.selectedRows, 1);
        // 显示弹框
        this.$refs.rewardAdd.changeStatus(true);
      }
    },

    closeDialogHandle(type) {
      switch (type) {
        case "driverRewardAdd":
          this.driverRewardVisable = false;
          break;
        case "log":
          this.currPage = 1;
          this.logVisible = false;
          break;
        case "detail":
          this.driverRewardDetailVisable = false;
      }
    },

    addSuccessHandle() {
      this.getPage(deleteEmptyProps(this.queryForm, ["isDesc"]));
    },

    loadingStatus() {
      this.exportLoading = false
    },
    // 导出
    rewardExportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));

      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      this.exportLoading = true
      rewardExport(requestParams).then(res => {
        excelDownload(res.data, "司机奖励发放数据信息");
      });
    },
    // 获得分页数据并解析
    getPage(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          Number(requestParams[propName]) === -1
        ) {
          delete requestParams[propName];
        }
      }
      // 获取司机奖励发放列表
      recommendRecord(requestParams)
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.totalCount = res.data.data.totalCount;
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }
        })
        .catch(error => {
          this.$alert("获取司机奖励发放分页列表数据失败，请稍后重试");
        });
    },
    handleCurrentChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.getPage(this.queryForm);
    },
    handleSizeChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = val;
      this.getPage(this.queryForm);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .export_btn_fl .el-button{
  float: left;
  margin-left: 0;
  margin-right: 10px;
}
</style>
