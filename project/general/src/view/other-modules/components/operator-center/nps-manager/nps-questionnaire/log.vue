
<template>
  <Modal v-model="showModal" :title="title" width="1100">
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <div slot="footer">
      <Button type="primary" @click="showModal = false">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import { logColumns } from "./fields";
import { getQuestionnaireLog } from "_o/api/nps/app.js";

export default {
  data() {
    let { columns } = logColumns;
    return {
      title: "日志信息",
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
      this.uuid = val.questionnaireId;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        recordType: 1,
        questionnaireId: this.uuid
      };
      getQuestionnaireLog(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
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
