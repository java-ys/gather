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
      <Button
        type="primary"
        style="margin-right: 10px;margin-bottom: 20px"
        @click="addRule"
        >新增</Button
      >
      <Button
        type="primary"
        style="margin-right: 10px;margin-bottom: 20px"
        @click="logchange"
        >日志</Button
      >
      <VTable
        :total="pageData.total"
        :current="pageData.currPage"
        :pageSize="pageData.pageSize"
        :parColumns="tableColumns(this)"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </VTable>
      <Modal v-model="modalShow" width="70%" :title="title" :footer-hide="true" :closable="false">
        <add @closeChange="closeChange" :leaveType="leaveType" :modal="modalShow" ref="addref" :code="code" @submitChange="submitChange"></add>
      </Modal>
      <Modal
        v-model="logModal"
        title="日志信息"
        width="70%"
        :mask-closable="false"
        :footer-hide="true"
      >
        <VTable
          :total="logTotal"
          :current="logCurrPage"
          :pageSize="logPageSize"
          :parColumns="initTableColumns(this)"
          :parTableData="logTableData"
          @changePage="logChangePage"
          @changePageSize="logChangePageSize"
        >
        </VTable>
      </Modal>
    </div>
  </div>
</template>
<script>
import { inputList, tableColumns, pageData, initTableColumns } from "./index.js";
import { leaveRuleList, logList } from "_o/api/rest.js";
import { getProvinceCityAllList } from '_g/api/common.js';
import { cpTranslate } from '@/libs/tools'
import add from "./add.vue";
export default {
  components: {
    add
  },
  data() {
    return {
      inputList,
      ...pageData,
      tableColumns,
      initTableColumns,
      modalShow: false,
      params: {},
      leaveType: "A",
      title: "新增请假规则",
      code: "",
      logParams: {
        businessType: 3
      },
      logTotal: 10,
      logCurrPage: 1,
      logPageSize: 10,
      logModal: false,
      logTableData: []
    };
  },
  mounted() {
    this.getCityList()
    this.getList()
  },
  methods: {
    // 获取城市列表
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data)
          this.inputList[0].cascaderList = list
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 数据列表
    getList() {
      let params = Object.assign(this.params,{currPage: this.pageData.currPage,pageSize:this.pageData.pageSize})
      leaveRuleList(params).then((res) =>{

        if(res.data.success) {
          if(res.data.data && res.data.data.list.length == 0 && this.pageData.currPage>1){
            this.pageData.currPage--
            this.getList()
            return
          }
          this.tableData = res.data.data&&res.data.data.list ? res.data.data.list : [];
          this.pageData.total = res.data.data&&res.data.data.totalCount ? res.data.data.totalCount : 0
        }
      })
    },
    // 日志列表
    getLogList() {
      let params = Object.assign(this.logParams,{currPage: this.logCurrPage,pageSize:this.logPageSize})
      logList(params).then((res) =>{

        if(res.data.success) {
          this.logTableData = res.data.data&&res.data.data.list ? res.data.data.list : [];
          this.logTotal = res.data.data&&res.data.data.totalCount ? res.data.data.totalCount : 0
        }
      })
    },
    addRule() {
      this.modalShow = true;
      this.title = "新增请假规则"
      this.leaveType = "A"
    },
    search(data) {
      this.params = data;
      this.getList()
    },
    closeChange() {
      this.modalShow = false;
    },
    submitChange() {
      this.pageData.currPage = 1;
      this.modalShow = false;
      this.getList();
    },
    reset() {
      this.pageData.currPage = 1;
      this.params = {};
      this.getList()
    },
    changePage(val) {
      this.pageData.currPage = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageData.pageSize = val;
			this.getList();
    },
    // 日志方法
    logchange() {
      this.logCurrPage = 1;
      this.getLogList();
			this.logModal = true;
		},
		logChangePage(val) {
      this.logCurrPage = val;
      this.getLogList();
    },
    logChangePageSize(val) {
      this.logPageSize = val;
			this.getLogList();
    }
  }
};
</script>
<style lang="less">
.new-rule-modal {
  .ivu-modal-body {
    padding: 16px 0 !important;
  }
}
</style>

