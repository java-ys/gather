<template>
  <div>
    <Modal
      v-model="visible"
      title="请选择管理条例模板"
      width="800"
      :mask-closable="false"
      :closable="false"
    >
      <SearchList
        :inputList="inputList"
        @on-search="queryData"
        @on-reset="clearQueryData"
      />
      <m2-table
        ref="_t3_table"
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :height="height"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
      <div slot="footer">
        <Button type="primary" v-lazy-click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { regulationColumn, regulationInputList } from "../fields";
import { store, mutations, SelectedQuestions } from "./store";
import {
  controlPageService,
  // controlDeleteService,
  // controlStatusService,
  // controlGetService,
} from "_o/api/check";
import { tool } from "_o/api/baseMixin.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    m2Table,
  },
  mixins: [tool],
  data() {
    return {
      tableColumns: regulationColumn(this),
      formItem: {
        categoryId: "",
      },
      isLoading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 30, 50, 100],
      tableData: [],
      inputList: regulationInputList,
      height: 500,
      searchData: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let p = {
        currPage: this.current,
        pageSize: this.pageSize,
        status: 1,
        ...this.searchData,
      };
      const [err, data] = await this.toResult(controlPageService(p));
      if (err) {
        return;
      }
      if (data.list) this.tableData = data.list;
    },
    async cancel() {
      this.$emit("close", {}); // 把传来的传回去保持不变
    },
    selectRow(row) {
      this.$emit("close", row);
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
    changePage(current) {
      this.current = current;
      this.getList();
    },
    queryData(data) {
      Object.keys(data).forEach((it) => {
        this.searchData[it] = data[it];
      });
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.searchData = {};
      this.getList();
    },
  },
};
</script>