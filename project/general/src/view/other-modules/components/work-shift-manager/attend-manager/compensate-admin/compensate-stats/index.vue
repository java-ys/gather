<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="reset"
      @cascade-change="handleCascadeChange"
    ></SearchList>
    <div>
      <div class="mb20">
        <ExportFile
          :exportUrl="exportUrl"
          :exportFileName="exportFileName"
          :queryData="searchParams"
          :columnsTitle="tableData"
          :baseUrlKey="baseUrlKey"
        ></ExportFile>
      </div>
      <VTable
        :total="pageData.total"
        :current="pageData.currPage"
        :pageSize="pageData.pageSize"
        :parColumns="tableColumn"
        :parTableData="tableData"
        :isLoading="isLoading"
        :pageSizeOpts="pageSizeOpts"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></VTable>
    </div>
    <!-- 补偿统计详情 -->
    <stats :visible="showDetailModal" :modal-data="nowRow" :statsDate="searchParams.statsDate" @close="hideModal"></stats>
  </div>
</template>

<script>
import { getProvinceCityAllList } from "_g/api/common.js";
import { getAgentByCity } from "_g/api/configData";
import { compensateListService } from "_o/api/compensate.js";
import {
  inputList,
  tableColumns,
  pageData,
  getNowYearMonth
} from "./fields.js";
import { cpTranslate } from "@/libs/tools";
import { tool } from "_o/api/baseMixin.js";
import ExportFile from "_a/export-file/exportFile";
import stats from "./stats.vue";

export default {
  name: "stats-list",
  components: {
    stats,
    ExportFile
  },
  mixins: [tool],
  data() {
    return {
      ...pageData,

      exportFileName: "补偿统计.xlsx",
      exportUrl: "/api/compensation/pageExport",
      baseUrlKey: "_baseUrl4Driver",

      inputList,
      tableColumn: tableColumns(this),
      searchParams: {
        statsDate: this._remove(getNowYearMonth())
      },
      cityCode: "",
      isLoading: true,
      showDetailModal: false,
      nowRow: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data);
          this.inputList[0].cascaderList = list;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    async getList() {
      let { statsDate } = this.searchParams;
      let params = {
        currPage: this.pageData.currPage,
        pageSize: this.pageData.pageSize,
        ...this.searchParams
      };
      const [err, data] = await this.toResult(compensateListService(params));
      this.$store.commit("changeLoadingFlag", false);

      if (err) return;
      if (data) {
        const { list, totalCount } = data;
        this.tableData = list;
        this.pageData.total = totalCount;
      }
      return this;
    },
    async getAgentList() {
      // if (!this.cityCode) return;
      // let [err, data] = await this.toResult(
      //   getAgentByCity({ cityCode: this.cityCode })
      // );
      // if (err) return;
      // if (data) {
      //   let list = data.data || [];
      //   list.forEach((item) => {
      //     item.label = item.name;
      //     item.value = item.uuid;
      //   });
      // }
      // return this;
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
    /*
      agentId (string, optional): 运营商id ,
      cityCode (string, optional): 城市Code ,
      currPage (integer, optional): 当前页，默认1 ,
      driverMobile (string, optional): 手机号 ,
      driverName (string, optional): 司机姓名 ,
      maxTimes (number, optional): 补偿时长最大值 ,
      minTimes (number, optional): 补偿时长最小值 ,
      pageSize (integer, optional): 分页大小，默认20 ,
      statsDate (string, optional): 日期字符串，格式yyyyMM
    */
    search(p) {
      this.searchParams = p;
      this.searchParams.statsDate = this._remove(this.searchParams.statsDate);
      this.pageData.currPage = 1;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.pageData.currPage = 1;
      this.pageData.pageSize = 10;
      this.getList();
    },
    changePage(page) {
      this.pageData.currPage = page;
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageData.pageSize = pageSize;
      this.getList();
    },
    handleCascadeChange(value) {
      const [, cityCode] = value;
      if (cityCode) {
        this.cityCode = cityCode;
        this.getAgentList();
      }
    },
    // 获取详情
    getDetail(row) {
      this.nowRow = row;
      this.truy("showDetailModal");
    },
    hideModal() {
      this.falsy("showDetailModal");
    },
    // 去除 - 符号
    _remove(str) {
      if (!str) return str;
      return `${str}`.replace(/-/gi, "");
    }
  }
};
</script>

<style lang="less">
.mb20 {
  margin-bottom: 20px;
}
</style>
