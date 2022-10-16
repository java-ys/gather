<template>
  <div>
    <Button type="primary" @click="openNew" v-hasAuth="'payment-questions-add'">新建问题</Button>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
    <Modal v-model="isModal" :width="900" :title="modalTitle" :mask-closable="false" footer-hide>
      <editor-modal :isShow="isModal" :editData="editData" :total="editData.uuid?pageObj.total:pageObj.total+1" @getTableList="getTableList" @close="isModal=false"></editor-modal>
    </Modal>
  </div>
</template>
<script>
import { cacheData, returnFields } from "./fields";
import editorModal from './components/editor-modal.vue'
import {
  axiosPaymentQuestionList,
  axiosPaymentQuestionDelete,
  axiosPaymentQuestionUp,
  axiosPaymentQuestionDown
} from "_o/api/operator-carrier";
export default {
  name:"payment-questions",
  data() {
    return {
      ...cacheData,
      isModal: false,
      modalTitle: '新建问题',
      editData: {}
    };
  },
  components: {
    editorModal
  },
  created() {
    this.parColumns.length === 0 &&
      Object.entries(returnFields(this)).forEach(([key, value]) => {
        this.parColumns.push(value);
      });
  },
  activated(){
    this.$store.commit("changeLoadingFlag", false);
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    openNew(){
      this.modalTitle='新建问题';
      this.editData = {
        question: '',
        answer:'',
        sortNumber: null
      }
      this.isModal=true;
    },
    changePage(val) {
      this.pageObj.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getTableList();
    },
    deleteItem(uuid,sort){
      axiosPaymentQuestionDelete({uuid:uuid,sortNumber:sort}).then(res => {
        this.$Message.success(res.data.msg||'操作成功')
        this.getTableList(true);
      })
    },
    switchSort(uuid,sort,type){
      let axiosFun = type==='1'?axiosPaymentQuestionUp:axiosPaymentQuestionDown
      axiosFun({uuid:uuid,sortNumber:sort}).then(res => {
        this.$Message.success(res.data.msg||'操作成功')
        this.getTableList(true);
      })
    },
    getTableList(notLoading) {
      !notLoading && this.$store.commit("changeLoadingFlag", true);
      let params = {
        currPage: this.pageObj.current,
        pageSize: this.pageObj.pageSize
      }
      axiosPaymentQuestionList(params).then(res => {
        let resData = res.data.data
        let list = (resData && resData.list) || [];
        this.tableData.splice(0,this.tableData.length)
        this.tableData.push(...list)
        this.$store.commit("changeLoadingFlag", false);
        this.pageObj.total = resData && resData.totalCount;
      })
    }
  }
};
</script>