<template>
  <div class="passenger-recommand-driver">
    <search-list
      :inputList="inputList"
      @on-search="searchData"
      @on-reset="resetData"
    ></search-list>
    <div class="button-wrap">
      <Button type="primary" @click="showAdd = true" v-hasAuth="'x-recommand-driver-add-rule'">新增推荐奖励配置</Button>
      <!-- <Button type="primary" @click="getAwardChange" style="float: right">奖励信息</Button> -->
    </div>
    <t-table
      :isLoading="awardListLoading"
      :current="tableConfig.current"
      :total="tableConfig.total"
      :pageSize="tableConfig.pageSize"
      :parColumns="tableConfig.tableColumns"
      :parTableData="tableConfig.tableData"
      @changePage="tablePageChange"
      @changePageSize="tablePageSizeChange"
    >
    </t-table>
    <!-- 操作记录弹框 -->
    <Modal v-model="showRecord" title="操作记录">
      <div class="showRecord-content">
        <v-table
          :current="modalTable.current"
          :pageSize="modalTable.pageSize"
          :parColumns="modalTable.tableColumns"
          :parTableData="modalTable.tableData"
          :isShowPage="false"
        >
        </v-table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="showRecord = false">确定</Button>
      </div>
    </Modal>
    <!-- 新增推荐奖励配置弹框 -->
    <add-rule
      v-if="showAdd"
      :showAdd="showAdd"
      :cityList="cityList"
      @close="close"
      @confirmAdd="confirmAdd"
    ></add-rule>
  </div>
</template>

<script>
import { inputList, tableColumns, modalTableColumns } from "./conf";
import addRule from "./addRule.vue";
import { cpTranslate } from "@/libs/tools";
import {
  getCityList,
  deadOperation,
  getRecord,
  queryRuleList,
  queryRewardOperateLog,
  closeRule,
  openRule,
  modifyStatus
} from "_o/api/operator-carrier";
import { constants } from "crypto";
export default {
  name: "passenger-recommand-driver",
  components: { addRule },
  data() {
    return {
      awardListLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      showRecord: false,
      tableConfig: {
        searchParams: {},
        current: 1,
        total: 0,
        pageSize: 10,
        tableColumns: tableColumns(this),
        tableData: [],
      },
      modalTable: {
        current: 1,
        pageSize: 10,
        tableColumns: modalTableColumns(this),
        tableData: [],
      },
      showAdd: false,
      dateOptions: {},
      cityList: [],
    };
  },
  mounted() {
    this.translateCityList();
    this.getTableConfigData();
  },
  methods: {
    translateCityList() {
      getCityList({}).then((res) => {
        let list = cpTranslate(res.data.data);
        this.inputList[1].cascaderList = [...list];
        this.cityList = [...list];
      });
    },
    searchData(params) {
      // 全国所有城市
      //   if (params.provinceCode === "1") {
      //     params.cityCode = "1";
      //   }

      // 代表x端推荐司机 1 -> 司机    2 -> 乘客
      // params.ruleType = 2;
      this.tableConfig.searchParams = params;
      this.tableConfig.current = 1;
      this.getTableConfigData();
    },
    resetData() {
      // 重置搜索条件与分页
      this.tableConfig.current = 1;
      this.tableConfig.searchParams = {};
      this.getTableConfigData();
    },
    // 获取列表数据
    getTableConfigData(params = this.tableConfig.searchParams) {
      let conf = {
        currPage: this.tableConfig.current,
        pageSize: this.tableConfig.pageSize,
      };
      params = Object.assign(conf, params);
      this.awardListLoading = true;
      queryRuleList(params).then((res) => {
        this.awardListLoading = false;
        let list = res.data.data.list;
        this.tableConfig.tableData = list;
        this.tableConfig.total = res.data.data.totalCount;
      });
      this.$store.commit("changeLoadingFlag", false);
    },
    tablePageChange(page) {
      this.tableConfig.current = page;
      this.getTableConfigData();
    },
    tablePageSizeChange(pageSize) {
      this.tableConfig.pageSize = pageSize;
      this.getTableConfigData();
    },
    // 确认新增
    confirmAdd() {
      this.getTableConfigData();
      this.close();
    },
    // 取消新增
    close() {
      this.showAdd = false;
    },
    mdfStatus(data, status) {
      const params = {
        ruleId: data.ruleId,
        operateType: status,
        rewardObject: data.rewardObjectList
      }
      const msgs = {
        1: '推荐奖励配已被启用',
        2: '推荐奖励配已被终止',
        3: '推荐奖励配已被废弃'
      }
      modifyStatus(params).then(res => {
        const {data} = res
        if(data.success) {
          this.$Message.success(msgs[status]);
          this.getTableConfigData();
        }

      })
    },
    // 获取操作记录列表数据
    getModalTableData(data) {
      queryRewardOperateLog({
        ruleId: data.ruleId,
      }).then((res) => {
        this.modalTable.tableData = res.data.list;
      });
    },
    // 格式化数字为两位小数
    formatNumber(value) {
      let reg = /^\d+\.\d{3,}$/;
      if (reg.test(value)) {
        let number = value.toFixed(2) - 0;
        return number;
      }
      return value;
    },
    getAwardChange() {
      this.$router.push({
        name: "passenger-award-info",
      });
    },
  },
};
</script>

<style lang="less">
.passenger-recommand-driver {
  .button-wrap {
    margin-bottom: 20px;
  }
}
</style>
