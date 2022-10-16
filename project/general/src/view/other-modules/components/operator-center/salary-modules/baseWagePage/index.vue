<!--
 * @Descritption:
 * @Author: xunzhibin
 * @Date: 2020-06-25 16:15:04
 * @LastEditors: xunzhibin
 * @LastEditTime: 2020-07-08 15:59:32
-->
<template>
  <div class="app-container app-container-new">


    <!-- 基本工资规则-搜索项 -->
    <div class="selectBar">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select v-model="queryForm.cityCode" placeholder="城市" style="width: 200px" filterable @change="getAreaInfoByCode">
                <el-option label="全部" value="-1"></el-option>
                <template v-for="(cityObj, index) in cities">
                  <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="司机档案所属区县" label-width="130px">
            <el-select v-model="queryForm.countryCode" placeholder="司机档案所属区县" style="width: 200px" filterable>
              <template v-for="(areaObj, index) in areaList">
                <el-option :key="index" :label="areaObj.orgName" :value="areaObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>           -->
          <el-col :span="6">
            <el-form-item label="产品线" label-width="100px">
              <el-select v-model="queryForm.businessType" placeholder="产品线" style="width: 200px" filterable>
                <el-option label="全部" value="-1"></el-option>
                <el-option label="快享" value="4"></el-option>
                <el-option label="专享" value="2"></el-option>
                <el-option label="惠享" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select v-model="queryForm.ruleStatus" placeholder="状态" style="width: 200px">
                <el-option label="初始" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="审核驳回" value="3"></el-option>
                <el-option label="启用" value="2"></el-option>
                <el-option label="过期" value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机工资类别" label-width="100px">
              <el-select v-model="queryForm.driverTag" placeholder="请选择司机类别" style="width: 200px">
                <el-option v-for="(item,index) in driverTypeList" :key="index" :label="item.itemvalue" :value="item.itemcode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="运营模式" label-width="100px">
              <el-select v-model="queryForm.operationType" placeholder="请选择运营模式" style="width: 200px">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="自营司机" :value="1"></el-option>
                <el-option label="UP司机" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效时间" label-width="100px">
              <el-date-picker v-model="queryForm.validBeginTime" type="month" placeholder="开始月份" style="width: 200px" value-format="yyyy-MM-dd">
              </el-date-picker>
              &nbsp;-&nbsp;
              <el-date-picker v-model="queryForm.validEndTime" type="month" placeholder="结束月份" style="width: 200px" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button v-if="hasPermission('baseWage-manage-query')" v-preventReClick="3000" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('baseWage-manage-query')" v-preventReClick="3000" type="info" @click="initData">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <el-button v-if="hasPermission('baseWage-manage-add')" v-preventReClick="3000" type="primary" size="small" @click="openAdd">新增规则</el-button>
    </div>
    <!-- 基本工资规则-列表项 -->
    <div style="margin-top: 60px">
      <el-table
        :row-style="{ backgroundColor: 'transparent' }" :data="tableData" style="width: 100%" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row @sort-change="sortChange"
      >
        <el-table-column prop="ruleCode" label="规则代码" min-width="110">
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称" min-width="110">
        </el-table-column>
        <el-table-column prop="cityName" label="城市" min-width="90">
        </el-table-column>
        <!-- <el-table-column prop="countryName" label="司机档案所属区县" min-width="130">
        </el-table-column>         -->
        <el-table-column label="运营商" min-width="90">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>
                <span v-for="(agent, index) in scope.row.agentInfoList" :key="agent.agentUuid">{{agent.agentName}} {{(index === scope.row.agentInfoList.length - 1) ? '' : ','}} </span>
              </p>
              <div slot="reference" class="operation-wrapper">
                <p>
                  <span v-for="(agent, index) in scope.row.agentInfoList" :key="agent.agentUuid">{{agent.agentName}} {{(index === scope.row.agentInfoList.length - 1) ? '' : ','}} </span>
                </p>
                <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="businessType" :formatter="businessTypeFormatter" label="产品线" min-width="110">
        </el-table-column>
        <el-table-column prop="operationType" :formatter="operationTypeFormatter" label="运营模式" min-width="90">
        </el-table-column>
        <el-table-column prop="driverTag" :formatter="SalaryTypeFormatter" label="司机工资类别" min-width="110">
        </el-table-column>
        <el-table-column prop="validBeginTime" min-width="170" label="生效时间" sortable="custom">
          <template slot-scope="scope">
            <template>
              {{scope.row.validBeginTime ? timeFormatterInner(scope.row.validBeginTime) : ''}}&nbsp;-&nbsp;{{scope.row.validEndTime ? timeFormatterInner(scope.row.validEndTime) : ''}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="ruleStatus" label="状态" min-width="80" :formatter="ruleStatusFormatter">
        </el-table-column>
        <el-table-column prop="auditPassedTime" label="审批通过时间" min-width="170">
        </el-table-column>        
        <el-table-column label="操作" fixed="right" min-width="200" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('baseWage-manage-subExamine') && userId == scope.row.creatorUuid && (scope.row.ruleStatus == 0 && new Date().getTime() <= new Date(scope.row.validEndTime).getTime() || scope.row.ruleStatus == 3 && new Date().getTime() <= new Date(scope.row.validEndTime).getTime())" size="small" type="text" @click="setApproval(scope.row)">
              提交审核</el-button>
            <!-- <el-button v-if="hasPermission('baseWage-manage-cancelExamine') && scope.row.ruleStatus == 1 && userId == scope.row.creatorUuid" size="small" type="text" @click="openCancel(scope.row)">取消审核</el-button>
            <el-button v-if="hasPermission('baseWage-manage-examine') && scope.row.ruleStatus == 1 && scope.row.auditorUuid == userId && scope.row.auditNodeId == scope.row.selectNodeId" size="small" type="text" @click="auditChange(scope.row)">审核
            </el-button> -->
            <el-button v-if="hasPermission('baseWage-manage-edit') && (scope.row.ruleStatus == 0 || scope.row.ruleStatus == 3) && userId == scope.row.creatorUuid" size="small" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="hasPermission('baseWage-manage-stop') && scope.row.ruleStatus == 2 && userId == scope.row.creatorUuid && new Date().getTime() <= new Date(scope.row.validEndTime).getTime()" size="small" type="text" @click="changeStatus(scope.row)">停用
            </el-button>
            <el-button v-if="hasPermission('baseWage-manage-detail')" v-preventReClick="3000" size="small" type="text" @click="openDetail(scope.row.id)">详情
            </el-button>
            <el-button
              v-if="hasPermission('baseWage-manage-delete') && (scope.row.ruleStatus == 0 || scope.row.ruleStatus == 3) && userId == scope.row.creatorUuid"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="deleteRules(scope.row)"
            >删除</el-button>
            <el-button v-if="hasPermission('baseWage-manage-log')" v-preventReClick="3000" size="small" type="text" @click="getLogs(String(scope.row.id), scope.row.ruleName)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination style="margin: 20px 20px 0 0; float: right" :page-size="pageSize" @current-change="handleCurrentChange" :current-page.sync="currPage" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination> -->
      <e-pagination :currPage="queryForm.currPage" :pageSize="queryForm.pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>
    </div>
    <approval-modal :ruleUuid="ruleUuid" @ruleSubmit="approvalSubmit"></approval-modal>
    <audit-modal :ruleUuid="ruleUuid" @reviewSubmit="reviewSubmit"></audit-modal>
    <!--基本工资-编辑-->
    <base-wage-edit v-if="editVisible" ref="baseWageEdit" :editVisible="editVisible" :editForm="editForm" :attendanceForm="attendanceForm" :workForm="workForm" :levelForm="levelForm" :title="title" :isEdit="isEdit" @successHandle="successHandle" @closeDialogHandle="closeDialogHandle"></base-wage-edit>
    <!--基本工资-详情-->
    <base-wage-detail v-if=" detailVisible" :detailVisible="detailVisible" :editForm="editForm" :attendanceForm="attendanceForm" :workForm="workForm" :levelForm="levelForm" :driverTypeList="driverTypeList" @closeDialogHandle="closeDialogHandle"></base-wage-detail>
    <!--基本工资-日志-->
    <logs :logVisible="logVisible" :logTableData="logTableData" :logTotalCount="logTotalCount" :currentLog="currentLog" :currentId="currentId" @closeDialogHandle="closeDialogHandle" @handleLogsPage="handleLogsPage"></logs>
  </div>
</template>

<script>
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import baseWageEdit from "./baseWageEdit";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import baseWageDetail from "./baseWageDetail";
import approvalModal from "../components/approvalModal";
import auditModal from "../components/auditModal";
import {
  salaryRulePage,
  salaryRuleDetail,
  disableSalaryRules
} from "_o/api/salary/salary";
import { deleteStepPerformance } from "_o/api/salary/salaryRule";
import { deleteEmptyProps, getMonthLastDay, getUserIdFromLocalStorage, getYearWeek } from "_o/common/common";
import { parseTime } from "@/libs/util";
import {
  queryWaterMark,
  queryCitiesWithJurisdiction,
  queryCitiesWithAgent,
  getAreaInfoByCode,
  auditSubmit,
  reviewSubmit,
  passAudit,
  refusedAudit,
  cancelAudit,
  getDicItemByDicCode,
  operationLogInfo
} from "_o/api/salary/common";
import { approval } from "../components/index.js";
export default {
  name: "QrCodePage",
  components: {
    baseWageEdit,
    logs,
    baseWageDetail,
    approvalModal,
    auditModal,
    EPagination
  },
  data() {
    return {
      ...approval,
      driverTypeList: [],
      userId: getUserIdFromLocalStorage(),
      WaterMarkInfo: "",
      pickerOptions: {
        firstDayOfWeek: 1
      },
      queryForm: {
        countryCode: "",
        currPage: 1,
        pageSize: 10,
        ruleType: 1,
        userUuid: getUserIdFromLocalStorage(),
        isDesc: "true",
        sortColumnName: "create_time"
      },
      tableData: [],
      editVisible: false, // 基本工资编辑页
      detailVisible: false, // 基本工资详情页
      logVisible: false, // 基本工资日志
      logTableData: [],
      logTotalCount: 0,
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      detailData: {},
      cities: [],
      areaList: [],
      agents: [],
      editForm: {
        ruleCode: "", // 规则代码
        ruleName: "", // 规则名称
        cityCode: "", // 城市
        // appointAgent: 1,
        countryCode: "", // 区县
        // countryName: "",
        businessType: "", // 产品线
        validBeginTime: "", // 生效起始月份
        validEndTime: "", // 生效结束月份
        driverTag: "", // 司机类别
        operationType: "",
        agentList: []
      }, // 基本表单
      attendanceForm: {
        dutySalary: "", // 月考勤工资
        dailyWageStandard: "", // 日薪标准
        absenceDeductStandard: "", // 每天缺勤扣减标准
        absentDeduct: "", // 旷工扣款
        casualLeaveDeduct: "", // 事假扣款
        dutyAbnormalDeduct: "", // 时长未达标扣款
        sickLeaveDeduct: "", // 病假扣款
        marriageLeaveDeduct: "", // 婚嫁扣款
        funeralLeaveDeduct: "", // 丧假扣款
        parentalLeaveDeduct: "", // 陪产假扣款
        maternityLeaveDeduct: "", // 产假扣款
        injuryLeaveDeduct: "", // 工伤扣款
        annualLeaveDeduct: "", // 年假扣款
        accidentDeduct: "" // 事故假扣款
      }, // 考勤工资表单
      workForm: {
        basicSenioritySalary: "", // 基础工龄工资
        seniorityGradSalary: "" // 每年递增标准
      }, // 工龄工资表单
      levelForm: {
        levelRuleDataList: [
          {
            driverLevel: "",
            levelValue: ""
          }
        ]
      }, // 等级工资表单
      title: "",
      currentLog: "",
      currentId: "",
      isEdit: false,
      currentPath: "",
      ruleUuid: ""
    };
  },
  created() {
    this.getCitiesWithAgent();
    this.getData({
      currPage: 1,
      pageSize: 10,
      ruleType: 1,
      userUuid: this.userId,
      isDesc: "true",
      sortColumnName: "create_time"
    });
    this.getWaterMarkInfo();
    this.getDicItemByDicCode();
  },
  methods: {
    deleteRules(row) {
      deleteStepPerformance({ ruleId: row.id }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          this.getData(this.queryForm);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    changeCurrent(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.queryForm.userUuid = this.userId;
      this.queryForm.ruleType = 1;
      this.getData(this.queryForm);
    },
    handleSizeChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.userUuid = this.userId;
      this.queryForm.ruleType = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = val;
      this.getData(this.queryForm);
    },
    getDicItemByDicCode() {
      getDicItemByDicCode().then(res => {
        if (res.data.success) {
          this.driverTypeList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
        }
      });
    },
    auditChange(row) {
      this.audit.dialogVisible = true;
      this.ruleUuid = String(row.id);
    },
    setApproval(row) {
      // this.audit.visible = true;
      // this.ruleUuid = String(row.id);
      const list = { auditOptionsType: 1, optionId: row.id };
      this.$confirm("确定提交至OA审批吗", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"}).then(() => {
        this.approvalSubmit(list);
      })      
    },
    //  取消审核
    openCancel(row) {
      this.$confirm("确定取消审核吗?", "取消审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancelAudit({ auditOptionsType: 1, optionId: row.id }).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.paramSelect();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 提交审核
    approvalSubmit(list) {
      auditSubmit(list).then(res => {
        if (res.data.success) {
          this.audit.visible = false;
          this.$message.success(res.data.msg);
          this.paramSelect();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 审核方法
    reviewSubmit(data) {
      let params = {
        auditOptionsType: 1,
        optionId: this.ruleUuid,
        remark: data.remark
      };
      if (data.reviewStatus == "1") {
        passAudit(params).then(res => {
          this.audit.dialogVisible = false;
          if (res.data.success) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.paramSelect();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        });
      }
      if (data.reviewStatus == "2") {
        refusedAudit(params).then(res => {
          this.audit.dialogVisible = false;
          if (res.data.success) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.paramSelect();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        });
      }
    },
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 分页查询
    getData(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          Number(requestParams[propName]) === -1
        ) {
          delete requestParams[propName];
        }
      }
      if (
        requestParams.validBeginTime &&
        requestParams.validBeginTime.length > 10
      ) {
        requestParams.validBeginTime = requestParams.validBeginTime.substr(
          0,
          10
        );
      }
      if (requestParams.validEndTime) {
        requestParams.validEndTime = parseTime(
          getMonthLastDay(requestParams.validEndTime),
          "{y}-{m}-{d}"
        );
      }
      if (!requestParams.currPage || !requestParams.pageSize) {
        requestParams.currPage = 1;
        requestParams.pageSize = 10;
      }
      salaryRulePage(requestParams).then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.totalCount;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 触发后端对列排序
    sortChange({ column, prop, order }) {
      if (column && prop) {
        this.queryForm.isDesc = order === "descending";
        if (prop === "createTime") {
          this.queryForm.sortColumnName = "create_time";
        } else if (prop === "beginTime") {
          this.queryForm.sortColumnName = "begin_time";
        }
      } else {
        delete this.queryForm.isDesc;
        delete this.queryForm.sortColumnName;
      }
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
    },
    // 处理页数跳转
    handleCurrentChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.queryForm.pageSize = this.pageSize;
      this.getData(this.queryForm);
    },
    // 打开详情页
    openDetail(id) {
      {
        salaryRuleDetail({ ruleId: id })
          .then(res => {
            if (res.data.success && res.data.data) {
              let data = res.data.data;
              let basisSalaryCfgDto = data.basisSalaryCfgDto;
              let salaryRuleDto = data.salaryRuleDto;
              this.editForm = salaryRuleDto;
              this.attendanceForm = this.salaryAssignment(
                basisSalaryCfgDto,
                this.attendanceForm
              );
              this.workForm = this.salaryAssignment(
                basisSalaryCfgDto,
                this.workForm
              );
              if (
                basisSalaryCfgDto.juniorSalary ||
                basisSalaryCfgDto.intermediateSalary ||
                basisSalaryCfgDto.seniorSalary
              ) {
                this.levelForm.levelRuleDataList = [];
              }
              if (basisSalaryCfgDto.juniorSalary) {
                // 初级
                this.levelForm.levelRuleDataList.push({
                  driverLevel: "0",
                  levelValue: basisSalaryCfgDto.juniorSalary
                });
              }
              if (basisSalaryCfgDto.intermediateSalary) {
                // 中级
                this.levelForm.levelRuleDataList.push({
                  driverLevel: "1",
                  levelValue: basisSalaryCfgDto.intermediateSalary
                });
              }
              if (basisSalaryCfgDto.seniorSalary) {
                // 高级
                this.levelForm.levelRuleDataList.push({
                  driverLevel: "2",
                  levelValue: basisSalaryCfgDto.seniorSalary
                });
              }
              this.detailVisible = true;
            }
          })
          .catch(error => {
            if (this.$route.path == this.currentPath) {
              this.$message.warning("获取规则详情数据失败，请稍后重试");
            }
          });
      }
    },
    // 统一处理弹框关闭
    closeDialogHandle(type) {
      switch (type) {
        case "detail":
          this.detailVisible = false;
          break;
        case "edit":
          this.editVisible = false;
          break;
        case "log":
          this.logVisible = false;
          break;
      }
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
    // 根据点中的行的ID获取对应日志信息
    getLogs(id, name, curPage, pageSize, hasOpenLogDialog) {
      let params = {
        businessId: id,
        currPage: curPage ? curPage : 1,
        pageSize: pageSize ? pageSize : 10
      };
      operationLogInfo(params)
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.list) {
            this.logTableData = res.data.data.list;
            this.logTotalCount = res.data.data.totalCount;
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
    // 带参数查询
    paramSelect() {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.currPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.queryForm.ruleType = 1;
      this.queryForm.userUuid = this.userId;
      this.getData(this.queryForm);
    },
    // 初始化数据（重置）
    initData() {
      this.queryForm = {
        isDesc: "true",
        sortColumnName: "create_time"
      };
      this.getData({
        currPage: 1,
        pageSize: 10,
        ruleType: 1,
        userUuid: this.userId,
        isDesc: "true",
        sortColumnName: "create_time"
      });
    },
    businessTypeFormatter(row) {
      switch (row.businessType) {
        case 2:
          return "专享";
        case 4:
          return "快享";
        case 6:
          return "惠享";
        default:
          return "";
      }
    },
    operationTypeFormatter(row) {
      switch (row.operationType) {
        case 1:
          return "自营司机";
        case 2:
          return "UP司机";
        default:
          return "";
      }
    },
    SalaryTypeFormatter(row) {
      let arr = this.driverTypeList.map((item, index) => {
        if (row.driverTag == item.itemcode) {
          return item.itemvalue;
        }
      });
      return arr;
    },
    ruleStatusFormatter(row) {
      if (row.ruleStatus == "0") {
        return "初始";
      } else if (row.ruleStatus == "1") {
        return "审核中";
      } else if (row.ruleStatus == "2") {
        return "启用";
      } else if (row.ruleStatus == "3") {
        return "审核驳回";
      } else if (row.ruleStatus == "9") {
        return "过期";
      }
    },
    timeFormatter(row) {
      return parseTime(row.createTime);
    },
    timeFormatterInner(time) {
      return parseTime(time, "{y}-{m}");
    },
    weekFormatter(time) {
      return getYearWeek(time);
    },
    openAdd() {
      // 打开新增规则窗口
      this.editForm = {
        agentList: [],
        countryCode: ""
        // appointAgent: 1
      }
      this.attendanceForm = {};
      this.workForm = {};
      this.levelForm = {
        levelRuleDataList: [
          {
            driverLevel: "",
            levelValue: ""
          }
        ]
      };
      this.isEdit = false;
      this.title = "新增基本工资规则";
      this.editVisible = true;
    },
    edit(id) {
      // 打开编辑规则窗口
      salaryRuleDetail({ ruleId: id }).then(res => {
        if (res.data.success && res.data.data) {
          this.isEdit = true;
          this.title = "修改基本工资规则";
          this.editVisible = true;
          let data = res.data.data;
          let basisSalaryCfgDto = data.basisSalaryCfgDto;
          let salaryRuleDto = data.salaryRuleDto;
          this.editForm = salaryRuleDto;
          this.editForm.agentList = salaryRuleDto.agentInfoList.map(agent => agent.agentUuid)
          this.attendanceForm = this.salaryAssignment(
            basisSalaryCfgDto,
            this.attendanceForm
          );
          this.workForm = this.salaryAssignment(
            basisSalaryCfgDto,
            this.workForm
          );
          if (
            basisSalaryCfgDto.juniorSalary ||
            basisSalaryCfgDto.intermediateSalary ||
            basisSalaryCfgDto.seniorSalary
          ) {
            this.levelForm.levelRuleDataList = [];
          } else {
            this.levelForm.levelRuleDataList = [
              {
                driverLevel: "",
                levelValue: ""
              }
            ];
          }
          if (basisSalaryCfgDto.juniorSalary) {
            // 初级
            this.levelForm.levelRuleDataList.push({
              driverLevel: "0",
              levelValue: basisSalaryCfgDto.juniorSalary
            });
          }
          if (basisSalaryCfgDto.intermediateSalary) {
            // 中级
            this.levelForm.levelRuleDataList.push({
              driverLevel: "1",
              levelValue: basisSalaryCfgDto.intermediateSalary
            });
          }
          if (basisSalaryCfgDto.seniorSalary) {
            // 高级
            this.levelForm.levelRuleDataList.push({
              driverLevel: "2",
              levelValue: basisSalaryCfgDto.seniorSalary
            });
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 考勤工资/工龄工资/等级工资赋值
    salaryAssignment(basisSalaryCfgDto, salaryTypeForm) {
      for (let i in basisSalaryCfgDto) {
        for (let j in salaryTypeForm) {
          if (i == j) {
            salaryTypeForm[j] = basisSalaryCfgDto[i];
          }
        }
      }
      return salaryTypeForm;
    },
    successHandle() {
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
      this.editVisible = false;
      this.$message.success(this.isEdit ? "规则修改成功" : "规则新增成功");
    },
    // 切换规则状态
    changeStatus(row) {
      this.$confirm(this.stopScene(row), "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          disableSalaryRules({
            ruleId: row.id
          }).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.getData({
                currPage: 1,
                pageSize: 10,
                ruleType: 1,
                userUuid: this.userId,
                isDesc: "true",
                sortColumnName: "create_time"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(error => {
          this.$message.error("取消操作");
        });
    },
    // 基本规则停用场景提示
    stopScene(row) {
      let operateName = row.ruleStatus == 2 ? "停用" : "";
      let ruleName = row.ruleName;
      let text = "";
      if (
        // 当前
        new Date().getTime() > new Date(row.validBeginTime).getTime() &&
        new Date().getTime() < new Date(row.validEndTime).getTime()
      ) {
        text =
          "是否" +
          operateName +
          ruleName +
          "规则? " +
          "规则将在" +
          this.timeFormatterInner(new Date().getTime()) +
          "月最后一天停用";
      } else if (
        new Date().getTime() < new Date(row.validBeginTime).getTime()
      ) {
        text = "由于此规则未进行,数据将进行删除处理,是否停用" + ruleName + "?";
      }
      return text;
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.length === 0) {
            this.$message.error("获取开通城市数据信息失败,请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      });
    },
    getAreaInfoByCode(val) {
      this.queryForm.countryCode = "";
      getAreaInfoByCode({ cityCode: val }).then(res => {
        if (res.data.success) {
          this.areaList = res.data.data;
        }
      });
    }
  }
};
</script>

<style>
.operation-wrapper {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.app-container-new .selectBar {
  margin: 10px;
}
.app-container-new .main {
  margin-left: 15px;
}
.el-message-box__content {
  padding: 20px 15px;
}
.el-message-box__title {
  font-size: 16px;
}
</style>
