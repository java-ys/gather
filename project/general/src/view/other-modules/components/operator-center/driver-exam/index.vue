<template>
  <div>
    <SearchList
      ref="searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></SearchList>
    <div>
      <div class="clearfix">
        <Button class="new-add" type="primary" @click="addNew" v-hasAuth="'driver-exam-add'">新建</Button>
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
    </div>
    <!-- 新建/编辑 -->
    <add :visible="onAdd" :modal-data="currentRow" @close="hideAdd"></add>
    <!-- 详情 -->
    <add :visible="onDetail" :is-detail="true" :modal-data="currentRow" @close="hideDetail"></add>
    <!--<detail :visible="onDetail" :modal-data="currentRow" @close="hideDetail"></detail>-->
  </div>
</template>

<script>
import { tool } from "_o/api/baseMixin.js";
import m2Table from "_a/m2-table/v-table";
import { timeFormat } from "@/libs/util";
import s from "_o/api/study-exam";
import { inputList, tableTitle } from "./fields.js";
import add from "./components/add";
import detail from "./components/detail";
import common from "./common";

export default {
  name: "driver-exam",
  components: { m2Table, add, detail },
  mixins: [tool, common],
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      currentRow: null,
      onAdd: false,
      onDetail: false
    };
  },
  created() {
    this.func = s.taskList;
    this.getList();
  },
  methods: {
    addNew() {
      this.currentRow = null;
      this.truy("onAdd");
    },
    hideAdd({ refresh }) {
      this.falsy("onAdd");
      this.currentRow = null;
      refresh && this.getList();
    },
    toDetail(row) {
      this.currentRow = row;
      this.truy("onDetail");
    },
    hideDetail() {
      this.falsy("onDetail");
      this.currentRow = null;
    },
    toEdit(row) {
      this.currentRow = row;
      this.truy("onAdd");
    },
    handleSearchData() {
      // let { publishStartTime, publishEndTime, offStartTime, offEndTime } = this.searchData;
      // this.searchData.publishStartTime = timeFormat( publishStartTime, "yyyy-mm-dd" );
      // this.searchData.publishEndTime = timeFormat(publishEndTime, "yyyy-mm-dd");
      // this.searchData.offStartTime = timeFormat(offStartTime, "yyyy-mm-dd");
      // this.searchData.offEndTime = timeFormat(offEndTime, "yyyy-mm-dd");
      let { publishTime, offTime } = this.searchData;
      this.searchData.publishTime = timeFormat(publishTime, "yyyy-mm-dd");
      this.searchData.offTime = timeFormat(offTime, "yyyy-mm-dd");
    },
    toExamList({ id }) {
      this.$router.push({ name: "exam-list", query: { id } });
    }
  }
};
</script>

<style lang="less" scoped>
.mt-20 {
  margin-top: 20px;
}
.new-add {
  float: right;
  padding-left: 30px;
  padding-right: 30px;
}
</style>
