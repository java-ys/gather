<template>
  <div>
      <div class="feedback-detail">
        <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
        <ExportFile exportUrl='/admin/passenger/feedback/export' exportFileName='用户反馈结果.xls' :queryData='queryAjaxPramas'
        btnText='导出查询结果' v-hasAuth="'feedback-export'">
     </ExportFile>
      </div>
      <VTable
        style="margin-top: 20px;"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize">
      </VTable>
      <feedbackDetailModal :params="detailParams" :isDetailModal="isDetailModal" @close="isDetailModal=false"></feedbackDetailModal>
      <feedbackEvaluateModal :params="evaluateParams" :isEvaluateModal="isEvaluateModal" @close="closeEva" @closeoff="isEvaluateModal=false"></feedbackEvaluateModal>
      <feedbackTModal :params="tParams" :istModal="istModal" @close="closeT" @closeoff="istModal=false"></feedbackTModal>
      <feedbackSolveModal :params="solveParams" :isSolveModal="isSolveModal" @close="closeSolve" @closeoff="isSolveModal=false"></feedbackSolveModal>
  </div>
</template>

<script>
import { feedbackList, feedbackDetail, feedbackEvaluate, feedbackTypeList } from '_o/api/experience.js';
import {tableTitle, feedbackData, inputList} from './fields.js';
import ExportFile from '_a/export-file/exportFile';
import feedbackDetailModal from '../components/feedback-detail-modal.vue'
import feedbackEvaluateModal from '../components/feedback-evaluate-modal.vue'
import feedbackSolveModal from '../components/feedback-solve-modal.vue'
import feedbackTModal from '../components/feedback-t-modal.vue'
export default {
  name: 'feedbackDetail',
  components: {
    ExportFile,
    feedbackDetailModal,
    feedbackEvaluateModal,
    feedbackTModal,
    feedbackSolveModal
  },
  created() {
    this.getTableColumns();
    this.getList();
    this.getALLType();
    this.inputList = JSON.parse(JSON.stringify(inputList))
  },
  data() {
    return {
      ...feedbackData,
      inputList,
      detailParams:{},
      evaluateParams:{},
      tParams:{},
      solveParams:{},
    }
  },
  methods: {
    queryData(data) { // 点击查询
      this.current = 1
      this.queryAjaxPramas = data;
      if(this.queryAjaxPramas.feedbackDateStart!=undefined){
        this.queryAjaxPramas.feedbackDateStart = this.$moment(this.queryAjaxPramas.feedbackDateStart).format("YYYY-MM-DD HH:mm:ss")
      }
      if(this.queryAjaxPramas.feedbackDateEnd!=undefined){
        this.queryAjaxPramas.feedbackDateEnd = this.$moment(this.queryAjaxPramas.feedbackDateEnd).format("YYYY-MM-DD HH:mm:ss")
      }
      this.getList()
    },
    clearQueryData() { // 点击清空
      this.queryAjaxPramas = {}
      this.current = 1
      this.getList()
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      this.$store.commit("changeLoadingFlag", true);
      feedbackList(obj).then(res => {
        this.total = res.data.data.totalCount;
        this.current = res.data.data.currPage !== 0 ?  res.data.data.currPage : 1;
        // this.pageSize = res.data.data.pageSize;
        this.tableData = res.data.data.list;
        this.$store.commit('changeLoadingFlag', false)
      })
    },
    //获取所有类型
     getALLType(){
      feedbackTypeList().then(res=>{
        if(res.data.data.length>0){
          this.inputList[2].dropList=res.data.data.map(itm=>{
            return {label:itm.name,value:itm.uuid}
          })
        }
      })
     },
    getTableColumns () {
      this.tableColumns = [];
      this.tableColumns = tableTitle(this);
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage (val) {
      this.current = val;
      this.getList();
    },
    closeEva(){
      this.isEvaluateModal =false;
      this.getList();
    },
    closeT(){
      this.istModal =false;
      this.getList();
    },
    closeSolve(){
      this.isSolveModal =false;
      this.getList();
    }
  }
}
</script>
<style lang="less">

</style>