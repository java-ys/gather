<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'commission-rules-add'" type="primary" @click="addRow">新建</Button>
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
      :id="id"
      :type="type"
      :title="modelTitle"
      :visible="showAdd"
      :detail="editDetail"
      @close="closeAdd"
      @confirm="confirm"
    ></add>
    <detail
      v-if="detailVisible"
      :visible="detailVisible"
      :detail="detailData"
      @close="closeDetail"
    ></detail>
  </div>
</template>

<script>
// todo 查看时候  不可操作

import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
// import { tool } from "_o/api/baseMixin.js";
import common from "../tool/common";

import {
  assessPageService,
  assessDeleteService,
  assessStatusService,
  assessGetService,
  commissionList,
  commissionAdd,
  commissionUpdate,
  commissionStatusUpdate,
  commissionDelete,
  commissionGet,
} from "_o/api/check";
import Add from "./components/add.vue";
import Detail from "./components/detail.vue";

export default {
  name: "check-management-target",
  components: {
    Add,
    m2Table,
    Detail,
  },
  mixins: [common],
  data() {
    return {
      id: 0,
      modelTitle: '',
      type: 'add',
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      showAdd: false,
      detailData: {}, // 详情数据
      detailVisible: false,
      editDetail: {}, // 编辑的行数据
    };
  },
  created() {
    this.func = commissionList;
    this.getList();
  },
  methods: {
    addRow() {
      this.modelTitle = '新建分佣规则'
      this.showAdd = true
    },
    deleteRow({ id }) {
      if (!id) return;
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确认删除?",
        onOk: async function () {
          const [err, data] = await self.toResult(commissionDelete({ id }));
          if (err) {
            return;
          }
          self.$Message.success("删除成功");
          self.getList();
        },
      });
    },
    block({ id, commissionStatus }) {
      let self = this;
      let msg = commissionStatus - 1 === 0 ? "禁用" : "启用";
      let s = commissionStatus - 1 === 0 ? 0 : 1;
      this.$Modal.confirm({
        title: "提示",
        content: `确认${msg}吗?`,
        onOk: async function () {
          const [err, data] = await self.toResult(
            commissionStatusUpdate({ id, commissionStatus: s })
          );
          if (err) {
            return;
          }
          self.$Message.success(`${msg}成功`);
          self.getList();
        },
      });
    },
    // 确认新增
    confirm() {
      this.closeAdd();
      this.getList();
    },
    // 取消新增
    closeAdd() {
      this.editDetail = {};
      this.type = 'add'
      this.modelTitle = '新建分佣规则'
      this.showAdd = false;
    },
    async showDetail({ id }) {
      this.type = 'detail'
      this.id = id
      this.modelTitle = '分佣规则详情'
      this.showAdd = true;
    },
    closeDetail() {
      this.detailVisible = false;
      this.detailData = {};
    },
    async editRow({ id }) {
      this.type = 'edit'
      this.id = id
      this.modelTitle = '编辑分佣规则'
      this.showAdd = true;
    },
  },
};
</script>

<style scoped>
</style>
