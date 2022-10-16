<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-28 10:26:43
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-29 16:33:18
-->
<template>
  <div class="app-container">



    <div class="selectBar">
      <el-form
        ref="queryForm"
        inline
        :rules="queryRules"
        :model="queryForm"
        label-position="right"
        class="demo-form-inline"
        size="mini"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select
                v-model="queryForm.cityCode"
                placeholder="城市"
                style="width: 200px"
                filterable
                @change="getAgentName"
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
          <el-col :span="6">
            <el-form-item label="薪酬月份" label-width="100px">
              <el-date-picker
                v-model="month"
                type="month"
                style="width: 200px"
                format="yyyy-MM"
                value-format="yyyy-MM"
                :clearable="false"
                placeholder="选择月"
                @change="handleStatusCheck"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属运营商" label-width="100px">
              <el-select
                v-model="queryForm.agentUuid"
                placeholder="所属运营商"
                style="width: 200px"
                filterable
                @change="changeValue"
              >
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(agentObj, index) in agents"
                  :key="index"
                  :label="agentObj.name"
                  :value="agentObj.uuid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名" label-width="100px">
              <el-input
                v-model="queryForm.driverName"
                placeholder="姓名"
                maxlength="32"
                style="width: 200px"
                @keydown.enter.native="paramSelect"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="手机号" prop="driverMobile" label-width="100px">
              <el-input
                v-model="queryForm.driverMobile"
                placeholder="手机号"
                maxlength="12"
                style="width: 200px"
                @keydown.enter.native="paramSelect"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="身份证号"
              prop="driverIdentityCard"
              label-width="100px"
            >
              <el-input
                v-model="queryForm.driverIdentityCard"
                placeholder="身份证号"
                maxlength="20"
                style="width: 200px"
                @keydown.enter.native="paramSelect"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-form-item label="司机ID" label-width="100px">
            <el-input
              v-model="queryForm.driverCode"
              placeholder="司机ID"
              maxlength="32"
              style="width: 200px"
              @keydown.enter.native="paramSelect"
            ></el-input>
          </el-form-item>
          <el-col :span="6">
            <el-form-item label="入职时间" label-width="100px">
              <el-date-picker
                v-model="entryDate"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                @change="handleDateChange(entryDate, 1)"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="计算时间" label-width="100px">
              <el-date-picker
                v-model="computeTime"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                @change="handleDateChange(computeTime, 2)"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label-width="110px" label="传HR财务时间">
          <el-date-picker
            v-model="taxAuditTime"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleDateChange(taxAuditTime, 3)"
          >
          </el-date-picker>
        </el-form-item> -->
          <!-- <el-form-item label="发放时间" label-width="100px">
          <el-date-picker
            v-model="payrollTime"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleDateChange(payrollTime, 4)"
          >
          </el-date-picker>
        </el-form-item> -->
          <el-col :span="6">
            <el-form-item label="核算结果" label-width="100px">
              <el-select
                v-model="queryForm.salaryAuditFlag"
                placeholder="核算结果"
                style="width: 200px"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="运营模式" label-width="110px">
            <el-select v-model="queryForm.operationType" placeholder="运营模式" style="width: 200px">
              <el-option label="A模式" :value="1"></el-option>
              <el-option label="UP模式" :value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-col :span="6">
            <el-form-item label="司机工资类别" label-width="100px">
              <el-select
                v-model="queryForm.driverSalaryType"
                placeholder="类别"
                style="width: 200px"
              >
                <el-option
                  v-for="(item, index) in driverTypeList"
                  :key="index"
                  :label="item.itemvalue"
                  :value="item.itemcode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程状态" label-width="100px">
              <el-select
                v-model="queryForm.flowStatus"
                placeholder="流程状态"
                style="width: 200px"
              >
                <el-option label="初始" value="0"></el-option>
                <el-option label="月薪应发审核中" value="2"></el-option>
                <el-option label="月薪应发审核驳回" value="91"></el-option>
                <el-option label="待提交月薪实发审核" value="3"></el-option>
                <el-option label="月薪实发审核中" value="4"></el-option>
                <el-option label="月薪实发审核驳回" value="92"></el-option>
                <el-option label="待显示app" value="5"></el-option>
                <el-option label="已显示app" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="所属劳务公司" label-width="100px">
              <el-select v-model="queryForm.laborServiceCompanyId" v-loadmore="getCompanyList" placeholder="请选择劳务公司" style="width:200px">
                <el-option v-for="(it, index) in companyList" :key="index" :label="it.label" :value="it.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button
              v-if="hasPermission('monthSalary-query')"
              v-preventReClick="3000"
              type="primary"
              @click="paramSelect"
            >搜索</el-button>
            <el-button
              v-if="hasPermission('monthSalary-query')"
              v-preventReClick="3000"
              type="info"
              @click="reset"
            >重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons export_btn_fl">
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="monthSalary-export"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
      <el-button
        v-if="hasPermission('monthSalary-yingSubmit') && (buttonType == 0 || buttonType == 91 || buttonType == 92)"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleSubmit(3)"
      >提交月薪应发审核</el-button>
      <el-button
        v-if="(buttonType == 0 || buttonType == 91 || buttonType == 92) && hasPermission('monthSalary-preImport')"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(1)"
      >离职司机维护</el-button>
      <el-button
        v-if="buttonType == 3 && hasPermission('monthSalary-afterImport') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(2)"
      >税后补发补扣导入</el-button>
      <el-button
        v-if="buttonType == 3 && hasPermission('monthSalary-socialImport') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(3)"
      >个税社保导入</el-button>
      <el-button
        v-if="buttonType == 3 && hasPermission('monthSalary-businessImport') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(4)"
      >是否核算导入</el-button>
      <el-button
        v-if="buttonType == 3 && hasPermission('monthSalary-actualSubmit') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleSubmit(4)"
      >提交月薪实发审核</el-button>
    </div>
    <!-- <div class="main buttons"> -->
    <!-- <el-button
        type="primary"
        v-preventReClick="3000"
        @click="cancelSubmit()"
        size="small"
        v-if="hasPermission('monthSalary-cancelSubmit') && cancelFlag"
        >取消审核</el-button
      >
      <el-button
        type="primary"
        v-preventReClick="3000"
        @click="showApp()"
        size="small"
        v-if="hasPermission('monthSalary-showApp') && appFlag"
        >APP展示</el-button
      > -->
    <!-- </div> -->
    <approval-modal
      :optionId="optionId"
      :auditBatchType="auditBatchType"
      :auditOptionsType="auditOptionsType"
      @ruleSubmit="approvalSubmit"
    ></approval-modal>
    <batch-import
      v-if="batchInsertVisible"
      :batchInsertVisible="batchInsertVisible"
      :title="title"
      :upLoadType="upLoadType"
      :type="monthTax"
      :importParams="importParams"
      :templateHref="templateHref"
      :importAction="importAction"
      :interface="salaryUploadData"
      @handleSuccessImport="handleSuccessImport"
      @closeDialogHandle="closeDialogHandle"
    ></batch-import>
    <div style="margin-top: 60px">
      <m2-el-table
        :tableData="tableData"
        :columns="columns"
        :pageObj="pageObj"
        :options="options"
        :TotalVal="TotalVal"
        :use-no-total-pagination="true"
        @on-pagesize-change="handleCurrentChange"
        @on-sort-change="sortChange"
        @pagesizeChange="sizeChange"
      >
        <el-table-column
          slot="entryDate"
          label="入职时间"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.entryDate | parseDate}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="司机类型"
          slot="operationType"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.operationType | operationTypeFormatter }}
          </template>
        </el-table-column> -->
        <el-table-column
          slot="driverSalaryType"
          label="司机工资类别"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{SalaryTypeFormatter(scope.row.driverSalaryType)}}
          </template>
        </el-table-column>
        <el-table-column
          slot="salaryAuditFlag"
          label="是否核算"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.salaryAuditFlag | formatFalaryAudit}}
          </template>
        </el-table-column>
        <el-table-column
          slot="flowStatus"
          label="流程状态"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.flowStatus | formatFlowStatus}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="审核状态"
          slot="auditStatus"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.auditStatus | formatFlowStatus }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="状态"
          slot="salaryStatus"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.salaryStatus | formatStatus }}
          </template>
        </el-table-column> -->
        <el-table-column
          slot="totalSurchargeAmount"
          label="附加费合计"
          prop="totalSurchargeAmount"
          min-width="180"
          :sortable="this.month && this.queryForm.cityCode ? true : false"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.totalSurchargeAmount}}
          </template>
        </el-table-column>
        <el-table-column
          slot="totalSalaryPretax"
          label="月应发合计"
          prop="totalSalaryPretax"
          min-width="180"
          :sortable="this.month && this.queryForm.cityCode ? true : false"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.totalSalaryPretax}}
          </template>
        </el-table-column>
        <el-table-column
          slot="action"
          label="操作项"
          min-width="180"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <el-button
              v-if="
                hasPermission('monthSalary-nextSalary') &&
                  scope.row.totalSalary < 0
              "
              size="mini"
              type="text"
              @click="handleNextSalary(scope.row)"
              >下一轮计薪</el-button
            > -->
            <el-button
              v-if="
                hasPermission('monthSalary-edit') &&
                  (scope.row.flowStatus == 0 || scope.row.flowStatus == 91 || scope.row.flowStatus == 92)
              "
              size="mini"
              type="text"
              @click="edit(scope.row)"
            >编辑</el-button>
            <!-- <el-button
              v-if="
                hasPermission('monthSalary-preModify') &&
                  (scope.row.flowStatus == 0 || scope.row.flowStatus == 91 || scope.row.flowStatus == 92)
              "
              size="mini"
              type="text"
              @click="handleSalary(1, scope.row, 1, 3)"
              >税前补发补扣</el-button> -->
            <el-button
              v-if="
                hasPermission('monthSalary-afterModify') &&
                  scope.row.flowStatus == 3
              "
              size="mini"
              type="text"
              @click="handleSalary(2, scope.row, 2, 3)"
            >税后补发补扣</el-button>
            <!-- <el-button
              v-if="
                hasPermission('monthSalary-preDetail')
              "
              size="mini"
              type="text"
              @click="handleSalaryDetail(1, scope.row, 1)"
              >税前补发补扣详情</el-button
            > -->
            <el-button
              v-if="
                hasPermission('monthSalary-afterDetail')
              "
              size="mini"
              type="text"
              @click="handleSalaryDetail(2, scope.row, 2)"
            >税后补发补扣详情</el-button>
            <!-- <el-button
              v-if="
                hasPermission('monthSalary-modify-detail') &&
                  (scope.row.auditStatus !== 0 && scope.row.auditStatus !== 12)
              "
              size="mini"
              type="text"
              @click="handleSalaryDetail(2, scope.row, 1)"
              >税前手工补扣详情</el-button
            >
            <el-button
              v-if="
                hasPermission('monthSalary-modify-detail') &&
                  (scope.row.auditStatus !== 20 && scope.row.auditStatus !== 22)
              "
              size="mini"
              type="text"
              @click="handleSalaryDetail(2, scope.row, 2)"
              >税后手工补扣详情</el-button
            > -->
            <el-button
              v-if="hasPermission('monthSalary-log')"
              size="mini"
              type="text"
              @click="getLogs(String(scope.row.salaryId), scope.row.driverName)"
            >日志</el-button>
          </template>
        </el-table-column>
      </m2-el-table>
    </div>
    <edit
      ref="editForm"
      :editVisiable="editVisiable"
      :totalAmount="totalAmount"
      :salaryId="salaryId"
      @handleSuccessEdit="handleSuccessEdit"
      @closeDialogHandle="closeDialogHandle"
    ></edit>
    <salary-edit
      v-if="showSalaryModal"
      :showSalaryModal="showSalaryModal"
      :title="salaryTitle"
      :salaryData="salaryData"
      :salaryMode="salaryMode"
      :salaryType="salaryType"
      :dateType="dateType"
      @closeDialogHandle="closeDialogHandle"
    ></salary-edit>
    <salary-detail
      v-if="showSalaryDetail"
      :showSalaryDetail="showSalaryDetail"
      :title="salaryDetailTitle"
      :salaryDetailProps="salaryDetailProps"
      :salaryType="salaryType"
      :manualAmount="manualAmount"
      @closeDialogHandle="closeDialogHandle"
    ></salary-detail>
    <logs
      :logVisible="logVisible"
      :logTableData="logTableData"
      :logTotalCount="logTotalCount"
      :currentLog="currentLog"
      :currentId="currentId"
      @closeDialogHandle="closeDialogHandle"
      @handleLogsPage="handleLogsPage"
    ></logs>
  </div>
</template>
<script>
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import salaryDetail from "_o/components/operator-center/salary-modules/common/salaryDetail";
import salaryEdit from "_o/components/operator-center/salary-modules/common/salaryEdit";
import edit from "./edit";
import { columns } from "./fields";
import {
  deleteEmptyProps,
  validatePhoneQuery,
  validateIdCardQuery, getUserIdFromLocalStorage
} from "_o/common/common";
import { parseTime } from "@/libs/util";
import {
  cityListByAll,
  queryCompanyByCity,
  queryWaterMark,
  queryCitiesWithAgent,
  getDicItemByDicCode,
  cancelAudit,
  auditSubmit,
  submitVerify,
  operationLogInfo,
  componyList
} from "_o/api/salary/common";
import {
  getDriverMonthlyWages,
  getNewDriverMonthlyWages,
  monthTotal,
  monthbatchRuleSubmit,
  monthBatchReviewSubmit,
  monthCancelReview,
  deductMoney,
  monthSetAppShow,
  monthbatchRedo,
  salaryUploadData,
  queryFlow,
  queryMonthStatisticalSalary
} from "_o/api/salary/salary";
import {
  queryMonthSalaryList,
  exportMonthSalaryList,
  nextCalculateSalary,
  querySalaryBtnStatus,
  salaryModifyDetail,
  appDisplayMonth
} from "_o/api/salary/salaryRule";
import { objAssignment, toResult } from "_o/common/salaryMixin";
import { excelDownload } from "_o/common/common";
import approvalModal from "../components/approvalModal";
import auditModal from "../components/auditModal";
import batchImport from "../components/driverSalary/index";
import batchAddResult from "_o/components/operator-center/salary-modules/common/batchImportResultWeek";
import addticket from "./addticket"; // 手工扣款
import addbonus from "./addbonus"; // 手工奖励
import { approval } from "../components/index.js";
import config from "@/config/config";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import { isDev } from "@/micro/registerApp/appEntry";
const pageSize = 20;
const currentPath = "/monthlySalary";
export default {
  name: "MonthlySalary",
  components: {
    edit,
    logs,
    salaryDetail,
    exportButton,
    salaryEdit,
    m3elTable,
    approvalModal,
    auditModal,
    batchImport,
    batchAddResult,
    addticket,
    addbonus
  },
  filters: {
    formatFlowStatus(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 2:
          return "月薪应发审核中";
          break;
        case 3:
          return "待提交月薪实发审核";
          break;
        case 4:
          return "月薪实发审核中";
          break;
        case 5:
          return "待显示APP";
          break;
        case 6:
          return "APP已显示";
          break;
        case 91:
          return "月薪应发审核驳回";
          break;
        case 92:
          return "月薪实发审核驳回";
          break;
      }
    },
    formatFalaryAudit(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 1:
          return "是";
          break;
        case 2:
          return "否";
          break;
      }
    },
    formatStatus(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 1:
          return "已计算";
          break;
        case 2:
          return "已传HR财务";
          break;
        case 3:
          return "已发放";
          break;
      }
    },
    parseDate(val) {
      return parseTime(val, "{y}-{m}-{d}");
    },
    operationTypeFormatter(val) {
      switch (val) {
        case 1:
          return "自营司机";
          break;
        case 2:
          return "UP司机";
          break;
      }
    },
    // formatFlowStatus(val) {
    //   switch (val) {
    //     case 0:
    //       return "初始";
    //       break;
    //     case 11:
    //       return "月工资审核中";
    //       break;
    //     case 12:
    //       return "月工资审核驳回";
    //       break;
    //     case 20:
    //       return "待导入个税/社保";
    //       break;
    //     case 23:
    //       return "个税/社保待提交审核";
    //       break;
    //     case 21:
    //       return "个税/社保审核中";
    //       break;
    //     case 22:
    //       return "个税/社保审核驳回";
    //       break;
    //     case 30:
    //       return "个税/社保审核通过";
    //       break;
    //     case 40:
    //       return "已显示APP";
    //       break;
    //   }
    // },
    // formatStatus(val) {
    //   switch (val) {
    //     case 0:
    //       return "初始";
    //       break;
    //     case 1:
    //       return "已计算";
    //       break;
    //     case 2:
    //       return "已传HR财务";
    //       break;
    //     case 3:
    //       return "已发放";
    //       break;
    //   }
    // }
  },
  data() {
    return {
      companyList: [],
      salaryId: "",
      totalAmount: "",
      editVisiable: false,
      salaryMode: 3,
      buttonType: null,
      title: "",
      upLoadType: null,
      salaryUploadData,
      showSalaryDetail: false,
      salaryDetailTitle: "",
      salaryDetailProps: {
        deductionAmountTotal: null,
        reissueAmountTotal: null,
        repairDetailResVoList: []
      },
      manualAmount: 0,
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      currentLog: "",
      currentId: "",
      showSalaryModal: false,
      salaryData: {},
      salaryTitle: "",
      salaryType: 3,
      dateType: "month",
      driverName: "",
      salaryPeriod: "",
      monthTax: "monthTax",
      objAssignment,
      toResult,
      exportLoading: false,
      importParams: {
        cityCode: "",
        salaryIndex: "",
        importType: "",
        salaryType: 3,
        salaryYear: null,
        operationType: "1"
      },
      pageObj: {
        size: 20,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false
      },
      columns,
      ...approval,
      month: "",
      entryDate: "",
      computeTime: "",
      taxAuditTime: "",
      payrollTime: "",
      WaterMarkInfo: "",
      optionId: "",
      auditBatchType: 0,
      auditOptionsType: null,
      userId: getUserIdFromLocalStorage(),
      batchInsertVisible: false,
      submitFlag: false,
      cancelFlag: false,
      appFlag: false,
      taxFlag: false,
      // 导入模板下载链
      templateHref: apiUrl + "/salary-web-api/" + "/downloadExcel/月个税.xlsx",
      // 上传excel的api地址
      importAction: "/api/salary/v1/IncomeTax/uploadData",
      ruleUuid: "",
      queryForm: {
        salaryType: 3,
        orderBy: "DESC",
        sortColumnName: "totalSalaryPretax",
        cityCode: "",
        cityName: "",
        agentUuid: "",
        agentName: "",
        salaryMonth: "",
        operationType: "1"
      },
      tableData: [],
      cities: [],
      agents: [],
      // 绩效薪酬月工资审核/月个税/社保审核参数
      queryData: this.$route.params,
      queryRules: {
        driverMobile: [
          { validator: validatePhoneQuery, trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        driverIdentityCard: [
          { validator: validateIdCardQuery, trigger: "blur" },
          { min: 1, max: 18, message: "长度在 1 到 18 个字符", trigger: "blur" }
        ]
      },
      driverTypeList: [],
      compareTime: false,
      TotalVal: []
    };
  },
  computed: {
    // driverTypeList() {
    //   return this.$store.getters['salary/driverTypeList']
    // }
  },
  watch: {
    tableData: {
      handler(val) {
        if (val.length && this.month && this.queryForm.cityCode) {
          // this.queryBtnStatus(val);
          this.setImport();
        } else {
          this.submitFlag = false;
          this.cancelFlag = false;
          this.appFlag = false;
          this.taxFlag = false;
        }
      }
    },
    "queryForm.cityCode": {
      handler(val) {
        if (!val) {
          this.submitFlag = false;
          this.taxFlag = false;
          this.cancelFlag = false;
          this.appFlag = false;
        }
      }
    },
    month: {
      handler(val) {
        if (val) {
          this.queryForm.year = val.split("-")[0];
          this.queryForm.monthOfYear = val.split("-")[1];
          // this.queryForm.monthOfYear = val.getMonth() + 1;
          // this.weekOrMonth =
          //   this.queryForm.year + "-" + this.queryForm.monthOfYear;
          // console.log(this.weekOrMonth);
        } else {
          this.queryForm.year = "";
          this.queryForm.monthOfYear = "";
        }
      },
      immediate: true
    }
  },
  created() {
    this.getCompanyList();
    this.handlerQueryData();
    this.getCitiesWithAgent();
    // this.getPage({
    //   currPage: this.pageObj.currentPage,
    //   pageSize: this.pageObj.size,
    //   orderBy: "DESC",
    //   sortColumnName: "totalSalaryPretax",
    //   ...this.queryForm
    // });
    this.getWaterMarkInfo();
    this.getDicItemByDicCode();
    this.$store.dispatch("salary/getDicItemByDicCode");
  },
  methods: {
    // 获取劳务公司
    getCompanyList() {
      componyList({ currentPage: this.currentPage, pageSize: this.pageSize }).then(res => {
        if (res.data.success && res.data.data && res.data.data.list) {
          this.currentPage += 1;
          const list = res.data.data.list;
          if (list.length > 0) {
            this.companyList.push(...list);
            this.companyList = this.companyList.map(item => ({
              ...item,
              ...{
                label: item.name,
                value: item.id
              }
            }))
          }
        }
      })
    },
    handleSuccessEdit() {
      this.editVisiable = false;
      this.getPage(this.queryForm);
    },
    edit(row) {
      this.totalAmount = row.totalAmount;
      this.salaryId = row.salaryId;
      this.editVisiable = true;
    },
    async handleSalary(type, row, taxType, salaryMode) {
      let params = {
        salaryId: row.salaryId,
        type: type,
        taxType: taxType
      };
      const [err, data] = await toResult(salaryModifyDetail(params));
      if (err) {
        this.$alert(err.message);
        return;
      }
      if (data.repairDetailResVoList && data.repairDetailResVoList.length) {
        this.$set(this.salaryData, "itemList", data.repairDetailResVoList);
      } else {
        this.$set(this.salaryData, "itemList", [
          {
            itemName: "",
            repairAmount: "",
            taxType: null,
            mark: "",
            salaryId: row.salaryId
          }
        ]);
      }
      if (type === 1) {
        this.salaryTitle = "税前补发补扣项";
        this.salaryType = type;
      } else {
        this.salaryTitle = "税后补发补扣项";
        this.salaryType = type;
      }
      this.salaryData.driverName = row.driverName;
      this.salaryData.salaryId = row.salaryId;
      this.salaryMode = salaryMode;
      console.log("salaryMode", salaryMode)
      let Y = row.yearMonth.substring(0, 4);
      let M = row.yearMonth.substring(4);
      if (M < 10) {
        M = "0" + M;
      }
      this.salaryData.salaryPeriod = Y + "-" + M;
      this.showSalaryModal = true;
    },
    async handleSalaryDetail(type, row, taxType) {
      let mount =  0;
      let params = {
        salaryId: row.salaryId,
        // type: type,
        taxType: taxType
      };
      const [err, data] = await toResult(salaryModifyDetail(params));
      if (err) {
        this.$alert(err.message);
        return;
      }
      if (data) {
        this.salaryDetailProps = data;
      } else {
        this.salaryDetailProps = {
          deductionAmountTotal: null,
          reissueAmountTotal: null,
          repairDetailResVoList: []
        };
      }
      this.showSalaryDetail = true;
      this.salaryType = type;
      // if (data.length > 0) {
      //   data.forEach(it => {
      //     mount += it.repairAmount;
      //   })
      // }
      if (type - 1 === 0) {
        this.salaryDetailTitle = "税前补发补扣";
        // this.manualAmount = mount;
      } else {
        this.salaryDetailTitle = "税后补发补扣";
        // this.manualAmount = mount;
      }
    },
    handleLogsPage(params) {
      this.getLogs(
        params.currentId,
        params.currentLog,
        params.currPage,
        params.pageSize,
        true
      );
    },
    // 根据点中的行的ID获取对应日志信息
    getLogs(id, name, curPage, pageSize, hasOpenLogDialog) {
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      let params = {
        businessId: id,
        businessType: "6",
        currPage: curPage,
        pageSize: pageSize
      };
      operationLogInfo(params)
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.list) {
            this.logTableData = res.data.data.list;
            this.logTotalCount = res.data.data.totalCount;
          } else {
            this.logTableData = [];
            this.logTotalCount = 0;
          }
          if (!hasOpenLogDialog) {
            this.currentId = id;
            this.currentLog = name;
            this.logVisible = true;
          }
        })
        .catch(error => {
          this.logTableData = [];
          this.logTotalCount = 0;
          if (!hasOpenLogDialog) {
            this.currentId = id;
            this.logVisible = true;
          }
        });
    },
    handlerQueryData() {
      if (this.queryData.month && this.queryData.cityCode) {
        this.month = this.queryData.month;
        this.queryForm = deleteEmptyProps({
          ...this.queryForm,
          ...this.queryData
        });
      }
    },
    handleNextSalary(row) {
      this.$confirm("确定将司机本月工资纳入下一轮计薪？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          nextCalculateSalary({ salaryId: row.salaryId })
            .then(res => {
              if (res.data.success) {
                this.$alert("操作成功");
              } else {
                this.$alert(res.data.msg);
              }
            })
            .catch(res => {
              this.$alert("操作失败,请稍后重试");
            });
        })
        .catch(() => {});
    },
    getDicItemByDicCode() {
      getDicItemByDicCode().then(res => {
        if (res.data.success) {
          this.driverTypeList = res.data.data;
        } else {
          this.$message({
            type: "success",
            message: res.data.msg
          });
        }
      });
    },
    closeDialogHandle(type) {
      switch (type) {
        case "batchAdd":
          this.batchInsertVisible = false;
          break;
        case "salaryEdit":
          this.showSalaryModal = false;
          this.getPage(this.queryForm);
          break;
        case "salaryDetail":
          this.showSalaryDetail = false;
          break;
        case "log":
          this.logVisible = false;
          break;
        case "edit":
          this.editVisiable = false;
          break;
        case "confirmDriverImport":
          this.getPage(this.queryForm);
          break;
      }
    },
    async showApp() {
      // let params = {
      //   cityCode: this.queryForm.cityCode,
      //   monthOfYear: this.queryForm.monthOfYear,
      //   year: this.queryForm.year
      // };
      const [err, data] = await toResult(appDisplayMonth(this.queryForm));
      if (err) {
        this.$alert(err.message);
        return;
      }
      this.$alert("操作成功");
      this.getPage(this.queryForm);
    },
    // 打开审核页面
    handleSubmit(type) {
      this.auditOptionsType = type;
      this.audit.visible = true;
    },
    // 取消审核
    // cancelSubmit() {
    //   this.$confirm("确定取消审核吗?", "取消审核", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       cancelAudit({
    //         auditOptionsType: 2,
    //         auditBatchType: this.auditBatchType,
    //         optionId: this.optionId
    //       }).then(res => {
    //         if (res.data.success) {
    //           this.$message({
    //             type: "success",
    //             message: "取消成功!"
    //           });
    //           this.paramSelect();
    //         } else {
    //           this.$message({
    //             type: "error",
    //             message: res.data.msg
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消"
    //       });
    //     });
    // },
    // 提交审核
    async approvalSubmit(params) {
      const [err, data] = await this.toResult(submitVerify(params));
      if (err) {
        this.$confirm(err.message, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            auditSubmit(params).then(res => {
              if (res.data.success) {
                this.audit.visible = false;
                this.$message.success(res.data.msg);
                this.paramSelect();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
            // this.audit.visible = false;
          });
      } else {
        auditSubmit(params).then(res => {
          if (res.data.success) {
            this.audit.visible = false;
            this.$message.success(res.data.msg);
            this.paramSelect();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    SalaryTypeFormatter(val) {
      let str;
      this.driverTypeList.forEach(item => {
        if (val == item.itemcode) {
          str = item.itemvalue;
        }
      });
      return str;
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
    handleCurrentChange(val) {
      this.pageObj.currentPage = Number(val);
      this.queryForm.currPage = Number(val);
      this.queryForm.pageSize = this.pageObj.size;
      this.getPage(this.queryForm);
    },
    // 触发后端对列排序
    sortChange({ column, prop, order }) {
      if (column && prop) {
        this.queryForm.orderBy = order === "descending" ? "DESC" : "ASC";
        if (prop === "createTime") {
          this.queryForm.sortColumnName = "create_time";
        } else if (prop === "age") {
          this.queryForm.sortColumnName = "age";
        }
      } else {
        delete this.queryForm.orderBy;
        delete this.queryForm.sortColumnName;
      }
      if (!this.queryForm.currPage || !this.queryForm.pageSize) {
        this.queryForm.currPage = 1;
        this.queryForm.pageSize = this.pageObj.size;
      }
      this.getPage(deleteEmptyProps(this.queryForm, ["orderBy"]));
    },
    handleStatusCheck() {
      this.month && this.queryForm.cityCode && this.paramSelect();
    },
    getTotalValue() {
      queryMonthStatisticalSalary(deleteEmptyProps({ currPage: this.pageObj.currentPage, pageSize: this.pageObj.size, orderBy: "DESC", sortColumnName: "totalSalaryPretax", ...this.queryForm })).then(res => {
        if (res.data.success) {
          const { deductedLastMonthAmountAfterTaxStat, monthAfterTaxAmountStat, nopaidLastMonthAmountAfterTaxStat, personalIncomeTaxStat, socialSecurityFeeStat, totalSalaryPretaxStat, totalSalaryStat, totalSurchargeAmountStat } = res.data.data;
          this.TotalVal = [
            { label: "月应发合计", value: totalSalaryPretaxStat },
            { label: "附加费合计", value: totalSurchargeAmountStat },
            { label: "上月实发欠款", value: deductedLastMonthAmountAfterTaxStat },
            { label: "上月实发未发金额", value: nopaidLastMonthAmountAfterTaxStat },
            { label: "社保扣款", value: socialSecurityFeeStat },
            { label: "代扣个税", value: personalIncomeTaxStat },
            { label: "月实发金额", value: totalSalaryStat },
            { label: "月工资劳务发放", value: monthAfterTaxAmountStat }
          ]
        }
      })
    },
    async queryBtnStatus(list) {
      this.submitFlag = false;
      this.cancelFlag = false;
      this.taxFlag = false;
      let queryParams = {
        batchType: 4,
        cityCode: this.queryForm.cityCode,
        weekOrMonth: this.month
      };
      const [preErr, preData] = await toResult(querySalaryBtnStatus(queryParams));
      if (preErr) {
        this.$alert(preErr.message);
        return;
      }
      if (preData.batchStatus === 0 || preData.batchStatus === 3) {
        this.optionId = String(preData.id);
        this.submitFlag = true;
        this.auditBatchType = 4;
      }
      if (preData.batchStatus === 1 && preData.applicantUuid == this.userId) {
        this.optionId = String(preData.id);
        this.cancelFlag = true;
        this.auditBatchType = 4;
      }
      queryParams.batchType = 6;
      const [err, data] = await toResult(querySalaryBtnStatus(queryParams));
      if (err) {
        this.$alert(err.message);
        return;
      }
      if (data.batchStatus === 2) {
        this.appFlag = true;
      } else {
        this.appFlag = false;
      }
      if (
        (preData.batchStatus === 2 && data.batchStatus == null) ||
        (preData.batchStatus === 2 &&
          (data.batchStatus === 0 || data.batchStatus === 3))
      ) {
        this.taxFlag = true;
      }
      if (data.batchStatus === 0 || data.batchStatus === 3) {
        this.optionId = String(data.id);
        this.submitFlag = true;
        this.auditBatchType = 6;
      }
      if (data.batchStatus === 1 && data.applicantUuid == this.userId) {
        this.optionId = String(data.id);
        this.cancelFlag = true;
        this.auditBatchType = 6;
      }
    },
    // 获得分页数据并解析
    getPage(params) {
      const { cityCode, monthOfYear } = params;
      if (cityCode == undefined || monthOfYear == undefined) {
        this.$alert("请选择城市与薪酬月份");
        return
      }
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      queryMonthSalaryList(deleteEmptyProps(requestParams))
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            this.tableData = data.data.list;
            this.pageObj.total = data.data.totalCount;
          } else if (!res.data.success) {
            this.$alert(res.data.msg);
          }
        })
        .catch(error => {
          if (this.$route.path == currentPath) {
            this.$alert("获取月工资查询分页数据失败，请稍后再试");
          }
        });
      this.month && this.queryForm.cityCode && this.getTotalValue();
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
            this.queryForm.operatorCode = "";
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
            } else {
              this.handleStatusCheck();
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
    // 带参数查询
    paramSelect() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.pageObj.currentPage = 1;
          this.queryForm.currPage = 1;
          this.queryForm.pageSize = this.pageObj.size;
          this.getPage(deleteEmptyProps(this.queryForm));
        }
      });
    },
    // 重置
    reset() {
      this.queryForm = {
        orderBy: "DESC",
        sortColumnName: "totalSalaryPretax",
        salaryType: 3
      };
      this.month = "";
      this.entryDate = "";
      this.computeTime = "";
      this.taxAuditTime = "";
      this.payrollTime = "";
      this.salaryType = 3;
      this.pageObj.currentPage = 1;
      this.getPage({
        salaryType: 3,
        currPage: 1,
        pageSize: this.pageObj.size,
        orderBy: "DESC",
        sortColumnName: "totalSalaryPretax"
      });
      this.TotalVal = [];
      this.getCitiesWithAgent();
    },
    formatter(row, column, cellValue, index) {
      switch (column.property) {
        case "entryTime":
          return row.entryTime ? parseTime(row.entryTime, "{y}-{m}-{d}") : "-";
        case "computingTime":
          return row.computingTime ? parseTime(row.computingTime) : "-";
        case "hrFinancialTime":
          return row.hrFinancialTime ? parseTime(row.hrFinancialTime) : "-";
        case "grantTime":
          return row.grantTime ? parseTime(row.grantTime) : "-";
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
          !requestParams[propName]
        ) {
          delete requestParams[propName];
        }
      }
      if (Object.keys(requestParams).length === 0 || !requestParams["cityCode"]) {
        this.$alert("请先选择筛选条件");
        return
      } else {
        for (let propName in requestParams) {
          if (
            requestParams.hasOwnProperty(propName) &&
            (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
          ) {
            delete requestParams[propName];
          }
        }
      }
      this.exportLoading = true;
      exportMonthSalaryList(deleteEmptyProps(requestParams)).then(res => {
        excelDownload(res.data, "月工资数据");
      });
    },
    // 导入
    handleImport(importType, salaryIndex) {
      this.importParams = objAssignment(this.queryForm, this.importParams);
      this.importParams.importType = importType;
      if (!this.queryForm.cityCode || !this.queryForm.monthOfYear) {
        this.$alert("请先选择城市和发放月");
      } else {
        // this.importParams.rewardTime = this.queryForm.monthOfYear;
        this.importParams.salaryYear = this.queryForm.year;
        this.importParams.salaryIndex = this.queryForm.monthOfYear;
        this.batchInsertVisible = true;
      }
      this.setExportTitle(importType);
    },
    setImport() {
      console.log(this.queryForm)
      console.log("importParams", this.importParams)
      const p = {
        cityCode: this.queryForm.cityCode,
        salaryIndex: this.queryForm.monthOfYear,
        salaryType: this.queryForm.salaryType,
        salaryYear: this.queryForm.year
      }
      this.getFlowStatus(p);
    },
    async getFlowStatus(params) {
      const [err, data] = await toResult(queryFlow(params));
      if (data) {
        this.buttonType = data.flowStatus;
        this.optionId = String(data.id);
        let now = new Date().getTime();
        let vn = new Date(data.limitDate).getTime();
        this.compareTime = now >= vn;
        return this.compareTime
      }
    },
    setExportTitle(importType) {
      switch (importType) {
        case 1:
          this.title = "离职司机维护";
          this.templateHref = apiUrl + "/salary-web-api/" + "downloadExcel/template_A.xlsx";
          this.upLoadType = importType;
          break;
        case 2:
          this.title = "税后补发补扣导入";
          this.templateHref = apiUrl + "/salary-web-api/" + "downloadExcel/template_B.xlsx";
          this.upLoadType = importType;
          break;
        case 3:
          this.title = "个税社保导入";
          this.templateHref = apiUrl + "/salary-web-api/" + "downloadExcel/template_C.xlsx";
          this.upLoadType = importType;
          break;
        case 4:
          this.title = "是否核算导入";
          this.templateHref = apiUrl + "/salary-web-api/" + "downloadExcel/template_D.xlsx";
          this.upLoadType = importType;
          break;
      }
    },
    handleSuccessImport() {
      this.batchInsertVisible = false;
      this.getPage(this.queryForm);
    },
    sizeChange(v) {
      this.pageObj.currentPage = 1;
      this.pageObj.size = v;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = v;
      this.getPage(this.queryForm);
    },
    handleDateChange(val, flag) {
      if (val) {
        let startDate = new Date(val[0]).getTime();
        let endDate = new Date(val[1]).getTime();
        let dayDiff = endDate - startDate - 86400000 * 92;
        if (dayDiff > 0) {
          this.$alert("时间跨度最多选择92天！");
          if (flag == 1) this.entryDate = "";
          if (flag == 2) this.salaryDay = "";
          if (flag == 3) this.computeTime = "";
          if (flag == 4) this.computeTime = "";
        } else {
          switch (flag) {
            case 1:
              this.queryForm.entryDateStart = val[0];
              this.queryForm.entryDateEnd = val[1];
              break;
            case 2:
              this.queryForm.computeTimeStart = val[0];
              this.queryForm.computeTimeEnd = val[1];
              break;
            case 3:
              this.queryForm.taxAuditTimeStart = val[0];
              this.queryForm.taxAuditTimeEnd = val[1];
              break;
            case 4:
              this.queryForm.payrollTimeStart = val[0];
              this.queryForm.payrollTimeEnd = val[1];
              break;
          }
        }
      } else {
        switch (flag) {
          case 1:
            this.queryForm.entryDateStart = "";
            this.queryForm.entryDateEnd = "";
            break;
          case 2:
            this.queryForm.computeTimeStart = "";
            this.queryForm.computeTimeEnd = "";
            break;
          case 3:
            this.queryForm.taxAuditTimeStart = "";
            this.queryForm.taxAuditTimeEnd = "";
            break;
          case 4:
            this.queryForm.payrollTimeStart = "";
            this.queryForm.payrollTimeEnd = "";
            break;
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selectBar {
  margin: 10px;
}

.main {
  margin-left: 15px;
}
::v-deep .export_btn_fl .el-button{
  margin-right: 10px;
  float: left;
  margin-left: 0;
}
</style>
