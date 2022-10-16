<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'check-management-batch-submit'" type="primary" @click="batchSubmit">批量提交</Button>
      <Button v-hasAuth="'check-management-create-proto'" type="primary" :loading="protoLoading" @click="createContract">生成协议</Button>
      <export-file
        v-hasAuth="'check-management-batch-export'"
        type="success"
        :isDisabled="tableData.length === 0"
        exportUrl="/api/agent/assess/flow/export"
        exportFileName="考核流程管理数据.xlsx"
        :queryData="searchData"
        btnText="批量导出"
      ></export-file>
    </div>
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @on-select="onSelect"
      @select-cancel="selectCancel"
      @select-all="selectAll"
      @select-all-cancel="selectAll"
    >
      <template slot="action" slot-scope="params">
        <Button v-hasAuth="'assessment-view-btn'" type="primary" ghost size="small" @click="rowClickHandle(params.data.row,'view')">查看</Button>
        <Button v-if="params.data.row.flowStatus === 'WJ'" v-hasAuth="'assessment-change-btn'" type="warning" ghost size="small" @click="rowClickHandle(params.data.row,'change')">变更</Button>
        <Button v-if="params.data.row.flowStatus !== 'HT_ZF'" v-hasAuth="'assessment-delete'" type="error" ghost size="small" @click="invalid(params.data.row)">作废</Button>
      </template>
    </m2-table>
    <add
      v-if="showAdd"
      :visible="showAdd"
      :detail="detailData"
      :title="modalTitle"
      @close="close"
    ></add>
  </div>
</template>

<script>
// 考核流程管理
import { inputList, tableColumns } from "./fields.js";
import Add from "./components/add.vue";
import m2Table from "_a/m2-table/v-table";
import common from "../tool/common";
import { store, mutations, SelectedQuestions } from "./components/store";
import {
  flowDetailService,
  flowPageService,
  flowSubmitBatchService,
  createContractService,
  flowCancelService,
} from "_o/api/assess";
import { _getProvinceCityList, _getAgentList } from "_g/api/general";
import ExportFile from "_a/export-file/exportFile";

// 考核流程管理: 只有未提交状态, 有4个按钮, 其他状态都只有取消按钮

export default {
  name: "check-management-league",
  components: {
    Add,
    m2Table,
    ExportFile
  },
  mixins: [common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      showAdd: false,
      selectedList: new SelectedQuestions([]),
      detailData: {},
      protoLoading: false,
      modalTitle: "编辑考核标准及管理条例"
    };
  },
  created() {
    this.func = flowPageService;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.getAgentList()
    // this.rowClickHandle({id: 6}) // todo
  },
  methods: {
    async invalid(row) {
      await new Promise(resolve => this.$Modal.confirm({ title: "请再次确认是否作废该审批流程，作废后不可恢复！", onOk: resolve }));
      let p = {
        id: row.id,
      };
      const [err, data] = await this.toResult(flowCancelService(p));
      if (err) {
        return;
      }
      this.$Message.success(`作废成功`);
      this.getList();
    },
    async batchSubmit() {
      let list = this.selectedList.list;
      if (!this.submitValid()) {
        return;
      }
      let p = {
        bizCodeList: list.map((it) => it.bizCode),
      };
      const [err, data] = await this.toResult(flowSubmitBatchService(p));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("批量提交成功");
      this.getList();
    },
    async rowClickHandle(row, isView = false) {
      let [err, data] = await this.toResult(flowDetailService({
        id: row.id,
      }));
      if (err) return;
      this.detailData = data || {};
      this.detailData.rowData = row;
      this.detailData.mold = 1
      this.detailData.isView = isView === "view"
      // 除了未提交状态, 其余选项都不能修改
      // 查看详情也不能修改
      if ((this.detailData.flowStatus !== "HT_WTJ" && this.detailData.flowStatus !== "WJ") || isView === "view") {
        this.detailData.finish = true
      }
      this.detailData.agentAssessIndexVoList = this.detailData.agentAssessIndexVoList.map(it => {
        // 如果是父指标 默认显示第一个子指标
        if (it.parentFlag - 1 === 0) {
          it._subIndex = 0;
        }
        if (typeof it.indexRuleJson === "string") {
          it.indexRuleJson = JSON.parse(it.indexRuleJson)
        }
        return it;
      })
      this.modalTitle = isView === "view" ? "查看考核标准及管理条例" : isView === "change" ? "变更考核标准" : "编辑考核标准及管理条例"
      this.showAdd = true;
    },
    // 未提交状态的单子 批量提交
    submitValid() {
      let list = this.selectedList.list;

      if (!list.length) {
        this.$Message.error("请选择数据");
        return;
      }
      if (!list.every((it) => it.flowStatus === "HT_WTJ")) {
        this.$Message.error("仅支持对未提交状态的工单进行批量提交");
        return;
      }
      return true;
    },
    async createContract() {
      if (!this.createValid()) {
        return;
      }
      this.protoLoading = true
      let list = this.selectedList.list;

      let [err, data] = await this.toResult(createContractService({
        bizCodeList: list.map((it) => it.bizCode),
      }));
      this.protoLoading = false

      if (err) return;
      this.$Message.success("生成协议成功");
      this.getList();
    },
    // 已完结的单子 生成协议
    createValid() {
      let list = this.selectedList.list;
      if (!list.length) {
        this.$Message.error("请选择数据");
        return;
      }
      if (!list.every((it) => it.flowStatus === "WJ")) {
        this.$Message.error("仅支持对已完结状态的工单生成协议");
        return;
      }
      return true;
    },
    listSuccess() {
      this.selectedList.clear()
    },
    // 选中一项触发
    async onSelect(selection, row) {
      this.selectedList.addItem(row);
    },
    // 取消一项触发
    selectCancel(selection, row) {
      this.selectedList.delItem(row.id);
    },
    // 点击全选时触发
    selectAll(selection) {
      if (selection && selection.length === 0) {
        let data = this.tableData;
        data.forEach((item) => {
          if (this.selectedList.has(item.id)) { this.selectedList.delItem(item.id); }
        });
      } else {
        selection.forEach((item) => this.selectedList.addItem(item));
      }
    },
    // 取消新增
    close(b) {
      this.showAdd = false;
      this.detailData = {};
      b && this.getList();
    },
    // 获取省市
    async getCityList() {
      const { cityList } = await _getProvinceCityList({});
      this.findBindKey("cityUuid").dropList = cityList;
    },
    // 根据城市code 获取运营商列表
    async getAgentList(cityCode) {
      const { list } = await _getAgentList({});
      this.findBindKey("agentUuid").dropList = list;
    },
    findBindKey(key) {
      return this.inputList.find(it => it.bind_key === key) || {};
    },
    setPageParams(p = {}) {
      delete p.provinceCode;
      if (p.flowStatusList && !Array.isArray(p.flowStatusList)) {
        p.flowStatusList = [p.flowStatusList];
      }
      if (p.operateTypeList && !Array.isArray(p.operateTypeList)) {
        p.operateTypeList = [p.operateTypeList];
      }
      this.setCityParams(p).setAgentParams(p)
      this.searchData = Object.entries(p).reduce((res, [k, v]) => (!/page/i.test(k) && (res[k] = v), res), {});
      return p;
    },
    setCityParams(p) {
      let _cityList = this.findBindKey("cityUuid").dropList
      // cityUuid 是3位的编码
      if (p.cityUuid) {
        let f = _cityList.find((it) => String(it.cityID) === String(p.cityUuid));
        if (f) {
          p.cityUuidList = [f.cityUuid];
        }
      }
      delete p.cityUuid;
      return this
    },
    setAgentParams(p) {
      // 运营商入参是 运营商名称
      if (p.agentUuid) {
        const f = this.findBindKey("agentUuid");
        if (f.dropList) {
          let fa = f.dropList.find((it) => it.value === p.agentUuid);
          fa && (p.agentName = fa.label);
        }
        // delete p.agentUuid
      }
      return this
    },
    changeRow(row) {

    }
  },
};
</script>

<style scoped>
</style>
