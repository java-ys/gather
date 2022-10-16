<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-26 11:03:30
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-29 17:10:34
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
          <!-- <el-form-item label="司机档案所属区县" label-width="130px">
            <el-select v-model="queryForm.countryCode" placeholder="司机档案所属区县" style="width: 200px" filterable>
              <template v-for="(areaObj, index) in areaList">
                <el-option :key="index" :label="areaObj.orgName" :value="areaObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>            -->
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
            <el-form-item label="姓名" label-width="110px">
              <el-input
                v-model="queryForm.driverName"
                placeholder="姓名"
                maxlength="32"
                style="width: 200px"
                @keydown.enter.native="paramSelect"
              ></el-input>
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row>
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
          <el-col :span="6">
            <el-form-item label="司机ID" label-width="100px">
              <el-input
                v-model="queryForm.driverCode"
                placeholder="司机ID"
                maxlength="32"
                style="width: 200px"
                @keydown.enter.native="paramSelect"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="奖励周" label-width="110px">
              <el-date-picker
                id="getWeek"
                v-model="week"
                type="week"
                placeholder="选择奖励周"
                style="width: 200px"
                :clearable="false"
                format="yyyy年第WW周"
                :picker-options="pickerOptions"
                @change="handleStatusCheck"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
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
          <!-- <el-form-item label="运营模式" label-width="100px">
            <el-select v-model="queryForm.operationType" placeholder="运营模式" style="width: 200px">
              <el-option label="A模式" :value="1"></el-option>
              <el-option label="UP模式" :value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-col :span="6">
            <el-form-item label="是否核算" label-width="110px">
              <el-select
                v-model="queryForm.salaryAuditFlag"
                placeholder="是否核算"
                style="width: 200px"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="2"></el-option>
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
                <el-option label="应发审核中" value="2"></el-option>
                <el-option label="待实发审核" value="3"></el-option>
                <el-option label="实发审核中" value="4"></el-option>
                <el-option label="应发审核驳回" value="91"></el-option>
                <el-option label="实发审核驳回" value="92"></el-option>
                <el-option label="待显示app" value="5"></el-option>
                <el-option label="已显示app" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否预警" label-width="100px">
              <el-select
                v-model="queryForm.alarmFlag"
                placeholder="状态"
                style="width: 200px"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属劳务公司" label-width="100px">
              <el-select v-model="queryForm.laborServiceCompanyId" v-loadmore="getCompanyList" placeholder="请选择劳务公司" style="width:200px">
                <el-option v-for="(it, index) in companyList" :key="index" :label="it.label" :value="it.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否当周新入职" label-width="110px">
              <el-select
                v-model="queryForm.isFullWeek"
                placeholder="状态"
                style="width: 200px"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
                <el-option label="追加" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button
              v-if="hasPermission('weekReward-modeA-query')"
              v-preventReClick="3000"
              type="primary"
              @click="paramSelect"
            >搜索</el-button>
            <el-button
              v-if="hasPermission('weekReward-modeA-query')"
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
        queryExport="weekReward-modeA-export"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
      <!--      <el-button v-if="hasPermission('weekReward-modeA-export')" v-preventReClick="3000" type="primary" size="small" :disabled="exportLoading" @click="exportExcel">批量导出</el-button>-->
      <!-- 税前补发补扣导入-A司机周工资(importType：1, salaryIndex:1) -->
      <el-button
        v-if="hasPermission('weekReward-modeA-preImport') && (buttonType == 0 || buttonType == 91 || buttonType == 92)"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(1, 1)"
      >离职司机维护</el-button>
      <el-button
        v-if="hasPermission('weekReward-modeA-yingSubmit') && (buttonType == 0 || buttonType == 91 || buttonType == 92)"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleSubmit(3)"
      >提交周应发审核</el-button>
      <!-- 税后补发补扣导入-A司机周工资(importType：2, salaryIndex:1) -->
      <el-button
        v-if="buttonType == 3 && hasPermission('weekReward-modeA-afterImport') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(2, 1)"
      >税后补发补扣导入</el-button>
      <!-- 个税社保导入-A司机周工资(importType：3, salaryIndex:1) -->
      <el-button
        v-if="buttonType == 3 && hasPermission('weekReward-modeA-socialImport') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(3, 1)"
      >个税社保导入</el-button>
      <!-- 是否核算导入-A司机周工资(importType：4, salaryIndex:1) -->
      <el-button
        v-if="buttonType == 3 && hasPermission('weekReward-modeA-businessImport') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleImport(4, 1)"
      >是否核算导入</el-button>
      <el-button
        v-if="buttonType == 3 && hasPermission('weekReward-modeA-actualSubmit') && compareTime"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="handleSubmit(4)"
      >提交周实发审核</el-button>
    </div>
    <!-- <div class="main buttons">
      <el-button
        type="primary"
        v-preventReClick="3000"
        @click="handleSubmit"
        size="small"
        v-if="hasPermission('weekReward-submit') && submitFlag"
        >提交审核</el-button
      >
      <el-button
        type="primary"
        v-preventReClick="3000"
        @click="cancelSubmit"
        size="small"
        v-if="hasPermission('weekReward-cancelSubmit') && cancelFlag"
        >取消审核</el-button
      >
      <el-button
        type="primary"
        v-preventReClick="3000"
        @click="showApp()"
        size="small"
        v-if="hasPermission('weekReward-showApp') && appFlag"
        >APP展示</el-button
      >
    </div> -->
    <div style="margin-top: 60px">
      <m2-el-table
        :tableData="tableData"
        :columns="columns"
        :pageObj="pageObj"
        :options="options"
        :pageSizes="pageSizes"
        :use-no-total-pagination="true"
        :TotalVal="TotalVal"
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
        <el-table-column
          slot="operationType"
          label="运营模式"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.operationType | operationTypeFormatter}}
          </template>
        </el-table-column>
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
            {{ scope.row.auditStatus | formatAuditStatus }}
          </template>
        </el-table-column> -->
        <el-table-column
          slot="alarmFlag"
          label="是否预警"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.alarmFlag | formatAlarmFlag}}
          </template>
        </el-table-column>
        <el-table-column
          slot="alarmResult"
          label="预警结果"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.alarmResult | formatAlarmResult}}
          </template>
        </el-table-column>
        <el-table-column
          slot="isFullWeek"
          label="当周新入职"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.isFullWeek | formatIsFullWeek}}
          </template>
        </el-table-column>
        <el-table-column
          slot="period"
          label="周收入周期"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.period}}
          </template>
        </el-table-column>
        <el-table-column
          slot="performanceGradientAmount"
          label="周基本流水抽成"
          prop="performanceGradientAmount"
          :sortable="this.week && this.queryForm.cityCode ? true : false"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.performanceGradientAmount}}
          </template>
        </el-table-column>
        <el-table-column
          slot="taskBonus"
          label="司机任务奖励"
          prop="taskBonus"
          :sortable="this.week && this.queryForm.cityCode ? true : false"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.taskBonus}}
          </template>
        </el-table-column>
        <el-table-column
          slot="afterCorrectionTotalPretax"
          label="周应发合计"
          prop="afterCorrectionTotalPretax"
          :sortable="this.week && this.queryForm.cityCode ? true : false"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.afterCorrectionTotalPretax}}
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
                hasPermission('weekReward-edit') &&
                  scope.row.alarmFlag == 1 &&
                  (scope.row.auditStatus == 0 || scope.row.auditStatus == 12)
              "
              size="mini"
              type="text"
              @click="handleNormal(scope.row)"
              >正常</el-button
            > -->
            <el-button
              v-if="
                hasPermission('weekReward-modeA-edit') &&
                  (scope.row.flowStatus == 0 || scope.row.flowStatus == 91 || scope.row.flowStatus == 92)
              "
              size="mini"
              type="text"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="hasPermission('weekReward-modeA-log')"
              size="mini"
              type="text"
              @click="getLogs(String(scope.row.salaryId), scope.row.driverName)"
            >日志</el-button>
            <!-- <el-button
              v-if="
                hasPermission('weekReward-modeA-preModify') &&
                  (scope.row.flowStatus == 0 || scope.row.flowStatus == 91 || scope.row.flowStatus == 92)
              "
              size="mini"
              type="text"
              @click="handleSalary(1, scope.row, 1, 1)"
              >税前补发补扣</el-button
            > -->
            <el-button
              v-if="
                hasPermission('weekReward-modeA-afterModify') &&
                  (scope.row.flowStatus == 3)
              "
              size="mini"
              type="text"
              @click="handleSalary(2, scope.row, 2, 1)"
            >税后补发补扣</el-button>

            <!-- <el-button
              v-if="
                hasPermission('weekReward-modeA-preDetail')

              "
              size="mini"
              type="text"
              @click="handleSalaryDetail(1, scope.row, 1)"
              >税前补发补扣详情</el-button
            > -->
            <el-button
              v-if="
                hasPermission('weekReward-modeA-afterDetail')
              "
              size="mini"
              type="text"
              @click="handleSalaryDetail(2, scope.row, 2)"
            >税后补发补扣详情</el-button>
          </template>
        </el-table-column>
      </m2-el-table>
    </div>
    <batch-import
      v-if="batchInsertVisible"
      :batchInsertVisible="batchInsertVisible"
      :title="title"
      :upLoadType="upLoadType"
      :importParams="importParams"
      :templateHref="templateHref"
      :importAction="importAction"
      :interface="salaryUploadData"
      @handleSuccessImport="handleSuccessImport"
      @closeDialogHandle="closeDialogHandle"
    ></batch-import>
    <edit
      ref="editForm"
      :editVisiable="editVisiable"
      :totalAmount="totalAmount"
      :salaryId="salaryId"
      @handleSuccessEdit="handleSuccessEdit"
      @closeDialogHandle="closeDialogHandle"
    ></edit>
    <logs
      :logVisible="logVisible"
      :logTableData="logTableData"
      :logTotalCount="logTotalCount"
      :currentLog="currentLog"
      :currentId="currentId"
      @closeDialogHandle="closeDialogHandle"
      @handleLogsPage="handleLogsPage"
    ></logs>
    <approval-modal
      :optionId="optionId"
      :auditBatchType="auditBatchType"
      :auditOptionsType="auditOptionsType"
      @ruleSubmit="approvalSubmit"
    ></approval-modal>
    <salary-edit
      :showSalaryModal="showSalaryModal"
      :title="salaryTitle"
      :salaryMode="salaryMode"
      :salaryData="salaryData"
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
  </div>
</template>
<script>
import { objAssignment, toResult } from "_o/common/salaryMixin";
import { excelDownload, getUserIdFromLocalStorage } from "_o/common/common";
import edit from "./edit";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import salaryEdit from "_o/components/operator-center/salary-modules/common/salaryEdit";
import salaryDetail from "_o/components/operator-center/salary-modules/common/salaryDetail";
import { columns } from "./fields";
import {
  deleteEmptyProps,
  validatePhoneQuery,
  validateIdCardQuery
} from "_o/common/common";
import { parseTime } from "@/libs/util";
import {
  cityListByAll,
  queryCompanyByCity,
  queryWaterMark,
  queryCitiesWithAgent,
  operationLogInfo,
  cancelAudit,
  auditSubmit,
  submitVerify,
  componyList,
  getAreaInfoByCode, callExportService
} from "_o/api/salary/common";
import {
  getDriverWeeklyBonus,
  batchRuleSubmit,
  batchReviewSubmit,
  cancelReview,
  weekTotal,
  queryDeductMoney,
  deductMoney,
  batchRedo,
  salaryUploadData,
  queryFlow,
  queryWeekStatisticalAward
} from "_o/api/salary/salary";
import {
  queryWeekAwardList,
  exportWeekAwardList,
  editWeekAward,
  querySalaryBtnStatus,
  salaryModifyDetail,
  appDisplayWeek
} from "_o/api/salary/salaryRule";
import { getDriverWeeklyBonusExcel } from "_o/api/salary/exportApi";
import { approval } from "../../components/index.js";
import approvalModal from "../../components/approvalModal";
import batchAddResult from "_o/components/operator-center/salary-modules/common/batchImportResultWeek";
import upload from "../../components/upload";
import auditModal from "../../components/auditModal";
import addticket from "./addticket"; // 手工扣款
import addbonus from "./addbonus"; // 手工奖励
import batchImport from "../../components/driverSalary/index";
import config from "@/config/config";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import { getYearWeek, getTrueYear } from "_o/common/salaryMixin";
import { isDev } from "@/micro/registerApp/appEntry";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
const pageSize = 20;
const currentPath = "/weekReward";
export default {
  name: "modelA",
  components: {
    exportButton,
    salaryDetail,
    logs,
    edit,
    m3elTable,
    approvalModal,
    upload,
    auditModal,
    batchImport,
    addticket,
    addbonus,
    batchAddResult,
    salaryEdit
  },
  filters: {
    formatFlowStatus(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 2:
          return "周收入应发审核中";
          break;
        case 3:
          return "待提交周收入实发审核";
          break;
        case 4:
          return "周收入实发审核中";
          break;
        case 5:
          return "待显示APP";
          break;
        case 6:
          return "APP已显示";
          break;
        case 91:
          return "周收入应发审核驳回";
          break;
        case 92:
          return "周收入实发审核驳回";
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
    operationTypeFormatter(val) {
      switch (val) {
        case 1:
          return "A模式";
          break;
        case 2:
          return "UP模式";
          break;
      }
    },
    // formatAuditStatus(val) {
    //   switch (val) {
    //     case 0:
    //       return "初始";
    //       break;
    //     case 11:
    //       return "周奖励审核中";
    //       break;
    //     case 12:
    //       return "周奖励审核驳回";
    //       break;
    //     case 20:
    //       return "待导入个税";
    //       break;
    //     case 23:
    //       return "个税待提交审核";
    //       break;
    //     case 21:
    //       return "个税审核中";
    //       break;
    //     case 22:
    //       return "个税审核驳回";
    //       break;
    //     case 30:
    //       return "个税审核通过";
    //       break;
    //     case 40:
    //       return "已显示APP";
    //       break;
    //   }
    // },
    formatAlarmFlag(val) {
      switch (val) {
        case 1:
          return "是";
          break;
        case 0:
          return "否";
          break;
      }
    },
    formatAlarmResult(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 1:
          return "正常";
          break;
        case 2:
          return "手工正常";
          break;
      }
    },
    formatIsFullWeek(val) {
      switch (val) {
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
        case 2:
          return "追加";
          break;
      }
    },
    parseDate(val) {
      if (val) {
        return parseTime(val, "{y}-{m}-{d}");
      }
    }
  },
  data() {
    return {
      companyList: [],
      salaryMode: 1,
      title: "",
      salaryUploadData,
      showSalaryDetail: false,
      salaryDetailTitle: "",
      salaryDetailProps: {
        deductionAmountTotal: null,
        reissueAmountTotal: null,
        repairDetailResVoList: []
      },
      pageSizes: [100, 200, 500],
      manualAmount: 0,
      showSalaryModal: false,
      salaryData: {},
      salaryTitle: "",
      salaryType: 1,
      dateType: "week",
      weekTax: "weekTax",
      objAssignment,
      toResult,
      exportLoading: false,
      importParams: {
        cityCode: "",
        firstDayOfWeek: "",
        importType: "",
        salaryType: null,
        operationType: "1"
      },
      pageObj: {
        size: 100,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false
      },
      columns,
      ...approval,
      week: "",
      totalAmount: "",
      entryDate: "",
      computeTime: "",
      taxAuditTime: "",
      payrollTime: "",
      submitFlag: false,
      cancelFlag: false,
      appFlag: false,
      taxFlag: false,
      salaryId: "",
      currentLog: "",
      currentId: "",
      editVisiable: false,
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      batchInsertVisible: false,
      // 导入模板下载链
      templateHref: "",

      // 上传excel的api地址
      importAction: "/api/salary/v1/driverSalary/uploadExcel",
      batchAddResultData: {},
      optionId: "",
      auditBatchType: 0,
      auditOptionsType: null,
      WaterMarkInfo: "",
      queryForm: {
        salaryType: 1,
        operationType: "1",
        orderBy: "DESC",
        sortColumnName: "performanceGradientAmount",
        cityCode: "",
        cityName: "",
        countryCode: "",
        agentUuid: "",
        agentName: ""
      },
      tableData: [],
      cities: [],
      agents: [],
      areaList: [],
      // 绩效薪酬周奖励审核/周个税审核参数
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
      pickerOptions: {
        firstDayOfWeek: 1
      },
      userId: getUserIdFromLocalStorage(),
      buttonType: null,
      upLoadType: null,
      compareTime: false,
      TotalVal: []
    };
  },
  computed: {
    driverTypeList() {
      return this.$store.getters["salary/driverTypeList"];
    }
  },
  watch: {
    tableData: {
      handler(val) {
        if (val.length && this.week && this.queryForm.cityCode) {
          this.setImport();
        } else {
          this.submitFlag = false;
          this.cancelFlag = false;
          this.appFlag = false;
          this.taxFlag = false;
        }
      }
    },
    week: {
      handler(val) {
        if (val) {
          let date = new Date(val.getTime() - 24 * 60 * 60 * 1000);
          this.queryForm.firstDayOfWeek = parseTime(date, "{y}-{m}-{d}");
          this.queryForm.year = date.getFullYear();
        } else {
          this.queryForm.firstDayOfWeek = "";
          this.queryForm.year = "";
        }
      },
      immediate: true
    },
    "queryForm.cityCode": {
      handler(val) {
        if (!val) {
          this.submitFlag = false;
          this.cancelFlag = false;
          this.appFlag = false;
          this.taxFlag = false;
        }
      }
    }
  },
  created() {
    this.getCompanyList();
    this.handlerQueryData();
    this.getCitiesWithAgent();
    // this.getPage(
    //   deleteEmptyProps({
    //     salaryType: 1,
    //     currPage: this.pageObj.currentPage,
    //     pageSize: this.pageObj.size,
    //     orderBy: "DESC",
    //     sortColumnName: "performanceGradientAmount",
    //     ...this.queryForm
    //   })
    // );
    this.getWaterMarkInfo();
    this.$store.dispatch("salary/getDicItemByDicCode");
  },
  methods: {
    getAreaInfoByCode(val) {
      getAreaInfoByCode({ cityCode: val }).then(res => {
        if (res.data.success) {
          this.areaList = res.data.data;
        }
      });
    },
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
    handlerQueryData() {
      if (this.queryData.week && this.queryData.cityCode) {
        this.week = this.queryData.week;
        this.queryForm = { ...this.queryForm, ...this.queryData };
      }
    },
    getTotalValue() {
      queryWeekStatisticalAward(deleteEmptyProps({ salaryType: 1, currPage: this.pageObj.currentPage, pageSize: this.pageObj.size, orderBy: "DESC", sortColumnName: "performanceGradientAmount", ...this.queryForm })).then(res => {
        if (res.data.success) {
          const { afterCorrectionTotalPretaxStat, deductedLastWeekAmountAfterTaxStat, nopaidLastWeekAmountAfterTaxStat, personalIncomeTaxStat, socialSecurityFeeStat, totalAmountStat, weekAfterTaxAmountStat } = res.data.data;
          this.TotalVal = [
            { label: "周应发合计", value: afterCorrectionTotalPretaxStat },
            { label: "上周实发欠款", value: deductedLastWeekAmountAfterTaxStat },
            { label: "上周实发未发", value: nopaidLastWeekAmountAfterTaxStat },
            { label: "社保扣款", value: socialSecurityFeeStat },
            { label: "代扣个税", value: personalIncomeTaxStat },
            { label: "周实发合计", value: totalAmountStat },
            { label: "周劳务发放合计", value: weekAfterTaxAmountStat }
          ]
        }
      })
    },
    edit(row) {
      // this.totalAmount = row.totalAmount;
      this.salaryId = row.salaryId;
      this.editVisiable = true;
    },
    handleNormal(row) {
      this.$confirm(
        "标记为正常状态后，司机周奖励正常发放，是否确定？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        }
      )
        .then(() => {
          editWeekAward({ salaryId: row.salaryId, alarmFlag: 1 })
            .then(res => {
              if (res.data.success) {
                this.$alert("标记正常成功");
                this.getPage(this.queryForm);
              } else {
                this.$alert(res.data.msg);
              }
            })
            .catch(res => {
              this.$alert("标记正常失败,请稍后重试");
            });
        })
        .catch();
    },
    // 根据点中的行的ID获取对应日志信息
    getLogs(id, name, curPage, pageSize, hasOpenLogDialog) {
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      let params = {
        businessId: id,
        businessType: "5",
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
    //  撤销审核
    batchRedoCancel() {
      this.$confirm("确定撤销审核吗?", "撤销审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = JSON.parse(JSON.stringify(this.queryForm));
          params.flowLevel = this.flowLevel;
          batchRedo(params).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "撤销成功"
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
    getWeek(y, m, d) {
      let day1 = new Date(y, parseInt(m) - 1, d);
      let day2 = new Date(y, 0, 1);
      let day = Math.round((day1.valueOf() - day2.valueOf()) / 86400000);
      return Math.ceil((day + (day2.getDay() + 1 - 1)) / 7);
    },
    handleSuccessEdit() {
      this.editVisiable = false;
      this.getPage(this.queryForm);
    },
    // 日志分页
    handleLogsPage(params) {
      this.getLogs(
        params.currentId,
        params.currentLog,
        params.currPage,
        params.pageSize,
        true
      );
    },
    closeDialogHandle(type) {
      switch (type) {
        case "edit":
          this.editVisiable = false;
          break;
        case "batchAdd":
          this.batchInsertVisible = false;
          break;
        case "log":
          this.logVisible = false;
          break;
        case "salaryDetail":
          this.showSalaryDetail = false;
          break;
        case "salaryEdit":
          this.showSalaryModal = false;
          this.getPage(this.queryForm);
          break;
        case "confirmDriverImport":
          this.getPage(this.queryForm);
          break;
      }
    },
    async handleSalaryDetail(type, row, taxType) {
      let mount =  0;
      let params = {
        salaryId: row.salaryId,
        salaryType: 1,
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
    async handleSalary(type, row, taxType, salaryMode) {
      let params = {
        salaryId: row.salaryId,
        type: type,
        salaryType: 1,
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
      } else {
        this.salaryTitle = "税后补发补扣项";
      }
      this.salaryType = type;
      this.salaryMode = salaryMode;
      this.salaryData.salaryId = row.salaryId;
      this.salaryData.driverName = row.driverName;
      this.salaryData.salaryPeriod =
        row.periodBeginTime.substr(0, 10) +
        "-" +
        row.periodEndTime.substr(0, 10);
      this.showSalaryModal = true;
    },
    handleSubmit(type) {
      this.auditOptionsType = type;
      this.audit.visible = true;
    },
    async showApp() {
      // let params = {
      //   cityCode: this.queryForm.cityCode,
      //   firstDayOfWeek: this.queryForm.firstDayOfWeek
      // };
      const [err, data] = await toResult(appDisplayWeek(this.queryForm));
      if (err) {
        this.$alert(err.message);
        return;
      }
      this.$alert("操作成功");
      this.getPage(this.queryForm);
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
        if (prop === "performanceGradientAmount") {
          this.queryForm.sortColumnName = "performanceGradientAmount";
        } else if (prop === "afterCorrectionTotalPretax") {
          this.queryForm.sortColumnName = "afterCorrectionTotalPretax";
        } else if (prop === "taskBonus") {
          this.queryForm.sortColumnName = "taskBonus";
        }
      } else {
        delete this.queryForm.orderBy;
        delete this.queryForm.sortColumnName;
      }
      if (!this.queryForm.currPage || !this.queryForm.pageSize) {
        this.queryForm.currPage = 1;
        this.queryForm.pageSize = this.pageObj.size;
      }
      this.getPage(this.queryForm);
    },
    handleStatusCheck() {
      this.week && this.queryForm.cityCode && this.paramSelect();
    },
    // async queryBtnStatus(list) {
    //   this.submitFlag = false;
    //   this.cancelFlag = false;
    //   this.taxFlag = false;
    //   let queryParams = {
    //     batchType: 3,
    //     cityCode: this.queryForm.cityCode,
    //     weekOrMonth: this.queryForm.firstDayOfWeek
    //   };
    //   const [preErr, preData] = await toResult(
    //     querySalaryBtnStatus(queryParams)
    //   );
    //   if (preErr) {
    //     this.$alert(preErr.message);
    //     return;
    //   }
    //   if (preData.batchStatus === 0 || preData.batchStatus === 3) {
    //     this.optionId = String(preData.id);
    //     this.submitFlag = true;
    //     this.auditBatchType = 3;
    //   }
    //   if (preData.batchStatus === 1 && preData.applicantUuid == this.userId) {
    //     this.optionId = String(preData.id);
    //     this.cancelFlag = true;
    //     this.auditBatchType = 3;
    //   }
    //   queryParams.batchType = 5;
    //   const [err, data] = await toResult(querySalaryBtnStatus(queryParams));
    //   if (err) {
    //     this.$alert(err.message);
    //     return;
    //   }
    //   if (data.batchStatus === 2) {
    //     this.appFlag = true;
    //   } else {
    //     this.appFlag = false;
    //   }
    //   if (
    //     (preData.batchStatus === 2 && data.batchStatus == null) ||
    //     (preData.batchStatus === 2 &&
    //       (data.batchStatus === 0 || data.batchStatus === 3))
    //   ) {
    //     this.taxFlag = true;
    //   }
    //   if (data.batchStatus === 0 || data.batchStatus === 3) {
    //     this.optionId = String(data.id);
    //     this.submitFlag = true;
    //     this.auditBatchType = 5;
    //   }
    //   if (data.batchStatus === 1 && data.applicantUuid == this.userId) {
    //     this.optionId = String(data.id);
    //     this.cancelFlag = true;
    //     this.auditBatchType = 5;
    //   }
    // },
    getAgentName(val) {
      if (val == -1) {
        val = null;
      }
      this.queryForm.countryCode = "";
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
      this.getAreaInfoByCode(val);
    },
    changeValue(value) {
      let obj = {};
      obj = this.agents.find(item => {
        return item.uuid === value; // 筛选出匹配数据
      });
      this.queryForm.agentName = obj ? obj.name : "";
    },
    // 获得分页数据并解析
    getPage(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      queryWeekAwardList(deleteEmptyProps(requestParams))
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
          this.$alert("获取周奖励列表数据失败，请稍后重试");
        });
      // 查询统计值
      this.week && this.queryForm.cityCode && this.getTotalValue();
    },
    // 带参数查询
    paramSelect() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.queryForm = deleteEmptyProps(this.queryForm);
          const { cityCode, firstDayOfWeek } = this.queryForm;
          if (cityCode == undefined || firstDayOfWeek == undefined) {
            this.$alert("请选择城市与奖励周");
            return
          }
          this.pageObj.currentPage = 1;
          this.queryForm.currPage = 1;
          this.queryForm.pageSize = this.pageObj.size;
          this.queryForm.operationType = "1";
          this.getPage(this.queryForm);
        }
      });
    },
    // 重置
    reset() {
      this.queryForm = {
        orderBy: "DESC",
        sortColumnName: "performanceGradientAmount",
        // operationType: 1,
        salaryType: 1
      };
      this.week = "";
      this.entryDate = "";
      this.computeTime = "";
      this.taxAuditTime = "";
      this.payrollTime = "";
      this.pageObj.currentPage = 1;
      this.getPage({
        salaryType: 1,
        operationType: 1,
        currPage: 1,
        pageSize: this.pageObj.size,
        orderBy: "DESC",
        sortColumnName: "performanceGradientAmount"
      });
      this.TotalVal = [];
      this.getCitiesWithAgent();
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导入
    handleImport(importType, salaryIndex) {
      this.importParams = objAssignment(this.queryForm, this.importParams);
      this.importParams.importType = importType;
      if (!this.importParams.cityCode || !this.importParams.firstDayOfWeek) {
        this.$alert("请先选择城市和奖励周");
        return;
      } else {
        // this.importParams.rewardTime = this.queryForm.firstDayOfWeek;
        this.batchInsertVisible = true;
      }
      this.setExportTitle(importType);
    },
    setImport() {
      const p = {
        cityCode: this.queryForm.cityCode,
        firstDayOfWeek: this.queryForm.firstDayOfWeek,
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
    // 导出
    exportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          !requestParams[propName] ||
          propName === "orderBy" ||
          propName === "operationType" ||
          propName === "sortColumnName"
        ) {
          delete requestParams[propName];
        }
      }
      if (Object.keys(requestParams).length === 0 || !requestParams["cityCode"]) {
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
        let exportParams = deleteEmptyProps({ ...this.queryForm, taxType: 1 })
        // 导出任务对应的code枚举
        exportParams.dataExportCode = "odb-driverWeekSalaryReport-A-service"
        callExportService(exportParams).then(res => {
          if (res.data && res.data.code === 200) {
            this.$Message.success("任务创建成功，请在 营运管理/异步导入导出任务查看 页面查看导出结果");
          } else {
            this.$Message.error("操作失败！");
          }
          // eslint-disable-next-line no-return-assign
        }).finally(() => this.exportLoading = false)
        // exportWeekAwardList(deleteEmptyProps({ ...this.queryForm, taxType: 1 })).then(res => {
        //   excelDownload(res.data, "周奖励数据");
        // });
      }
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
