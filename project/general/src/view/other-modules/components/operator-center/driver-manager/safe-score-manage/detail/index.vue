<template>
  <div>
    <SearchList
      :inputList="inputList"
      resetTxt="重置"
      :spreadStatus="true"
      :showNumber="7"
      @on-search="search"
      @on-reset="search"
      @loadData="loadData"
    ></SearchList>
    <div class="right-flex">
      <column-select-btn
        :localName="localColumnName"
        :totalColumn="totalColumn"
        @reload="reloadColumn">
      </column-select-btn>
      <export-file
        v-hasAuth="''"
        type="success"
        :isDisabled="tableData.length===0"
        exportUrl="/api/securityPoint/manager/recordExport"
        exportFileName="明细列表.pdf"
        :queryData="searchData"
        btnText="导出"
      ></export-file>
    </div>
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
        <div class="middle-flex">
          <Button
            type="text"
            size="small"
            class="textBtn"
            @click="openDetail(params.data.row)"
            v-hasAuth="''"
          >详情</Button>
        </div>
      </template>
    </m2-table>
    <detail-modal
      :show="isDetailModal"
      :uuid="detailInfo.uuid"
      @close="isDetailModal=false"
    ></detail-modal>
  </div>
</template>
<script>
import { inputList, parColumns } from "./fields";
import m2Table from "_a/m2-table/v-table";
import ExportFile from "_a/export-file/exportFile";
import detailModal from "./detail-modal";
import columnSelectBtn from "_a/m2-column-select/index.vue";
import columnSelectMix from "_a/m2-column-select/mixin";
import {
  axiosSafeScoreEachLevelList,
  axiosSafeScoreRecordList
} from "_o/api/driver.js";
export default {
  name: "",
  data() {
    return {
      parColumns: [],
      totalColumn: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      isDetailModal: false,
      searchData: {},
      detailInfo: {},
      isLoading: false,
      isUpMenu: false,
      localColumnName: 'safeScoreDetail'
    };
  },
  components: {
    m2Table,
    ExportFile,
    detailModal,
    columnSelectBtn
  },
  mounted() {
    this.getTableList();
    this.getClasses();
  },
  // 路由更新
  beforeRouteUpdate(to, from, next) {
    this.searchData = {}
    this.current = 1
    this.pageSize = 10
    this.getTableList(to.params.id);
    next();
  },
  mixins: [columnSelectMix],
  methods: {
    getClasses() {
      axiosSafeScoreEachLevelList({levelType:1}).then(res => {
        let data = res.data.data;
        this.inputList[0].cascaderList = this.formatCascader(data, false);
      });
    },
    formatCascader(list, isAll = true, level=1) {
      let resData = []
      list.forEach(item => {
        let obj = {
          label: item,
          value: item,
          level: level,
          children: []
        }
        level<5 && ( obj.loading = false )
        resData.push(obj)
      });
      return resData
    },
    changeIcon(value){
      this.isUpMenu = value
    },
    search(data) {
      this.current = 1;
      if(data.title1){
        data.woTitle = data.title3 || data.title2
      }
      this.searchData = data;
      this.getTableList();
    },
    getTableList(uuid) {
      this.searchData.uuid = uuid || this.$route.params.id
      let params = {
        ...this.searchData,
        pageSize: this.pageSize,
        currPage: this.current
      };
      this.isLoading = true;
      axiosSafeScoreRecordList(params)
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
    // 详情
    openDetail(item) {
      this.detailInfo = item
      this.isDetailModal = true;
    },
    // 跳转到明细列表
    moveToDriverDetail(item){
      this.$route.push(`/opCenter/driver/staff-detail/${item.driverUuid}`)
    },
    // 级联懒加载
    loadData (item, callback) {
      item.loading = true;
      let params = {
        levelType: item.level+1,
        levelName: item.value
      }
      axiosSafeScoreEachLevelList(params).then(res => {
        let data = res.data.data || []
        if(data.length>0){
          item.children = this.formatCascader(data,true,item.level+1)
          item.loading = false
          callback();
        }else{
          item.loading = false
          delete item.loading
          callback();
        }

      })
    },
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