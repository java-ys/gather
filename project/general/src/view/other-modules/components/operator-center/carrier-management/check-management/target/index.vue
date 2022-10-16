<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'check-management-target-add'" type="primary" @click="showAdd = true">新建指标</Button>
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
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
// import { tool } from "_o/api/baseMixin.js";
import common from "../tool/common";

import {
  assessPageService,
  assessDeleteService,
  assessStatusService,
  assessGetService,
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
    this.func = assessPageService;
    this.getList();
  },
  methods: {
    deleteRow({ id }) {
      if (!id) return;
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确认删除?",
        onOk: async function () {
          const [err, data] = await self.toResult(assessDeleteService({ id }));
          if (err) {
            return;
          }
          self.$Message.success("删除成功");
          self.getList();
        },
      });
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
            assessStatusService({ id, status: s })
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
      this.showAdd = false;
    },
    async showDetail({ id }) {
      const [err, data] = await this.toResult(assessGetService({ id }));
      if (err || !data) {
        // this.$Message.error("获取详情失败");
        return;
      }
      if (data) {
        this.detailData = data || {};
        let st = JSON.parse(data.standard)
        this.detailData._stardard = st;
        let pf = +this.detailData.parentFlag || 0
        this.detailData.parentFlag = pf
        if(pf) {
          this.detailData._subIndex = 0
        }

        this.detailVisible = true;
      }
    },
    closeDetail() {
      this.detailVisible = false;
      this.detailData = {};
    },
    editRow(row) {
      this.editDetail = row;
      this.showAdd = true;
    },
  },
};
</script>

<style scoped>
</style>