<template>
  <div class="driver-award">
    <search-list
      ref="searchForm"
      :inputList="inputList"
      @on-search="getPage"
      @on-reset="reset"
    ></search-list>
    <div class="block-btns">
      <Button type="primary"  @click="batchReward" v-hasAuth="'x-driver-award'">批量奖励</Button>
      <export-file
        v-hasAuth="'x-driver-award-export'"
        btnText="批量导出"
        exportUrl="/api/resource/recruit/recommend/driver/reward/export"
        baseUrlKey="_baseResourceRecruit"
        exportFileName="司机奖励发放数据信息.xls"
        :isMastQuery="true"
        :queryData="queryForm"
        @click.native="getQueryForm"
      ></export-file>
      <!-- <Button type="primary" @click="rewardExportExcel">批量导出</Button> -->
      <Button type="primary" @click="importExcel" v-hasAuth="'x-driver-import'">批量奖励导入</Button>
    </div>
    <div class="block-table">
      <t-table
        :isLoading="awardLoading"
        :current="currPage"
        :total="totalCount"
        :pageSize="pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @selectHandle="handleSelectionChange"
        @changePage="tablePageChange"
        @changePageSize="tablePageSizeChange"
      ></t-table>
    </div>

    <!-- 奖励发放 -->
    <driver-reward-add 
      ref="rewardAdd"
      :driverUuidList="driverUuidList"
      :isShowAmount="isShowAmount"
      :driverRewardVisable="driverRewardVisable"
      :driverRewardForm="driverRewardForm"
      @closeDialogHandle="closeDialogHandle"
      @addSuccessHandle="addSuccessHandle"
      ></driver-reward-add>

    <driver-reward-detail
      :driverRewardDetailVisable="driverRewardDetailVisable"
      :rewardDetailData="rewardDetailData"
      @closeDialogHandle="closeDialogHandle"
      ></driver-reward-detail>
    <!-- 日志 -->
    <logs
      :logVisible="logVisible"
      :logTableData="logTableData"
      :logTotalCount="logTotalCount"
      :currentLog="currentLog"
      :currentId="currentId"
      @closeDialogHandle="closeDialogHandle"
      @handleLogsPage="handleLogsPage"
      ></logs>
    <!-- 批量导入 -->
    <batch-import
      :batchInsertVisible="batchInsertVisible"
      @successReload="importSuccessReload"
      @closeDialogHandle="closeImportDialogHandle"
      :isBondManage="true"
      :notePictureArr="notePictureArr"
      :templateHref="templateHref"
      :importAction="importAction"
    ></batch-import>
    <!-- 导入结果反馈 -->
    <batch-add-result
      :batchAddResultData="batchAddResultData"
      :resultVisible="resultVisible"
      @closeDialogHandle="closeImportDialogHandle"
      @errorImport="errorImport"
    ></batch-add-result>
  </div>
</template>
<script>
import { createInputList, tableColumns } from "./driverAward.conf";
import { 
  deleteEmptyProps,
  dateTimeFormat,
  validatePhoneQuery,
  validateIdCardQuery,
  excelDownload
} from '@/libs/util'
import { cpTranslate } from "@/libs/tools";
import {
  recommendRecord,
  queryAgent,
  recommendDetails,
  operateLog,
  rewardExport,
  getCityList
} from "_o/api/operator-carrier";

import driverRewardAdd from "./driverRewardAdd.vue"
import driverRewardDetail from "./driverRewardDetail.vue"
import exportFile from "_a/export-file/exportFile.vue"
import logs from "./logs.vue"
import batchImport from "./batchImport.vue";
import batchAddResult from "./batchImportResult.vue";

export default {
  name: "DriverAward",
  components: {
    driverRewardAdd,
    driverRewardDetail,
    logs,
    exportFile,
    batchImport,
    batchAddResult
  },
  data() {
    return {
      awardLoading: false,
      inputList: [],
      tableColumns: tableColumns(this),
      exportLoading: false,
      WaterMarkInfo: "",
      importRule: true,
      queryForm: {
      },
      payDataArr: [],
      rewardPayDataArr: [],
      driverRewardVisable: false,
      driverRewardDetailVisable: false,
      isShowAmount: false,
      driverRewardForm: {},
      rewardDetailData: {
        talent: {},
        talentScout: {},
      },
      driverUuidList: [],
      cities: [],
      agents: [],
      selectedRows: [],
      currPage: 1,
      pageSize: 10,
      logPageSize: 10,
      sortColumnName: "operate_time",
      totalCount: 0,
      tableData: [],
      currentLog: "",
      currentId: "",
      batchInsertVisible: false,
      resultVisible: false,
      batchAddResultData: {},
      // 批量导入提示图片数组
      notePictureArr: [],
      // 导入模板下载链
      templateHref:
        "/downloadExcel/司机推荐奖励导入.xlsx",
      // 上传excel的api地址
      importAction: "/api/resource/recruit/recommend/driver/reward/import",
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      queryRules: {
        identityCard: [{ validator: validateIdCardQuery, trigger: "blur" }],
        mobile: [{ validator: validatePhoneQuery, trigger: "blur" }],
      },
    };
  },
  methods: {
    getQueryForm(){
      // this.queryForm = this.$refs.searchForm.getSearchData()
    },
    tablePageChange(page) {
      this.currPage = page;
      this.getPage();
    },
    tablePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPage();
    },
    // 表格选中事件
    selectionChange(selection) {
      this.selectionTableData = selection;
    },
    importExcel() {
      this.batchInsertVisible = true;
    },
    importSuccessReload(json) {
      if (json.response.success) {
        this.batchInsertVisible = false;
        this.batchAddResultData = json;
        this.resultVisible = true;
        this.getPage();
      } else {
        this.$Message.error(json.response.msg)
      }
    },
    errorImport() {
      this.resultVisible = false;
      this.$Message.warning("导入失败，请检查导入的excel是否符合模板要求");
    },
    closeImportDialogHandle(type) {
      switch (type) {
        case "batchAdd":
          this.batchInsertVisible = false;
          break;
        case "result":
          this.resultVisible = false;
          break;
      }
    },
    getAgent() {
      const params = this.cityCode ? {cityCode: this.cityCode} : {}
      queryAgent(params)
        .then((res) => {
          const {data} = res

          if (data.data && data.data.length > 0) {
            this.agents = res.data.data
            this.setCityAndAgent(this.cities, this.agents)
          } else {
            this.setCityAndAgent(this.cities, [])
            this.$Modal.warning({
              title: "暂无开通运营商数据信息",
              content: "暂无开通运营商数据信息，请先联系相关运营人员进行开通城市操作",
            });
          }
        })
        .catch((err) => {
          this.$Message.error("获取数据信息失败，请刷新页面重试");
        });
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    isReward(params, status) {
      this.$refs.rewardAdd.getData(params, status);
      if (status == 2) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定取消奖励?',
          onOk: () => {
            this.$refs.rewardAdd.cancelReward();
          }
        })
      } else {
        this.$refs.rewardAdd.changeStatus(true);
      }
    },
    getDetails(recordId) {
      this.driverRewardDetailVisable = true;
      recommendDetails({ recommendId: recordId })
        .then((res) => {
          if (res.data.success && res.data.data) {
            this.rewardDetailData = res.data.data;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch((error) => {
          this.$Message.error("获取司机奖励发放详情失败，请稍后重试");
        });
    },
   
    changeValue(value) {
      let obj = {};
      obj = this.agents.find((item) => {
        return item.uuid === value; //筛选出匹配数据
      });
      this.queryForm.agentName = obj ? obj.name : "";
    },
    getLogs(id, name, hasOpenLogDialog) {
      operateLog({
        recommendId: id,
        currPage: this.currPage,
        pageSize: this.logPageSize,
        sortColumnName: this.sortColumnName,
      })
        .then((res) => {
          if (res.data.success && res.data.data) {
            this.logTableData = res.data.data.list;
            this.logTotalCount = res.data.data.totalCount;
          } else {
            this.logTableData = [];
            this.logTotalCount = 0;
          }
          if (!hasOpenLogDialog) {
            this.currentId = String(id);
            this.currentLog = "当前司机奖励发放";
            this.logVisible = true;
          }
        })
        .catch((error) => {
          this.$Message.error("查看司机奖励发放详情失败，请稍后重试");
        });
    },
    handleLogsPage(params) {
      this.currPage = params.currPage;
      this.getLogs(params.currentId, params.currentLog, true);
    },
    // 重置
    reset() {
      this.queryForm = {
        name: this.name,
        mobile: this.mobile,
        identityCard: this.identityCard,
        agentUuid: this.agentUuid,
        rewardStatus: this.rewardStatus,
        cityCode: this.cityCode,
      };
      this.payDataArr = [];
      this.rewardPayDataArr = [];
      this.currPage = 1;
      this.getPage({
        currPage: 1,
        pageSize: 10,
        isDesc: "false",
      });
      this.getAgent();
    },
    //批量奖励
    batchReward() {
      this.isShowAmount = false;
      let driverRewardList = [];
      if (this.selectedRows.length === 0) {
        this.$Message.error("请至少选中一行数据");
      } else {
        this.$refs.rewardAdd.getData(this.selectedRows, 1);
        // 显示弹框
        this.$refs.rewardAdd.changeStatus(true);
      }
    },

    closeDialogHandle(type) {
      switch (type) {
        case "driverRewardAdd":
          this.driverRewardVisable = false;
          break;
        case "log":
          this.currPage = 1;
          this.logVisible = false;
          break;
        case "detail":
          this.driverRewardDetailVisable = false;
      }
    },

    addSuccessHandle() {
      this.getPage(deleteEmptyProps(this.queryForm, ["isDesc"]));
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    rewardExportExcel() {
      const requestParams = this.$refs.searchForm.getSearchData()
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 ||
            requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      this.exportLoading = true;
      rewardExport(requestParams).then((res) => {
        excelDownload(res.data, "司机奖励发放数据信息");
      });
    },
    // 获得分页数据并解析
    getPage() {
      const params = this.$refs.searchForm.getSearchData()
      this.queryForm = params
      const requestParams = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        ...JSON.parse(JSON.stringify(params))
      }

      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          Number(requestParams[propName]) === -1
        ) {
          delete requestParams[propName];
        }
      }
      this.awardLoading = true
      // 获取司机奖励发放列表
      recommendRecord(requestParams)
        .then((res) => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.totalCount = res.data.data.totalCount;
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }
          this.awardLoading = false
        })
        .catch((error) => {
          this.$Message.error("获取司机奖励发放分页列表数据失败，请稍后重试");
          this.awardLoading= false
        });
    },
    searchDataChange(p, q, item) {
      const [provinceCode, cityCode] = p
      if(this.cityCode !== cityCode) {
        this.cityCode = cityCode
        console.log(this.inputList[0].cascaderList)
        this.getAgent()
      }
    },
    setCityAndAgent(citys, agents) {
      if(citys) {
        this.inputList = createInputList({
          citys,
          orgs: agents.map((item) => {
            return {
              label: item.agentName,
              value: item.agentUuid,
            };
          }),
        });
      }else{
        this.inputList.find(item => item.bind_key === 'agentUuid').dropList = agents.map( item => {
          return {
            label: item.agentName,
            value: item.agentUuid,
          }
        })
      }
    },
    getAllCities() {
      getCityList({}).then( res => {
        const {data} = res
        if(data.success) {
          this.cities = cpTranslate(data.data)
          this.setCityAndAgent(this.cities, [])
        }
      })
    }
  },
  created() {
    this.getAllCities()
    this.$nextTick(() => {
      this.getAgent();
      this.getPage();
    })
  },
  filters: {
    rounding(value) {
      if (value == "" || value == null) {
        value = 0;
      }
      return Number(value).toFixed(2);
    },
  },
};
</script>
<style lang="less" scoped>
  .block-table{
    margin-top: 20px;
  }
</style>