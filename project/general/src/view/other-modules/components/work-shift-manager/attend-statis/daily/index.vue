<!--
 * @description: 考勤管理-考勤统计-日报
 * @author: wangpeng
 * @date: 2020-03-8 16:24:26
!-->
<template>
  <div class="daily-record">
    <search-list
      :inputList="inputList"
      @on-search="searchData"
      @cascade-change="cityChange"
      @on-reset="resetData"
    ></search-list>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
  </div>
</template>

<script>
import searchList from "_a/search-list/search-list.vue";
import vTable from "_a/v-table/v-table.vue";
import { dailyRecord } from "../config";
// import { getDailyRecord } from "@/api/attend-statis.js";
import { attendanceMonthList, getDailyRecord } from "_o/api/driver.js";
import { getCitys, getProvinceCityAllList } from "_g/api/common.js";
import { getCitiesWithOrgan } from "_o/api/m2-driver-api/common.js";
import { getAgentByCity } from "_g/api/configData";
import { deepClone, timeFormat } from "../utils.js";
import { cpTranslate } from "@/libs/tools";
export default {
  name: "daily-record",
  components: { searchList, vTable },
  data() {
    const { inputList, columns } = deepClone({}, dailyRecord);
    return {
      inputList,
      searchParams: {},
      current: 1,
      pageSize: 10,
      total: 0,
      columns: columns(this),
      tableData: [],
      cityList: [],
      organList: []
    };
  },
  mounted() {
    this.getTableData();
    // this.setInputList();
    this.getProvinceCityList();
  },
  methods: {
    getOrgans(val) {
      if (val) {
        getAgentByCity({ cityCode: val }).then(res => {
          // console.log(res.data.data);
          let data = res.data.data || [];
          this.organList = [];
          for (let i = 0; i < data.length; i++) {
            this.organList.push({
              label: data[i].name,
              value: data[i].organId
            });
          }
        });
      }
    },
    // setInputList() {
    //   getCitys({}).then(res => {
    //     let data = res.data.data || [];
    //     for (let i = 0; i < data.length; i++) {
    //       this.cityList.push({
    //         label: data[i].city,
    //         value: data[i].cityID
    //       });
    //     }
    //   });
    // },
    searchData(params) {
      this.searchParams = params;
      if (params.startTime) {
        this.searchParams.dutyStartDate = timeFormat(
          params.startTime,
          "yyyy-MM-dd"
        );
        this.searchParams.dutyEndDate = timeFormat(
          params.endTime,
          "yyyy-MM-dd"
        );
      }
      delete this.searchParams.startTime;
      delete this.searchParams.endTime;
      delete this.searchParams.provinceID;
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
      getDailyRecord(params)
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.totalCount;
            this.$store.commit("changeLoadingFlag", false);
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(error => {
          // this.$Message.error("获取考勤日报分页数据失败，请稍后重试");
        });
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    detailData(params) {
      let dutyDate = params.dutyDate.split("/"),
        queryDate = dutyDate[0] + "-" + dutyDate[1] + "-" + dutyDate[2];
      this.$router.push({
        name: "daily-detail",
        query: {
          date: queryDate,
          // cityCode: params.cityCode,
          agentId: params.agentId
        }
      });
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
  }
};
</script>

<style lang="less" scoped>
</style>