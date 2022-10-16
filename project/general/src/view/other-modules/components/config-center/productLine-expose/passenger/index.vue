<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="菜单名称:">
        <Input
          v-model="businessName"
          clearable="clearable"
          style="width:250px"
          :maxlength="50"
      /></FormItem>
      <FormItem label="菜单类型:">
        <Select v-model="businessType" clearable style="width:150px">
          <Option :value="1">产品线</Option>
          <Option :value="2">自定义</Option>
        </Select>
      </FormItem>
      <FormItem label="菜单状态:">
        <Select v-model="status" clearable style="width:150px">
          <Option :value="0">开启</Option>
          <Option :value="2">仅白名单</Option>
          <Option :value="1">关闭</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          @click="search"
          style="margin-right:20px;margin-left:40px"
          >查询</Button
        >
        <Button @click="init()">清空</Button>
      </FormItem>
    </Form>
    <Button type="primary" v-hasAuth="'passenger-add'" @click="addData" style="margin-bottom:20px"
      >新增菜单
    </Button>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <add ref="add" @reload="getTableList()" />
    <linkModal ref="linkModal" />
  </div>
</template>

<script>
import { listColumns, businessTypeData } from "./fields";
import VTable from "_a/v-table/v-table";
import { keys } from "@/libs/tools";
import add from "./add";
import linkModal from "./linkModal";

import {
  getProductStrategyList,
  editProductStrategyDetail
} from "_o/api/configData.js";

export default {
  components: {
    VTable,
    add,
    linkModal
  },
  data() {
    let { columns } = listColumns;
    return {
      businessType: "",
      businessName: "",
      status: "",
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10
    };
  },
  mounted() {
    console.log(1111, this._baseUrl4CommonWeb);
    this.init();
  },
  methods: {
    init() {
      this.businessType = "";
      this.businessName = "";
      this.status = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        businessName: this.businessName,
        businessType: this.businessType,
        status: this.status
      };
      getProductStrategyList(params).then(res => {
        this.tableData = res.data.data.list || [];
        this.total = res.data.data.totalCount || 0;
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    addData() {
      this.$refs.add.init();
    },
    goLink(val) {
      this.$refs.linkModal.init(val);
    },
    goEdit(val) {
      editProductStrategyDetail({ id: val }).then(res => {
        this.$refs.add.init(res.data.data);
      });
    },
    // 白名单管理
    gotoWhitelist(row) {
      this.$router.push({
        name: "whitelist",
        query: {
          productLine: row.productLine,
          businessType: row.businessType,
          businessName: encodeURI(row.businessName)
        }
      });
    }
  }
};
</script>
