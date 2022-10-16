<template>
  <div>
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <Button
      type="primary"
      @click="(e) => showAdd()"
      v-hasAuth="'passenger-cat-add'"
    >新增</Button
    >
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
    <add v-if="addVisible" ref="_add" @refresh="getList"></add>
    <detail v-if="detailVisible" ref="_detail"></detail>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { tool } from "@/mixins/base";
import Detail from "./components/detail"
import Add from "./components/add"
import { getAllMenu } from "_o/components/short-message-center/passenger-info/service";
import { findKeyInList } from "_o/components/short-message-center/passenger-info/fields";
import { getAnnounceList } from "_o/api/announcement";
import { noticeMenuPage } from "_o/api/notice";

export  default {
  name: "cat-temp",
  components: {m2Table, Add, Detail},
  mixins: [tool,list],
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      addVisible: false,
      detailVisible: false,
    }
  },
  created() {
    this.func = noticeMenuPage;
    this.getList();
  },
  mounted() {
    this.getCat()
  },
  methods: {
    showAdd() {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs._add.init()
      })
    },
    openRow(row) {
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs._detail.init(row)
      })
    },
    edit(row) {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs._add.init(row)
      })
    },
    async getCat() {
      const { nameList } = await getAllMenu({});
      findKeyInList('pubMenuName', 'bind_key', this.inputList).dropList = nameList
    }
  }
}
</script>

<style scoped>

</style>
