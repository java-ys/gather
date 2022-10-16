<template>
  <div>
    <div class="customer">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
    </div>
    <div>
      <VTable
        :total="pageData.total"
        :current="pageData.currPage"
        :pageSize="pageData.pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        :pageSizeOpts="pageSizeOpts"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </VTable>
    </div>
  </div>
</template>

<script>
import { inputList, tableColumns, pageData } from "./index.js";
import { getDriverLabel } from "_o/api/m2-driver-api/common.js";
import { dutyList } from "_o/api/m2-driver-api/schedule.js";
import { cpTranslate } from "@/libs/tools";
import { getProvinceCityAllList } from '_g/api/common.js';

export default {
  name: "work-list",
  data() {
    return {
      inputList,
      ...pageData,
      tableColumns: tableColumns(this),
      tableData: [],
      queryForm: {}
    };
  },
  mounted() {
    this.getDriverTypeList();
    this.getCityList();
    this.getList()
  },
  methods: {
    getList() {
      let params = Object.assign(this.queryForm,{currPage: this.pageData.currPage,pageSize:this.pageData.pageSize})
      dutyList(params).then(res => {
        // console.log(res)
        if (res.data.success) {
          const { list, totalCount} = res.data.data
          this.tableData = list
          this.pageData.total = totalCount
        }
      })
    },
    // 获取城市列表
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        // console.log(res)
        if (res.data.success) {
          let list = cpTranslate(res.data.data);
          list.forEach(item => {
            item.children.unshift({
              label: "全部",
              value: "1"
            });
          });
          list.unshift({
            label: "全部",
            value: "1",
            children: []
          });
          this.inputList[0].cascaderList.push(...list);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getDriverTypeList() {
      getDriverLabel().then(res => {
        if (res.data.success) {
          // console.log(res)
          this.inputList[3].dropList = [];
          res.data.data.forEach(item => {
            this.inputList[3].dropList.push({
              value: item.itemcode,
              label: item.itemvalue
            });
          });
        }
      });
    },
    search(data) {
      this.queryForm = data;
      this.pageData.currPage = 1;
      this.getList();
    },
    reset() {
      this.queryForm = {};
      this.pageData.currPage = 1;
      this.pageData.pageSize = 20;
      this.getList();
    },
    changePage(p) {
      this.pageData.currPage = p;
      this.getList();
    },
    changePageSize(v) {
      this.pageData.pageSize = v
      this.getList()
    },
    toCalendar(row) {
      this.$router.push({
        name: "schedule-calendar",
        query: row
      })
    }
  }
};
</script>
