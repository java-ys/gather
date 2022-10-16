<template>
  <div class="task-record">
    <search-list
      :inputList="inputList"
      @on-search="searchData"
      @on-reset="resetData"
    ></search-list>
    <!-- <Button type="primary" @click="exportExcel" style="margin-bottom: 10px">数据导出</Button> -->
    <div class="exportBtn">
      <!-- <ExportFile
        :queryData="searchParams"
        :excelTitle="'司机考勤' + this.exportDate"
        :exportUrl="exportUrl"
      ></ExportFile>-->
      <ExportFile
        :queryData="searchParams"
        exportFileName="司机考勤日报数据.xlsx"
        :exportUrl="exportUrl"
        :baseUrlKey="baseUrlKey"
      ></ExportFile>
    </div>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :isLoading="isLoading"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="handleSelectionChange"
    ></v-table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import searchList from "_a/search-list/search-list.vue";
import vTable from "_a/v-table/v-table.vue";
import { dailyDetail } from "../config";
import ExportFile from "_a/export-file/exportFile";
import { attendanceMonthList, getDailyRecordDetail } from "_o/api/driver.js";
// import { getDailyRecordDetail, batchExportDaily } from "@/api/attend-statis.js";
// import { likeNameOrPhone, likePlateNum } from "@/api/fuzzy-search.js";
import { deepClone, timeFormat, deleteEmptyProps } from "../utils.js";
export default {
  name: "daily-detail",
  components: { searchList, vTable, ExportFile },
  data() {
    const { inputList, columns } = deepClone({}, dailyDetail);
    return {
      inputList,
      searchParams: {},
      current: 1,
      pageSize: 10,
      total: 0,
      exportUrl: "/api/statistics/daily/batchExport",
      baseUrlKey: "_baseUrl4Driver",
      columns: columns(this),
      tableData: [],
      bindDate: [],
      isLoading: false
    };
  },
  mounted() {
    this.setInputList();
    this.getTableData();
    // this.inputList[3].remoteMethod = this.driverManagerMethod;
    // this.inputList[4].remoteMethod = this.nameMethod;
    // this.inputList[5].remoteMethod = this.phoneMethod;
    // this.inputList[6].remoteMethod = this.plateNumMethod;
  },
  methods: {
    // ...mapActions(["getDriverManage"]),
    // // 司管模糊搜索
    // driverManagerMethod: function(query) {
    //   this.inputList[3].remoteList = [];
    //   for (let i = 0; i < this.driverManagerList.length; i++) {
    //     this.inputList[3].remoteList.push({
    //       label: this.driverManagerList[i],
    //       value: this.driverManagerList[i]
    //     });
    //   }
    // },
    // // 姓名输入框模糊搜索
    // nameMethod: function(query) {
    //   likeNameOrPhone({
    //     pageSize: 20,
    //     currPage: 1,
    //     driverName: query,
    //     querytype: 2
    //   }).then(res => {
    //     this.inputList[4].remoteList = [];
    //     for (let i = 0; i < res.data.data.list.length; i++) {
    //       this.inputList[4].remoteList.push({
    //         label: res.data.data.list[i].name,
    //         value: res.data.data.list[i].name
    //       });
    //     }
    //   });
    // },
    // // 手机号输入框模糊搜索
    // phoneMethod: function(query) {
    //   likeNameOrPhone({
    //     pageSize: 20,
    //     currPage: 1,
    //     querytype: 1,
    //     mobile: query
    //   }).then(res => {
    //     this.inputList[5].remoteList = [];
    //     for (let i = 0; i < res.data.data.list.length; i++) {
    //       this.inputList[5].remoteList.push({
    //         label: res.data.data.list[i].mobile,
    //         value: res.data.data.list[i].mobile
    //       });
    //     }
    //   });
    // },
    // // 车牌号输入框模糊搜索
    // plateNumMethod: function(query) {
    //   likePlateNum({
    //     pageSize: 20,
    //     currPage: 1,
    //     plateNum: query,
    //     querytype: 2
    //   }).then(res => {
    //     this.inputList[6].remoteList = [];
    //     for (let i = 0; i < res.data.data.list.length; i++) {
    //       this.inputList[6].remoteList.push({
    //         label: res.data.data.list[i].plateNum,
    //         value: res.data.data.list[i].plateNum
    //       });
    //     }
    //   });
    // },
    setInputList() {
      this.inputList[0].value = this.$route.query.date;
      // this.inputList[1].dropList = [
      //   { label: "全天", value: "全天" },
      //   { label: "白班", value: "白班" },
      //   { label: "夜班", value: "夜班" }
      // ];
      this.inputList[2].dropList = [
        { label: "单班", value: "1" },
        { label: "双班", value: "2" }
      ];
      this.inputList[6].dropList = [
        { label: "出勤", value: 1 },
        { label: "休息", value: 2 },
        { label: "请假", value: 3 },
        { label: "停运", value: 4 },
        { label: "强制休息", value: 5 },
        { label: "旷工", value: 6 }
      ];
      this.inputList[7].dropList = [
        { label: "达标", value: 1 },
        { label: "不达标", value: 0 }
      ];
    },
    searchData(params) {
      this.current = 1;
      if (params.dutyDate) {
        params.date = timeFormat(params.dutyDate, "yyyy-MM-dd");
        delete params.dutyDate;
      }
      this.searchParams = params;
      this.getTableData();
    },
    resetData(params) {
      this.searchParams = {};
      this.current = 1;
      this.getTableData();
    },

    getTableData(params = this.searchParams) {
      if (!params.date) {
        let conf = {
          currPage: this.current,
          pageSize: this.pageSize,
          date: this.$route.query.date,
          agentId: this.$route.query.agentId
          // cityCode: this.$route.query.cityCode
        };
        Object.assign(params, conf);
        params = deleteEmptyProps(params);
        getDailyRecordDetail(params).then(res => {
          this.isLoading = true;
          let data = res.data.data || {};
          this.total = data.totalCount;
          this.tableData = data.list;
          // if (this.tableData.length) {
          //   this.bindDate = this.tableData[0].dutyDate.toString().split("/");
          // }
          delete this.$route.query.date;
        });
      } else {
        let conf = {
          currPage: this.current,
          pageSize: this.pageSize,
          agentId: this.$route.query.agentId
        };
        Object.assign(params, conf);
        getDailyRecordDetail(params).then(res => {
          this.isLoading = true;
          let data = res.data.data || {};
          this.total = data.totalCount;
          this.tableData = data.list;
          // if (this.tableData.length) {
          //   this.bindDate = this.tableData[0].dutyDate.toString().split("/");
          // }
        });
      }
    },
    handleSelectionChange(val) {
      this.dailyRecordList = [];
      this.selectedRows = val;
      this.getDailyRecordList(val);
      this.searchParams.ids = this.dailyRecordList;
    },
    getDailyRecordList(data) {
      data.forEach((item, index) => {
        if (item.id) {
          this.dailyRecordList.push(item.id);
        }
      });
    },
    changePage(page) {
      this.current = page;
      let queryParams = JSON.parse(JSON.stringify(this.searchParams));
      queryParams.ids && delete queryParams.ids;
      this.getTableData(queryParams);
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      let queryParams = JSON.parse(JSON.stringify(this.searchParams));
      queryParams.ids && delete queryParams.ids;
      this.getTableData(queryParams);
    }
  },
  filters: {
    dateFormat: function(value) {
      if (!value) return "";
      let y = value[0],
        m = value[1],
        d = value[2];
      return y + m + d;
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === from.name && to.query.date !== from.query.date) {
      this.getTableData({ date: to.query.date });
    }
    next();
  },
  computed: {
    // ...mapState(["driverManagerList"]),
    exportDate: function() {
      if (this.bindDate.length) {
        let y = this.bindDate[0],
          m = this.bindDate[1];
        return y + m;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.exportBtn {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
