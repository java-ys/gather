
<template>
  <Modal v-model="showModal" :title="title" width="500">
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
  </Modal>
</template>

<script>
import { logColumns } from "./fields";
import { hexagonLog } from "_o/api/more-day-car";
export default {
  data() {
    let { columns } = logColumns;
    return {
      title: "操作日志",
      showModal: false,
      columns: columns(this),
      tableData: [{}],
      current: 1,
      total: 0,
      pageSize: 10
    };
  },
  methods: {
    init(val) {
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.tableData = [{}];
      this.showModal = true;
      this.uuid = val;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        uuid: this.uuid
      };
      hexagonLog(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    }
  }
};
</script>

<style></style>
