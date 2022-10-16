<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <Button type="primary" class="right15" @click="addNew" v-hasAuth="'side-menu-add'">新增菜单</Button>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :isLoading="isLoading"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot-scope="params" slot="action">
        <Button
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="openEdit(params.data.row)"
          v-hasAuth="'side-menu-edit'"
        >编辑</Button>
        <Button
          v-if="params.data.row.status===1"
          ghost
          type="error"
          size="small"
          @click="shiftStatus(0,params.data.row)"
          v-hasAuth="'side-menu-close'"
        >关闭</Button>
        <Button
          v-else
          ghost
          type="success"
          size="small"
          @click="shiftStatus(1,params.data.row)"
          v-hasAuth="'side-menu-open'"
        >开启</Button>
      </template>
    </m2-table>
    <!-- 新增协议 -->
    <add-menu
      :show="isAddModal"
      :isNew="isNew"
      :addData="addData"
      @close="isAddModal=false"
      @refresh="getTableList"
    ></add-menu>
  </div>
</template>
<script>
import { inputList, parColumns } from "./fields";
import addMenu from "./components/add-menu";
import m2Table from "_a/m2-table/v-table";
import {
  axiosLeftMenuList,
  axiosLeftMenuShift
} from "_o/api/configData.js";
export default {
  name: "",
  data() {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      isAddModal: false,
      defaultAdd: {
        menuName: "",
        menuUrl: "",
        priority: null,
        menuIcon: "",
        cityType: 1,
        cityList: []
      },
      addData: {
        ...this.defaultAdd,
        cityList: []
      },
      isNew: true,
      isLoading: false
    };
  },
  components: {
    addMenu,
    m2Table
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        ...this.searchData,
        pageSize: this.pageSize,
        currPage: this.current
      };
      this.isLoading = true;
      axiosLeftMenuList(params)
        .then(res => {
          this.isLoading = false;
          let data = res.data.data;
          this.tableData = (data && data.list) || [];
          this.total = data.totalCount || 0;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    //新增
    addNew() {
      this.addData = { cityList: [], ...this.defaultAdd };
      this.isNew = true;
      this.isAddModal = true;
    },
    // 编辑
    openEdit(item) {
      this.addData = {
        uuid: item.uuid,
        menuName: item.menuName,
        menuUrl: item.menuUrl,
        priority: item.priority,
        menuIcon: item.menuIcon,
        cityType: item.cityCodes==='1'?1:2,
        cityList: item.cityCodes==='1'?[]:item.cityCodes.split(',')
      };
      this.isNew = false;
      this.isAddModal = true;
    },
    // 开启关闭
    shiftStatus(status, item) {
      let params = {
        uuid: item.uuid,
        status
      };
      axiosLeftMenuShift(params).then(res => {
        this.$Message.success(`${status===0?'关闭':'开启'}成功`)
        this.getTableList();
      });
    }
  }
};
</script>
<style lang="less">
.tableImg {
  width: 40px;
  height: 40px;
  margin: 5px 0;
}
</style>