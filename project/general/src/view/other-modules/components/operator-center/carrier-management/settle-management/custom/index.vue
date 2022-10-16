<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-change="inputChange"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'custom-target-import'" type="primary" @click="importFile">批量导入</Button>
      <export-file
        v-hasAuth="'custom-target-export'"
        type="success"
        :isDisabled="tableData.length === 0"
        exportUrl="/api/operate/assess/score/exportAgentAssessScore"
        exportFileName="指标考核数据.xlsx"
        :queryData="searchData"
        btnText="批量导出"
      ></export-file>
      <Button v-hasAuth="'custom-target-add'" type="primary" :loading="false" @click="addNew">新建</Button>
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
    </m2-table>
    <add
      v-if="showAdd"
      :visible="showAdd"
      :isDetail="isDetail"
      :detail="detailData"
      @close="close"
    ></add>
    <!-- 批量导入 -->
    <file-import
      v-if="fileVisible"
      :visible="fileVisible"
      @close="fileClose"
      @confirm="fileConfirm"
    ></file-import>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import Add from "./components/add.vue";
import m2Table from "_a/m2-table/v-table";
import common from "../tool/common";
import { store, mutations, SelectedQuestions } from "./components/store";
import { _getProvinceCityList, _getAgentList } from "_g/api/general";
import FileImport from "./components/import"
import ExportFile from "_a/export-file/exportFile";
import { agentScoreService, deleteAgentService } from "_o/api/settle/goal.js"
import { assessPageService } from "_o/api/check";

export default {
  name: "check-goal",
  components: {
    Add,
    m2Table,
    FileImport,
    ExportFile
  },
  mixins: [common],
  provide() {
    return {
      getCityList: () => this.cityList,
      getIndicatorList: () => this.indicatorList
    }
  },
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),
      showAdd: false,
      selectedList: new SelectedQuestions([]),
      detailData: {},
      fileVisible: false,
      cityList: [],
      indicatorList: [], // 指标列表
      isDetail: false
    };
  },
  created() {
    this.func = agentScoreService;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.getAgentList();
    this.getIndicatorList();
  },
  methods: {
    importFile() {
      this.fileVisible = true
    },
    fileClose(f) {
      this.fileVisible = false;
      f && this.getList();
    },
    fileConfirm() {
      this.getList();
      this.close();
    },
    addNew() {
      this.detailData = {}
      this.isDetail = false
      this.showAdd = true
    },
    openEdit(row) {
      this.detailData = { ...row }
      this.isDetail = false
      this.showAdd = true
    },
    openView(row) {
      this.detailData = { ...row }
      this.isDetail = true
      this.showAdd = true
    },
    deleteRow({ uuid }) {
      let self = this;
      this.$Modal.warning({
        title: "提示",
        closable: true,
        content: `确认删除吗?`,
        onOk: async function () {
          const [err] = await self.toResult(deleteAgentService({ uuid }));
          if (err) {
            return;
          }
          self.$Message.success(`删除成功`);
          self.getList();
        },
      });
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
      let list = [{ label: "全国", value: -1 }].concat(cityList)
      this.cityList = list
      this.findBindKey("cityCodeList").dropList = list;
    },
    // 根据城市code 获取运营商列表
    async getAgentList(cityCode) {
      const { list } = await _getAgentList({});
      this.findBindKey("agentUuidList").dropList = list;
    },
    findBindKey(key) {
      return this.inputList.find(it => it.bind_key === key) || {};
    },
    inputChange(a, b) {
      let len = a.length
      if (b === "cityCodeList" && len) {
        let f = this.findBindKey("cityCodeList")
        if (a[len - 1] - (-1) === 0) {
          f.value = [-1]
        } else {
          let index = a.findIndex(it => it - (-1) === 0)
          if (index > -1) {
            a.splice(index, 1)
            f.value = a
          }
        }
      }
    },
    async getIndicatorList() {
      const [, data] = await this.toResult(assessPageService({
        currPage: 1,
        pageSize: 2000,
      }))
      let list = data?.list?.map(it => ({
        ...it,
        label: it.name,
        value: it.uuid
      })) || []
      this.indicatorList = list
      this.findBindKey("indexUuidList").dropList = list
    }
  },
};
</script>

<style scoped>
</style>
