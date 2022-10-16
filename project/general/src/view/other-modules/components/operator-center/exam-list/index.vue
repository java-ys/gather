<template>
  <div>
    <SearchList
      ref="_searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @on-change="queryChange"
    ></SearchList>
    <div>
      <div class="clearfix">
        <export-file
          class="fr"
          exportUrl="/api/exam/task/export"
          exportFileName="考试数据.xlsx"
          btnText="导出"
          :isDisabled="exportDisable"
          :queryData="exportAllParams"
          :baseUrlKey="baseUrlKey"
          :isMastQuery="true"
          :extraCheck="extraCheck"
          @on-extra="exportCheck"
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
        @selectHandle="selectHandle"
      ></m2-table>
    </div>
    <!-- 详情 -->
    <detail :visible="onDetail" :modal-data="currentDetailRow" @close="hideDetail"></detail>
    <!-- 答卷列表 -->
    <test-page-list :visible="isShowPageList" :modal-data="currentPageListRow" @close="hidePageList" @open-detail="toPaperDetail"></test-page-list>
  </div>
</template>

<script>
import { inputList, tableTitle } from "./fields.js";
import s from "_o/api/study-exam";
import { tool, isArray } from "_o/api/baseMixin.js";
import common from "./common";
import m2Table from "_a/m2-table/v-table";
import exportFile from "_a/export-file/exportFile";
import detail from "./components/detail";
import { timeFormat } from "@/libs/util";
import TestPageList from "./components/test-page-list";

export default {
  name: "exam-list",
  components: { TestPageList, m2Table, exportFile, detail },
  mixins: [tool, common],
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      currentDetailRow: null,
      currentPageListRow: null,
      onDetail: false,
      isShowPageList: false,
      selectionList: [],
      exportDisable: true,
      baseUrlKey: "_base4Driver"
    };
  },
  beforeRouteEnter(to, from, next) {
    const { id } = to.query;
    next(vm => {
      if (id) {
        vm.resetQueryParam()
        vm.extraParams.taskId = id;
        vm.exportParams.taskId = id;
        vm.func = s.taskResultList
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
        ...this.exportParams
      });
    },
    extraCheck() {
      return !this.exportAllParams.agentUuid;
    }
  },
  methods: {
    getAgentList() {
      let _agentList = JSON.parse(localStorage.getItem("pcOperatorList"));
      let arr = [];
      _agentList.forEach(it => {
        it.children &&
          it.children.forEach(item => {
            arr = [...arr, ...item.children];
          });
      });
      this.inputList[3].dropList = arr;
    },
    hideDetail() {
      this.falsy("onDetail");
    },
    hidePageList() {
      this.falsy("isShowPageList");
    },
    toPaperDetail(row) {
      // todo 处理 row
      this.currentDetailRow = row;
      this.truy("onDetail");
      this.falsy("isShowPageList");
    },
    toPaperList(row) {
      this.currentPageListRow = row
      this.truy("isShowPageList")
    },
    selectHandle(rowList) {
      this.selectionList = rowList;
    },
    listSuccess(data) {
      this[data && data.length ? "falsy" : "truy"]("exportDisable");
    },
    listError(err) {
      this.truy("exportDisable");
    },
    resetQueryParam() {
      this.current = 1;
      this.searchData = {};
      this.$refs._searchList.resetData()
    },
    handleSearchData() {
      let { submitStartTime, submitEndTime } = this.searchData;
      this.searchData.submitStartTime = timeFormat(
        submitStartTime,
        "yyyy-mm-dd"
      );
      this.searchData.submitEndTime = timeFormat(submitEndTime, "yyyy-mm-dd");
    },
    queryChange(v) {
      let r = {};
      this.inputList.forEach(it => {
        // 时间范围
        if (isArray(it.bind_key)) {
          it.bind_key.forEach((item, idx) => {
            let ts = +new Date(it.value[idx]);
            if (it.value[idx] && ts) {
              r[item] = timeFormat(ts, 'yyyy-mm-dd');
            } else {
              r[item] = ""
            }
          });
        } else {
          r[it.bind_key] = it.value;
        }
      });
      this.exportParams = {
        ...this.exportParams,
        ...r
      };
    },
    exportCheck() {
      this.$Message.warning("导出必须选择所属运营商");
    }
  }
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
</style>
