<!--
 * @description: 考勤管理-考勤统计-月报
 * @author: wangpeng
 * @date: 2020-03-8 16:24:26
!-->
<template>
  <div class="task-record">
    <search-list
      :inputList="inputList"
      @on-search="searchData"
      @on-reset="resetData"
      @cascade-change="cityChange"
    ></search-list>
    <div class="container">
      <ExportFile
        :queryData="searchParams"
        exportFileName="司机考勤月报数据.xlsx"
        :exportUrl="exportUrl"
        :baseUrlKey="baseUrlKey"
      ></ExportFile>
      <div class="statusList">
        <div class="statusBox">
          <div class="tick"></div>
          <span>出勤</span>
        </div>
        <div class="statusBox">
          <div class="circle red"></div>
          <span>旷工</span>
        </div>
        <div class="statusBox">
          <div class="circle blue"></div>
          <span>请假</span>
        </div>
        <div class="statusBox">
          <div class="circle purple"></div>
          <span>休息</span>
        </div>
        <div class="statusBox">
          <div class="circle yellow"></div>
          <span>停运</span>
        </div>
        <div class="statusBox">
          <div class="circle orange"></div>
          <span>强制休息</span>
        </div>
        <div class="statusBox">
          <div class="circle green"></div>
          <span>其他</span>
        </div>
      </div>
    </div>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="handleSelectionChange"
    ></v-table>
    <communicate ref="detail" v-model="detailModal"></communicate>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getAgentByCity } from "_g/api/configData";
import searchList from "_a/search-list/search-list.vue";
import vTable from "_a/v-table/v-table.vue";
import communicate from "./communicate.vue";
import { monthlyRecord } from "../config";
import ExportFile from "_a/export-file/exportFile";
import { attendanceMonthList, getMonthlyRecord } from "_o/api/driver.js";
import { getDriverName, getCarNoList } from "_g/store/api/common.js";
// import { staffList } from "_o/api/driver.js";
// import { getMonthlyRecord, batchExportMonthly } from "@/api/attend-statis.js";
// import { likeNameOrPhone, likePlateNum } from "@/api/fuzzy-search.js";
// import { teamAll } from "@/api/driver.js";
import { deepClone, timeFormat, deleteEmptyProps } from "../utils.js";

import { getProvinceCityAllList } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";

export default {
  name: "monthly-record",
  components: { searchList, vTable, communicate, ExportFile },
  data() {
    const { inputList, columns } = deepClone({}, monthlyRecord);
    return {
      inputList,
      searchParams: {},
      current: 1,
      pageSize: 10,
      total: 0,
      exportUrl: "/api/statistics/Monthly/batchExport",
      baseUrlKey: "_baseUrl4Driver",

      columns: columns(this),
      tableData: [],
      bindDate: [],
      detailModal: false,
      cityCode: ""
    };
  },
  created() {
    this.getProvinceCityList();
    this.getTableData();
    this.setInputList();
    // this.getDriverManage();
    // this.inputList[2].remoteMethod = this.driverManagerMethod;
    // this.inputList[3].remoteMethod = this.teamMethod;
    this.inputList[5].remoteMethod = this.nameMethod;
    this.inputList[6].remoteMethod = this.phoneMethod;
    this.inputList[7].remoteMethod = this.plateNumMethod;
  },
  methods: {
    // ...mapActions(["getDriverManage"]),
    // 姓名输入框模糊搜索
    nameMethod: function(query) {
      getDriverName({
        // pageSize: 20,
        // currPage: 1,
        // driverName: query,
        // querytype: 2
      }).then(res => {
        // this.inputList[5].remoteList = [];
        // for (let i = 0; i < res.data.data.list.length; i++) {
        //   this.inputList[5].remoteList.push({
        //     label: res.data.data.list[i].name,
        //     value: res.data.data.list[i].name
        //   });
        // }
      });
    },
    // 手机号输入框模糊搜索
    phoneMethod: function(query) {
      likeNameOrPhone({
        pageSize: 20,
        currPage: 1,
        querytype: 1,
        mobile: query
      }).then(res => {
        this.inputList[6].remoteList = [];
        for (let i = 0; i < res.data.data.list.length; i++) {
          this.inputList[6].remoteList.push({
            label: res.data.data.list[i].mobile,
            value: res.data.data.list[i].mobile
          });
        }
      });
    },
    // 车牌号输入框模糊搜索
    plateNumMethod: function(query) {
      getCarNoList({
        // pageSize: 20,
        // currPage: 1,
        // plateNum: query,
        // querytype: 2
      }).then(res => {
        // this.inputList[7].remoteList = [];
        // for (let i = 0; i < res.data.data.list.length; i++) {
        //   this.inputList[7].remoteList.push({
        //     label: res.data.data.list[i].plateNum,
        //     value: res.data.data.list[i].plateNum
        //   });
        // }
      });
    },
    // // 司管模糊搜索
    // driverManagerMethod: function(query) {
    //   this.inputList[2].remoteList = [];
    //   for (let i = 0; i < this.driverManagerList.length; i++) {
    //     this.inputList[2].remoteList.push({
    //       label: this.driverManagerList[i],
    //       value: this.driverManagerList[i]
    //     });
    //   }
    // },
    // // 车队模糊搜索
    // teamMethod: function(query) {
    //   this.inputList[3].remoteList = [];
    //   for (let i = 0; i < this.teamArr.length; i++) {
    //     this.inputList[3].remoteList.push({
    //       label: this.teamArr[i].name,
    //       value: this.teamArr[i].uuid
    //     });
    //   }
    // },
    setInputList() {
      this.inputList[2].dropList = [
        { label: "单班", value: 1 },
        { label: "双班", value: 2 }
      ];
      this.inputList[9].dropList = [
        { label: "出勤", value: 1 },
        { label: "休息", value: 2 },
        { label: "请假", value: 3 },
        { label: "停运", value: 4 },
        { label: "强制休息", value: 5 },
        { label: "旷工", value: 6 }
      ];
    },
    searchData(params) {
      this.current = 1;
      if (params.startTime) {
        params.entryStartTime = timeFormat(params.startTime, "yyyy-MM-dd");
        delete params.startTime;
      }
      if (params.endTime) {
        params.entrustEndTime = timeFormat(params.endTime, "yyyy-MM-dd");
        delete params.endTime;
      }
      if (params.startDate) {
        params.boundCarStartTime =
          timeFormat(params.startDate, "yyyy-MM-dd") + " 00:00:00";
        delete params.startDate;
      }
      if (params.endDate) {
        params.boundCarEndTime =
          timeFormat(params.endDate, "yyyy-MM-dd") + " 23:59:59";
        delete params.endDate;
      }
      if (params.month) {
        params.month = params.month + "-01";
      }
      this.searchParams = params;
      this.getTableData();
    },
    resetData() {
      this.searchParams = {};
      this.current = 1;
      this.getTableData();
    },

    getTableData(params = this.searchParams) {
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      Object.assign(params, conf);
      getMonthlyRecord(params).then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          // if (this.tableData.length) {
          //   this.bindDate = this.tableData[0].dutyDate.toString().split("/");
          // }
          this.total = res.data.data.totalCount;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    handleSelectionChange(val) {
      this.monthlyRecordList = [];
      this.selectedRows = val;
      this.getDailyRecordList(val);
      this.searchParams.uuidList = this.monthlyRecordList;
    },
    getDailyRecordList(data) {
      data.forEach((item, index) => {
        if (item.uuid) {
          this.monthlyRecordList.push(item.uuid);
        }
      });
    },
    changePage(page) {
      this.current = page;
      let queryParams = JSON.parse(JSON.stringify(this.searchParams));
      queryParams.uuidList && delete queryParams.uuidList;
      this.getTableData(queryParams);
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      let queryParams = JSON.parse(JSON.stringify(this.searchParams));
      queryParams.uuidList && delete queryParams.uuidList;
      this.getTableData(queryParams);
    },

    detailData(data) {
      this.detailModal = true;
      // this.$refs.detail.initData(data, "detail");
    },
    getAgentList() {
      if (!this.cityCode) return;
      getAgentByCity({ cityCode: this.cityCode }).then(res => {
        let list = res.data.data || [];
        list.forEach(item => {
          item.label = item.name;
          item.value = item.uuid;
        });
        // list.unshift({ label: "全部", value: "0" });
        this.inputList[1].dropList = list;
      });
    },
    // 获取已经配置的地区
    getProvinceCityList() {
      let dataP = [];
      getProvinceCityAllList().then(res => {
        if (res.data.success) {
          dataP = cpTranslate(res.data.data);
          this.inputList[0].cascaderList = dataP;
        }
      });
    },
    cityChange([_, cityCode]) {
      if (cityCode) {
        this.cityCode = cityCode;
        this.getAgentList();
      }
    }
  },
  computed: {
    // ...mapState(["driverManagerList"]),
    // exportDate: function() {
    //   if (this.bindDate.length) {
    //     let y = this.bindDate[0],
    //       m = this.bindDate[1];
    //     return y + m;
    //   } else {
    //     return "";
    //   }
    // }
  }
};
</script>

<style lang="less">
.container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.statusList {
  display: flex;
  justify-content: space-around;
}

.statusBox {
  margin-right: 20px;

  span {
    margin: 10px;
  }
}

.tick {
  width: 14px;
  height: 25px;
  border-color: black;
  border-style: solid;
  border-width: 0 6px 6px 0;
  transform: rotate(45deg);
  display: inline-block;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  display: inline-block;
  transform: translate(0, 8px);
  border: solid 1px;
}

.red {
  background: #ff0000;
}

.blue {
  background: #0099ff;
}

.purple {
  background: #cc66ff;
}

.yellow {
  background: #ffff00;
}

.orange {
  background: #ff9933;
}

.green {
  background: #66ff33;
}
</style>
