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

      <Modal v-model="modalShow" :title="restModal" width="70%" :mask-closable="false" :footer-hide="true" :closable="false">
        <add @closeChange="closeChange" :restType="restType" :id="id" :modal="modalShow" ref="addref" @submitChange="submitChange"></add>
      </Modal>
    </div>
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
</template>
<script>
import { inputList, tableColumns, pageData,initTableColumns } from "./index.js";
import add from './add.vue'
import { restList, logList } from "_o/api/rest.js";
import { getProvinceCityAllList } from '_g/api/common.js';
import {cpTranslate} from '@/libs/tools'
export default {
  components:{
		add,
	},
  data() {
    return {
      restModal: '新增休息规则',
			inputList,
			...pageData,
			tableColumns,
			modalShow: false,
			initTableColumns,
      params: {},
      restType: "A",
      id: null,
      logParams: {
        businessType: 2
      },
      logTotal: 10,
      logCurrPage: 1,
      logPageSize: 10,
      logModal: false,
      logTableData: []
    };
  },
  mounted() {
    this.getList()
    this.getCityList()
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
    // 记载表格数据
    getList() {
      let params = Object.assign(this.params,{currPage: this.pageData.currPage,pageSize:this.pageData.pageSize})
      restList(params).then((res) =>{
        console.log(res)
        if(res.data.success) {
          if(res.data.data.list.length == 0 && this.pageData.currPage>1){
            this.pageData.currPage--
            this.getList()
            return
          }
          this.tableData = res.data.data.list;
          this.pageData.total = res.data.data.totalCount
        }
      })
    },
    changePage(val) {
      this.pageData.currPage = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageData.pageSize = val;
			this.getList();
    },
    closeChange() {
      this.modalShow = false;
    },
    submitChange(val) {
      if(val){
        this.pageData.currPage = val
      }

      this.modalShow = false;
      this.getList();
    },

		search(data) {
      this.params = data;
      this.getList()
    },
    reset() {
      this.params = {};
      this.getList()
    },
    addRule() {
      this.restType = "A"
      this.restModal = '新增休息规则',
			this.modalShow = true;
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
