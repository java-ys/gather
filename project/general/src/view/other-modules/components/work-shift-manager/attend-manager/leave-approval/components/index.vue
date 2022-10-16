<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="reset"
      @cascade-change="handleCityChange"
    >
    </SearchList>
    <div style="overflow: hidden;">
      <router-link :to="{name: 'leave-rule'}">
        <Button
          v-if="attedType==1"
          type="primary"
          style="margin-right: 10px;margin-bottom: 20px"
          >请假规则</Button
        >
      </router-link>
      <!-- <Button
        type="primary"
        style="margin-right: 10px;margin-bottom: 20px;float: right;"
        @click="logchange"
        >日志</Button
      > -->
    </div>
    <!-- <VTable
      :total="pageData.total"
      :current="pageData.currPage"
      :pageSize="pageData.pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable> -->
      <m2-table
        :total="pageData.total"
        :current="pageData.currPage"
        :pageSize="pageData.pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :isLoading="isLoading"
      ></m2-table>
    <!-- <Modal
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
      </Modal> -->

    <modal-approval :show="isShow" :attedType="attedType" :title="approvalTitle" @submitChange="submitChange" @closeChange="closeModelChange" :id="id">></modal-approval>
    <modal-detail :show="detailShow" :attedType="attedType" @submitChange="detailSubmit" :footer-hide="true" :id="id"></modal-detail>
  </div>
</template>

<script>
import ModalApproval from "./modal";
import ModalDetail from "./detail";
import { tableColumns, compensateList, initTableColumns } from "./fields";
import { getProvinceCityList } from '_g/api/common.js';
import { cpTranslate } from '@/libs/tools'
import { driverNameMobileList, cancelLeaveList, leaveList, patchLeaveList, restLeaveList } from "_o/api/rest";
import { getAgentByCity } from "_g/api/configData";
import { deepClone, timeFormat } from "./utils";
import m2Table from "_a/m2-table/v-table.vue";


export default {
  props: {
    attedType: {
			type: Number,
			default: 3
		}
  },
  components: {
    ModalApproval,
    ModalDetail,
    m2Table
  },
  data() {
    const { inputList, pageData, tableColumns, initTableColumns } = deepClone({}, compensateList);
    return {
      isShow: false,
      detailShow: false,
      id: null,
      inputList: inputList(this),
      totalCount: null,
      ...pageData,
      tableColumns: tableColumns(this),
      params: {},
      initTableColumns,
      // logParams: {
      //   businessType: 3
      // },
      // logTotal: 10,
      // logCurrPage: 1,
      // logPageSize: 10,
      // logModal: false,
      // logTableData: [],
      getPageList: {},
      approvalTitle: "",
      isLoading: true
    };
  },
  created() {
    if(this.attedType != 2){
      this.tableColumns.splice(12, 1)
    }
    switch(this.attedType) {
     case 1:
        this.getPageList = leaveList
        break;
     case 2:
        this.getPageList = cancelLeaveList
        break;
     case 3:
        this.getPageList = patchLeaveList
        break;
     case 4:
        this.getPageList = restLeaveList
        break;
    }
    if(this.attedType == 4){
      this.inputList.splice(5, 1)
      this.tableColumns[9].title="当月累计休息"
    }
  },
  mounted() {
    this.getCityList()
    this.getList();
  },
  methods: {
    // 加载列表
    getList() {
      let params = Object.assign(this.params,{currPage: this.pageData.currPage,pageSize:this.pageData.pageSize})
      this.getPageList(params).then((res) =>{
        if(res.data.success) {
          if(res.data.data.list.length == 0 && this.pageData.currPage>1){
            this.pageData.currPage--
            this.getList()
            return
          }
          this.isLoading = false
          console.log(res)
          this.tableData = res.data.data.list;
          this.pageData.total = res.data.data.totalCount
        }
      })
    },
    // 获取城市列表
    getCityList() {
      getProvinceCityList({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data)
          this.inputList[0].cascaderList = list
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    handleCityChange(value) {
      const [city, citycode] = value;
      if (!city) {
        this.inputList[1].dropList = []
        this.inputList[1].value = ""
        return
      };
      this.getAgentList(citycode);
    },
    // 获取运营商
    getAgentList(cityCode) {
      if (!cityCode) return;
      getAgentByCity({cityCode: cityCode}).then(res => {
        if (res.data.success) {
          let list = (res.data.data || []).map(item => {
        return {
          label: item.name,
          value: item.uuid
        };
      });
          this.inputList[1].dropList = list
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    search(data) {
      if(data.applyTimeEnd){
        data.applyTimeEnd = timeFormat(data.applyTimeEnd, "endTime");
        data.applyTimeStart = timeFormat(data.applyTimeStart, "yyyy-mm-dd");
      }
      this.pageData.currPage = 1;
      this.params = data;
      this.getList();
    },
    reset() {
      this.params = {};
      this.pageData.currPage = 1;
      this.getList();
    },
    //处理分页
    changePageSize(val) {
      this.pageData.pageSize = val;
      this.getList();
    },
    changePage(val) {
      this.pageData.currPage = val;
      this.getList();
    },
    toCalendar(row) {
      this.$router.push({
        name: "attendence-calendar",
        query: row
      });
    },
    submitChange(){
      this.isShow = false
      this.getList()
    },
    closeModelChange() {
      this.isShow = false
    },
    detailSubmit(){
      this.detailShow = false
    },
    // 日志方法
    getLogList() {
      console.log("日志方法")
    },
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

<style scoped lang="less" src="./index.less"></style>
<style lang="less">
.ivu-table-cell a{
  margin: 0 10px;
}
.ivu-table-cell span{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
.ivu-input[disabled], fieldset[disabled] .ivu-input{
  background-color: #fff;
}
</style>
