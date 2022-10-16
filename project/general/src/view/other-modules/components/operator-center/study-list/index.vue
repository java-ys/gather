<template>
  <div>
    <SearchList
      ref="_searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @on-change="queryChange"
    ></SearchList>
    <div class="rel">
      <div class="clearfix">
        <export-file
          class="fr"
          :isDisabled="tableData.length === 0"
          exportUrl="/api/exam/study/recordList/export"
          exportFileName="学习数据.xlsx"
          :queryData="exportAllParams"
          :baseUrlKey="baseUrlKey"
          :isMastQuery="true"
          btnText="导出"
        ></export-file>
      </div>
      <m2-table
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
      <p class="tto"><span>全部: {{total}}</span></p>
    </div>
  </div>
</template>

<script>
import { inputList, tableTitle } from "./fields.js";
import s from "_o/api/study-exam";
import { tool, isArray } from "_o/api/baseMixin.js";
import common from "./common";
import m2Table from "_a/m2-table/v-table";
import { timeFormat } from "@/libs/util";
import ExportFile from "_a/export-file/exportFile";

export default {
  name: "study-list",
  components: { m2Table, ExportFile },
  mixins: [tool, common],
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      baseUrlKey: "_base4Driver"
    };
  },
  computed: {
    exportAllParams() {
      return this.filterEmptyParams({
        ...this.queryData,
        ...this.exportParams,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    const { id } = to.query;
    next((vm) => {
      if (id) {
        vm.resetQueryParam()
        vm.extraParams.taskId = id;
        vm.exportParams.taskId = id;
        vm.func = s.studyRecordList;
        vm.getList();
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.query;
    this.extraParams.taskId = id;
    this.exportParams.taskId = id;
    this.getList();
    next();
  },
  beforeDestroy() {
    this.searchData = {};
  },
  created() {
    // const { id } = this.$route.query;
    // this.func = s.taskResultList;
    // this.extraParams.taskId = id;
    // this.exportParams.taskId = id;
    // this.getList();
    this.getAgentList();
  },
  computed: {
    exportAllParams() {
      return this.filterEmptyParams({
        ...this.queryData,
        ...this.exportParams,
      });
    },
    extraCheck() {
      return !this.exportAllParams.agentUuid;
    },
  },
  methods: {
    getAgentList() {
      let _agentList = JSON.parse(localStorage.getItem("pcOperatorList"));
      let arr = [];
      _agentList.forEach((it) => {
        it.children &&
          it.children.forEach((item) => {
            arr = [...arr, ...item.children];
          });
      });
      this.inputList[3].dropList = arr;
    },
    listSuccess(data) {
      // this[data && data.length ? "falsy" : "truy"]("exportDisable");
    },
    listError(err) {
      // this.truy("exportDisable");
    },
    resetQueryParam() {
      this.current = 1;
      this.searchData = {};
      this.$refs._searchList.resetData()
    },
    handleSearchData() {},
    queryChange(v) {
      let r = {};
      this.inputList.forEach((it) => {
        r[it.bind_key] = it.value;
      });
      this.exportParams = {
        ...this.exportParams,
        ...r,
      };
    },
    exportCheck() {
      this.$Message.warning("导出必须选择所属运营商");
    },
  },
};
</script>

<style lang="less" scoped>
.mt-20 {
  margin-top: 20px;
}
.fr {
  float: right;
  padding-left: 30px;
  padding-right: 30px;
}
.rel {
  position: relative;
}
.tto {
  position: absolute;
  left: 0;
  bottom: 26px;
}
</style>