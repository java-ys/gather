<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <Button
      class="but"
      :class="extraParams.index - 0 === 0 ? 'primary' : ''"
      @click="pending"
      >待处理申请单</Button
    >
    <Button
      class="but"
      :class="extraParams.index - 1 === 0 ? 'primary' : ''"
      @click="processed"
      >已处理申请单</Button
    >
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="extraParams.index - 0 === 0 ? tableColumns : tableColumnsDone"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <add
      v-if="showAdd"
      :visible="showAdd"
      :detail="detailData"
      :disabled="addDisable"
      @close="close"
    ></add>
  </div>
</template>

<script>
// 考核待办流程
import { inputListProcess, tableColumnsProcess, tableColumnsProcessDone } from "./fields.js";
import Add from "./components/add.vue";
import m2Table from "_a/m2-table/v-table";
import common from "../tool/common";
import {
  flowApproveService,
  flowCancelService,
  flowDetailService,
  flowListService,
  flowPageService,
  flowSubmitService,
  flowSubmitBatchService,
} from "_o/api/assess";

export default {
  name: "check-management-process",
  components: {
    Add,
    m2Table,
  },
  mixins: [common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputListProcess)),
      tableColumns: tableColumnsProcess(this),
      tableColumnsDone: tableColumnsProcessDone(this),
      showAdd: false,
      detailData: {},
      addDisable: false,
    };
  },
  created() {
    this.func = flowListService;
    this.extraParams.index = 0;
    this.getList();
  },
  methods: {
    pending() {
      this.extraParams.index = 0;
      this.getList();
    },
    processed() {
      this.extraParams.index = 1;
      this.getList();
    },
    async rowClickHandle(row) {
      let [err, data] = await this.toResult(
        flowDetailService({
          id: row.id,
        })
      );
      if (err) return;
      this.detailData = data || {};
      this.detailData.rowData = row;
      this.detailData.mold = 2;
      // this.detailData.finish = true
      this.addDisable = row.flowStatus === "CS_QR";
      this.detailData.agentAssessIndexVoList = this.detailData.agentAssessIndexVoList.map(it => {
        // 如果是父指标 默认显示第一个子指标
        if (it.parentFlag - 1 === 0) {
          it._subIndex = 0;
        }
        if(typeof it.indexRuleJson === 'string') {
          it.indexRuleJson = JSON.parse(it.indexRuleJson)
        }
        return it;
      })
      this.showAdd = true;
    },
    // 取消新增
    close(b) {
      this.showAdd = false;
      this.detailData = {};
      b && this.getList();
    },
  },
};
</script>

<style scoped lang="less">
.but {
  width: 200px;
  height: 100px;
  font-size: 20px;
  margin-right: 20px;
  background-color: #eee;
}
.has {
  background-color: #eee;
}
.primary {
  background-color: #2d8cf0;
  color: #fff;
}
</style>
