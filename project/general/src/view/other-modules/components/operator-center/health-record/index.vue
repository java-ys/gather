<template>
  <div>
    <SearchList :inputList="inputList"  @on-search="search" @on-reset="search"></SearchList>
    <export-file
      :isDisabled="isExportBtn"
      exportUrl="/admin/healthRecord/export"
      exportFileName="健康码记录.xlsx"
      :queryData="searchData"
      btnText="批量导出"
      :isMastQuery="true"
    ></export-file>
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
    />
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import remoteSelect from "_a/remote-select/index.vue";
import { inputList, parColumns } from "./fields";
import exportFile from "_a/export-file/exportFile";
import {
  axiosHealthRecordList,
} from "_o/api/operator-carrier";
export default {
  name: "",
  data() {
    return {
      parColumns:parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      driverInfo:{},
      isHistoryShow:false,
      searchData: {},
      isExportBtn:true,
      isBigImg: false,
      bigImgTit: '查看图片',
      bigImgList: [],
      nowBig: 0,
      isLoading:true
    };
  },
  components: {
    m2Table,
    remoteSelect,
    exportFile,
  },
  mounted() {
    let date = this.$moment(new Date()).format('YYYY-MM-DD')
    this.searchData.startDate = date
    this.searchData.endDate = date
    this.inputList[0].value = [date,date]
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      data.startDate && (this.searchData.startDate=this.$moment(data.startDate).format('YYYY-MM-DD'))
      data.endDate && (this.searchData.endDate=this.$moment(data.endDate).format('YYYY-MM-DD'))
      if(data.queryParam){
        let arr = data.queryParam.split('-')
        data.driverName = arr[0]
        data.mobile = arr[1]
        data.plateNumber = arr[2]
      }
      delete this.searchData.queryParam
      this.getTableList();
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      delete params.queryParam
      this.isLoading = true
      axiosHealthRecordList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
        this.isExportBtn = this.tableData.length === 0 ? true : false;
        this.$store.commit("changeLoadingFlag", false);
      }).catch(err => {
        this.isLoading = false
        this.total = 0
        this.tableData = []
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
  }
};
</script>
<style scoped lang='less'>
</style>
