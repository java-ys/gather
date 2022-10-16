<template>
  <div>
    <div class="customer">
      <SearchList :inputList="inputList" @on-search="searchData" @on-reset="resetData"></SearchList>
    </div>
    <div>
      <Button type="primary" style="margin-right: 15px;margin-bottom: 15px" @click="addRule">新增规则</Button>
      <Button type="primary" style="margin-right: 15px;margin-bottom: 15px" @click="configRule">类型配置</Button>
      <Button type="primary" style="float: right;margin-right: 15px" @click="getLog">日志</Button>
      <v-table
        :current="currPage"
        :total="total"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></v-table>
      <add
        ref="addRuleModal"
        v-model="addRuleVisible"
        :params="nowRow"
        :isEdit="isEdit"
        :ruleTitle="ruleTitle"
        @on-confirm="addConfirm"
      ></add>
      <detail ref="detailModal" v-model="detailVisible" :data="nowRow"></detail>
      <type-config ref="configModal" v-model="configVisible"></type-config>
      <!-- <Modal v-model="logVisible" title="操作日志" width="700px">
        <div class="operateLog-content">
          <v-table
            :parColumns="logTable.tableColumns"
            :parTableData="logTable.tableData"
            :isShowPage="false"
          ></v-table>
        </div>
        <div slot="footer">
          <Button type="primary" @click="logVisible = false">确定</Button>
        </div>
      </Modal>-->
      <Modal
        v-model="logVisible"
        title="操作日志"
        width="80%"
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
        ></VTable>
      </Modal>
    </div>
  </div>
</template>
<script>
import { getProvinceCityAllList } from "_g/api/common.js";
import { ruleData, logTableColumns, initTableColumns } from "./fields.js";
import {
  addCompensateRule, //新增补偿列表
  editCompensateRule, //编辑补偿列表
  deleteCompensateRule, //删除补偿列表
  getRuleDetail, //补偿列表详情
  getpageList //查询列表
} from "_o/api/compensate.js";
import { logList } from "_o/api/rest.js";
import add from "./add.vue";
import detail from "./detail.vue";
import typeConfig from "./config.vue";
import { cpTranslate } from "@/libs/tools";
import { deepClone } from "./utils";
export default {
  components: {
    add,
    detail,
    typeConfig
  },
  data() {
    const { inputList, columns } = deepClone({}, ruleData);
    return {
      initTableColumns,
      inputList,
      nowRow: {},
      searchParams: {},
      currPage: 1,
      pageSize: 10,
      total: 0,
      columns: columns(this),
      tableData: [],
      isEdit: false,
      ruleTitle: "",
      detailVisible: false,
      addRuleVisible: false,
      configVisible: false,
      logVisible: false,
      logTable: {
        current: 1,
        pageSize: 10,
        tableColumns: logTableColumns(this),
        tableData: []
      },
      logTotal: 0,
      logCurrPage: 1,
      logPageSize: 10,
      logTableData: []
    };
  },
  mounted() {
    this.getCityList();
    this.getTablList();
  },
  methods: {
    // 获取城市列表
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data);
          this.inputList[0].cascaderList = list;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 获取补偿规则列表
    getTablList(params = this.searchParams) {
      let conf = {
        currPage: this.currPage,
        pageSize: this.pageSize
      };
      Object.assign(params, conf);
      getpageList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.totalCount;
        }
      });
    },
    getLog() {
      this.logVisible = true;
      this.getLogList();
    },
    // 日志列表
    getLogList() {
      let params = Object.assign(
        { businessType: 4 },
        { currPage: this.logCurrPage, pageSize: this.logPageSize }
      );
      logList(params).then(res => {
        if (res.data.success) {
          this.logTableData =
            res.data.data && res.data.data.list ? res.data.data.list : [];
          this.logTotal =
            res.data.data && res.data.data.totalCount
              ? res.data.data.totalCount
              : 0;
        }
      });
    },
    // 补偿规则详情
    detail(row) {
      // getdetailList({ cityCode: "500100" }).then(res => {});
      this.detailVisible = true;
      this.nowRow = row;
    },
    // 删除补偿规则列表
    delete(id) {
      this.$Modal.confirm({
        title: "是否确认删除",
        onOk: () => {
          deleteCompensateRule({ id }).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg);
              this.getTablList();
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 新增规则
    addRule() {
      this.ruleTitle = "新建停运补偿规则";
      this.isEdit = false;
      this.addRuleVisible = true;
    },
    // 编辑规则
    editRule(row) {
      this.ruleTitle = "编辑停运补偿规则";
      this.addRuleVisible = true;
      this.isEdit = true;
      this.nowRow = row;
    },
    // 类型配置
    configRule() {
      this.configVisible = true;
    },
    searchData(params) {
      this.searchParams = params;
      this.currPage = 1;
      this.getTablList();
    },
    resetData() {
      this.searchParams = {};
      this.currPage = 1;
      this.getTablList();
    },
    changePage(page) {
      this.currPage = page;
      this.getTablList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTablList();
    },
    addConfirm() {
      this.addRuleVisible = false;
      this.getTablList();
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
