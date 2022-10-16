
<template>
  <div>
    <div class="day-operate-wrap">
      <SearchList
        :inputList="inputList"
        @on-search="queryData"
        @on-reset="clearQueryData"
        @on-change="cityChange"
      ></SearchList>
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

import { queryEditByPage } from "_o/api/vehicle-edit.js";
import { getAgentByCity } from "_o/api/configData";
import { pageData, inputList, tableTitle } from "./fields.js";
import { mapActions, mapState } from "vuex";

const pageConfig = {
  exportUrl: "/api/v1/driver/car/export",
  exportBaseUrl: "_base4Driver",
  exportFileName: "车辆绑定记录.xlsx",
  listFunc: queryEditByPage,
};

export default {
  name: "vehicleRecord",
  components: {

  },
  data() {
    return {
      ...pageData,
      inputList,
      detailParams: {},
      ...pageConfig,
    };
  },
  computed: mapState({
    authCityList: (state) => state.common.authCityList,
  }),
  watch: {
    authCityList: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.inputList[0].dropList = newVal;
        }
      },
      deep: true,
    },
  },
  created() {
    this.getAuthCityList();
    this.getTableColumns();
    // this.getList();
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.queryData()
  },
  methods: {
    ...mapActions(["getAuthCityList"]),
    // 点击查询
    queryData(data) {
      this.current = 1;
      let tmpParams = data
      if (data) {
        tmpParams = JSON.parse(JSON.stringify(data))
        if (data.applyChangeCarQueryStartTime && data.applyChangeCarQueryEndTime) {
          tmpParams.applyChangeCarQueryStartTime = this.$moment(tmpParams.applyChangeCarQueryStartTime).format("YYYY-MM-DD HH:mm:ss")
          tmpParams.applyChangeCarQueryEndTime = this.$moment(tmpParams.applyChangeCarQueryEndTime + 86400000 - 1).format("YYYY-MM-DD HH:mm:ss")
        }
      }
      this.queryAjaxPramas = tmpParams;
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
        currPage: this.current,
        pageSize: this.pageSize,
        // type:1
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
      if (name === "cityCode") {
        this.getAgentList(data);
      }
    },
    getAgentList(cityCode) {
      if (!cityCode) return;
      getAgentByCity({ cityCode }).then((res) => {
        this.agentList = res.data.data || [];
        this.inputList[1].dropList = this.agentList.map((item) => {
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
    gotoAdut(data) {
      this.$route.meta.closeAlert = true;
      this.$router.push({
        name: "vehicle-edit-manager-audit",
        query: { changeCarOrderUuid: data.id }
      });
    },
    gotoDetails(data) {
      this.$route.meta.closeAlert = true;
      this.$router.push({
        name: "vehicle-edit-manager-detail",
        query: { changeCarOrderUuid: data.id }
      });
    }

  },
};
</script>
<style lang="less">
</style>
