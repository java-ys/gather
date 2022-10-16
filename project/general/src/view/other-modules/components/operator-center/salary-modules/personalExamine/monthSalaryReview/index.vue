<!--
 * @Descritption:
 * @Author: xunzhibin
 * @Date: 2020-07-05
 * @LastEditors: xunzhibin
 * @LastEditTime: 2020-07-05
-->
<template>
  <!-- 月工资应发审核-搜索项 -->
  <div>
    <div class="selectBar">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="薪酬月份" label-width="100px">
              <el-date-picker v-model="dateArr" class="text-width" :clearable="false" type="month" placeholder="请选择">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select v-model="queryForm.cityCode" placeholder="城市" class="text-width" filterable>
                <el-option label="全部" value="-1"></el-option>
                <template v-for="(cityObj, index) in cities">
                  <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提交审核时间" label-width="100px">
              <el-date-picker v-model="auditDateArr" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="text-width" value-format="yyyy-MM-dd" :clearable="false" @change="handleDate('auditDateArr', auditDateArr)"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核时间" label-width="100px">
              <el-date-picker v-model="examineDateArr" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="text-width" value-format="yyyy-MM-dd" :clearable="false" @change="handleDate('examineDateArr', examineDateArr)"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select v-model="queryForm.auditType" placeholder="请选择" class="text-width">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="同意" value="1"></el-option>
                <el-option label="驳回" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="float: right">
            <el-button v-if="hasPermission('monthSalaryReview-manage-query')" v-preventReClick="3000" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('monthSalaryReview-manage-query')" v-preventReClick="3000" type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <export-button :loading="exportLoading" queryExport="monthSalaryReview-manage-export" :queryForm="queryForm" @fatherExport="exportExcel" @loadingStatus="loadingStatus"></export-button>
    </div>
    <!-- 月工资应发审核-列表项 -->
    <div style="tb-mt">
      <el-table v-loading="listLoading" element-loading-text="正在加载" :row-style="{ backgroundColor: 'transparent' }" :data="tableData" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row>
        <el-table-column label="薪酬月份" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime ? scope.row.beginTime.substr(0, 7) : ""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cityName" label="城市" min-width="130"></el-table-column>
        <!-- <el-table-column prop="salaryType" label="运营模式" :formatter="salaryTypeFormatter" min-width="120"></el-table-column> -->
        <el-table-column prop="totalAmount" label="月工资应发总金额" min-width="130"></el-table-column>
        <el-table-column prop="driverCount" label="总人数" min-width="130"></el-table-column>
        <el-table-column prop="apieceAmount" label="人均应发金额" min-width="130"></el-table-column>
        <el-table-column prop="applicantName" label="提交人" min-width="130"></el-table-column>
        <el-table-column prop="applyTime" label="提交审核时间" min-width="150"></el-table-column>
        <el-table-column prop="batchTypes" label="审核类型" min-width="120">
          <template slot-scope="scope">
            {{"月工资应发"}}
          </template>
        </el-table-column>
        <el-table-column prop="auditType" label="状态" :formatter="auditTypeFormatter" min-width="130"></el-table-column>
        <el-table-column prop="auditorName" label="审核人" min-width="130"></el-table-column>
        <el-table-column prop="auditPassedTime" label="审核通过时间" min-width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="140"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="160" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('monthSalaryReview-manage-examine') && scope.row.auditType == 0" size="small" type="text" @click="setApproval(scope.row)">审核</el-button>
            <el-button v-if="hasPermission('monthSalaryReview-manage-detail')" size="small" type="text" @click="getDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <e-pagination :currPage="queryForm.currPage" :pageSize="queryForm.pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>
    </div>
    <!-- 审核 -->
    <!-- <audit-modal :ruleUuid="ruleUuid" @reviewSubmit="reviewSubmit"></audit-modal> -->
    <examine :id="id" :examineVisible="examineVisible" @closeDialogHandle="closeDialogHandle"></examine>

  </div>
</template>

<script>
// import auditModal from "../../components/auditModal";
// import { approval } from "../../components/index.js";
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import examine from "../examine";
import { parseTime } from "@/libs/util";
import { getFirstAndLastDay } from "_o/common/salaryMixin";
import {
  queryCitiesWithJurisdiction,
  queryCitiesWithAgent,
  queryWaterMark,
  passAudit,
  refusedAudit
} from "_o/api/salary/common";
import { deleteEmptyProps, dateTimeFormat, getUserIdFromLocalStorage } from "_o/common/common";
import { excelDownload } from "_o/common/common";
import { getWeekRewardReviewList } from "_o/api/salary/personalExamine";
import { weekRewardExport } from "_o/api/salary/exportApi";
export default {
  name: "monthSalaryReview",
  components: {
    examine,
    EPagination,
    exportButton,
    // auditModal
  },
  data() {
    return {
      queryForm: {
        cityUuid: "", // 城市code
        currPage: 1,
        pageSize: 10,
        queryType: 3
        // batchStatusList: [1, 2],
        // batchTypes: [4],
        // userUuid: this.store.get("userId")
      },
      userId: getUserIdFromLocalStorage(),
      beginTimeDesc: "",
      exportLoading: false,
      dateArr: "", // 奖励周
      beginTime: "",
      endTime: "",
      auditDateArr: [], // 提交审核时间
      examineDateArr: [], // 审核时间
      listLoading: false,
      cities: [], // 城市
      tableData: [], // 列表数据
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      WaterMarkInfo: "", // 水印
      examineVisible: false, // 审核
      ruleUuid: "",
      // ...approval,
      id: null
    };
  },
  watch: {
    dateArr: {
      handler(val) {
        if (val) {
          let dateArr = getFirstAndLastDay(this.dateArr);
          this.queryForm.beginTime = dateArr[0];
          this.queryForm.endTime = dateArr[1];
        }
      },
      immediate: true
    },
    auditDateArr: {
      handler(val) {
        if (val) {
          this.queryForm.auditCreatedTimeStart = this.auditDateArr[0]
            ? parseTime(
              new Date(this.auditDateArr[0]).getTime(),
              "{y}-{m}-{d} 00:00:00"
            )
            : "";
          this.queryForm.auditCreatedTimeEnd = this.auditDateArr[0]
            ? parseTime(
              new Date(this.auditDateArr[1]).getTime(),
              "{y}-{m}-{d} 23:59:59"
            )
            : "";
        }
      },
      immediate: true
    },
    examineDateArr: {
      handler(val) {
        if (val) {
          this.queryForm.auditPassedTimeStart = this.examineDateArr[0]
            ? parseTime(
              new Date(this.examineDateArr[0]).getTime(),
              "{y}-{m}-{d} 00:00:00"
            )
            : "";
          this.queryForm.auditPassedTimeEnd = this.examineDateArr[1]
            ? parseTime(
              new Date(this.examineDateArr[1]).getTime(),
              "{y}-{m}-{d} 23:59:59"
            )
            : "";
        }
      },
      immediate: true
    }
  },
  created() {
    this.getData(this.queryForm);
    this.getCitiesWithAgent();
    this.getWaterMarkInfo();
  },
  methods: {
    salaryTypeFormatter(row) {
      switch (row.salaryType) {
        case 1:
          return "A模式周工资";
          break;
        case 2:
          return "UP模式周工资";
          break;
        case 3:
          return "月工资";
          break;
      }
    },
    // 审核方法
    // reviewSubmit(data) {
    //   let params = {
    //     auditOptionsType: 2,
    //     auditBatchType: 4,
    //     optionId: this.ruleUuid,
    //     remark: data.remark
    //   };
    //   if (data.reviewStatus == "1") {
    //     passAudit(params).then(res => {
    //       this.audit.dialogVisible = false;
    //       if (res.data.success) {
    //         this.$message({
    //           message: "提交成功",
    //           type: "success"
    //         });
    //         this.paramSelect();
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: res.data.msg
    //         });
    //       }
    //     });
    //   }
    //   if (data.reviewStatus == "2") {
    //     refusedAudit(params).then(res => {
    //       this.audit.dialogVisible = false;
    //       if (res.data.success) {
    //         this.$message({
    //           message: "提交成功",
    //           type: "success"
    //         });
    //         this.paramSelect();
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: res.data.msg
    //         });
    //       }
    //     });
    //   }
    // },
    // auditChange(row) {
    //   this.audit.dialogVisible = true;
    //   this.ruleUuid = String(row.id);
    // },
    handleDate(name, value) {
      if (value && value.length > 0) {
        let begin = new Date(value[0]).getTime();
        let end = new Date(value[1]).getTime();
        let day = (end - begin) / (24 * 60 * 60 * 1000) + 1;
        if (day > 92) {
          this.$message.warning("开始时间与结束时间跨度为92天");
          this[name] = [];
        }
      }
    },
    changeCurrent(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.getData(this.queryForm);
    },
    handleSizeChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.pageSize = val;
      this.getData(this.queryForm);
    },
    paramSelect() {
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.getData(this.queryForm);
    },
    reset() {
      this.dateArr = "";
      this.auditDateArr = [];
      this.examineDateArr = [];
      this.queryForm = {
        currPage: 1,
        pageSize: 10,
        queryType: 3
        // userUuid: this.store.get("userId"),
        // batchStatusList: [1, 2],
        // batchTypes: [4]
      };
      this.getData(this.queryForm);
    },
    // 奖励周时间回显包装
    TimeDescFormatter(val) {
      if (val) {
        this.beginTime = parseTime(
          new Date(val.getTime() - 1000 * 60 * 60 * 24),
          "{y}-{m}-{d}"
        );
        this.endTime = parseTime(
          new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5),
          "{y}-{m}-{d}"
        );
        this.beginTimeDesc = this.beginTime + "~" + this.endTime;
      }
    },
    getDetail(row) {
      this.$router.push({
        name: "monthlySalary",
        params: {
          cityCode: row.cityCode,
          cityName: row.cityName,
          year: new Date(row.beginTime).getFullYear(),
          monthOfYear: new Date(row.beginTime).getMonth() + 1,
          month: new Date(row.beginTime.split(" ")[0]).toISOString()
        }
      });
    },
    setApproval(row) {
      this.id = row.id;
      this.examineVisible = true;
    },
    // 获取开通的城市
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.length === 0) {
            this.$message.warning("获取开通城市数据信息失败,请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      });
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 数据导出
    exportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          !requestParams[propName] ||
          propName === "currPage" ||
          propName === "pageSize" ||
          propName === "userUuid" ||
          (requestParams[propName] instanceof Array &&
            requestParams[propName].length >= 0)
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
        weekRewardExport(this.queryForm).then(res => {
          excelDownload(res.data, "月工资应发审核数据信息");
        });
      }
    },
    // 列表水印
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      });
    },
    // 月工资应发列表
    getData(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      this.listLoading = true;
      getWeekRewardReviewList(deleteEmptyProps(requestParams)).then(res => {
        this.listLoading = false;
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.totalCount;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 处理页数跳转
    handleCurrentChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.queryForm.pageSize = this.pageSize;
      this.getData(this.queryForm);
    },
    // 审核类型转换
    batchStatusFormatter(row) {
      if (row.batchTypes == "3") {
        return "周奖励";
      } else if (row.batchTypes == "4") {
        return "月工资";
      } else if (row.batchTypes == "5") {
        return "周个税";
      } else if (row.batchTypes == "6") {
        return "月个税/社保";
      } else if (row.batchTypes == "11") {
        return "周司机服务奖励(税前)";
      } else if (row.batchTypes == "12") {
        return "周营销奖励(税前)";
      } else if (row.batchTypes == "21") {
        return "月司机服务奖励(税前)";
      } else if (row.batchTypes == "22") {
        return "月营销奖励(税前)";
      } else if (row.batchTypes == "23") {
        return "月招募奖励(税前)";
      } else if (row.batchTypes == "31") {
        return "品控扣款(税前)";
      } else if (row.batchTypes == "32") {
        return "风控扣款(税前)";
      } else {
        return "";
      }
    },
    auditTypeFormatter(row) {
      if (row.auditType == 0) {
        return "待审核";
      } else if (row.auditType == 1) {
        return "同意";
      } else if (row.auditType == 2) {
        return "驳回";
      } else {
        return "";
      }
    },
    // 操作项关闭
    closeDialogHandle(type) {
      switch (type) {
        case "weekRewardReview":
          this.examineVisible = false;
          this.getData(this.queryForm);
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.selectBar {
  margin-top: 20px;
}
.text-width {
  width: 200px !important;
}
.main {
  margin-left: 15px;
}
.tb-mt {
  margin-top: 60px;
}
</style>
