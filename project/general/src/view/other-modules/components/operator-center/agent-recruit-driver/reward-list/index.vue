<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" :axiosFun="axiosAgentNameList"></SearchList>
    <div class="right-flex">
      <export-file
        type="success"
        class="right15"
        :isDisabled="tableData.length===0"
        exportUrl="/api/operatorReward/exportRewardPayment"
        exportFileName="运营商招募司机奖励信息.xlsx"
        :queryData="searchData"
        btnText="批量导出"
      ></export-file>
      <Button
        type="primary"
        class="right15"
        @click="rewardItem(true)">批量奖励</Button>
      <ImportFile
        btnText="奖励发放记录导入"
        sameMessage="导入数据最多500条，超出信息默认不导入"
        :importFileUrl="importUrl"
        :toDownTemplateUrl="downLoadUrl"
        @on-success="getTableList"
        @on-error="uploadFail"
      >
      </ImportFile>
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
      @changePageSize="changePageSize"
      @selectHandle="selectHandle">
      <template slot-scope="params" slot="action">
        <Button
          v-if="params.data.row.rewardStatus===1"
          ghost
          type="error"
          size="small"
          class="tableBtn"
          @click="cancelRewardItem(params.data.row)"
        >取消奖励</Button>
        <Button
          v-else
          ghost
          type="primary"
          size="small"
          class="tableBtn"
          @click="rewardItem(false,params.data.row)"
        >奖励</Button>
        <Button
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="turnToDetail(params.data.row)"
        >详情</Button>
        <Button
          ghost
          type="success"
          size="small"
          @click="openHistory(params.data.row)"
        >操作日志</Button>
      </template>
    </m2-table>
    <!-- 新增协议 -->
    <history-modal
      :show="showHistoryModal"
      :rewardCode="historyUuid"
      @close="showHistoryModal=false"
    ></history-modal>
    <import-fail-modal
      :show="isImportFail"
      :info="importFailInfo"
      @close="isImportFail=false">
    </import-fail-modal>
  </div>
</template>
<script>
import { inputList, parColumns } from "./fields";
import historyModal from "./components/history-modal";
import ImportFile from '_a/import-file/index.vue'
import importFailModal from "_a/import-file//import-fail-modal";
import m2Table from "_a/m2-table/v-table";
import ExportFile from '_a/export-file/exportFile';
import { driverOriginMap } from "_o/components/operator-center/agent-recruit-driver/status-map"

import {
  axiosAgentNameList,
  axiosAgentRewardList,
  axiosAgentRewardCancel,
  axiosAgentReward
} from "_o/api/operator-carrier";
import { cpTranslate } from '@/libs/tools';

export default {
  name: "safe-score-list",
  data() {
    return {
      axiosAgentNameList:axiosAgentNameList,
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: false,
      // 操作记录模态框
      showHistoryModal: false,
      historyUuid: '',
      // 选择删除uuid列表
      selectList: [],
      // 下载导入模板
      importUrl: '/api/operatorReward/importRewardPayment',
      downLoadUrl: '/download/运营商导入现金发放记录.xlsx',
      isImportFail: false,
      importFailInfo:{}
    };
  },
  components: {
    m2Table,
    historyModal,
    ImportFile,
    ExportFile,
    importFailModal
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        ...this.searchData,
        pageSize: this.pageSize,
        currPage: this.current
      };
      this.isLoading = true;

      axiosAgentRewardList(params)
        .then(res => {
          this.isLoading = false;
          let data = res.data.data || {};
          let list = data.list || [];
          list.forEach(item => {
            if (item.rewardStatus === 1) {
              item._disabled = true;
            }
            // 司机来源渠道
            let arr = item.channelType.split(',').map(son=>{
              return driverOriginMap[Number(son)]
            })
            item.channelTypeName = arr.join(',')
            // 奖励形式
            let typeArr = []
            item.rewardType.includes('0') && typeArr.push('固定金额')
            item.rewardType.includes('1') && typeArr.push('梯度奖励')
            item.rewardTypeName = typeArr.join(',')
            // 奖励周期-活动有效期
            item.effectiveTime = `${this.$moment(item.validTime).format("YYYY-MM-DD")} 至 ${this.$moment(item.expireTime).format("YYYY-MM-DD")}`
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
    },
    // 打开日志
    openHistory(item){
      this.historyUuid = item.rewardCode
      this.showHistoryModal = true
    },
    cancelRewardItem(item){
      console.log(item)
      this.$Modal.confirm({
        title: "取消",
        content: `<p>是否确认取消奖励记录？</p>`,
        onOk: () => {
          let params = {
            rewardDistributionCodeList: [item.rewardCode]
          };
          axiosAgentRewardCancel(params).then(res => {
            this.$Message.success("取消奖励成功!");
            this.getTableList(true);
          });
        }
      });
    },
    // 开启关闭
    rewardItem(isBatch,item) {
      if(isBatch===true){
        if (this.selectList.length <= 0) {
          this.$Message.warning("请先勾选一条记录");
          return;
        }
      }
      let msg = isBatch?'<p>确定将已选择的记录设置为已奖励？</p>':"<p>是否确认发放奖励？</p>"
      this.$Modal.confirm({
        title: "确认",
        content: msg,
        onOk: () => {
          let params = {
            rewardDistributionCodeList: isBatch ? this.selectList : [item.rewardCode]
          };
          axiosAgentReward(params).then(res => {
            this.$Message.success("奖励成功!");
            this.getTableList(true);
          });
        }
      });
    },
    selectHandle(list){
      this.selectList = list.map(item=>item.rewardCode)
    },
    turnToDetail(item){
      this.$router.push(`/opCenter/recomd-driver-manage/agent-detail/${item.ruleId}?agentUuid=${item.agentUuid}`)
    },
    uploadFail(res) {
      let data = res.data
      if(data.downloadFlag){
        this.importFailInfo = {
          params: data,
          msg: data.failMsg,
          url: '/api/operatorReward/downloadErrorRecord',
          baseUrl: '/m2-admin'
        }
        this.isImportFail = true
        this.getTableList(true);
      }
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