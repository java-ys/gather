<template>
  <div class="settle-management-process">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <Button
      class="but"
      :class="buttonIndex - 0 === 0 ? 'primary' : ''"
      @click="pending"
      >待处理账单</Button
    >
    <Button
      class="but"
      :class="buttonIndex - 1 === 0 ? 'primary' : ''"
      @click="processed"
      >已处理账单</Button
    >
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="buttonIndex - 0 === 0 ? tableColumns : tableColumnsDone"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <processed-dcp
      v-if="processVisible"
      :visible="processVisible"
      :detail="detailData"
      @close="processClose"
    ></processed-dcp>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import {
  dcpBillDetailService,
  dcpGetTodoDcpBillPageService,
  dcpGetDoneDcpBillPageService
} from "_o/api/settle";
import {
  inputListProcess,
  tableColumnsProcess,
  tableColumnsProcessDone
} from "./fields.js";
import common from "../tool/common";
import ProcessedDcp from "./dcp/processedDcp.vue";

// 合作伙伴申诉处理中, 可编辑
// 账单待办流程
export default {
  name: "settle-management-process",
  components: {
    ProcessedDcp,
    m2Table
  },
  mixins: [common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputListProcess)),
      tableColumns: tableColumnsProcess(this, 'dcp'),
      tableColumnsDone: tableColumnsProcessDone(this, 'dcp'),
      detailVisible: false,
      detailData: {},

      buttonIndex: 0,
      processVisible: false
    };
  },
  created() {
    this.func = dcpGetTodoDcpBillPageService;
    this.getList();
  },
  methods: {
    async rowClickHandle(row) {
      let [err, data] = await this.toResult(
        dcpBillDetailService({
          billingUuid: row.uuid
        })
      );
      if (err) return;
      this.detailData = data;
      this.detailData.rowData = row;
      if (this.buttonIndex - 1 === 0) {
        this.detailData.finish = true;
      }
      this.processVisible = true;
    },
    pending() {
      this.buttonIndex = 0;
      this.func = dcpGetTodoDcpBillPageService;
      this.getList();
    },
    processed() {
      this.buttonIndex = 1;
      this.func = dcpGetDoneDcpBillPageService;
      this.getList();
    },
    detailClose(b) {
      this.detailVisible = false;
      b && this.getList();
    },
    detailConfirm() {
      this.detailClose();
    },
    processClose(b) {
      this.processVisible = false;
      this.detailData = {};
      b && this.getList();
    }
  }
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
