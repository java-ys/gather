<template>
  <div>
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
    </m2-table>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { parColumns } from "./fields";
import {
  axiosRecordApplicatuinHistoryList,
} from "_o/api/operator-center/server-card";

export default {
  name: "",
  data () {
    return {
      parColumns: parColumns(this),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      isLoading: true,
    };
  },
  components: {
    m2Table
  },
  mounted () {
    this.getTableList();
  },
  // 路由更新
  beforeRouteUpdate(to, from, next) {
    this.driverUuid = to.params.uuid||''
    if(this.driverUuid){
      this.getTableList(to.params.uuid,to.query.applicationUuid);
    }
    next();
  },
  methods: {
    getTableList (driverUuid,applicationUuid) {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        driverUuid: driverUuid || this.$route.params.uuid,
        applicationUuid: applicationUuid || this.$route.query.applicationUuid
      }
      this.isLoading = true
      axiosRecordApplicatuinHistoryList(params).then(res => {
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
    }
  }
};
</script>
<style lang='less'>
</style>