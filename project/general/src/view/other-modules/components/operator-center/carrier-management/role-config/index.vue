<template>
  <div>
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button
        @click="add"
        type="primary"
        v-hasAuth="'role-config-add'"
        style="width: 80px"
        >新建</Button
      >
    </div>
    <m2-table
      class="top15"
      :isLoading="isLoading"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <add :visible="visible" :detail="detailData" @close="close"></add>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { pageData, tableColumns } from "./fields.js";
import Add from "./components/add";
import { inputList } from "./fields";
import { tool } from "_o/api/baseMixin.js";
import common from "./common";
import {
  roleGroupPageService,
  roleGroupGetService,
  roleGroupSaveService,
  roleGroupUpdateService,
  roleGroupDeleteService,
  roleGroupQueryUserlistService,
  roleGroupQueryCitylistService,
} from "_o/api/roleConfig";

export default {
  name: "role-config",
  components: {
    m2Table,
    Add,
  },
  mixins: [tool, common],
  data() {
    return {
      ...pageData,
      isLoading: false,
      tableColumns: tableColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),

      detailData: {}, // 详情参数
      visible: false,
    };
  },
  created() {
    this.func = roleGroupPageService;
    this.getList();
  },
  methods: {
    async edit(row) {
      const [err, data] = await this.toResult(
        roleGroupGetService({ id: row.id })
      );
      // console.log(err, data);
      if (err) {
        return;
      }
      this.detailData = data;
      this.visible = true;
    },
    delete(row) {
      let id = row.id;
      if (!id) return;
      let self = this;
      this.$Modal.confirm({
        content: "确认删除?",
        onOk: async function () {
          const [err, data] = await self.toResult(
            roleGroupDeleteService({ id })
          );
          if (err) {
            return;
          }
          self.$Message.success("删除成功");
          self.getList();
        },
      });
    },
    add() {
      this.visible = true;
      this.detailData = {};
    },
    close(r) {
      this.visible = false;
      if (r) {
        this.getList();
      }
    },
  },
};
</script>

<style scoped lang="less">
</style>