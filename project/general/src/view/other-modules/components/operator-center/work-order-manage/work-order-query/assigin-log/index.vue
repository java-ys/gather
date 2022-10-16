<template>
  <div>
    <searchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="handleReset"
      ref="searchList"
    >
    </searchList>
    <VTable
      :total="table.total"
      :current="table.pageNum"
      :pageSize="table.pageSize"
      :parColumns="tableColumn"
      :parTableData="tableData"
      @changePage="handleChangePage"
      @changePageSize="handleChangePageSize"
    >
    </VTable>
  </div>
</template>

<script>
import { inputList, tableColumn } from "./fields";
import { fetchAssignLog } from "_o/api/work-order/dashboard.js";
import { fetchCategoryList } from "_o/api/work-order/work-order-config";

export default {
  name: "assigin-log",
  data() {
    return {
      type: 0,
      inputList: inputList(this),
      tableColumn: tableColumn(this),
      search: {},
      table: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: []
    };
  },

  mounted() {
    this.queryCategoryList();
    this.$refs.searchList.search();
  },

  methods: {
    async init() {
      await this.queryCategoryList();
      this.queryList();
    },

    async queryList() {
      const {
        search,
        table: { pageNum, pageSize }
      } = this;
      if (search.startTime && this.$moment(search.startTime).add(30, "d") < this.$moment(search.endTime)) {
        this.$store.commit("changeLoadingFlag", false);
        return this.$Message.warning("指派时间查询范围不能超过30天")
      }
      this.$store.commit("changeLoadingFlag", true);
      const params = {
        currPage: pageNum,
        pageSize,
        ...search
      };
      try {
        const {
          data: {
            success,
            data: { list, totalCount }
          }
        } = await fetchAssignLog(params);
        if (success) {
          this.tableData = list;
          this.table.total = totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("changeLoadingFlag", false);
    },

    async queryCategoryList() {
      const {
        data: { success, data }
      } = await fetchCategoryList();
      if (success) {
        this.inputList.find(
          item => item.bind_key === "woType"
        ).dropList = this.categoryMap = data.map(item => ({
          label: item.categoryName,
          value: item.categoryCode
        }));
      }
    },

    onNavOrderDetail(row) {
      const { woCode } = row;
      this.$router.push({
        name: "work-order-detail",
        query: { woCode }
      });
    },

    handleSearch(val) {
      const { startTime, endTime } = val;
      this.search = val;
      if (startTime) {
        this.search.startTime = this.$moment(startTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (endTime) {
        this.search.endTime = this.$moment(endTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      this.table.pageNum = 1;
      this.queryList();
    },

    handleReset() {
      this.search = {};
      this.table.pageNum = 1;
      this.queryList();
    },

    handleChangePage(val) {
      this.table.pageNum = val;
      this.queryList();
    },

    handleChangePageSize(val) {
      this.table.pageSize = val;
      this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
</style>
