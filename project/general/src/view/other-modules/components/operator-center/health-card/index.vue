<template>
  <div>
    <SearchList :inputList="inputList" :axiosFun="axiosHealthCardFuzzyQuery" @on-search="search" @on-reset="search"></SearchList>
    <export-file
      :isDisabled="isExportBtn"
      exportUrl="/admin/healthCard/export"
      exportFileName="健康卡列表.xlsx"
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
    >
      <template slot-scope="params" slot="action">
        <Button
          ghost
          type="info"
          size="small"
          class="tableBtn"
          @click="openHistory(params.data.row)"
          v-hasAuth="'health-card-history'"
         >历史报备</Button>
        <Button ghost type="success" size="small" @click="openPage(params.data.row)" v-hasAuth="'health-card-photo'">行车照片</Button>
      </template>
    </m2-table>
    <history-modal :show="isHistoryShow" :driverInfo="driverInfo" @close="closeModal('isHistoryShow')" ></history-modal>
    <carousel-modal
      :show="isBigImg"
      :title="bigImgTit"
      :imgList="bigImgList"
      :indexVal="nowBig"
      @close="isBigImg=false">
    </carousel-modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import remoteSelect from "_a/remote-select/index.vue";
import { inputList, parColumns } from "./fields";
import historyModal from "./history-modal";
import exportFile from "_a/export-file/exportFile";
import carouselModal from '_a/carousel-modal/index.vue'
import {
  axiosHealthCardList,
  axiosHealthCardFuzzyQuery
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
      axiosHealthCardFuzzyQuery,
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
    historyModal,
    remoteSelect,
    exportFile,
    carouselModal
  },
  mounted() {
    let date = this.$moment(new Date()).format('YYYY-MM-DD')
    this.searchData.dateBegin = date
    this.searchData.dateEnd = date
    this.inputList[0].value = [date,date]
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      data.dateBegin && (this.searchData.dateBegin=this.$moment(data.dateBegin).format('YYYY-MM-DD'))
      data.dateEnd && (this.searchData.dateEnd=this.$moment(data.dateEnd).format('YYYY-MM-DD'))
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
      axiosHealthCardList(params).then(res => {
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
    openHistory(item){
      this.driverInfo = item
      this.isHistoryShow=true
    },
    closeModal(name) {
      this[name] = false;
    },
    openPage(item){
      if(item.vin){
        // 传入vin和时间

        let time = item.createTime?this.$moment(item.createTime).format('YYYY-MM-DD'):''
        // this.$router.push(`/safe/drive-incident-manage/${item.vin}?time=${time}`)
        this.$router.pushToAnotherModule("/m2-web-expressAndPrivate", {
          path: `/safe/drive-incident-manage/${item.vin}`,
          query: {
            time
          }
        });
      }else{
        this.$Message.error('未获取到该车辆的VIN')
      }

    },
    openCarousel(list,title){
      this.isBigImg = true
      this.bigImgTit = title
      this.bigImgList = list
      this.nowBig = 0
    }
  }
};
</script>
<style scoped lang='less'>
</style>