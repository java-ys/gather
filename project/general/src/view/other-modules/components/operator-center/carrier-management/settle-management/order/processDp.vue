<template>
  <div class="settle-management-process">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <Button
      class="but"
      :class="`${buttonIndex}` === '0' ? 'primary' : ''"
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
      :parColumns="`${buttonIndex}` === '0' ? tableColumns : tableColumnsDone"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
<!--    申诉审核-->
    <processed
      v-if="processVisible"
      :visible="processVisible"
      :detail="detailData"
      @close="processClose"
    ></processed>
<!--    结算审核-->
    <settle-review
      :visible="settleVisible"
      :detail="detailData"
      @close="settleClose"
    ></settle-review>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import common from "../tool/common";
import {
  queryTodoBillingByPageService,
  queryDoneBillingByPageService,
  billingDetailService,
  flowHandleService,
} from "_o/api/settle";
import {
  inputListProcess,
  tableColumnsProcess,
    tableColumnsProcessDone,
  calModeConvert,
} from "./fields.js";
import Processed from "./components/processed.vue";
import SettleReview from "./components/settleReview.vue";

// 合作伙伴申诉处理中, 可编辑
// 账单待办流程
export default {
  name: "settle-management-process",
  components: {
    Processed,
    m2Table,
    SettleReview
  },
  mixins: [common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputListProcess)),
      tableColumns: tableColumnsProcess(this),
      tableColumnsDone: tableColumnsProcessDone(this),
      detailVisible: false,
      detailData: undefined,

      buttonIndex: 0,
      processVisible: false,
      settleVisible: false
    };
  },
  created() {
    this.func = queryTodoBillingByPageService;
    this.getList();
  },
  methods: {
    async rowClickHandle(row) {
      await this.getRowDetail(row);
      if(this.buttonIndex - 1 === 0) {
        this.detailData.finish = true
      }
      this.processVisible = true;
    },
    async getRowDetail(row) {
      let [err, data] = await this.toResult(
        billingDetailService({
          billingUuid: row.uuid,
        })
      );
      if (err) return;
      this.detailData = data;
      this.detailData.rowData = row
    },
    pending() {
      this.buttonIndex = 0;
      this.func = queryTodoBillingByPageService;
      this.getList();
    },
    processed() {
      this.buttonIndex = 1;
      this.func = queryDoneBillingByPageService;
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
      this.detailData = {}
      b && this.getList()
    },
    async appealAudit(row) {
      await this.getRowDetail(row);
      this.processVisible = true;
    },
    async settleAudit(row) {
      await this.getRowDetail(row);
      this.settleVisible = true
    },
    settleClose() {
      this.settleVisible = false
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
