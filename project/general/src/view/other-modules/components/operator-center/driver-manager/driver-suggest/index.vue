<template>
  <div>
    <SearchList class="top15" :inputList="inputList" @on-search="search" @on-reset="search" @loadData="loadData"></SearchList>
    <export-file
      v-hasAuth="'driver-suggest-export'"
      :isDisabled="isExportBtn"
      exportUrl="/admin/feedback/driver/exportDriverProposalList"
      exportFileName="司机反馈建议列表.xlsx"
      :queryData="searchData"
      btnText="批量导出"
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
          <Button ghost type="info" size="small" v-hasAuth="'driver-suggest-detail'" @click="openDetail(params.data.row)">详情</Button>
      </template>
    </m2-table>
    <t-detail :show="openDetailModal" :id="detailId" :type="2" @close="(isReload)=>closeModal('openDetailModal',isReload)"></t-detail>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns } from "./fields";
import tDetail from "../driver-question/components/detail.vue";
import {
  axiosDriverProposalList,
  axiosDriverQuestionDetail
} from "_o/api/operator-carrier";
import {
  getOnLineCity,
  getAgentByCity,
  getDriverByAgent
} from "_g/api/common.js";
import exportFile from "_a/export-file/exportFile";
import { cpLabelValue } from "@/libs/tools";

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
      searchData: {},
      isExportBtn: true,
      openDetailModal: false,
      detailId:'',
      isLoading: true
    };
  },
  components: {
    m2Table,
    exportFile,
    tDetail
  },
  mounted() {
    this.getTableList();
    // 获取已开通城市、
    this.getOpenCityList()
  },
  methods: {
    search(data) {
      this.current = 1;
      data.proposalType && (data.proposalTypeArray = [data.proposalType])
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
      axiosDriverProposalList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
        this.isExportBtn = this.tableData.length === 0 ? true : false;
      })
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    // 查询开通城市
    getOpenCityList(){
      getOnLineCity().then(res => {
        let list = res.data.data||[]
        let params = {
          list: list,
          labelKey: 'city',
          valueKey: 'cityId',
          isDeep: true,
          data: {
            loading: false,
            type:1 //级联位置
          }
        }
        list = cpLabelValue(params)
        this.inputList[5].cascaderList = list
      })
    },
    loadData (item, callback) {
      item.loading = true;
      if(item.type===1){
        //选择城市，调运营商
        getAgentByCity({cityCode: item.value}).then(res => {
          let list = res.data.data||[]
          if(list.length === 0){
            list = [
              {
                value: '0',
                label: '暂无数据',
                disabled:true
              }
            ]
          }else{
            let params = {
              list: list,
              labelKey: 'name',
              valueKey: 'uuid',
              isDeep: true,
              data: {
                loading: false,
                type:2 //级联位置
              }
            }
            list = cpLabelValue(params)
          }

          item.children = list
          item.loading = false;
          callback();
        })
      }else{
        //选择运营商，调司管
        getDriverByAgent({agentId: item.value}).then(res => {
          let list = res.data.data||[]
          if(list.length === 0){
            list = [
              {
                value: '0',
                label: '暂无数据',
                disabled:true
              }
            ]
          }else{
            let params = {
              list: list,
              labelKey: 'realName',
              valueKey: 'uuid',
              isDeep: false,
              data: {
                type:3 //级联位置
              }
            }
            list = cpLabelValue(params)
          }
          item.children = list
          item.loading = false;
          callback();
        });
      }
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    openDetail(item){
      this.detailId = item.id
      this.openDetailModal = true
    },
    closeModal(name,isReload) {
      this[name] = false;
      if(name==='openDetailModal' && isReload){
        this.getTableList();
      }
    }
  }
};
</script>