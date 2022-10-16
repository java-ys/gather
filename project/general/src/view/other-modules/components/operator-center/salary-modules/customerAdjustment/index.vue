<template>
  <div class="app-container">


    <div class="selectBar">
      <el-form ref="queryForm" inline :model="queryForm" class="demo-form-inline" size="mini" :rules="queryRules" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="司机id" label-width="100px">
              <el-input v-model="queryForm.driverNo" placeholder="请输入" class="text-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机姓名" label-width="100px">
              <el-input v-model="queryForm.driverName" placeholder="请输入" class="text-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机手机号" label-width="100px">
              <el-input v-model="queryForm.driverMobile" placeholder="请输入" maxlength="12" class="text-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号" label-width="100px">
              <el-input v-model="queryForm.routeNo" placeholder="请输入" class="text-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select v-model="queryForm.cityCode" placeholder="请选择" class="text-width" filterable>
                <el-option label="全部" value="-1"></el-option>
                <template v-for="(cityObj, index) in cities">
                  <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客服调价时间" label-width="100px">
              <el-date-picker v-model="AdjustDateArr" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="text-width" value-format="yyyy-MM-dd" @change="handleDate('AdjustDateArr', AdjustDateArr)"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客服退款时间" label-width="100px">
              <el-date-picker v-model="RefundDateArr" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="text-width" value-format="yyyy-MM-dd" @change="handleDate('RefundDateArr', RefundDateArr)"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付状态" label-width="100px">
              <el-select v-model="queryForm.payStatus" placeholder="请选择" class="text-width">
                <el-option label="已支付" value="1"></el-option>
                <el-option label="未支付" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="司机类型" label-width="100px">
              <el-select v-model="queryForm.driverType" placeholder="请选择" class="text-width">
                <template v-for="(driverObj, index) in driverList">
                  <el-option :key="index" :label="driverObj.driverTypeDesc" :value="driverObj.driverType"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="是否核算" label-width="180px">
            <el-select v-model="queryForm.hasIssue" placeholder="请选择" class="text-width">
              <el-option label="已核算" value="1"></el-option>
              <el-option label="未核算" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作状态" label-width="100px">
            <el-select v-model="queryForm.operateStatus" placeholder="请选择" class="text-width">
              <el-option label="初始" value="0"></el-option>
              <el-option label="已处理" value="1"></el-option>
              <el-option label="超时未处理" value="3"></el-option>
            </el-select>
          </el-form-item> -->
        </el-row>
        <el-row>
          <el-form-item style="float: right">
            <el-button v-if="hasPermission('customerAdjustment-manage-query')" v-preventReClick="3000" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('customerAdjustment-manage-query')" v-preventReClick="3000" type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <export-button :loading="exportLoading" queryExport="customerAdjustment-manage-export" :queryForm="queryForm" @fatherExport="exportExcel" @loadingStatus="loadingStatus"></export-button>
    </div>
    <div style="margin-top: 60px">
      <el-table v-loading="loading" element-loading-text="正在加载" :row-style="{ backgroundColor: 'transparent' }" :data="tableData" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row>
        <el-table-column prop="driverNo" label="司机Id" min-width="120"></el-table-column>
        <el-table-column prop="driverName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="driverMobile" label="手机号" min-width="160"></el-table-column>
        <el-table-column prop="driverIdcard" label="身份证号" min-width="160"></el-table-column>
        <el-table-column prop="cityName" label="所属城市" min-width="160"></el-table-column>
        <el-table-column prop="agentName" label="所属运营商" min-width="160"></el-table-column>
        <el-table-column prop="driverTypeDesc" label="司机类型" min-width="160"></el-table-column>
        <el-table-column prop="routeNo" label="订单号" min-width="160"></el-table-column>
        <el-table-column prop="settlementTime" label="订单完成时间" min-width="160"></el-table-column>
        <el-table-column prop="orderFare" label="订单流水" min-width="160"></el-table-column>
        <el-table-column prop="estFare" label="订单预估金额" min-width="160"></el-table-column>
        <el-table-column prop="adjustFare" label="客服调价增减金额" min-width="160"></el-table-column>
        <el-table-column prop="refundFare" label="客服退款金额" min-width="160"></el-table-column>
        <el-table-column prop="adjustTime" label="客服调价时间" min-width="160"></el-table-column>
        <el-table-column prop="refundTime" label="客服退款时间" min-width="160"></el-table-column>
        <el-table-column prop="chargingMileage" label="订单里程(km)" min-width="160"></el-table-column>
        <el-table-column prop="estMileage" label="预估里程(km)" min-width="160"></el-table-column>
        <el-table-column prop="payStatus" label="支付状态" :formatter="payStatusFormatter" min-width="160"></el-table-column>
        <!-- <el-table-column prop="isGrant" label="是否核算" :formatter="isGrantFomatter" min-width="160"></el-table-column> -->
        <!-- <el-table-column prop="operateStatus" label="操作状态" :formatter="operateStatusFomatter" min-width="160"></el-table-column> -->
        <el-table-column prop="manualFare" label="补扣款" min-width="160"></el-table-column>
        <el-table-column prop="operateRemark" label="备注" min-width="160"></el-table-column>
        <!-- <el-table-column label="操作项" min-width="160" fixed="right" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="scope.row.isOverdue == 0 && hasPermission('customerAdjustment-manage-edit')" v-preventReClick="3000" @click="edit(String(scope.row.id))">编辑</el-button>
            <el-button size="small" type="text" v-if="hasPermission('customerAdjustment-manage-logs')" v-preventReClick="3000" @click="getLogs()">日志</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <no-total-pagination
        :currPage="queryForm.currPage"
        :pageSize="queryForm.pageSize"
        :data-length="tableData.length"
        @currentChange="changeCurrent"
        @pageSizeChange="handleSizeChange"
      />
      <!--      <e-pagination :currPage="queryForm.currPage" :pageSize="queryForm.pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>-->
    </div>
    <!-- 编辑 -->
    <edit :id="id" :editVisible="editVisible" :editForm="editForm" @closeDialogHandle="closeDialogHandle" @successHandle="paramSelect" />
  </div>
</template>

<script>
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import { queryWaterMark, queryCitiesWithJurisdiction, queryCitiesWithAgent, queryAllDriverType } from "_o/api/salary/common";
import { deleteEmptyProps, dateTimeFormat } from "_o/common/common";
import { downLoadAdsDriSalAdjustDetailDt } from "_o/api/salary/exportApi";
import { excelDownload } from "_o/common/common";
import { pageQuery } from "_o/api/salary/customerAdjustment";
import edit from "./edit";
import NoTotalPagination from "_o/components/operator-center/salary-modules/noTotalPagination";
export default {
  name: "customerAdjustment",
  components: {
    NoTotalPagination,
    edit,
    exportButton,
    EPagination
  },
  data() {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10
      }, // 搜索项
      exportLoading: false,
      loading: false, // 加载状态
      cities: [], // 城市
      AdjustDateArr: [], // 客服调价时间
      RefundDateArr: [], // 客服退款时间
      selectedRows: [], // 列表项复选
      WaterMarkInfo: "", // 水印
      queryRules: {}, // 表单规则
      tableData: [], // 列表项数据
      totalCount: 0, // 数据总条数
      currPage: 1,
      pageSize: 10,
      editVisible: false,
      id: "",
      editForm: {
        manualFare: "",
        operateRemark: ""
      },
      driverList: []
    };
  },
  created() {
    this.getPage(this.queryForm);
    this.getDriverList();
    this.getWaterMarkInfo();
    this.getCitiesWithAgent();
  },
  methods: {
    getLogs() {

    },
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
    // 支付状态转换
    payStatusFormatter(row) {
      switch (row.payStatus) {
        case 1:
          return "已支付";
        case 2:
          return "未支付";
        default:
          return "";
      }
    },
    // 发放状态转换
    isGrantFomatter(row) {
      switch (row.isGrant) {
        case 0:
          return "未核算";
        case 1:
          return "已核算";
        default:
          return "";
      }
    },
    // 操作状态
    operateStatusFomatter(row) {
      switch (row.operateStatus) {
        case 0:
          return "初始";
        case 1:
          return "已处理";
        case 3:
          return "超时未处理";
        default:
          return "";
      }
    },
    paramSelect() {
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.getPage(deleteEmptyProps(this.queryForm));
    },
    // 重置
    reset() {
      this.AdjustDateArr = [];
      this.RefundDateArr = [];
      this.queryForm = {
        currPage: 1,
        pageSize: 10
      };
      this.getPage(this.queryForm);
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
    // 添加水印
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      });
    },
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
    // 编辑
    edit(id) {
      this.id = id;
      this.editVisible = true;
    },
    assignmentTimesToQueryForm(queryForm, DateArr, [startTimeName, endTimeName]) {
      if (DateArr && DateArr.length > 0) {
        queryForm[startTimeName] = DateArr[0] + " 00:00:00";
        let date = new Date(DateArr[1]);
        date.setDate(date.getDate());
        queryForm[endTimeName] =
          dateTimeFormat(date.toDateString(), "yyyy-MM-dd") + " 23:59:59";
      } else {
        queryForm[startTimeName] = "";
        queryForm[endTimeName] = "";
      }
    },
    getPage(params) {
      this.assignmentTimesToQueryForm(this.queryForm, this.AdjustDateArr, ["adjustStartTime", "adjustEndTime"])
      this.assignmentTimesToQueryForm(this.queryForm, this.RefundDateArr, ["refundStartTime", "refundEndTime"])

      let requestParams = JSON.parse(JSON.stringify(this.queryForm));

      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          Number(requestParams[propName]) === -1
        ) {
          delete requestParams[propName];
        }
      }
      this.loading = true;
      pageQuery(deleteEmptyProps(requestParams)).then(res => {
        this.loading = false;
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.totalCount;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    closeDialogHandle(type) {
      switch (type) {
        case "edit":
          this.editVisible = false;
          break;
      }
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    exportExcel() {
      this.exportLoading = true;
      downLoadAdsDriSalAdjustDetailDt(this.queryForm).then(res => {
        excelDownload(res.data, "客服调价订单数据信息");
      });
    },
    getDriverList() {
      queryAllDriverType({}).then(res => {
        if (res.data.success && res.data.data) {
          this.driverList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.text-width {
  width: 200px !important;
}
.button-position {
  margin: 20px 20px 0 0;
  float: right;
}
</style>
