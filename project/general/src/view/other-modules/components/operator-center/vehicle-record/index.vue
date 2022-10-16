<!--
 * @description: 营运管理-车辆绑定记录
!-->
<template>
  <div>
    <div class="day-operate-wrap">
      <SearchList
        :inputList="inputList"
        @on-search="queryData"
        @on-reset="clearQueryData"
        @on-change="cityChange"
      ></SearchList>
      <ExportFile
        :exportUrl="exportUrl"
        v-hasAuth="'vehicle-record-export'"
        :exportFileName="exportFileName"
        :queryData="{pageSize, currentPage: current, ...queryAjaxPramas}"
        :baseUrlKey="exportBaseUrl"
        btnText="导出"
      >
      </ExportFile>
    </div>
    <VTable
      style="margin-top: 20px"
      class="staff-table-container"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
  </div>
</template>

<script>
/*
  1. 按钮权限
*/
import { getDriverCarList } from "_o/api/vehicle.js";
import { getAgentByCity } from "_o/api/configData";
import { pageData, inputList, tableTitle } from "./fields.js";
import ExportFile from "_a/export-file/exportFile";
import { mapActions, mapState } from "vuex";

const pageConfig = {
  exportUrl: "/api/v1/driver/car/export",
  exportBaseUrl: "_base4Driver",
  exportFileName: "车辆绑定记录.xlsx",
  listFunc: getDriverCarList,
};

export default {
  name: "vehicleRecord",
  components: {
    ExportFile,
  },
  data() {
    return {
      ...pageData,
      inputList,
      detailParams: {},
      ...pageConfig,
    };
  },
  created() {
    this.getAuthCityList();
    this.getTableColumns();
    // this.getList();
    this.inputList = JSON.parse(JSON.stringify(inputList));

    this.inputList[6].value = '1'
    this.queryData({driverStatus: "1"})
  
  },
  computed: mapState({
    authCityList: (state) => state.common.authCityList,
  }),
  watch: {
    authCityList: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.inputList[3].dropList = newVal;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(["getAuthCityList"]),
    // 点击查询
    queryData(data) {
      this.current = 1;
      this.queryAjaxPramas = data;
      this.getList();
    },
    // 点击清空
    clearQueryData() {
      this.queryAjaxPramas = {};
      this.current = 1;
      this.getList();
    },
    getList() {
      let params = {
        currentPage: this.current,
        pageSize: this.pageSize,
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      this.$store.commit("changeLoadingFlag", true);
      pageConfig.listFunc(obj).then((res) => {
        this.total = res.data.data.totalCount;
        this.current =
          res.data.data.currPage !== 0 ? res.data.data.currPage : 1;
        this.pageSize = res.data.data.pageSize;
        this.tableData = res.data.data.list;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    cityChange(data, name) {
      if(name === "cityCode") {
        this.getAgentList(data);
      }
    },
    getAgentList(cityCode) {
      if (!cityCode) return;
      getAgentByCity({ cityCode }).then((res) => {
        this.agentList = res.data.data || [];
        this.inputList[4].dropList = this.agentList.map((item) => {
          return {
            label: item.name,
            value: item.uuid,
          };
        });
      });
    },
    getTableColumns() {
      this.tableColumns = [];
      this.tableColumns = tableTitle(this);
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
  },
};
</script>
<style lang="less">
</style>
