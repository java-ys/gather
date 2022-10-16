<template>
  <div class="app-container">


    <div class="selectResume">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select v-model="queryForm.cityCode" placeholder="城市" style="width: 200px" filterable clearable>
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(cityObj, index) in cities" :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务线" label-width="100px">
              <el-select v-model="queryForm.businessType" placeholder="请选择" style="width: 200px" filterable clearable>
                <el-option label="全部" value="-1"></el-option>
                <el-option label="快享" value="4"></el-option>
                <el-option label="专享" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则名称" label-width="100px">
              <el-select v-model="queryForm.ruleName" placeholder="请选择" style="width: 200px" filterable clearable>
                <el-option v-for="(ruleObj, index) in rulesNames" :key="index" :label="ruleObj.label" :value="ruleObj.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select v-model="queryForm.ruleStatus" placeholder="审核状态" style="width: 200px" filterable clearable>
                <el-option label="待生效" value="6"></el-option>
                <el-option label="生效中" value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="司机工资类型" label-width="100px">
              <el-select v-model="queryForm.driverTag" placeholder="司机工资类型" style="width: 200px">
                <el-option v-for="(item,index) in driverTypeList" :key="index" :label="item.itemvalue" :value="item.itemcode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button v-if="hasPermission('salaryWarning-manage-query')" v-preventReClick="3000" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('salaryWarning-manage-query')" v-preventReClick="3000" type="info" @click="initData">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="buttons">
      <el-button v-if="hasPermission('salaryWarning-manage-add')" v-preventReClick="3000" type="primary" size="small" @click="addRule">新增规则</el-button>
    </div>
    <div style="margin-top: 60px">
      <el-table :row-style="{ backgroundColor: 'transparent' }" :data="tableData" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row>
        <el-table-column prop="ruleCode" label="规则编码" min-width="120"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间" min-width="120"></el-table-column>
        <el-table-column prop="ruleName" label="预警规则名称" min-width="120"></el-table-column>
        <el-table-column prop="cityName" label="城市" min-width="120"></el-table-column>
        <el-table-column prop="businessType" :formatter="businessFormatter" label="业务线" min-width="120"></el-table-column>
        <el-table-column prop="driverTag" :formatter="SalaryTypeFormatter" label="司机工资类型" min-width="120"></el-table-column>
        <el-table-column prop="validBeginTime" label="生效时间" min-width="160">
          <template slot-scope="scope">
            <template>
              {{scope.row.validBeginTime ? timeFormatterInner(scope.row.validBeginTime) : ''}}&nbsp;-&nbsp;{{scope.row.validEndTime ? timeFormatterInner(scope.row.validEndTime) : ''}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="ruleStatus" label="状态" :formatter="ruleFormatter" min-width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="160" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('salaryWarning-manage-edit') && scope.row.ruleStatus != 7" size="small" type="text" @click="editRule(scope.row.id)">编辑</el-button>
            <el-button v-if="hasPermission('salaryWarning-manage-detail')" size="small" type="text" @click="getDetail(scope.row.id)">详情</el-button>
            <el-button v-if="hasPermission('salaryWarning-manage-shutDown') && (scope.row.ruleStatus == 7 || scope.row.ruleStatus == 6) && new Date().getTime() <= new Date(scope.row.validEndTime).getTime()" size="small" type="text" @click="shutDown(scope.row)">停用</el-button>
            <el-button v-if="hasPermission('salaryWarning-manage-log')" size="small" type="text" @click="getLogs(String(scope.row.id), scope.row.ruleName)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <e-pagination :currPage="queryForm.currPage" :pageSize="queryForm.pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>
    </div>
    <!-- 薪酬预警-新增 -->
    <add ref="add" :title="title" :addVisible="addVisible" :isEdit="isEdit" :addForm="addForm" @closeDialogHandle="closeDialogHandle" @successHandle="successHandle" />
    <!-- 薪酬预警-详情 -->
    <detail ref="detail" :title="title" :detailVisible="detailVisible" :driverTypeList="driverTypeList" :detailData="detailData" @closeDialogHandle="closeDialogHandle" />
    <!-- 薪酬预警-日志 -->
    <logs :logVisible="logVisible" :logTableData="logTableData" :logTotalCount="logTotalCount" :currentLog="currentLog" :currentId="currentId" @closeDialogHandle="closeDialogHandle" @handleLogsPage="handleLogsPage" />
  </div>
</template>

<script>
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import add from "./add";
import detail from "./detail";
import { deleteEmptyProps, getUserIdFromLocalStorage, validatePhoneQuery } from "_o/common/common";
import { parseTime } from "@/libs/util";
import {
  queryWaterMark,
  queryCitiesWithAgent,
  getDicItemByDicCode,
  operationLogInfo
} from "_o/api/salary/common";
import {
  salaryWarningRulesList,
  salaryWarningRulesDetail,
  disableRules,
  rulesNameList
} from "_o/api/salary/salaryWarning";
import { getLog } from "_o/api/salary/driverFollowUp";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
export default {
  name: "salaryWarningManage",
  components: {
    add,
    detail,
    logs,
    EPagination
  },
  data() {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        ruleType: 4,
        userUuid: getUserIdFromLocalStorage()
      },
      detailData: {},
      addForm: {
        ruleName: "", // 规则名称
        cityCode: "", // 城市code
        driverTag: "", // 司机工资类别
        rewardAlarmThreshold: "", // 预警金额
        rulePeriod: 2, // 奖励维度
        scaleAlarmThreshold: "", // 薪酬流水比例预警值
        validBeginTime: "", // 预警开始时间
        validEndTime: "" // 预警结束时间
      },
      currentDate: "", // 获取当前时间
      driverTypeList: [], // 司机工资类型
      WaterMarkInfo: "", // 水印
      title: "", // 新增/编辑/详情标题
      cities: [],
      rulesNames: [],
      currPage: 1,
      pageSize: 10,
      createTime: [],
      tableData: [],
      totalCount: 0,
      isEdit: false, // 是否编辑
      addVisible: false, // 新增/编辑弹窗
      detailVisible: false, // 详情
      logVisible: false, // 日志
      logTableData: [],
      logTotalCount: 0,
      currentLog: "",
      currentId: ""
    };
  },
  created() {
    this.getCitiesWithAgent();
    this.getData({
      currPage: 1,
      pageSize: 10,
      ruleType: 4,
      userUuid: getUserIdFromLocalStorage()
    });
    this.getWaterMarkInfo();
    this.getDicItemByDicCode();
    this.getRulesNameList();
  },
  methods: {
    changeCurrent(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.getData(this.queryForm);
    },
    handleSizeChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = val;
      this.getData(this.queryForm);
    },
    // 新增
    addRule() {
      this.title = "新增薪酬预警规则";
      this.detailData = {
        ruleName: "", // 规则名称
        cityCode: "", // 城市code
        driverTag: "", // 司机工资类别
        rewardAlarmThreshold: "", // 预警金额
        rulePeriod: 2, // 奖励维度
        scaleAlarmThreshold: "", // 薪酬流水比例预警值
        validBeginTime: "", // 预警开始时间
        validEndTime: "" // 预警结束时间
      };
      this.addVisible = true;
      this.isEdit = false;
    },
    // 编辑
    editRule(id) {
      this.getUpdateData(id);
      this.title = "编辑薪酬预警规则";
      this.addVisible = true;
      this.isEdit = true;
    },
    // 开始/结束生效时间格式转换
    timeFormatterInner(time) {
      return parseTime(time, "{y}-{m}-{d}");
    },
    // 停用
    shutDown(row) {
      this.$confirm(this.stopScene(row), "停用警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          disableRules({
            ruleId: row.id
          }).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.successHandle(this.queryForm);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(error => {
          this.$message.error("取消操作");
        });
    },
    // 薪酬预警停用场景提示
    stopScene(row) {
      let operateName = row.ruleStatus == 7 ? "停用" : "";
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
          "规则将在本周最后一天停用";
      } else if (
        new Date().getTime() < new Date(row.validBeginTime).getTime()
      ) {
        text = "由于此规则未进行,数据将进行删除处理,是否停用" + ruleName + "?";
      }
      return text;
    },
    // 司机工资类别
    getDicItemByDicCode() {
      getDicItemByDicCode().then(res => {
        if (res.data.success) {
          this.driverTypeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 规则名称List
    getRulesNameList() {
      rulesNameList({ ruleType: 4, userUuid: getUserIdFromLocalStorage() }).then(res => {
        if (res.data.success) {
          this.rulesNames = res.data.data;
          this.rulesNames = this.rulesNames.map(item => ({
            label: item,
            value: item
          }));
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 司机工资类别转换
    SalaryTypeFormatter(row) {
      let arr = this.driverTypeList.map((item, index) => {
        if (row.driverTag == item.itemcode) {
          return item.itemvalue;
        }
      });
      return arr;
    },
    getUpdateData(id) {
      salaryWarningRulesDetail({ ruleId: id }).then(res => {
        if (res.data.success && res.data.data) {
          let data = {
            ...res.data.data.salaryWarningDto,
            ...res.data.data.salaryRuleDto
          };
          this.addForm = data;
        }
      });
    },
    // 详情
    getDetail(id) {
      salaryWarningRulesDetail({ ruleId: id }).then(res => {
        if (res.data.success && res.data.data) {
          this.detailVisible = true;
          let data = {
            ...res.data.data.salaryWarningDto,
            ...res.data.data.salaryRuleDto
          };
          this.detailData = data;
        }
      });
    },
    // 水印
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      });
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.cities.length === 0) {
            this.$message.warning("暂无开通城市数据信息，请先联系相关运营人员进行开通城市操作");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      });
    },
    // 业务线状态
    businessFormatter(row) {
      if (row.businessType == "4") {
        return "快享";
      } else if (row.businessType == "2") {
        return "专享";
      } else {
        return "";
      }
    },
    // 是否审核状态
    auditFormatter(row) {
      if (row.auditFlag == "0") {
        return "未审核";
      } else if (row.auditFlag == "1") {
        return "已审核";
      } else {
        return "";
      }
    },
    // 规则状态
    ruleFormatter(row) {
      if (row.ruleStatus == "6") {
        return "待生效";
      } else if (row.ruleStatus == "7") {
        return "生效中";
      } else {
        return "";
      }
    },
    paramSelect() {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.currPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.queryForm.ruleType = 4;
      this.queryForm.userUuid = getUserIdFromLocalStorage();
      this.getData(this.queryForm);
    },
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
      salaryWarningRulesList(requestParams).then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.totalCount;
        } else {
          this.tableData = [];
          this.totalCount = 0;
        }
      });
    },
    successHandle() {
      this.getData(deleteEmptyProps(this.queryForm));
    },
    initData() {
      this.queryForm = {
        currPage: 1,
        pageSize: 10,
        ruleType: 4,
        userUuid: getUserIdFromLocalStorage()
      };
      this.getData(this.queryForm);
      this.getCitiesWithAgent();
      this.getDicItemByDicCode();
    },
    handleCurrentChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.queryForm.pageSize = this.pageSize;
      this.getData(this.queryForm);
    },
    // 操作项关闭
    closeDialogHandle(type) {
      switch (type) {
        case "add":
          this.addVisible = false;
          break;
        case "detail":
          this.detailVisible = false;
          break;
        case "log":
          this.logVisible = false;
      }
    },
    // 根据点中的行的ID获取对应日志信息
    getLogs(id, name, curPage, pageSize) {
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      operationLogInfo({
        businessId: id,
        currPage: curPage,
        pageSize: pageSize
      })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.logTableData = res.data.data.list;
            this.logTotalCount = res.data.data.totalCount;
          } else {
            this.logTableData = [];
            this.logTotalCount = 0;
          }
          if (!this.logVisible) {
            this.currentId = id;
            this.currentLog = name;
            this.logVisible = true;
          }
        })
        .catch(error => {
          this.logTableData = [];
          this.logTotalCount = 0;
          if (!this.logVisible) {
            this.currentId = id;
            this.logVisible = true;
          }
        });
    },
    handleLogsPage(params) {
      this.getLogs(
        params.currentId,
        params.currentLog,
        params.currPage,
        params.pageSize,
        true
      );
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  margin-top: 15px;
}

.tophr {
  height: 1px;
  background-color: #eef1f6;
  border: none;
  margin: 20px 0px;
}

.pagination-container {
  text-align: right;
}
</style>
