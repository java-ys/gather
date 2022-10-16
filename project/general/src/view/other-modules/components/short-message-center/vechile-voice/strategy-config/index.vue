<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" :axiosFun="queryPageStrategyVoiceNameList"></SearchList>
    <Button type="primary" @click="handleItem(1)" v-hasAuth="'vechile-voice-sAdd'">新建</Button>
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
          v-hasAuth="'vechile-voice-sDetai'"
          @click="handleItem(3,params.data.row)"
        >详情</Button>
        <Button
          ghost
          type="success"
          size="small"
          v-hasAuth="'vechile-voice-sEdit'"
          @click="handleItem(2,params.data.row)"
        >编辑</Button>
      </template>
    </m2-table>
    <add-modal
      :show="openAddModal"
      :handleType="handleType"
      :uuid="editInfo.uuid"
      @close="closeAddModal">
    </add-modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import addModal  from "./components/add-modal.vue";
import { parColumns,inputList } from "./fields";
import { cpLabelValue } from '@/libs/tools'
import {
  queryPageStrategyVoiceList,
  queryDriverProvinceCityList,
  queryPageStrategyVoiceNameList
} from '_o/api/driver-broadcast'
export default {
  props: ['tabVal'],
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      queryPageStrategyVoiceNameList,
      parColumns,
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      //以下为新建部分，不用可删
      openAddModal: false,
      searchData:{},
      editInfo: {},
      isLoading: false,
      handleType: 1//1-新建，2-编辑，3-详情
    };
  },
  components: {
    m2Table,
    addModal
  },
  mounted() {
    this.getTableList();
    this.getCity()
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      // 后台接口支持到时分秒
      if(params.startTimeEffective)
        params.startTimeEffective = this.$moment(params.startTimeEffective).format('YYYY-MM-DD HH:mm:ss')
      if(params.endTimeEffective)
        params.endTimeEffective = this.$moment(params.endTimeEffective).format('YYYY-MM-DD HH:mm:ss').replace('00:00:00','23:59:59')
      this.isLoading = true
      queryPageStrategyVoiceList(params).then(res => {
        let data = res.data.data||{}
        this.tableData = data.list || []
        this.total = data.totalCount || 0
        this.isLoading = false
      }).catch(err=>{
        this.isLoading = false
        this.tableData = []
        this.total = 0
      })
    },
    getCity() {
      queryDriverProvinceCityList({}).then(res => {
        let resList = res.data.data||[]

        let params = {
          list: resList,
          labelKey: 'province',
          valueKey: 'provinceID',
          isDeep: true,
          children: 'nodes',
          sonLableKey: 'city',
          sonValueKey: 'cityID'
        }
        let list = cpLabelValue(params)
        this.inputList[2].cascaderList = list
      })
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    formReset(name='addForm') {
      this.$refs[name].resetFields();
    },
    //1-新建，2-编辑，3-详情
    handleItem(type,item) {
      this.handleType = type;
      this.editInfo = item||{}
      this.openAddModal = true;
    },
    closeAddModal(isReload){
      this.openAddModal = false
      isReload && this.getTableList();
    }
  }
};
</script>
<style lang="less">
  .ivu-tooltip.lang-val{
    .ivu-tooltip-rel span{
      text-overflow:ellipsis;
      white-space:nowrap;
      display: inline-block;
      overflow:hidden;
      max-width: 226px;
    }
  }
</style>