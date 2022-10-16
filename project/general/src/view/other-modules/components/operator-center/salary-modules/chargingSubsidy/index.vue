<template>
  <div class="app-container">


    <SearchBox :needIsmore="true">
      <div slot="content">
        <el-form inline :model="queryForm" class="demo-form-inline" :rules="queryRules" label-position="right" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="城市" label-width="100px">
                <el-select v-model="queryForm.cityId" placeholder="城市" style="width: 200px" filterable clearable @change="getAgentName">
                  <el-option v-for="(item, index) in cities" :key="index" :label="item.orgName" :value="item.orgCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运营商" label-width="100px">
                <el-select v-model="queryForm.agentUuid" placeholder="运营商" style="width: 200px" filterable @change="changeValue">
                  <el-option v-for="(item, index) in agents" :key="index" :label="item.name" :value="item.uuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名" label-width="100px">
                <el-input v-model="queryForm.driverName" placeholder="姓名" style="width: 200px" @keydown.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号" prop="mobile" label-width="100px">
                <el-input v-model="queryForm.mobile" placeholder="手机号" style="width: 200px" @keydown.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="身份证号" prop="identityCard" label-width="100px">
                <el-input v-model="queryForm.identityCard" placeholder="身份证号" style="width: 200px" @keydown.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="司机ID" label-width="100px">
                <el-input v-model="queryForm.driverNo" placeholder="司机ID" style="width: 200px" @keydown.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计算时间" label-width="100px">
                <el-date-picker v-model="queryForm.computationTime" type="date" value-format="yyyyMMdd" placeholder="选择日期" style="width: 200px"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="补贴月份" label-width="100px">
                <el-date-picker v-model="queryForm.subsidiesMonth" type="month" value-format="yyyyMM" placeholder="选择月" style="width: 200px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="moreDetail">
        <el-form inline :model="queryForm" class="demo-form-inline" :rules="queryRules" label-position="right" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="状态" label-width="100px">
                <el-select v-model="queryForm.status" placeholder="状态" style="width: 200px">
                  <el-option label="全部" :value="2"></el-option>
                  <el-option label="已计算" :value="0"></el-option>
                  <el-option label="已传司机能源账户" :value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="能源补贴金额大于平均值" label-width="180px">
                <el-input-number v-model="queryForm.percentageAboveAverage" :min="0" :max="100" :controls="false" style="width:120px;" @keydown.enter.native="search"></el-input-number><strong style="padding-left:10px;">%</strong>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footerRight">
        <el-button v-if="hasPermission('subsidy-search-query')" v-preventReClick="3000" type="primary" size="mini" @click="search">搜索</el-button>
        <el-button v-if="hasPermission('subsidy-search-query')" v-preventReClick="3000" type="info" size="mini" @click="reset">重置</el-button>
      </div>
    </SearchBox>

    <div class=" buttons">
      <!-- <el-button type="primary" v-if="hasPermission('subsidy-search-export')" v-preventReClick="3000" @click="exportExcel" size="small">批量导出</el-button> -->
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="subsidy-search-export"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
    </div>
    <el-table
      v-loading="loading"

      :row-style="{ backgroundColor: 'transparent' }"
      :data="tableData"
      size="mini"
      fit highlight-current-row
      :header-cell-style="{ background: '#F5F4F2' }"
      style="width: 100%"
      height="515"
      @selection-change="selection"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        align="center"
        :prop="item.prop"
        :label="item.label"
        min-width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
    <NoTotalPagination
      :currPage="currPage"
      :pageSize="pageSize"
      :data-length="tableData.length"
      @currentChange="changeCurrent"
      @pageSizeChange="handleSizeChange"
    ></NoTotalPagination>
    <!--    <e-pagination-->
    <!--        :currPage="currPage"-->
    <!--        :pageSize="pageSize"-->
    <!--        :total="total"-->
    <!--        @currentChange="changeCurrent"-->
    <!--        @pagesizeChange="handleSizeChange"-->
    <!--    ></e-pagination>-->
  </div>
</template>
<script>
import { validatePhoneQuery, validateIdCardQuery, deleteEmptyProps } from "_o/common/common";
import { getLastMonth, excelDownload } from "_o/common/common"
import { subsidyExport } from "_o/api/salary/exportApi"
import { getSubsidyList } from "_o/api/salary/salary"
import { cityListByAll, getAgents, queryCompanyByCity, queryWaterMark, queryCitiesWithAgent } from "_o/api/salary/common";
import { defaultData } from "./fields"
import SearchBox from "_o/components/operator-center/salary-modules/searchForm/Form/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
// import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import NoTotalPagination from "_o/components/operator-center/salary-modules/noTotalPagination";
export default {
  name: "ChargingSubsidy",
  components: {
    NoTotalPagination,
    SearchBox, exportButton
    // , EPagination
  },
  data() {
    return {
      exportLoading: false,
      WaterMarkInfo: "",
      ...defaultData,
      loading: false, // 表格是否加载
      cities: [], // 获取所有已开通城市
      agents: [], // 获取所有运营商
      exportList: [], // 需要导出数据的uuid集合
      currAgentUuid: "",
      queryForm: {
        subsidiesMonth: getLastMonth(new Date()),
        status: 2,
        cityId: "",
        cityName: "",
        agentUuid: "",
        agentName: ""
      },
      queryRules: {
        mobile: [
          { validator: validatePhoneQuery, trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        identityCard: [
          { validator: validateIdCardQuery, trigger: "blur" },
          { min: 1, max: 18, message: "长度在 1 到 18 个字符", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList();
    this.getCitiesWithAgent();
    this.getWaterMarkInfo();
  },
  methods: {
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
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
      }).catch(err => {
        this.$alert("获取数据信息失败，请刷新页面重试")
      })
    },
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      }).catch(err => {
        this.$alert("获取水印数据信息失败，请刷新页面重试")
      })
    },
    search() {
      if (this.agents.length === 1) { // 通过判断运营商列表的长度，若为1则是运营商账号，否则是平台账号
        this.queryForm.agentUuid = this.currAgentUuid
        this.currPage = 1
        this.pageSize = 10
        this.getList()
      } else {
        if (!this.queryForm.agentUuid) {
          this.$alert("暂无数据，请先选择运营商")
        } else {
          this.currPage = 1
          this.pageSize = 10
          this.getList()
        }
      }
    },
    reset() {
      this.currPage = 1
      this.pageSize = 10
      console.log(this.pageSize)
      this.queryForm = {
        status: 2,
        subsidiesMonth: getLastMonth(new Date()),
      }
      if (this.agents.length === 1) {
        this.queryForm.agentUuid = this.currAgentUuid
      }
      this.getList()
      this.getCitiesWithAgent();
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
            this.queryForm.agentUuid = "";
            let obj = {};
            obj = this.cities.find((item) => {
              return item.orgCode === val;// 筛选出匹配数据
            });
            if (obj === undefined) {
              return
            }
            this.queryForm.cityName = obj.orgName;
            this.queryForm.cityId = obj.orgCode;
            if (this.agents.length === 0) {
              this.$alert("暂无开通运营商数据信息，请先联系相关运营人员进行开通城市操作");
            }
          }
          else {
            this.$alert("获取开通运营商数据信息失败，请刷新页面重试");
          }
        })
        .catch(err => {
          this.$alert("获取开通运营商数据信息失败，请刷新页面重试")
        })
    },
    changeValue(value) {
      let obj = {};
      obj = this.agents.find((item) => {
        return item.uuid === value;// 筛选出匹配数据
      });
      this.queryForm.agentName = obj ? obj.name : "";
    },
    loadingStatus() {
      this.exportLoading = false
    },
    exportExcel() {
      this.exportLoading = true
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      let params = {
        ...this.queryForm,
        driverIdList: [...this.exportList]
      }
      subsidyExport(params).then(res => {
        excelDownload(res.data, "能源补贴")
      }).catch(error => {
        this.$message.error("导出excel数据失败，请稍后重试");
      })
    },
    changeCurrent(val) {
      this.currPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.currPage = 1
      this.pageSize = val
      this.getList()
    },
    selection(selection) {
      let selectArray = []
      selection.forEach(item => {
        selectArray.push(item.uuid)
      })
      this.exportList = selectArray.filter(item => {
        return item !== undefined
      })
    },
    getList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.currPage
      }
      params = Object.assign(params, this.queryForm)
      for (let obj in params) {
        if (params[obj] === "" || params[obj] === null) delete params[obj]
      }
      this.loading = true
      getSubsidyList(params).then(res => {
        if (res.data.success) {
          this.loading = false
          this.tableData = [...res.data.data.list]
          this.tableData.forEach(item => {
            item.status = this.statusMap[item.status]
          })
          this.total = res.data.data.totalCount
        }
      }).catch(error => {
        this.loading = false
        this.$message.error("获取规则分页数据失败，请稍后重试");
      })
    }
  }
}
</script>
