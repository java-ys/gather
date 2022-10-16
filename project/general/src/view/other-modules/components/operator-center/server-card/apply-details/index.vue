<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search"></SearchList>
    <div class="text-right">
      <ExportFile
        exportUrl="/api/application/record/exportExcel"
        exportFileName="司机申请记录列表.xlsx"
        :queryData="searchData"
        v-hasAuth="'servercard-apply-export'">
      </ExportFile>
    </div>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template
        slot-scope="params"
        slot="action"
      >
        <Button
          v-hasAuth="'servercard-apply-history'"
          ghost
          type="info"
          size="small"
          @click="openHistory(params.data.row)"
        >查看历史</Button>
      </template>
    </m2-table>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import ExportFile from '_a/export-file/exportFile'
import { parColumns,inputList } from "./fields";
import {
  axiosRecordApplicatuinList
} from "_o/api/operator-center/server-card";

export default {
  name: "",
  data () {
    return {
      inputList,
      parColumns: parColumns(this),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: true,
      selectList: []
    };
  },
  components: {
    m2Table,
    ExportFile
  },
  mounted () {
    this.getTableList();
  },
  methods: {
    search (data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList () {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      this.isLoading = true
      axiosRecordApplicatuinList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
      }).catch(err => {
        this.isLoading = false
        this.total = 0
        this.tableData = []
      });
    },
    changePage (val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize (val) {
      this.current = 1
      this.pageSize = val;
      this.getTableList();
    },
    // 历史
    openHistory (item) {
      this.$router.push(`/opCenter/server-card/apply-history/${item.driverUuid}?applicationUuid=${item.reportUuid}`)
    }
  }
};
</script>
<style lang='less'>
</style>