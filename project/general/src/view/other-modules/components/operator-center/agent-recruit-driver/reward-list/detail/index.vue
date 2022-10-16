<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search"></SearchList>
    <div class="right-flex">
      <export-file
        type="primary"
        class="right15"
        :isDisabled="tableData.length===0"
        exportUrl="/api/operatorReward/exportRewardPaymentDetailList"
        exportFileName="运营商奖励详情列表.xlsx"
        :queryData="searchData"
        btnText="批量导出"
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
      @changePageSize="changePageSize">
    </m2-table>
  </div>
</template>
<script>
import { inputList, parColumns } from "./fields";
import m2Table from "_a/m2-table/v-table";
import ExportFile from '_a/export-file/exportFile';

import {
  getCityList,
  axiosAgentRewardDetailList
} from "_o/api/operator-carrier";
import { cpTranslate } from '@/libs/tools';

export default {
  name: "agent-reward-detail-list",
  data() {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {
        ruleId: this.$route.params.id,
        agentUuid: this.$route.query.agentUuid
      },
      isLoading: false
    };
  },
  components: {
    m2Table,
    ExportFile
  },
  mounted() {
    this.getTableList();
    this.getCitys()
  },
  beforeRouteUpdate(to, from, next) {
    this.searchData.ruleId = to.params.id,
    this.searchData.agentUuid = to.query.agentUuid,
    this.getTableList();
    next();
  },
  methods: {
    getCitys(){
      getCityList({}).then(res => {
        let list = cpTranslate(res.data.data);
        this.inputList[0].cascaderList = [...list];
      });
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.searchData.ruleId = this.$route.params.id
      this.searchData.agentUuid = this.$route.query.agentUuid
      this.getTableList();
    },
    getTableList() {
      let params = {
        ...this.searchData,
        pageSize: this.pageSize,
        currPage: this.current
      };
      this.isLoading = true;

      axiosAgentRewardDetailList(params)
        .then(res => {
          this.isLoading = false;
          let data = res.data.data;
          let list = (data && data.list) || [];
          list.forEach(item => {
            if (item.rewardStatus === 1 || item.rewardType != 1) {
              item._disabled = true;
            }
          });
          this.tableData = list
          this.total = data.totalCount || 0;
          this.selectList.splice(0,this.selectList.length)
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
    }
  }
};
</script>
<style lang="less">
.right-flex{
  display: flex;
  justify-content:flex-end;
}
</style>