<template>
  <div class="rule-content">
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
        v-hasAuth="'driver-add-rule'"
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
    </div>
		<Modal v-model="modal1" :title="modalName" width="60%" :mask-closable="false" :footer-hide="true" :closable="false" class="new-rule-modal" >
    	<add @closeChange="closeChange" :ruleType="ruleType" :modal="modal1" :id="shiftUuid" ref="addref" @submitChange="submitChange"></add>
    </Modal>
    <Modal v-model="logModal" title="日志信息" width="70%" :mask-closable="false" :footer-hide="true"  >
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
import { inputList, tableColumns, pageData,initTableColumns } from "./index";
import add from "./add.vue";
import { getProvinceCityAllList } from '_g/api/common.js';
import { rulequeryPageList,queryLog } from "_o/api/m2-driver-api/rule.js";
import { getDriverLabel } from "_o/api/m2-driver-api/common.js";
  import {cpTranslate} from '@/libs/tools'
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
      modal1: false,
      logModal: false,
			modalName: '新增排班',
      ruleType: 'A',
      params: {},
      detailData: {},
      shiftUuid: '',
      logTotal: 10,
      logCurrPage: 1,
      logPageSize: 10,
      logTableData: []
    };
  },
  mounted() {
    this.getList();
    this.getCityList();
    this.getDriverTypeList();
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
    getList() {
      let params = Object.assign(this.params,{currPage: this.pageData.currPage,pageSize:this.pageData.pageSize})
      rulequeryPageList(params).then((res) =>{
        if(res.data.success) {
          this.tableData = res.data.data.list;
          this.pageData.total = res.data.data.totalCount
          this.$store.commit("changeLoadingFlag", false);
        }
      })
    },
    getDriverTypeList() {
      getDriverLabel().then((res) =>{
        if(res.data.success) {
          this.inputList[1].dropList = []
          res.data.data.forEach(item => {
            this.inputList[1].dropList.push({
              value: item.itemcode,
              label: item.itemvalue
            });
          });
        }
      })
    },
		cpTranslate(cpList) {
      let arr = JSON.parse(JSON.stringify(cpList))
			arr.forEach(function (item, index) {
				item.value = item.cityID
				item.label = item.city
			})
			return arr
		},
    addRule() {
			this.modalName = "新增排班"
      this.modal1 = true;
      this.ruleType = 'A';

		},
		closeChange() {
      this.modal1 = false;
    },
    submitChange() {
      this.pageData.currPage = 1;
      this.modal1 = false;
      this.getList();
    },
    search(data) {
      this.params = data;
      this.pageData.currPage = 1;
      this.getList()
    },
    reset() {
      this.params = {};
      this.pageData.currPage = 1;
      this.pageData.pageSize = 10;
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
    logchange() {
      this.logModal = true;
      this.logPageSize = 10;
      this.logCurrPage = 1;
      this.getQueryLog();
    },
    getQueryLog() {
      queryLog({pageSize: this.logPageSize,currPage: this.logCurrPage}).then((res) =>{
        if(res.data.success) {
          this.logTableData = []
          this.logTableData = res.data.data.list;
          this.logTotal = res.data.data.totalCount;
        }
      })
    },
    logChangePage(val) {
      this.logCurrPage= val;
      this.getQueryLog();
    },
    logChangePageSize(val) {
      this.logPageSize= val;
      this.getQueryLog();
    },
  }
};
</script>
<style lang="less">
.new-rule-modal{
	.ivu-modal-body{
		padding: 16px 0 !important;
	}
}

</style>

