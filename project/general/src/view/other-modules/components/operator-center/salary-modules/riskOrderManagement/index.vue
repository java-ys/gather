<!--
 * @Descritption:
 * @Author: xunzhibin
 * @Date: 2020-06-25 16:15:04
 * @LastEditors: xunzhibin
 * @LastEditTime: 2020-06-25 17:13:48
-->
<template>
  <div class="app-container">


    <div class="selectResume">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
        <el-row>
          <el-form-item label="司机姓名" label-width="100px">
            <el-input v-model="queryForm.driverName" placeholder="司机姓名" maxlength="32" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="司机手机号" label-width="100px">
            <el-input v-model="queryForm.driverMobile" placeholder="司机手机号" maxlength="12" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="订单号" label-width="100px">
            <el-input v-model="queryForm.orderNo" placeholder="订单号" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="城市" label-width="80px">
            <el-select v-model="queryForm.cityCode" placeholder="城市" style="width: 200px" filterable clearable @change="getAgentName">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(cityObj, index) in cities" :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营商" label-width="100px">
            <el-select v-model="queryForm.agentUuid" placeholder="运营商" style="width: 200px" filterable @change="changeValue">
              <el-option label="全部" value="-1"></el-option>
              <template v-for="(agentObj, index) in agents">
                <el-option :key="index" :label="agentObj.name" :value="agentObj.uuid"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="是否刷单" label-width="100px">
            <el-select v-model="queryForm.forgeFlag" placeholder="是否刷单" style="width: 200px">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否审核" label-width="100px">
            <el-select v-model="queryForm.auditFlag" placeholder="是否审核" style="width: 200px">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="已审核" value="1"></el-option>
              <el-option label="超时未处理" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button v-if="hasPermission('riskOrder-management-query')" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('riskOrder-management-query')" type="info" @click="resetData">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="buttons">
      <export-button :loading="exportLoading" :queryForm="queryForm" queryExport="riskOrder-management-export" @fatherExport="exportExcel" @loadingStatus="loadingStatus"></export-button>
    </div>
    <div style="margin-top: 60px">
      <el-table :row-style="{ backgroundColor: 'transparent' }" :data="tableData" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column prop="orderDate" label="订单完单时间" min-width="140"></el-table-column>
        <el-table-column prop="cityName" label="城市" min-width="110"></el-table-column>
        <el-table-column prop="agentName" label="运营商" min-width="110"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="180"></el-table-column>
        <el-table-column prop="orderFare" label="订单流水" min-width="110"></el-table-column>
        <el-table-column prop="paymentStatus" :formatter="paymentFormatter" label="支付状态" min-width="110"></el-table-column>
        <el-table-column prop="routeFinishTime" label="订单完成时间" min-width="140"></el-table-column>
        <el-table-column prop="driverNo" label="司机id" min-width="180"></el-table-column>
        <el-table-column prop="driverName" label="司机姓名" min-width="110"></el-table-column>
        <el-table-column prop="driverMobile" label="司机手机号" min-width="110"></el-table-column>
        <el-table-column prop="hitRiskRule" label="命中规则" min-width="180"></el-table-column>
        <el-table-column prop="auditFlag" :formatter="auditFormatter" label="是否审核" min-width="100"></el-table-column>
        <el-table-column prop="forgeFlag" :formatter="forgeFormatter" label="是否刷单" min-width="100"></el-table-column>
        <el-table-column prop="hitRiskReason" label="刷单理由" min-width="200"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="140"></el-table-column>
        <el-table-column prop="riskAuditName" label="风控审核人" min-width="100"></el-table-column>
        <el-table-column prop="riskAuditTime" label="审核时间" min-width="140"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="150" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button v-if="scope.row.auditFlag == 0 && scope.row.isOverdue == 0 && hasPermission('riskOrder-management-examine')" size="small" type="text" @click="examine(scope.row.id)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination style="margin: 20px 20px 0 0; float: right" :page-size="pageSize" @current-change="handleCurrentChange" :current-page.sync="currPage" layout="total, prev, pager, next" :total="totalCount"></el-pagination> -->
      <e-pagination :currPage="queryForm.currPage" :pageSize="queryForm.pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>
    </div>
    <!-- 批量导出 -->
    <batch-add-result v-if="resultVisible" :batchAddResultData="batchAddResultData" :resultVisible="resultVisible" @closeDialogHandle="closeDialogHandle" @errorImport="errorImport"></batch-add-result>
    <!-- 审核 -->
    <risk-examine :examineVisible="examineVisible" :riskId="riskId" @successHandle="successHandle" @closeDialogHandle="closeDialogHandle" />
  </div>
</template>

<script>
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import batchImport from "_o/components/operator-center/salary-modules/common/batchImport";
import batchAddResult from "_o/components/operator-center/salary-modules/common/batchImportResult";
import { queryCitiesWithAgent, queryWaterMark } from "_o/api/salary/common";
import riskExamine from "./riskExamine";
import riskRecords from "./riskRecords";
import { excelDownload } from "_o/common/common";
import { deleteEmptyProps, validatePhoneQuery } from "_o/common/common";
import { pageQuery } from "_o/api/salary/riskOrder";
import { riskExport } from "_o/api/salary/exportApi";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
export default {
  name: "riskOrderManagement",
  components: {
    batchImport,
    batchAddResult,
    riskRecords,
    riskExamine,
    exportButton,
    EPagination
  },
  data() {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        cityCode: "",
        agentUuid: ""
      },
      exportLoading: false,
      cities: [],
      agents: [],
      WaterMarkInfo: "",
      tableData: [],
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      examineVisible: false, // 审核
      riskId: 0,
      batchAddResultData: {},
      resultVisible: false // 批量导出
    };
  },
  created() {
    this.getPage(this.queryForm);
    this.getCitiesWithAgent();
    this.getWaterMarkInfo();
  },
  methods: {
    changeCurrent(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.getPage(this.queryForm);
    },
    handleSizeChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = val;
      this.getPage(this.queryForm);
    },
    getAgentName(val) {
      if (val == -1) {
        this.queryForm.cityName = "";
        val = null;
      }
      queryCitiesWithAgent({ cityCode: val }).then(res => {
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
            this.$message.warning("暂无开通运营商数据信息，请先联系相关运营人员进行开通城市操作");
          }
        } else {
          this.$message.warning("获取开通运营商数据信息失败，请刷新页面重试");
        }
      });
    },
    changeValue(value) {
      let obj = {};
      obj = this.agents.find(item => {
        return item.uuid === value; // 筛选出匹配数据
      });
      this.queryForm.agentName = obj ? obj.name : "";
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.cities.length === 0) {
            this.$message.warning("暂无开通城市数据信息，请先联系相关运营人员进行开通城市操作");
          } else {
            this.cities = res.data.data.cities;
          }
          if (res.data.data.agentInfoVos.length === 0) {
            this.$message.warning("获取代理商下拉选择列表数据失败，请刷新页面重试");
          } else {
            this.agents = res.data.data.agentInfoVos;
          }
        }
      });
    },
    // 列表水印
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      });
    },
    // 是否审核状态
    auditFormatter(row) {
      if (row.auditFlag == "0") {
        return "未审核";
      } else if (row.auditFlag == "1") {
        return "已审核";
      } else if (row.auditFlag == "3") {
        return "超时未处理";
      } else {
        return "";
      }
    },
    // 带参数查询
    paramSelect() {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.currPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.getPage(this.queryForm);
    },
    resetData() {
      this.queryForm = { currPage: 1, pageSize: 10 };
      this.getPage(this.queryForm);
      this.getCitiesWithAgent();
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    handleCurrentChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.queryForm.pageSize = this.pageSize;
      this.getPage(this.queryForm);
    },
    examine(id) {
      this.examineVisible = true;
      this.riskId = id;
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    exportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      this.exportLoading = true;
      // 根据搜索条件进行导出
      riskExport(deleteEmptyProps(requestParams)).then(res => {
        excelDownload(res.data, "风控订单数据信息");
      });
    },
    // 导出错误
    errorImport() {
      this.resultVisible = false;
      this.$message.error("导入失败，请检查导入的excel是否符合模板要求");
    },
    closeDialogHandle(type) {
      switch (type) {
        case "result":
          this.resultVisible = false;
          break;
        case "examine":
          this.examineVisible = false;
      }
    },
    paymentFormatter(row) {
      switch (row.paymentStatus) {
        case 0:
          return "未支付";
        case 1:
          return "已支付";
        default:
          return "";
      }
    },
    forgeFormatter(row) {
      switch (row.forgeFlag) {
        case 0:
          return "否";
        case 1:
          return "是";
        default:
          return "";
      }
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
      // 获取风控列表
      pageQuery(requestParams).then(res => {
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
      this.getPage(deleteEmptyProps(this.queryForm));
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
