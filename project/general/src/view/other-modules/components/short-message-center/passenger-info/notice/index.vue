<template>
  <div>
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>

    <Button type="primary" @click="e => showAdd()" v-hasAuth="'passenger-info-add'">新增</Button>
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
    <detail v-if="detailVisible" ref="_detail"></detail>
    <add v-if="addVisible" ref="_add" @refresh="getList"></add>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { tool } from "@/mixins/base";
import { getAnnounceList, deleteAnnounce } from "_o/api/announcement.js";
import Detail from "./components/detail";
import Add from "./components/add";
import { getAllMenu } from "_o/components/short-message-center/passenger-info/service";
import { findKeyInList } from "_o/components/short-message-center/passenger-info/fields";

export default {
  name: "notice-temp",
  components: { m2Table, Detail, Add },
  mixins: [tool, list],
  provide() {
    return {
      getCatList: () => this.catList
    }
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      addVisible: false,
      detailVisible: false,
      catList: []
    };
  },
  created() {
    this.func = getAnnounceList;
    this.getList();
  },
  mounted() {
    this.getCat();
  },
  methods: {
    showAdd() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs._add.init();
      });
    },
    openRow(row) {
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs._detail.init(row);
      });
    },
    repeal(row) {
      deleteAnnounce({ uuid: row.uuid }).then(res => {
        if (res.data.success) {
          this.$Message.success("撤销成功");
          this.getList();
        } else {
          this.$Message.error("撤销失败");
        }
      });
    },
    async getCat() {
      const { list } = await getAllMenu({});
      this.catList = list
      findKeyInList('publishMenuCode', 'bind_key', this.inputList).dropList = list
    },
    setPageParams(p) {
      p.location = 2
      return p
    }
  }
};
</script>

<style scoped></style>
