<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'check-management-rules-add'" type="primary" @click="showAdd = true">新建模板</Button>
    </div>
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <add
      v-if="showAdd"
      :visible="showAdd"
      :detail="rowData"
      @close="close"
      @confirm="confirm"
    ></add>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import Add from "./components/add.vue";
import m2Table from "_a/m2-table/v-table";
import oss from "@/mixins/oss";
import common from "../tool/common";
import {
  controlPageService,
  controlDeleteService,
  controlStatusService,
  controlGetService,
} from "_o/api/check";

export default {
  name: "check-management-rules",
  components: {
    Add,
    m2Table,
  },
  mixins: [common, oss],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      showAdd: false,
      rowData: {},
    };
  },
  created() {
    this.func = controlPageService;
    this.getList();
  },
  methods: {
    // 确认新增
    confirm() {
      this.getList();
      this.close();
    },
    // 取消新增
    close() {
      this.showAdd = false;
      this.rowData = {}
    },
    block({ id, status }) {
      let self = this;
      let msg = status - 1 === 0 ? "禁用" : "启用";
      let s = status - 1 === 0 ? 0 : 1;
      this.$Modal.confirm({
        title: "提示",
        content: `确认${msg}吗?`,
        onOk: async function () {
          const [err, data] = await self.toResult(
            controlStatusService({ id, status: s })
          );
          if (err) {
            return;
          }
          self.$Message.success(`${msg}成功`);
          self.getList();
        },
      });
    },
    delete({ id }) {
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: `确认删除吗?`,
        onOk: async function () {
          const [err, data] = await self.toResult(controlDeleteService({ id }));
          if (err) {
            return;
          }
          self.$Message.success(`删除成功`);
          self.getList();
        },
      });
    },
    async editRow({ id }) {
      const [err, data] = await this.toResult(controlGetService({ id }));
      if (err || !data) {
        this.$Message.error(`获取模板失败`);
        return;
      }
      this.rowData = data;
      // fileUrl 是 文件的uuid
      const [, v] = await this.getOssFile({uuid: data.fileUrl})
      this.rowData._fileUrl = v ? v : ""
      this.showAdd = true;
    },
    async open(data) {
      const [, v] = await this.getOssFile({uuid: data.fileUrl})
      if(v) window.open(v);
    }
  },
};
</script>

<style scoped>
</style>