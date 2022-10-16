<template>
  <div class="app-container">


    <div class="selectBar">
      <el-form ref="queryForm" inline :model="queryForm" class="demo-form-inline" size="mini" :rules="queryRules" label-position="right">
        <el-row>
          <el-form-item label="司机姓名" label-width="100px">
            <el-input v-model="queryForm.driverName" placeholder="请输入" class="text-width"></el-input>
          </el-form-item>
          <el-form-item label="司机id" label-width="180px">
            <el-input v-model="queryForm.driverNo" placeholder="请输入" class="text-width"></el-input>
          </el-form-item>
          <el-form-item label="司机手机号" label-width="180px">
            <el-input v-model="queryForm.driverMobile" placeholder="请输入" maxlength="12" class="text-width"></el-input>
          </el-form-item>
          <el-form-item label="订单号" label-width="180px">
            <el-input v-model="queryForm.routeNo" placeholder="请输入" class="text-width"></el-input>
          </el-form-item>
          <el-form-item label="城市" label-width="100px">
            <el-select v-model="queryForm.cityCode" placeholder="请选择" class="text-width" filterable @change="getAgentName">
              <el-option label="全部" value="-1"></el-option>
              <template v-for="(cityObj, index) in cities">
                <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="运营商" label-width="180px">
            <el-select v-model="queryForm.agentUuid" placeholder="请选择" style="width: 200px" filterable @change="changeValue">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(agentObj, index) in agents" :key="index" :label="agentObj.name" :value="agentObj.uuid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态" label-width="180px">
            <el-select v-model="queryForm.payStatus" placeholder="请选择" class="text-width">
              <el-option label="已支付" value="1"></el-option>
              <el-option label="未支付" value="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否核算" label-width="180px">
            <el-select v-model="queryForm.operateStatus" placeholder="请选择" class="text-width">
              <el-option label="初始" value="0"></el-option>
              <el-option label="正常核算" value="1"></el-option>
              <el-option label="暂停核算" value="2"></el-option>
              <el-option label="超时未处理" value="3"></el-option>
            </el-select>
          </el-form-item> -->
        </el-row>
        <el-row>
          <el-form-item style="float: right">
            <el-button v-if="hasPermission('abnormalOrder-manage-query')" v-preventReClick="3000" type="primary" @click="paramSelect">搜索</el-button>
            <el-button v-if="hasPermission('abnormalOrder-manage-query')" v-preventReClick="3000" type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <export-button :loading="exportLoading" queryExport="abnormalOrder-manage-export" :queryForm="queryForm" @fatherExport="exportExcel" @loadingStatus="loadingStatus"></export-button>
    </div>
    <div style="margin-top: 60px">
      <el-table v-loading="loading" element-loading-text="正在加载" :row-style="{ backgroundColor: 'transparent' }" :data="tableData" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row>
        <el-table-column prop="driverNo" label="司机Id" min-width="120"></el-table-column>
        <el-table-column prop="driverName" label="司机姓名" min-width="120"></el-table-column>
        <el-table-column prop="driverMobile" label="司机手机号" min-width="160"></el-table-column>
        <el-table-column prop="driverIdcard" label="司机身份证号" min-width="160"></el-table-column>
        <el-table-column prop="cityName" label="所属城市" min-width="160"></el-table-column>
        <el-table-column prop="agentName" label="所属运营商" min-width="160"></el-table-column>
        <el-table-column prop="routeNo" label="订单号" min-width="160"></el-table-column>
        <el-table-column prop="settlementTime" label="订单结算时间" min-width="160"></el-table-column>
        <el-table-column prop="orderFare" label="订单流水" min-width="160"></el-table-column>
        <el-table-column prop="estFare" label="订单预估金额" min-width="160"></el-table-column>
        <el-table-column prop="chargingMileage" label="计费里程(km)" min-width="160"></el-table-column>
        <el-table-column prop="estMileage" label="预估里程(km)" min-width="160"></el-table-column>
        <el-table-column prop="payStatus" label="支付状态" :formatter="payStatusFormatter" min-width="160"></el-table-column>
        <!-- <el-table-column prop="operateStatus" label="是否核算" :formatter="operateStatusFomatter" min-width="160"></el-table-column>
        <el-table-column prop="operateRemark" label="备注" min-width="160"></el-table-column> -->
        <!-- <el-table-column label="操作项" min-width="160" fixed="right" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-preventReClick="3000" v-if="hasPermission('abnormalOrder-manage-normalAccount') && scope.row.isOverdue == 0 && scope.row.operateStatus == 0" @click="grant(scope.row, 1)">正常核算</el-button>
            <el-button size="small" type="text" v-preventReClick="3000" v-if="hasPermission('abnormalOrder-manage-suspensionAccount') && scope.row.isOverdue == 0 && scope.row.operateStatus == 0" @click="grant(scope.row, 2)">暂停核算</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <e-pagination :currPage="queryForm.currPage" :pageSize="queryForm.pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>
    </div>
    <!-- 正常核算/暂停核算 -->
    <edit :id="id" :editVisible="editVisible" :title="title" :operateStatus="operateStatus" :editForm="editForm" :businessId="businessId" @closeDialogHandle="closeDialogHandle" @successHandle="successHandle" />
  </div>
</template>

<script>
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import edit from "./edit";
import { queryWaterMark, queryCitiesWithAgent } from "_o/api/salary/common";
import { excelDownload } from "_o/common/common";
import { deleteEmptyProps } from "_o/common/common";
import { AdsDriSalExcep } from "_o/api/salary/exportApi";
import { getAbnormalOrderList } from "_o/api/salary/abnormalOrder";
export default {
  name: "abnormalOrder",
  components: {
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
      agents: [], // 运营商
      DataArr: [], // 客服调价时间
      selectedRows: [], // 列表项复选
      WaterMarkInfo: "", // 水印
      queryRules: {}, // 表单规则
      tableData: [], // 列表项数据
      totalCount: 0, // 数据总条数
      currPage: 1,
      pageSize: 10,
      editVisible: false,
      operateStatus: 1, // 1:正常核算； 2：暂停核算
      title: "",
      businessId: null,
      id: null,
      editForm: {
        operateRemark: ""
      }
    };
  },
  created() {
    this.getPage(this.queryForm);
    this.getCitiesWithAgent();
    this.getWaterMarkInfo();
  },
  methods: {
    // 核算状态转换
    operateStatusFomatter(row) {
      switch (row.operateStatus) {
        case 0:
          return "初始";
        case 1:
          return "正常核算";
        case 2:
          return "暂停核算";
        case 3:
          return "超时未处理";
        default:
          return "";
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
    // 搜索
    paramSelect() {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.currPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = this.pageSize;
      this.getPage(this.queryForm);
    },
    successHandle() {
      this.getPage(deleteEmptyProps(this.queryForm));
    },
    // 重置
    reset() {
      this.queryForm = {
        currPage: 1,
        pageSize: 10
      };
      this.getPage(this.queryForm);
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    exportExcel() {
      this.exportLoading = true;
      AdsDriSalExcep(deleteEmptyProps(this.queryForm)).then(res => {
        excelDownload(res.data, "异常订单数据信息");
      });
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
            this.$message.warning("暂无开通运营商数据信息,请先联系相关运营人员进行开通城市操作");
          }
        } else {
          this.$message.warning("获取开通运营商数据信息失败,请刷新页面重试");
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
            this.$message.warning("暂无开通城市数据信息,请先联系相关运营人员进行开通城市操作");
          } else {
            this.cities = res.data.data.cities;
          }
          if (res.data.data.agentInfoVos.length === 0) {
            this.$message.warning("获取代理商下拉选择列表数据失败,请刷新页面重试");
          } else {
            this.agents = res.data.data.agentInfoVos;
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
    grant(row, type) {
      this.operateStatus = type;
      this.businessId = row.businessId;
      this.id = row.id;
      if (type == 1) {
        this.title = "正常核算";
      } else if (type == 2) {
        this.title = "暂停核算";
      }
      this.editVisible = true;
    },
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
      this.loading = true;
      getAbnormalOrderList(requestParams).then(res => {
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
