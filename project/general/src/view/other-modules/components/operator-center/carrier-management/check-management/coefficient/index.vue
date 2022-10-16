<template>
  <div class="check-management-coefficient">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button
        type="primary"
        v-hasAuth="'coefficient-add'"
        @click="showAdd = true"
        >新建</Button
      >
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
      :view="view"
      @close="close"
      @confirm="confirm"
    ></add>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import Add from "./components/add.vue";
import m2Table from "_a/m2-table/v-table";
import common from "../tool/common";
import {
  cListService,
  cGetService,
  cStatusService,
  cDeleteService
} from "_o/api/coe";
import { getProvinceCityList } from "_g/api/common";
import { cpTranslate } from "@/libs/tools";

export default {
  name: "check-management-coefficient",
  components: {
    Add,
    m2Table
  },
  mixins: [common],
  provide() {
    return {
      getCityList: () => this.provinceCityList
    };
  },
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      showAdd: false,
      rowData: {},
      provinceCityList: [],
      view: false
    };
  },
  created() {
    this.func = cListService;
    this.getList();
  },
  mounted() {
    this.setProvinceCity();
  },
  methods: {
    async getCityList() {
      const [err, data] = await this.toResult(getProvinceCityList({}));
      if (err) {
        // this.$Message.error(err.message);
        return Promise.resolve({ data: [], list: [] });
      }
      let list = cpTranslate(data);
      return Promise.resolve({
        data,
        list
      });
    },
    async setProvinceCity() {
      const f = this.inputList.find(it => it.name === "cascader-input");
      if (!f) return;
      const { list } = await this.getCityList();
      this.provinceCityList = list;
      f.cascaderList = list;
    },
    confirm() {
      this.getList();
      this.close();
    },
    close() {
      this.showAdd = false;
      this.rowData = {};
      this.view = false;
    },
    block({ id, configStatus }) {
      let self = this;
      let msg = configStatus - 1 === 0 ? "停用" : "启用";
      let s = configStatus - 1 === 0 ? 2 : 1;
      this.$Modal.confirm({
        title: "提示",
        content: `确认${msg}吗?`,
        onOk: async function() {
          const [err, data] = await self.toResult(
            cStatusService({ id, configStatus: s })
          );
          if (err) {
            return;
          }
          self.$Message.success(`${msg}成功`);
          self.getList();
        }
      });
    },
    delete({ id }) {
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: `确认删除吗?`,
        onOk: async function() {
          const [err, data] = await self.toResult(
            cDeleteService({ id, delFlag: 1 })
          );
          if (err) {
            return;
          }
          self.$Message.success(`删除成功`);
          self.getList();
        }
      });
    },
    async editRow({ id }) {
      const [err, data] = await this.toResult(cGetService({ id }));
      if (err || !data) {
        this.$Message.error(`获取模板失败`);
        return;
      }
      this.rowData = data;
      this.showAdd = true;
    },
    open(data) {
      this.view = true;
      this.editRow(data);
    },
    setPageParams(p) {
      if (p.provinceCode) {
        delete p.provinceCode;
      }
      return p;
    }
  }
};
</script>

<style scoped></style>
