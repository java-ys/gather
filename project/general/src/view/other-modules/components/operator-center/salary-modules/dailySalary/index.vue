<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-26 11:03:30
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-30 17:46:03
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
          <el-form-item label="司机姓名" label-width="100px">
            <el-input
              v-model="queryForm.driverName"
              placeholder="请输入"
              maxlength="32"
              clearable
              style="width: 200px"
              @keydown.enter.native="paramSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="司机ID" label-width="100px">
            <el-input
              v-model="queryForm.driverNo"
              placeholder="司机ID"
              maxlength="32"
              clearable
              style="width: 200px"
              @keydown.enter.native="paramSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="城市" label-width="100px">
            <el-select
              v-model="queryForm.cityCode"
              placeholder="城市"
              clearable
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
          <el-form-item label="运营商" label-width="100px">
            <el-select
              v-model="queryForm.agentUuid"
              placeholder="所属组织"
              clearable
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
          <el-form-item label="入职日期" label-width="100px">
            <el-date-picker
              v-model="entryDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 200px"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleDateChange(entryDate, 1)"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计薪日期" label-width="100px">
            <el-date-picker
              v-model="salaryDay"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 200px"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleDateChange(salaryDay, 2)"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计算时间" label-width="100px">
            <el-date-picker
              v-model="computeTime"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 200px"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleDateChange(computeTime, 3)"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button
              v-if="hasPermission('dailySalary-query')"
              v-preventReClick="3000"
              type="primary"
              @click="paramSelect"
            >搜索</el-button>
            <el-button
              v-if="hasPermission('dailySalary-query')"
              v-preventReClick="3000"
              type="info"
              @click="reset"
            >重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="dailySalary-export"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
    </div>
    <div style="margin-top: 60px">
      <m2-el-table
        :tableData="tableData"
        :columns="columns"
        :pageObj="pageObj"
        :options="options"
        @on-pagesize-change="handleCurrentChange"
        @on-sort-change="sortChange"
        @pagesizeChange="sizeChange"
      >
        <el-table-column
          slot="entryDate"
          label="入职日期"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.entryDate | parseDate}}
          </template>
        </el-table-column>
        <el-table-column
          slot="salaryDay"
          label="计薪日期"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.salaryDay | parseDate}}
          </template>
        </el-table-column>
      </m2-el-table>
    </div>
  </div>
</template>
<script>
import { excelDownload, getUserIdFromLocalStorage } from "_o/common/common";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
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
  queryCitiesWithAgent
} from "_o/api/salary/common";
import {
  getDriverWeeklyBonus,
  batchRuleSubmit,
  batchReviewSubmit,
  cancelReview,
  weekTotal,
  queryDeductMoney,
  deductMoney,
  setAppShow,
  batchRedo
} from "_o/api/salary/salary";
import {
  queryWeekAwardList,
  exportWeekAwardList,
  editWeekAward,
  queryDailySalaryList,
  exportDailySalaryList
} from "_o/api/salary/salaryRule";
import { getDriverWeeklyBonusExcel } from "_o/api/salary/exportApi";
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro

const pageSize = 20;
const currentPath = "/weekReward";
export default {
  name: "weekReward",
  components: { m3elTable, exportButton },
  filters: {
    parseDate(val) {
      return parseTime(val, "{y}-{m}-{d}");
    }
  },
  data() {
    return {
      pageObj: {
        size: 20,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false
      },
      columns,
      totalAmount: "",
      salaryId: "",
      currentLog: "",
      currentId: "",
      // 批量导入提示图片数组
      notePictureArr: [{ src: require("@/assets/examTemplate1.png") }],
      // 导入模板下载链
      templateHref:
        apiUrl + "/m2-driver-resume-web/" + "/downloadExcel/周个税导入.xlsx",

      // 上传excel的api地址
      importAction: "/api/v1/driver/performancerule/batchImportInfoForWeek",
      batchAddResultData: {},
      WaterMarkInfo: "",
      queryForm: {
        isDesc: "true",
        sortColumnName: "entry_time",
        driverName: "",
        cityCode: "",
        agentUuid: ""
      },
      entryDate: "",
      salaryDay: "",
      computeTime: "",
      dateArr: [],
      tableData: [],
      cities: [],
      agents: [],
      warnForm: {
        warnReward: "",
        currentYear: ""
      },
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
      grantStateMap: {
        1: "已计算",
        2: "已传HR财务",
        3: "已发放"
      },
      detaiDeductlList: [],
      //  按钮状态
      btnStatus: "",
      processFlag: "",
      flowLevel: "",
      reviewer: "",
      submitter: "",
      prevReviewer: "",
      reviewType1: "",
      reviewType2: "",
      reviewType3: "",
      appShow: "",
      userId: getUserIdFromLocalStorage(),
      btnShow: false,
      exportLoading: false,
      btnShow2: false,
      disabledApp: false,
      salaryStatusList: {
        btnStatus: "",
        flowLevel: "",
        appShow: ""
      }
    };
  },
  created() {
    this.getCitiesWithAgent();
    this.getPage({
      currPage: this.pageObj.currentPage,
      pageSize: this.pageObj.size,
      isDesc: "true",
      sortColumnName: "entry_time"
    });
    this.getWaterMarkInfo();
  },
  methods: {
    edit(row) {
      this.totalAmount = row.totalAmount;
      this.salaryId = row.salaryId;
      this.editVisiable = true;
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
      this.queryForm = deleteEmptyProps(this.queryForm);
      this.queryForm.currPage = Number(val);
      this.queryForm.pageSize = this.pageObj.size;
      this.getPage(this.queryForm);
    },
    sizeChange(v) {
      this.pageObj.currentPage = 1;
      this.pageObj.size = v;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = v;
      this.getPage(this.queryForm);
    },
    // 触发后端对列排序
    sortChange({ column, prop, order }) {
      if (column && prop) {
        this.queryForm.isDesc = order === "descending";
        if (prop === "createTime") {
          this.queryForm.sortColumnName = "create_time";
        } else if (prop === "age") {
          this.queryForm.sortColumnName = "age";
        }
      } else {
        delete this.queryForm.isDesc;
        delete this.queryForm.sortColumnName;
      }
      if (!this.queryForm.currPage || !this.queryForm.pageSize) {
        this.queryForm.currPage = 1;
        this.queryForm.pageSize = this.pageObj.size;
      }
      this.getPage(this.queryForm);
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
      queryDailySalaryList(deleteEmptyProps(requestParams))
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            this.tableData = data.list;
            this.pageObj.total = data.totalCount;
          } else if (!res.data.success) {
            this.$alert(res.data.msg);
          }
        })
        .catch(error => {
          this.$alert("获取日工资查询分页数据失败，请稍后再试");
        });
    },
    // 带参数查询
    paramSelect() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.queryForm = deleteEmptyProps(this.queryForm);
          this.pageObj.currentPage = 1;
          this.queryForm.currPage = 1;
          this.queryForm.pageSize = this.pageObj.size;
          this.getPage(this.queryForm);
        }
      });
    },
    // 重置
    reset() {
      this.queryForm = {
        isDesc: "true",
        sortColumnName: "entry_time"
      };
      this.entryDate = "";
      this.salaryDay = "";
      this.computeTime = "";
      this.pageObj.currentPage = 1;
      this.getPage({
        currPage: 1,
        pageSize: this.pageObj.size,
        isDesc: "true",
        sortColumnName: "entry_time"
      });
      this.getCitiesWithAgent();
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    exportExcel() {
      this.exportLoading = true;
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      requestParams.currPage = 1;
      requestParams.pageSize = 10;
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          Number(requestParams[propName]) === -1
        ) {
          delete requestParams[propName];
        }
      }
      exportDailySalaryList(deleteEmptyProps(requestParams))
        .then(res => {
          // 这里res.data是返回的blob对象
          excelDownload(res.data, "日工资数据");
        })
        .catch(error => {
          delete this.queryForm.excelHeader;
          if (this.$route.path == currentPath) {
            this.$alert("导出excel数据失败，请稍后重试");
          }
        });
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
        } else {
          switch (flag) {
            case 1:
              this.queryForm.entryDateStart = val[0];
              this.queryForm.entryDateEnd = val[1];
              break;
            case 2:
              this.queryForm.salaryDayStart = val[0];
              this.queryForm.salaryDayEnd = val[1];
              break;
            case 3:
              this.queryForm.computeTimeStart = val[0];
              this.queryForm.computeTimeEnd = val[1];
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
            this.queryForm.salaryDayStart = "";
            this.queryForm.salaryDayEnd = "";
            break;
          case 3:
            this.queryForm.computeTimeStart = "";
            this.queryForm.computeTimeEnd = "";
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
</style>
