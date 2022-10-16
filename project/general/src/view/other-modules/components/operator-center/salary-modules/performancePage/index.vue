<template>
  <div class="app-container">



    <div class="selectBar">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
        <el-row>
          <el-form-item label="城市" label-width="100px">
            <el-select v-model="queryForm.cityUuid" placeholder="城市" style="width: 200px" filterable>
              <el-option label="全部" value="-1"></el-option>
              <template v-for="(cityObj, index) in cities">
                <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="业务线" label-width="100px">
            <el-select v-model="queryForm.businessType" placeholder="业务线" style="width: 200px" filterable>
              <el-option label="全部" value="-1"></el-option>
              <el-option label="出租车" :value="1"></el-option>
              <el-option label="专享" :value="2"></el-option>
              <el-option label="快享" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则名称" label-width="100px">
            <el-input v-model="queryForm.ruleName" placeholder="规则名称" maxlength="16" style="width: 200px" @keydown.enter.native="paramSelect"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="100px">
            <el-select v-model="queryForm.ruleStatus" placeholder="状态" style="width: 200px">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
              <el-option label="停用" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生效时间" label-width="100px">
            <el-date-picker
              v-model="queryForm.beginTime"
              style="width: 200px"
              type="week"
              placeholder="开始周"
              :format="'yyyy 第 WW 周(' + beginTimeDesc + ')'"
              :picker-options="pickerOptions"
              @change="beginTimeDescFormatter"
            >
            </el-date-picker>
            &nbsp;-&nbsp;
            <el-date-picker
              v-model="queryForm.endTime"
              style="width: 200px"
              type="week"
              placeholder="结束周"
              :format="'yyyy 第 WW 周(' + endTimeDesc + ')'"
              :picker-options="pickerOptions"
              @change="endTimeDescFormatter"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item style="float: right">
            <el-button v-if="hasPermission('performance-manage-query')" v-preventReClick="3000" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('performance-manage-query')" v-preventReClick="3000" type="info" @click="initData">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <el-button v-if="hasPermission('performance-manage-add')" v-preventReClick="3000" type="primary" size="small" @click="openAdd">新增规则</el-button>
    </div>
    <div style="margin-top: 60px">
      <el-table

        :row-style="{ backgroundColor: 'transparent' }"
        :data="tableData"
        style="width: 100%"
        size="mini"
        :header-cell-style="{ background: '#F5F4F2' }" fit
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ruleCode"
          label="规则代码"
          min-width="110"
        >
        </el-table-column>
        <el-table-column
          prop="ruleName"
          label="规则名称"
          min-width="110"
        >
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="城市"
          min-width="90"
        >
        </el-table-column>
        <el-table-column
          prop="businessType"
          :formatter="businessTypeFormatter"
          label="业务线"
          min-width="110"
        >
        </el-table-column>
        <el-table-column
          prop="beginTime"
          :formatter="timeFormatter"
          min-width="170"
          label="生效时间"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{weekFormatter(scope.row.beginTime)}}&nbsp;-&nbsp;{{weekFormatter(scope.row.endTime)}}<br />({{scope.row.beginTime.substr(0,
                                                                                                                                       10)}}&nbsp;~&nbsp;{{scope.row.endTime.substr(0, 10)}})
          </template>
        </el-table-column>
        <el-table-column
          prop="ruleStatus"
          label="状态"
          min-width="80"
          :formatter="ruleStatusFormatter"
        >
        </el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('performance-manage-edit') && (scope.row.ruleStatus == 3)" v-preventReClick="3000" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('performance-manage-open') && (scope.row.ruleStatus == 3)" v-preventReClick="3000" size="small"
                       type="text" @click="changeStatus(scope.row, scope.$index)"
            >启用
            </el-button>
            <el-button v-if="hasPermission('performance-manage-stop') && (scope.row.ruleStatus == 0)" v-preventReClick="3000" size="small"
                       type="text" @click="changeStatus(scope.row, scope.$index)"
            >停用
            </el-button>
            <el-button v-if="hasPermission('performance-manage-detail')" v-preventReClick="3000" size="small" type="text" @click="openDetail(scope.row.uuid)">详情</el-button>
            <el-button v-if="hasPermission('performance-manage-log')" v-preventReClick="3000" size="small" type="text" @click="getLogs(scope.row.uuid, scope.row.ruleName)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 20px 20px 0 0; float: right"
        :page-size="pageSize"
        :current-page.sync="currPage"
        layout="total, prev, pager, next"
        :total="totalCount"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!--绩效工资-->
    <performance-edit
      v-if="editPerformanceVisible"
      :editVisible="editPerformanceVisible"
      :editForm="editForm"
      :title="title"
      :ruleDataList="ruleDataList"
      :isEdit="isEdit"
      :afterResetCheckBox="afterResetCheckBox"
      @successHandle="successHandle"
      @closeDialogHandle="closeDialogHandle"
    ></performance-edit>

    <performance-detail
      v-if="detailVisible"
      :detailVisible="detailVisible"
      :detailData="detailData"
      @closeDialogHandle="closeDialogHandle"
    ></performance-detail>

    <logs
      :logVisible="logVisible"
      :logTableData="logTableData"
      :logTotalCount="logTotalCount"
      :currentLog="currentLog"
      :currentId="currentId" @closeDialogHandle="closeDialogHandle"
      @handleLogsPage="handleLogsPage"
    ></logs>
  </div>
</template>

<script>
import performanceEdit from "./performanceEdit";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import performanceDetail from "./performanceDetail";
import { getLog } from "_o/api/salary/resume";
import {
  salaryRulePage,
  salaryRuleDetail,
  changeRuleStatus,
  getObjectById,
  commitReview,
  updateAuditStatus,
  unAuditStatus
} from "_o/api/salary/salary";
import { deleteEmptyProps, convertUTCTimeToLocalTime, dateTimeFormat, getMonthLastDay, getYearWeek } from "_o/common/common";
import { parseTime } from "@/libs/util"
import { cityListByAll, queryWaterMark, queryCitiesWithAgent } from "_o/api/salary/common";
export default {
  name: "QrCodePage",
  components: {
    performanceEdit,
    logs,
    performanceDetail,
  },
  data() {
    return {
      WaterMarkInfo: "",
      beginTimeDesc: "",
      endTimeDesc: "",
      pickerOptions: {
        firstDayOfWeek: 1
      },
      queryForm: {
        currPage: 1,
        pageSize: 10,
        isDesc: "true",
        sortColumnName: "create_time",
      },
      tableData: [],
      editPerformanceVisible: false, // 绩效工资编辑页
      detailVisible: false,
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      detailData: {},
      cities: [],
      agents: [],
      currCities: [],
      editForm: {},
      ruleDataList: [],
      afterResetCheckBox: false,
      title: "",
      currentLog: "",
      currentId: "",
      isEdit: false,
      currentPath: "",
    }
  },
  created() {
    this.currentPath = this.$route.path;
    this.getCitiesWithAgent();
    this.getData({
      currPage: 1, pageSize: 10, isDesc: "true",
      sortColumnName: "create_time"
    });
    this.getWaterMarkInfo();
  },
  methods: {
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      }).catch(err => {
        this.$alert("获取水印数据信息失败，请刷新页面重试")
      })
    },
    // 分页查询
    getData(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (requestParams.hasOwnProperty(propName) && Number(requestParams[propName]) === -1) {
          delete requestParams[propName];
        }
      }
      if (requestParams.beginTime && requestParams.beginTime.length > 10) {
        requestParams.beginTime = requestParams.beginTime.substr(0, 10);
      }
      if (requestParams.endTime) {
        requestParams.endTime = parseTime(new Date(requestParams.endTime).getTime() + 1000 * 60 * 60 * 24 * 5, "{y}-{m}-{d}");
      }
      if (!requestParams.currPage || !requestParams.pageSize) {
        requestParams.currPage = 1;
        requestParams.pageSize = 20;
      }
      requestParams.salaryType = 1;
      salaryRulePage(requestParams).then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.totalCount;
        }
      }).catch(error => {
        if (this.$route.path == this.currentPath) {
          this.$alert("获取规则分页数据失败，请稍后重试");
        }
      })
    },
    // 触发后端对列排序
    sortChange({ column, prop, order }) {
      if (column && prop) {
        this.queryForm.isDesc = order === "descending"
        if (prop === "createTime") {
          this.queryForm.sortColumnName = "create_time"
        } else if (prop === "beginTime") {
          this.queryForm.sortColumnName = "begin_time"
        }
      } else {
        delete this.queryForm.isDesc
        delete this.queryForm.sortColumnName
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
    // 开始时间回显包装
    beginTimeDescFormatter(val) {
      if (val) {
        let begin = parseTime(new Date(val.getTime() - 1000 * 60 * 60 * 24), "{y}-{m}-{d}");
        let end = parseTime(new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5), "{y}-{m}-{d}");
        this.beginTimeDesc = begin + "~" + end;
      }
    },
    // 结束时间回显包装
    endTimeDescFormatter(val) {
      if (val) {
        let begin = parseTime(new Date(val.getTime() - 1000 * 60 * 60 * 24), "{y}-{m}-{d}");
        let end = parseTime(new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5), "{y}-{m}-{d}");
        this.endTimeDesc = begin + "~" + end;
      }
    },
    // 打开详情页
    openDetail(id) {
      salaryRuleDetail({ uuid: id }).then(res => {
        if (res.data.success && res.data.data) {
          this.detailData = res.data.data;
          this.detailVisible = true
        }
      }).catch(error => {
        if (this.$route.path == this.currentPath) {
          this.$alert("获取规则详情数据失败，请稍后重试");
        }
      });
    },
    // 提交审核
    commitReview(row, index) {
      commitReview({ uuid: row.uuid, subprocFlag: 1, reviewer: "111" }).then(res => {
        if (res.data.success) {
          this.$alert("提交审核成功");
        } else {
          this.$alert(res.data.msg);
        }
      }).catch(err => {
        this.$alert("提交审核失败");
      })
    },
    // 审核
    updateAuditStatus(row, index) {
      let params = { uuid: row.uuid, subprocFlag: 1, processFlag: 0 };
      switch (row.subprocFlag) {
        // 一审
        case 1:
        case "1":
          params.subprocFlag = 2;
          break;
        case 2:
        case "2":
          params.subprocFlag = 3;
          break;
        case 3:
        case "3":
          params.subprocFlag = 4;
          params.processFlag = 1;
          break;
        default:
      }
      updateAuditStatus(params).then(res => {
        if (res.data.success) {
          this.$alert("审核成功");
        } else {
          this.$alert(res.data.msg);
        }
      }).catch(err => {
        this.$alert("审核失败");
      })
    },
    // 取消审核
    unAuditStatus(row, index) {
      unAuditStatus({ uuid: row.uuid, subprocFlag: 0 }).then(res => {
        if (res.data.success) {
          this.$alert("取消审核成功");
        } else {
          this.$alert(res.data.msg);
        }
      }).catch(err => {
        this.$alert("取消审核失败");
      })
    },

    // 统一处理弹框关闭
    closeDialogHandle(type) {
      switch (type) {
        case "detail":
          this.detailVisible = false;
          break;
        case "edit":
          this.editPerformanceVisible = false;
          this.editForm = {}
          break;
        case "log":
          this.logVisible = false;
          break;
      }
    },
    // 日志分页
    handleLogsPage(params) {
      this.getLogs(params.currentId, params.currentLog, params.currPage, params.pageSize, true);
    },
    // 根据点中的行的ID获取对应日志信息
    getLogs(id, name, curPage, pageSize, hasOpenLogDialog) {
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      getLog({ resumeUuid: id, currPage: curPage, pageSize: pageSize, sortColumnName: "operate_time", isDesc: "true" }).then(res => {
        if (res.data.success && res.data.data && res.data.data.list) {
          this.logTableData = res.data.data.list;
          this.logTotalCount = res.data.data.totalCount;
        } else {
          this.logTableData = [];
          this.logTotalCount = 0;
        }
        if (!hasOpenLogDialog) {
          this.currentId = id
          this.currentLog = name
          this.logVisible = true
        }
      }).catch(error => {
        this.logTableData = [];
        this.logTotalCount = 0;
        if (!hasOpenLogDialog) {
          this.currentId = id;
          this.logVisible = true
        }
      });
    },
    // 带参数查询
    paramSelect() {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      // console.log("after del: %o", this.queryForm);
      this.currPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.getData(this.queryForm);
    },
    // 初始化数据（重置）
    initData() {
      this.timeArr = [];
      this.beginTimeDesc = "";
      this.endTimeDesc = "";
      this.queryForm = {
        isDesc: "true",
        sortColumnName: "create_time"
      };
      this.getData({
        currPage: 1, pageSize: 10, isDesc: "true",
        sortColumnName: "create_time"
      });
    },
    businessTypeFormatter(row) {
      switch (row.businessType) {
        case 1:
          return "出租车";
        case 2:
          return "专享";
        case 6:
          return "包车";
        case 4:
          return "快享";
        default:
          return "未知";
      }
    },
    ruleStatusFormatter(row) {
      switch (row.ruleStatus) {
        case 0:
          return "启用";
        case 1:
          return "无效";
        case 2:
          return "待审核";
        case 3:
          return "停用";
        default:
          return "未知";
      }
    },
    timeFormatter(row) {
      return parseTime(row.createTime);
    },
    timeFormatterInner(time) {
      return parseTime(time, "{y}-{m}-{d}");
    },
    weekFormatter(time) {
      return getYearWeek(time);
    },
    // 打开新增规则窗口
    openAdd() {
      this.isEdit = false;
      this.editForm = {};
      this.title = "新增绩效工资规则";
      this.editPerformanceVisible = true;
    },

    // 打开编辑规则窗口
    edit(row) {
      salaryRuleDetail({ uuid: row.uuid }).then(res => {
        if (res.data.success && res.data.data) {
          let data = res.data.data;
          this.editForm = data;
          this.ruleDataList = data.ruleDataList;
          this.isEdit = true;
          this.title = "修改绩效工资规则";
          this.editPerformanceVisible = true;
        } else {
          this.$alert("当前修改的规则信息已被清除，请前往新增页面添加相关数据");
        }
      }).catch(error => {
        if (this.$route.path == this.currentPath) {
          this.$alert("服务器繁忙，无法获取当前编辑数据的详情，请稍后重试");
        }
      });
    },
    successHandle() {
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
      this.editPerformanceVisible = false;
      this.$alert(this.isEdit ? "规则修改成功" : "规则新增成功");
    },
    // 切换规则状态
    changeStatus(row, index) {
      let operateName = row.ruleStatus == 3 ? "启用" : "停用";
      let toStatus = row.ruleStatus == 3 ? 0 : 3;
      this.$confirm("是否" + operateName + row.ruleName + "规则? " + row.ruleName + "规则将在" + (row.ruleStatus == 3 ? this.timeFormatterInner(row.beginTime) : this.timeFormatterInner(row.endTime)) + "后" + (row.ruleStatus == 3 ? "生效" : "失效"), "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      }).then(() => {
        changeRuleStatus({ uuid: row.uuid, ruleStatus: toStatus, beginTime: row.beginTime, endTime: row.endTime }).then(res => {
          if (res.data.success) {
            this.$set(this.tableData[index], "ruleStatus", toStatus);
            if (this.$route.path === this.currentPath) {
              this.$alert("规则" + operateName + "成功");
            }
          } else {
            if (this.$route.path === this.currentPath) {
              this.$alert(res.data.msg);
            }
          }
        }).catch(error => {
          if (this.$route.path === this.currentPath) {
            this.$alert("规则" + operateName + "失败");
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "操作已取消"
        });
      });
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.cities.length === 0) {
            this.$alert("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      }).catch(err => {
        this.$alert("获取数据信息失败，请刷新页面重试")
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .selectBar {
    margin: 10px;
  }

  .main {
    margin-left: 15px;
  }
</style>
