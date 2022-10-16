<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-25 14:52:19
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-29 10:57:57
-->
<template>
  <div class="app-container">


    <div class="selectBar">
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
        size="mini"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select
                v-model="queryForm.cityCode"
                placeholder="城市"
                style="width: 200px"
                filterable
                @change="getAreaInfoByCode"
              >
                <el-option label="全部" value="-1"></el-option>
                <template v-for="(cityObj, index) in cities">
                  <el-option
                    :key="index"
                    :label="cityObj.orgName"
                    :value="cityObj.orgCode"
                  ></el-option>
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
              <el-select
                v-model="queryForm.businessType"
                placeholder="产品线"
                style="width: 200px"
                filterable
              >
                <el-option label="全部" value="-1"></el-option>
                <el-option label="出租车" :value="1"></el-option>
                <el-option label="专享" :value="2"></el-option>
                <el-option label="快享" :value="4"></el-option>
                <el-option label="惠享" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则名称" label-width="100px">
              <el-input
                v-model="queryForm.ruleName"
                placeholder="规则名称"
                maxlength="16"
                style="width: 200px"
                @keydown.enter.native="paramSelect"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select
                v-model="queryForm.ruleStatus"
                placeholder="状态"
                style="width: 200px"
              >
                <el-option label="初始" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="启用" value="2"></el-option>
                <el-option label="审核驳回" value="3"></el-option>
                <el-option label="过期" value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="司机工资类别" label-width="100px">
              <el-select
                v-model="queryForm.driverTag"
                placeholder="请选择司机类别"
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
              <el-date-picker
                v-model="queryForm.validBeginTime"
                style="width: 260px"
                type="week"
                placeholder="开始周"
                :format="'yyyy 第 WW 周(' + beginTimeDesc + ')'"
                :picker-options="pickerOptions"
                @change="beginTimeDescFormatter"
              >
              </el-date-picker>
              &nbsp;-&nbsp;
              <el-date-picker
                v-model="queryForm.validEndTime"
                style="width: 260px"
                type="week"
                placeholder="结束周"
                :format="'yyyy 第 WW 周(' + endTimeDesc + ')'"
                :picker-options="pickerOptions"
                @change="endTimeDescFormatter"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button
              v-if="hasPermission('stepPerformance-query')"
              v-preventReClick="3000"
              type="primary"
              @click="paramSelect"
            >搜索</el-button>
            <el-button
              v-if="hasPermission('stepPerformance-query')"
              v-preventReClick="3000"
              type="info"
              @click="initData"
            >重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <el-button
        v-if="hasPermission('stepPerformance-add')"
        v-preventReClick="3000"
        type="primary"
        size="small"
        @click="openAdd"
      >新增规则</el-button>
    </div>
    <div style="margin-top: 60px">
      <m2-el-table
        :tableData="tableData"
        :columns="columns"
        :pageObj="pageObj"
        :options="options"
        @on-pagesize-change="pageSizeChange"
        @on-sort-change="sortChange"
        @pagesizeChange="sizeChange"
      >
        <el-table-column slot="ruleCode" label="业务代码">
          <template slot-scope="scope">
            <span>{{scope.row.ruleCode}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="agentInfoList" label="运营商">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>
                <span v-for="(agent, index) in scope.row.agentInfoList" :key="agent.agentUuid + '_' + index">{{agent.agentName}} {{(index === scope.row.agentInfoList.length - 1) ? '' : ','}} </span>
              </p>
              <div slot="reference" class="operation-wrapper">
                <p>
                  <span v-for="(agent, index) in scope.row.agentInfoList" :key="agent.agentUuid + '_' + index">{{agent.agentName}} {{(index === scope.row.agentInfoList.length - 1) ? '' : ','}} </span>
                </p>
                <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column slot="businessType" label="产品线">
          <template slot-scope="scope">
            <span>{{scope.row.businessType | parseBusinessType}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="businessLines" label="业务线">
          <template slot-scope="scope">
            <span>{{businessTypeFormatter(scope.row.businessLines)}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="operationType" label="运营模式" min-width="120">
          <template slot-scope="scope">
            <span>{{operationTypeFormatter(scope.row.operationType)}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="driverTag" label="司机工资类别" min-width="120">
          <template slot-scope="scope">
            <span>{{SalaryTypeFormatter(scope.row.driverTag)}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="validTime" label="生效时间" min-width="160">
          <template slot-scope="scope">
            {{weekFormatter(scope.row.validBeginTime)}}&nbsp;-&nbsp;{{weekFormatter(scope.row.validEndTime)}}<br />{{scope.row.validBeginTime.substr(0, 10)}}&nbsp;~&nbsp;{{scope.row.validEndTime.substr(0, 10)}}
          </template>
        </el-table-column>
        <el-table-column slot="ruleStatus" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.ruleStatus | parseStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="auditPassedTime" label="审批通过时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.auditPassedTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          slot="action"
          label="操作"
          min-width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                hasPermission('stepPerformance-subExamine') &&
                  (scope.row.ruleStatus == 0 || scope.row.ruleStatus == 3) && userId == scope.row.creatorUuid
              "
              size="small"
              type="text"
              @click="setApproval(scope.row)"
            >
              提交审核</el-button>
            <!-- <el-button
              v-if="
                hasPermission('stepPerformance-cancelExamine') &&
                  scope.row.ruleStatus == 1 && userId == scope.row.creatorUuid
              "
              size="small"
              type="text"
              @click="openCancel(scope.row)"
            >取消审核</el-button>
            <el-button
              v-if="
                hasPermission('stepPerformance-examine') &&
                  scope.row.ruleStatus == 1 &&
                  scope.row.auditorUuid == userId &&
                  scope.row.auditNodeId == scope.row.selectNodeId
              "
              size="small"
              type="text"
              @click="auditChange(scope.row)"
            >审核
            </el-button> -->
            <el-button
              v-if="
                hasPermission('stepPerformance-edit') &&
                  (scope.row.ruleStatus == 0 || scope.row.ruleStatus == 3) && userId == scope.row.creatorUuid
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="
                hasPermission('stepPerformance-stop') &&
                  scope.row.ruleStatus == 2 &&
                  new Date().getTime() <=
                  new Date(scope.row.validEndTime).getTime() && userId == scope.row.creatorUuid
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="changeStatus(scope.row, scope.$index)"
            >停用
            </el-button>
            <el-button
              v-if="hasPermission('stepPerformance-add1')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="replicationRules(scope.row)"
            >复制上周规则</el-button>
            <el-button
              v-if="hasPermission('stepPerformance-detail')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="openDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-if="hasPermission('stepPerformance-delete') && (scope.row.ruleStatus == 0 || scope.row.ruleStatus == 3) && userId == scope.row.creatorUuid"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="deleteRules(scope.row)"
            >删除</el-button>
            <el-button
              v-if="hasPermission('stepPerformance-log')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="getLogs(String(scope.row.id), scope.row.ruleName)"
            >日志</el-button>
          </template>
        </el-table-column>
      </m2-el-table>
    </div>
    <approval-modal
      :ruleUuid="ruleUuid"
      @ruleSubmit="approvalSubmit"
    ></approval-modal>
    <audit-modal
      :ruleUuid="ruleUuid"
      @reviewSubmit="reviewSubmit"
    ></audit-modal>
    <edit
      v-if="editActivityVisible"
      :editVisible="editActivityVisible"
      :editFormData="editForm"
      :title="title"
      :rulesList="rulesList"
      :fixedRewardRulesList="fixedRewardRulesList"
      :isEdit="isEdit"
      :submitType="submitType"
      @successHandle="successHandle"
      @closeDialogHandle="closeDialogHandle"
    ></edit>
    <detail
      v-if="detailVisible"
      :driverTypeList="driverTypeList"
      :detailVisible="detailVisible"
      :detailData="detailData"
      :ruleDetailData="ruleDetailData"
      :fixedAwardData="fixedAwardData"
      @closeDialogHandle="closeDialogHandle"
    ></detail>
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
import edit from "./edit";
import detail from "./detail";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import {
  disableSalaryRules,
  commitReview
} from "_o/api/salary/salary";
import { salaryRulesList, stepPerformanceDetail, deleteStepPerformance } from "_o/api/salary/salaryRule";
import { deleteEmptyProps, getUserIdFromLocalStorage, getYearWeek } from "_o/common/common";
import { parseTime } from "@/libs/util";
import { getCurrSunday } from "_o/common/salaryMixin";
import {
  queryWaterMark,
  queryCitiesWithAgent,
  getAreaInfoByCode,
  auditSubmit,
  passAudit,
  refusedAudit,
  cancelAudit,
  getDicItemByDicCode,
  operationLogInfo
} from "_o/api/salary/common";
import approvalModal from "../components/approvalModal";
import auditModal from "../components/auditModal";
import { approval } from "../components/index.js";
import { editData, columns, businessLineMap } from "./fields";
export default {
  name: "StepPerformancePage",
  components: {
    m3elTable,
    logs,
    approvalModal,
    auditModal,
    edit,
    detail
  },
  filters: {
    parseBusinessType(val) {
      switch (val) {
        case 1:
          return "出租车";
        case 2:
          return "专享";
        case 4:
          return "快享";
        case 6:
          return "惠享";
      }
    },
    parseStatus(val) {
      switch (val) {
        case 0:
          return "初始";
        case 1:
          return "审核中";
        case 2:
          return "启用";
        case 3:
          return "审核驳回";
        case 9:
          return "过期";
      }
    }
  },
  data() {

    return {
      columns,
      businessLineMap,
      submitType: 1, // 新增: 1, // 编辑: 2, // 复制上周规则: 3
      driverTypeList: [],
      WaterMarkInfo: "",
      beginTimeDesc: "",
      endTimeDesc: "",
      userId: getUserIdFromLocalStorage(),
      pickerOptions: {
        firstDayOfWeek: 1
      },
      timeArr: [],
      queryForm: {
        currPage: 1,
        pageSize: 20,
        countryCode: "",
        userUuid: getUserIdFromLocalStorage(),
        isDesc: "true",
        sortColumnName: "create_time"
      },
      tableData: [],
      editActivityVisible: false, // 活动绩效编辑页
      detailVisible: false,
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      pageObj: {
        size: 20,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false
      },
      detailData: {},
      ruleDetailData: [],
      fixedAwardData: [],
      cities: [],
      agents: [],
      areaList: [],
      currCities: [],
      currAgents: [],
      editForm: {
        // operationType: "",
        // agentList: []
      },
      rulesList: [
        {
          orderIntervalEnd: "",
          orderIntervalStart: "",
          rewardValue: ""
        }
      ],
      fixedRewardRulesList: [
        {
          orderIntervalEnd: "",
          orderIntervalStart: "",
          rewardValue: ""
        }
      ],
      title: "",
      currentLog: "",
      currentId: "",
      isEdit: false,
      currentPath: "",
      ruleUuid: "",
      ...approval
    };
  },
  created() {
    this.currentPath = this.$route.path;
    this.getCitiesWithAgent();
    this.getData({
      currPage: 1,
      pageSize: 20,
      userUuid: this.userId,
      isDesc: "true",
      sortColumnName: "create_time"
    });
    this.getWaterMarkInfo();
    this.getDicItemByDicCode();
  },
  methods: {
    getAreaInfoByCode(val) {
      this.queryForm.countryCode = "";
      getAreaInfoByCode({ cityCode: val }).then(res => {
        if (res.data.success) {
          this.areaList = res.data.data;
        }
      });
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
              this.$message({
                type: "success",
                message: "取消成功!"
              });
              this.getData(this.queryForm);
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
    // 提交审核
    approvalSubmit(list) {
      auditSubmit(list).then(res => {
        if (res.data.success) {
          this.audit.visible = false;
          this.$message.success(res.data.msg);
          this.getData(this.queryForm);
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
    // 分页查询
    getData(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
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
          new Date(requestParams.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5,
          "{y}-{m}-{d}"
        );
      }
      if (!requestParams.currPage || !requestParams.pageSize) {
        requestParams.currPage = 1;
        requestParams.pageSize = 20;
      }
      requestParams.ruleType = 2;
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      salaryRulesList(deleteEmptyProps(requestParams))
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.pageObj.total = res.data.data.totalCount;
          } else {
            this.$alert(res.data.msg);
            this.tableData = [];
            this.this.pageObj.total = 0;
          }
        })
        .catch(error => {
          if (this.$route.path == this.currentPath) {
            this.$alert("获取规则分页数据失败，请稍后重试");
          }
        });
    },
    // 触发后端对列排序
    sortChange({ column, prop, order }) {
      if (column && prop) {
        this.queryForm.isDesc = order === "descending";
        if (prop === "createTime") {
          this.queryForm.sortColumnName = "create_time";
        } else if (prop === "validBeginTime") {
          this.queryForm.sortColumnName = "begin_time";
        }
      } else {
        delete this.queryForm.isDesc;
        delete this.queryForm.sortColumnName;
      }
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
    },
    pageSizeChange(v) {
      this.pageObj.currentPage = v;
      this.queryForm.currPage = v;
      this.getData(this.queryForm);
    },
    sizeChange(v) {
      this.pageObj.currentPage = 1;
      this.pageObj.size = v;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = v;
      this.getData(this.queryForm);
    },
    // 开始时间回显包装
    beginTimeDescFormatter(val) {
      if (val) {
        let begin = parseTime(
          new Date(val.getTime() - 1000 * 60 * 60 * 24),
          "{y}-{m}-{d}"
        );
        let end = parseTime(
          new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5),
          "{y}-{m}-{d}"
        );
        this.beginTimeDesc = begin + "~" + end;
      }
    },
    // 结束时间回显包装
    endTimeDescFormatter(val) {
      if (val) {
        let begin = parseTime(
          new Date(val.getTime() - 1000 * 60 * 60 * 24),
          "{y}-{m}-{d}"
        );
        let end = parseTime(
          new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5),
          "{y}-{m}-{d}"
        );
        this.endTimeDesc = begin + "~" + end;
      }
    },
    // 打开详情页
    openDetail(row) {
      stepPerformanceDetail({ ruleId: row.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            this.detailData = data.salaryRuleDto;
            this.detailData.predictRevenue = data.predictRevenue ? data.predictRevenue : 0;
            this.detailData.commissionMode = data.commissionMode;
            this.detailData.statPeriod = data.statPeriod;
            this.detailData.upperThreshold = data.upperThreshold;
            this.ruleDetailData = data.rulesList;
            this.fixedAwardData = data.fixedRewardRulesList;
            this.detailVisible = true;
          } else {
            this.$alert("获取规则详情数据失败，请稍后重试");
          }
        })
        .catch(error => {
          if (this.$route.path == this.currentPath) {
            this.$alert("获取规则详情数据失败，请稍后重试");
          }
        });
    },
    // 提交审核
    commitReview(row, index) {
      commitReview({ uuid: row.uuid, subprocFlag: 1, reviewer: "111" })
        .then(res => {
          if (res.data.success) {
            this.$alert("提交审核成功");
          } else {
            this.$alert(res.data.msg);
          }
        })
        .catch(err => {
          this.$alert("提交审核失败");
        });
    },
    SalaryTypeFormatter(val) {
      let type = this.driverTypeList.find(item => item.itemcode == val);
      return type && type.itemvalue;
    },
    businessTypeFormatter(value) {
      let businessName = "";
      if (value) {
        businessName = value.map(it => {
          if (it === 0) {
            return "全部";
          } else {
            return this.businessLineMap[it]
          }
        }).toString();
      }
      return businessName
    },
    operationTypeFormatter(value) {
      switch (value) {
        case 1:
          return "自营司机";
        case 2:
          return "UP司机";
        default:
          return "";
      }
    },
    // 统一处理弹框关闭
    closeDialogHandle(type) {
      switch (type) {
        case "detail":
          this.detailVisible = false;
          break;
        case "edit":
          this.editActivityVisible = false;
          this.editForm = {};
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
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      let params = {
        businessId: id,
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
            this.currentId = id.toString();
            this.currentLog = name;
            this.logVisible = true;
          }
        })
        .catch(error => {
          this.logTableData = [];
          this.logTotalCount = 0;
          if (!hasOpenLogDialog) {
            this.currentId = id.toString();
            this.logVisible = true;
          }
        });
    },
    // 带参数查询
    paramSelect() {
      this.pageObj.currentPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = this.pageObj.size;
      this.getData(this.queryForm);
    },
    // 初始化数据（重置）
    initData() {
      this.timeArr = [];
      this.beginTimeDesc = "";
      this.endTimeDesc = "";
      this.queryForm = {
        ruleType: 2,
        userUuid: this.userId,
        isDesc: "true",
        sortColumnName: "create_time"
      };
      this.pageObj.currentPage = 1;
      this.getData({
        currPage: 1,
        pageSize: 20,
        ruleType: 2,
        userUuid: this.userId,
        isDesc: "true",
        sortColumnName: "create_time"
      });
    },
    weekFormatter(time) {
      return getYearWeek(time);
    },
    // 打开新增规则窗口
    openAdd() {
      this.isEdit = false;
      this.rulesList = [
        {
          orderIntervalEnd: "",
          orderIntervalStart: "",
          rewardValue: ""
        }
      ];
      this.fixedRewardRulesList = [
        {
          orderIntervalEnd: "",
          orderIntervalStart: "",
          rewardValue: ""
        }
      ];
      this.editForm = JSON.parse(JSON.stringify(editData));
      // this.editForm.agentList = []
      this.title = "新增基本流水抽成规则";
      this.editActivityVisible = true;
      this.submitType = 1;
    },
    // 打开编辑规则窗口
    edit(row) {
      stepPerformanceDetail({ ruleId: row.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            this.editForm = data.salaryRuleDto;
            this.editForm.agentList = data.salaryRuleDto.agentInfoList.map(agent => agent.agentUuid)
            this.editForm.predictRevenue = data.predictRevenue ? data.predictRevenue : 0;
            this.editForm.commissionMode = data.commissionMode;
            this.editForm.commissionRuleId = data.commissionRuleId;
            this.editForm.statPeriod = data.statPeriod;
            this.editForm.upperThreshold = data.upperThreshold;
            this.editForm.countryCode = [this.editForm.countryCode];
            this.editForm.countryName = [this.editForm.countryName];
            this.editForm.orderTypes = [0];
            // this.editForm.driverTagList = [data.driverTag];
            if (res.data.data.predictRevenue == null && res.data.data.salaryRuleDto.operationType === 2) {
              this.editForm.predictRevenue = 0;
            }
            if (data.rulesList && data.rulesList.length) {
              this.rulesList = data.rulesList;
            } else {
              this.rulesList = [
                {
                  orderIntervalEnd: "",
                  orderIntervalStart: "",
                  rewardValue: ""
                }
              ];
            }
            if (data.fixedRewardRulesList && data.fixedRewardRulesList.length) {
              this.fixedRewardRulesList = data.fixedRewardRulesList;
            } else {
              this.fixedRewardRulesList = [
                {
                  orderIntervalEnd: "",
                  orderIntervalStart: "",
                  rewardValue: ""
                }
              ];
            }
            this.isEdit = true;
            this.title = "修改基本流水抽成规则";
            this.editActivityVisible = true;
            this.submitType = 2;
          } else {
            this.$alert(res.data.msg);
          }
        })
        .catch(error => {
          if (this.$route.path == this.currentPath) {
            this.$alert("服务器繁忙，无法获取当前编辑数据的详情，请稍后重试");
          }
        });
    },
    // 复制上周规则
    replicationRules(row) {
      stepPerformanceDetail({ ruleId: row.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            this.editForm = data;
            if (data.rulesList && data.rulesList.length) {
              this.rulesList = data.rulesList;
            }
            this.isEdit = true;
            this.title = "复制上周阶梯绩效工资规则";
            this.editActivityVisible = true;
            this.submitType = 3;
          } else {
            this.$alert("当前修改的规则信息已被清除,请前往新增页面添加相关数据");
          }
        })
        .catch(error => {
          if (this.$route.path == this.currentPath) {
            this.$alert("服务器繁忙，无法获取当前编辑数据的详情，请稍后重试");
          }
        });
    },
    successHandle() {
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
      this.editActivityVisible = false;
      this.$alert(this.isEdit ? "规则修改成功" : "规则新增成功");
    },
    // 切换规则状态
    changeStatus(row, index) {
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
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.msg);
                this.getData(this.queryForm);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              if (this.$route.path === this.currentPath) {
                this.$alert("规则停用失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    },
    // 规则停用场景提示
    stopScene(row) {
      let ruleName; let text; let
        date;
      ruleName = row.ruleName;
      text = "";
      date = new Date();
      if (
        date.getTime() > new Date(row.validBeginTime).getTime() &&
        date.getTime() < new Date(row.validEndTime).getTime()
      ) {
        text =
          "是否停用" +
          row.ruleName +
          "规则? " +
          "此规则将在" +
          getCurrSunday() +
          "后停用";
      } else if (date.getTime() < new Date(row.validBeginTime).getTime()) {
        text = "由于此规则未进行,数据将进行删除处理,是否停用" + ruleName + "?";
      }
      return text;
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({})
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.length === 0) {
              this.$alert("获取开通城市数据信息失败，请刷新页面重试");
            } else {
              this.cities = res.data.data.cities;
            }
          }
        })
        .catch(err => {
          this.$alert("获取数据信息失败，请刷新页面重试");
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-wrapper {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.selectBar {
  margin: 10px;
}

.main {
  margin-left: 15px;
}
</style>
