<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-18 14:12:49
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-28 16:15:30
-->
<template>
  <div class="app-container">
    <div class="selectBar">
      <el-form
        ref="queryForm"
        inline
        :model="queryForm"
        class="demo-form-inline"
        size="mini"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="奖励/扣款" label-width="100px">
              <el-select
                v-model="querytype"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option label="奖励" value="0"></el-option>
                <el-option label="扣款" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类目" label-width="100px">
              <el-select
                v-model="childrenType"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-if="querytype == '0'"
                  label="司机服务奖励"
                  value="21"
                ></el-option>
                <el-option
                  v-if="querytype == '0'"
                  label="推荐司机"
                  value="23"
                ></el-option>
                <el-option
                  v-if="querytype == '0'"
                  label="推荐乘客"
                  value="24"
                ></el-option>
                <el-option
                  v-if="querytype == '0'"
                  label="城市补发"
                  value="25"
                ></el-option>
                <el-option
                  v-if="querytype == '1'"
                  label="司机服务违规扣款"
                  value="31"
                ></el-option>
                <el-option
                  v-if="querytype == '1'"
                  label="风控（税前）"
                  value="32"
                ></el-option>
                <el-option
                  v-if="querytype == '1'"
                  label="城市扣减"
                  value="33"
                ></el-option>
              <!-- <el-option label="司机座谈会补贴" value="8" v-if="querytype == '0'"></el-option>
              <el-option label="线下活动奖励" value="18" v-if="querytype == '0'"></el-option>
              <el-option label="租金返还补贴" value="19" v-if="querytype == '0'"></el-option>
              <el-option label="A转UP补贴" value="7" v-if="querytype == '0'"></el-option>
              <el-option label="其他" value="9" v-if="querytype == '0'"></el-option>                 -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="薪酬月份" label-width="100px">
              <el-date-picker
                v-model="month"
                type="month"
                :clearable="false"
                style="width: 200px"
                placeholder="选择月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select
                v-model="queryForm.cityCode"
                placeholder="城市"
                style="width: 200px"
                filterable
              >
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(cityObj, index) in cities"
                  :key="index"
                  :label="cityObj.orgName"
                  :value="cityObj.orgCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select
                v-model="queryForm.batchStatus"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option label="初始" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="审批通过" value="2"></el-option>
                <el-option label="审核驳回" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button
              v-if="hasPermission('offlineRewards-query')"
              v-preventReClick="3000"
              type="primary"
              @click="paramSelect"
            >搜索</el-button>
            <el-button
              v-if="hasPermission('offlineRewards-query')"
              v-preventReClick="3000"
              type="info"
              @click="reset"
            >重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <hr class="tophr" />
    <div class="main buttons">
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="offlineRewards-export-week"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
      <el-button
        v-if="hasPermission('offlineRewards-import-month')"
        v-preventReClick="3000"
        style="margin-left:10px"
        type="primary"
        size="small"
        @click="importExcel"
      >批量导入</el-button>
    </div>
    <div style="margin-top: 60px">
      <m2-el-table
        :tableData="tableData"
        :columns="monthList"
        :pageObj="pageObj"
        :options="options"
        @on-pagesize-change="pageSizeChange"
        @on-sort-change="sortChange"
        @pagesizeChange="sizeChange"
      >
        <el-table-column slot="rewardMonth" label="薪酬月份">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime | parseMonth}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="itemType" label="奖励/扣款">
          <template slot-scope="scope">
            <span>{{scope.row.itemType | parseType}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="batchType" label="类目">
          <template slot-scope="scope">
            <span>{{scope.row.batchTypes | parseCategory}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="batchStatus" prop="batchStatus" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.batchStatus | parseStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          slot="action"
          label="操作项"
          min-width="160px"
          align="center"
        >
          <template slot-scope="scope" min-width="120">
            <el-button
              v-if="hasPermission('offlineRewards-detail')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-if="hasPermission('offlineRewards-delete-month') && btnCheck(scope.row.batchStatus, 1) && (scope.row.applicantUuid == userId || scope.row.applicantUuid == '')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              v-if="
                hasPermission('offlineRewards-check-month') &&
                  btnCheck(scope.row.batchStatus, 0) &&
                  scope.row.auditorUuid == userId &&
                  scope.row.auditNodeId == scope.row.selectNodeId
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleAudit(scope.row)"
            >审核</el-button>
            <el-button
              v-if="
                hasPermission('offlineRewards-submit-month') &&
                  btnCheck(scope.row.batchStatus, 1) && (scope.row.applicantUuid == userId || scope.row.applicantUuid == '')
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleSubmit(scope.row)"
            >提交审核</el-button>
            <el-button
              v-if="
                hasPermission('offlineRewards-cancelSubmit-month') &&
                  btnCheck(scope.row.batchStatus, 0) &&
                  scope.row.auditNodeId == scope.row.selectNodeId && (scope.row.applicantUuid == userId || scope.row.applicantUuid == '')
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="cancelSubmit(scope.row)"
            >取消审核</el-button>
          </template>
        </el-table-column>
      </m2-el-table>
    </div>
    <batch-import
      v-if="batchInsertVisible"
      :batchInsertVisible="batchInsertVisible"
      title="批量导入奖励项"
      :importParams="importParams"
      :templateHref="templateHref"
      :importAction="importAction"
      :type="monthType"
      :interface="offlineRewardsImport"
      @handleSuccessImport="handleSuccessImport"
      @closeDialogHandle="closeDialogHandle"
    ></batch-import>
    <approval-modal
      v-if="audit.visible"
      :optionId="optionId"
      :importantType="importantType"
      :auditBatchType="auditBatchType"
      :auditOptionsType="auditOptionsType"
      @ruleSubmit="approvalSubmit"
    ></approval-modal>
    <audit-modal
      v-if="audit.dialogVisible"
      @reviewSubmit="approvalAudit"
    ></audit-modal>
    <detail
      v-if="detailVisible"
      :detailVisible="detailVisible"
      :batchNo="batchNo"
      @closeDialogHandle="closeDialogHandle"
    ></detail>
  </div>
</template>

<script>
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import { monthList } from "./fields";
import {
  dateTimeFormat,
  deleteEmptyProps, getUserIdFromLocalStorage,
  validateIdCardQuery,
  validatePhoneQuery
} from "_o/common/common";
import {
  cityListByAll,
  queryCompanyByCity,
  queryWaterMark,
  auditSubmit,
  cancelAudit,
  queryCitiesWithAgent,
  submitVerify,
  passAudit,
  refusedAudit,
  offlineRewardsImport
} from "_o/api/salary/common";
import { queryOfflineRewards, exportOfflineRewards, deleteOfflineRewards } from "_o/api/salary/salaryRule";
import { toResult, deepClone } from "_o/common/salaryMixin";
import approvalModal from "../components/approvalModal";
import { approval } from "../components/index.js";
import auditModal from "../components/auditModal";
import { excelDownload } from "_o/common/common";
import detail from "./monthDetail";
import batchImport from "_o/components/operator-center/salary-modules/common/salaryImport/index";
import config from "@/config/config";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
import { parseTime } from "@/libs/util";
import { getFirstAndLastDay } from "_o/common/salaryMixin";
import { isDev } from "@/micro/registerApp/appEntry";
export default {
  name: "driverReward",
  components: {
    exportButton,
    m3elTable,
    batchImport,
    approvalModal,
    auditModal,
    detail
  },
  filters: {
    parseType(val) {
      if (val == 1) {
        return "奖励";
      } else if (val == 2) {
        return "扣款";
      }
    },
    parseCategory(val) {
      if (val == 24) {
        return "推荐乘客";
      }
      if (val == 25) {
        return "城市补发";
      }
      if (val == 21) {
        return "司机服务奖励";
      }
      if (val == 23) {
        return "推荐司机";
      }
      if (val == 31) {
        return "司机服务违规扣款";
      }
      if (val == 32) {
        return "风控（税前）";
      }
      if (val == 33) {
        return "城市扣减";
      }
      // if(val == 18) {
      //   return "线下活动奖励";
      // }
      // if(val == 19) {
      //   return "租金返还补贴";
      // }
      // if(val == 7) {
      //   return "A转UP补贴";
      // }
      // if(val == 8) {
      //   return "司机座谈会补贴";
      // }
      // if(val == 9) {
      //   return "其他";
      // }
    },
    parseDate(val) {
      if (val) {
        return parseTime(val, "{y}-{m}-{d}");
      }
      return;
    },
    parseMonth(val) {
      if (val) {
        let date = parseTime(val, "{y}-{m}-{d}");
        let y = date.split("-")[0];
        let m = date.split("-")[1];
        return y + "-" + m;
      }
      return;
    },
    parseStatus(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 1:
          return "审核中";
          break;
        case 2:
          return "审批通过";
          break;
        case 3:
          return "审核驳回";
          break;
      }
    }
  },
  data() {
    return {
      importantType: 2,
      offlineRewardsImport,
      monthList,
      monthType: "month",
      toResult,
      ...approval,
      optionId: "",
      auditBatchType: 0,
      auditOptionsType: 2,
      userId: getUserIdFromLocalStorage(),
      batchNo: "",
      querytype: "",
      childrenType: "",
      WaterMarkInfo: "",
      pageObj: {
        size: 20,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false
      },
      importParams: {
        salaryType: 1
      },
      queryForm: {
        currPage: 1,
        pageSize: 20,
        batchTypes: ["21", "23", "31", "32", "24", "25", "33"],
        userUuid: getUserIdFromLocalStorage()
      },
      month: "",
      exportLoading: false,
      detailVisible: false,
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
      tableData: [],
      currentLog: "",
      currentId: "",
      batchInsertVisible: false,
      // 导入模板下载链
      templateHref:
        apiUrl + "/salary-web-api/" + "downloadExcel/offlineReward-month.xlsx",
      // 上传excel的api地址
      importAction: "/api/salary/v1/offlineRewards/uploadData",
      logVisible: false,
      logTableData: [],
      logTotalCount: 0
    };
  },
  watch: {
    querytype: {
      handler(val) {
        if (val && !this.childrenType) {
          switch (val) {
            case "0":
              this.queryForm.batchTypes = [21, 23, 24, 25];
              break;
            case "1":
              this.queryForm.batchTypes = [31, 32, 33];
              break;
          }
        } else {
          this.childrenType = "";
        }
      },
      immediate: true
    },
    childrenType: {
      handler(val) {
        if (val) {
          this.queryForm.batchTypes = [];
          this.queryForm.batchTypes.push(this.childrenType);
        }
      },
      immediate: true
    },
    month: {
      handler(val) {
        if (val) {
          let dateArr = getFirstAndLastDay(this.month);
          this.queryForm.beginTime = dateArr[0];
          this.queryForm.endTime = dateArr[1];
        }
      },
      immediate: true
    }
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
    handleSuccessImport() {
      this.batchInsertVisible = false;
      this.getPage(this.queryForm);
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
      this.pageObj.currentPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = this.pageObj.size;
      this.getPage(this.queryForm);
    },
    handleDelete(row) {
      deleteOfflineRewards({ id: row.id }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          this.getPage(this.queryForm);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 打开提交审核页面
    handleSubmit(row) {
      this.audit.visible = true;
      this.optionId = String(row.id);
      this.auditBatchType = row.batchTypes;
      // this.$confirm("确定提交至OA审批吗", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"}).then(() => {
      //   this.approvalSubmit({ auditBatchType: row.batchTypes, auditOptionsType: 2, optionId: row.id });
      // })
    },
    // 打开审核页面
    handleAudit(row) {
      this.audit.dialogVisible = true;
      this.optionId = String(row.id);
      this.auditBatchType = row.batchTypes;
    },
    // 提交审核
    async approvalSubmit(params) {
      const [err, data] = await this.toResult(submitVerify(params));
      if (err) {
        this.$message.error(err.msg);
        return;
      }
      if (data.success) {
        auditSubmit(params).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.audit.visible = false;
            this.paramSelect();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // 取消审核
    cancelSubmit(row) {
      this.$confirm("确定取消审核吗?", "取消审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancelAudit({
            auditOptionsType: 2,
            auditBatchType: row.batchTypes,
            optionId: String(row.id)
          }).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "取消成功!"
              });
              this.paramSelect();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 审核
    async approvalAudit(params) {
      let queryParams = {
        auditOptionsType: this.auditOptionsType,
        auditBatchType: this.auditBatchType,
        optionId: this.optionId,
        remark: params.remark
      };
      const [err, data] = await this.toResult(this.requestType(queryParams, params.reviewStatus));
      if (err) {
        this.$alert(err.message);
        return;
      }
      this.audit.dialogVisible = false;
      this.$message.success(data.msg);
      this.paramSelect();
    },
    requestType(params, flag) {
      if (flag == 1) {
        return passAudit(params);
      } else {
        return refusedAudit(params);
      }
    },
    // 重置
    reset() {
      this.queryForm = {
        currPage: 1,
        pageSize: this.pageObj.size,
        batchTypes: ["21", "23", "31", "32", "24", "25", "33"],
        userUuid: this.userId
      };
      this.month = "";
      this.pageObj.currentPage = 1;
      this.querytype = "";
      this.childrenType = "";
      this.getPage({ ...this.queryForm });
    },
    closeDialogHandle(type) {
      switch (type) {
        case "detail":
          this.detailVisible = false;
          break;
        case "batchAdd":
          this.batchInsertVisible = false;
          break;
      }
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    exportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          !requestParams[propName] ||
          propName === "currPage" ||
          propName === "pageSize" ||
          propName === "userUuid" ||
          (requestParams[propName] instanceof Array &&
            requestParams[propName].length === 4)
        ) {
          delete requestParams[propName];
        }
      }
      if (Object.keys(requestParams).length === 0) {
        this.$alert("请先选择筛选条件");
      } else {
        for (let propName in requestParams) {
          if (
            requestParams.hasOwnProperty(propName) &&
            (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
          ) {
            delete requestParams[propName];
          }
        }
        this.exportLoading = true;
        exportOfflineRewards(requestParams).then(res => {
          excelDownload(res.data, "月奖励/扣款数据");
        });
      }
    },
    // 获得分页数据并解析
    getPage(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      // 获取司机奖励发放列表
      queryOfflineRewards(deleteEmptyProps(requestParams))
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.pageObj.total = res.data.data.totalCount;
          } else if (!res.data.success) {
            this.$alert(res.data.msg);
            this.tableData = [];
            this.pageObj.total = 0;
          }
        })
        .catch(error => {
          this.$alert("获取司机奖励发放分页列表数据失败，请稍后重试");
        });
    },
    pageSizeChange(v) {
      this.pageObj.currentPage = v;
      this.queryForm.currPage = v;
      this.getPage(this.queryForm);
    },
    sizeChange(v) {
      this.pageObj.currentPage = 1;
      this.pageObj.size = v;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = v;
      this.getPage(this.queryForm);
    },
    sortChange() {},
    handleDetail(row) {
      this.detailVisible = true;
      this.batchNo = row.id;
    },
    btnCheck(val, flag) {
      if (!flag) {
        const auditStatusMap = [1];
        return auditStatusMap.includes(val);
      } else {
        const submitStatusMap = [0, 3];
        return submitStatusMap.includes(val);
      }
    }
  }
};
</script>

<style></style>
