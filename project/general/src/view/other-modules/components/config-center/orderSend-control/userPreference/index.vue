<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="城市">
        <Cascader
          filterable
          :data="provinceCityList"
          v-model="cityData"
          style="width:180px;"
        ></Cascader>
      </FormItem>
      <!-- <FormItem label="产品线">
        <Select v-model="productLine" clearable style="width:150px">
          <Option :value="4">快享</Option>
          <Option :value="2">专享</Option>
          <Option :value="1">出租车</Option>
        </Select>
      </FormItem> -->
      <FormItem label="状态">
        <Select v-model="useStatus" clearable style="width:150px">
          <Option :value="1">已启用</Option>
          <Option :value="0">未启用</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          @click="search"
          style="margin-right:20px;margin-left:40px"
          >查询</Button
        >
        <Button @click="init()">重置</Button>
      </FormItem>
    </Form>
    <Button v-hasAuth="'userPreference_control-add'" type="primary" style="margin-bottom: 10px;" @click="addData"
      >新增策略</Button
    >
    <m2-table
      :isLoading="isLoading"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></m2-table>
    <add ref="add" @reload="init()" />
    <detail ref="detail" />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import add from "./add";
import detail from "./detail";
import { getProvinceCityList } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";

import { baseDiscountList } from "_o/api/priceCenter";
import {
  absolutelyUserGroupStrategy,
  userAbsPreferenceUpdateStatus
} from "_o/api/configData.js";
import m2Table from "_a/m2-table/v-table";
console.log(listColumns,"listColumns");
export default {
  components: {
    add,
    detail,
    m2Table
  },
  mounted() {
    this.init();
    this.getProvinceCityList();
  },
  activated() {
    this.init();
  },
  data() {
    let { columns } = listColumns;
    return {
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      provinceCityList: [],
      cityData: [],
      productLine: "",
      useStatus: "",
      isLoading: false
    };
  },
  methods: {
    init() {
      this.cityData = [];
      this.productLine = "";
      this.useStatus = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      console.log(this.cityData);
      this.isLoading = true;
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        cityCode: this.cityData ? this.cityData[1] : "",
        productLine: this.productLine,
        useStatus: this.useStatus
      };
      absolutelyUserGroupStrategy(params).then(res => {
        this.isLoading = false;

        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
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
      this.$refs.add.init({
        provinceCityList: this.provinceCityList,
        flag: "add"
      });
    },
    goEdit(val) {
      console.log(val,"val");
      this.$refs.add.init({ ...val, provinceCityList: this.provinceCityList });
    },
    goDetail(val) {
      debugger
      this.$refs.detail.init(val);
    },
    getProvinceCityList() {
      getProvinceCityList().then(res => {
        // 获取已开通省、市级联列表
        let list = cpTranslate(res.data.data,"cityID", "cityID");
        this.provinceCityList = list;
      });
    },
    updateStatus(val) {
      userAbsPreferenceUpdateStatus({
        uuid: val.uuid,
        useStatus: val.useStatus === 1 ? 0 : 1
      }).then(res => {
        this.getTableList();
      });
    }
  }
};
</script>

