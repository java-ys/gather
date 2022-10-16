<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @on-change="queryChange"
    ></search-list>
    <Button
      v-hasAuth="'home-page-add'"
      type="primary"
      @click="(e) => showAdd()"
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
    <edit ref="_edit" @refresh="getList"></edit>
    <detail ref="_detail" v-if="tableData.length"></detail>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import list from "@/mixins/list";
import { tool } from "@/mixins/base";
import { homePageList, deleteRow, getRowDetail, toggleStatus } from "_o/api/homePage"
import Edit from "./components/edit";
import Detail from "./components/detail";
import {fetchMenuList} from "./service"

export default {
  name: "home-page-list",
  components: {
    m2Table,
    Edit,
    Detail,
  },
  mixins: [tool, list],
  provide() {
    return {
      allMenu: () => this.allMenuList
    }
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      menuList: [],
      allMenuList: []
    };
  },
  created() {
    this.getAllMenu();
    this.func = homePageList;
    this.getList();
  },
  methods: {
    deleteRow({ id }) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定删除吗?`,
        onOk: async () => {
          const [err, data] = await this.toResult(
            deleteRow({ id})
          );
          if (err) {
            return;
          }
          this.$Message.success(`删除成功`);
          await this.getList();
        },
      });
    },
    showAdd(p) {
      this.$refs._edit.init(p);
    },
    showDetail(p) {
      this.$refs._detail.init(p);
    },
    // 查看详情
    async showRow({ id }) {
      const [err, data] = await this.toResult(getRowDetail({ id }));
      if (err) {
        return;
      }
      this.showDetail(data);
    },
    async takeDown({id}) {
      const [err, data] = await this.toResult(toggleStatus({ id, configStatus: 2 }));
      if (err) {
        return;
      }
      this.$Message.success(`下架成功`);
      await this.getList()
    },
    async takeUp({id}) {
      const [err, data] = await this.toResult(toggleStatus({ id, configStatus: 1 }));
      if (err) {
        return;
      }
      this.$Message.success(`上架成功`);
      await this.getList()
    },
    async queryChange(data, name) {
      if(name === 'terminal') {
        if(data !== undefined) {
          const {list} = await fetchMenuList([data]);
          this.setMenu(list)
        } else {
          this.setMenu()
        }
      }
    },
    setMenu(l = []) {
      this.menuList = l
      let f = this.inputList.find(it => it.bind_key === 'menu')
      if(f) {
        f.dropList = l
        f.value = ""
      }
    },
    async getAllMenu() {
      const {list} = await fetchMenuList([0, 1]);
      this.allMenuList = list
    }
  },
};
</script>

<style scoped>
</style>
