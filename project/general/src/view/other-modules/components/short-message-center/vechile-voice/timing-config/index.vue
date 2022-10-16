<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" :axiosFun="queryPageTimedVoiceNameList"></SearchList>
    <Button type="primary" @click="handleItem(1)" v-hasAuth="'vechile-voice-tAdd'">新建</Button>
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
          v-hasAuth="'vechile-voice-tDetai'"
          @click="handleItem(3,params.data.row)"
        >详情</Button>
        <!-- 数据的所有城市都在权限内，才能编辑 -->
        <Button
          v-if="params.data.row.hasAuth===1"
          ghost
          type="success"
          size="small"
          class="tableBtn"
          v-hasAuth="'vechile-voice-tEdit'"
          @click="handleItem(2,params.data.row)"
        >编辑</Button>
        <i-switch
          size="large"
          v-hasAuth="'vechile-voice-tFail'"
          v-model="params.data.row.effectiveStatus"
          :true-value="1"
          :false-value="1"
          v-if="params.data.row.effectiveStatus===1"
          @on-change="changeStatus(params.data.row)">
          <span  slot="open">生效</span>
          <span slot="close">失效</span>
        </i-switch>
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
  queryPageTimedVoiceList,
  setTimedVoiceStatus,
  queryTimedDriverProvinceCityList,
  queryPageTimedVoiceNameList
} from '_o/api/driver-broadcast'
export default {
  props: ['tabVal'],
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      queryPageTimedVoiceNameList,
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
      this.isLoading = true
      queryPageTimedVoiceList(params).then(res => {
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
      queryTimedDriverProvinceCityList({}).then(res => {
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
    },
    changeStatus(item){
      this.$Modal.confirm({
        title:'确认将该条配置置为失效？',
        onOk:()=>{
          setTimedVoiceStatus({uuid: item.uuid}).then(res => {
            this.$Message.success('已将该配置设置为失效')
            this.getTableList()
          })
        },
        onCancel:()=>{
          item.effectiveStatus=1
        }
      })
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