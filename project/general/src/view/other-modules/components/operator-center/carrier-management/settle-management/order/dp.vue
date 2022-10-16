<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button v-hasAuth="'dp-import'" type="primary" @click="fileVisible = true">批量导入账单</Button>
      <export-file
        v-hasAuth="'dcp-export'"
        baseUrlKey="_baseUrl"
        exportUrl="/api/operate/billing/batchExport"
        exportFileName="结算账单列表.xlsx"
        :queryData="searchData"
        btnText="批量导出账单"
        :disabled="!total || total === 0"
      ></export-file>
      <Button type="primary" @click="deductVisible = true">批量补发/补扣</Button>
      <Button
        v-hasAuth="'dp-batch-submit'"
        type="primary"
        :disabled="!tableData.length"
        @click="batchSubmit"
      >批量提交</Button>
      <Button
        v-hasAuth="'check-rebuild-bill-batch'"
        type="primary"
        :disabled="!tableData.length"
        @click="batchReBuildBill"
      >批量重生账单</Button>
      <!--      <Button-->
      <!--        type="primary"-->
      <!--        @click="generateAgree"-->
      <!--        v-hasAuth="'dp-proto'"-->
      <!--        :loading="protoLoading"-->
      <!--        >生成协议</Button-->
      <!--      >-->
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
      @selectHandle="changeSelected"
    >
    </m2-table>
    <!-- 批量导入 -->
    <file-import
      v-if="fileVisible"
      :visible="fileVisible"
      @close="close"
      @confirm="confirm"
    ></file-import>
    <!-- 补发/补扣批量导入 -->
    <deduct-import
      v-if="deductVisible"
      :visible="deductVisible"
      @close="closeDeduct"
      @confirm="confirmDeduct"
    ></deduct-import>
    <!-- 提交 -->
    <submit
      v-if="detailVisible"
      :visible="detailVisible"
      :detail="detailData"
      @close="detailClose"
      @confirm="detailConfirm"
    ></submit>
    <!--    补发扣减-->
    <replace-deduct
      :visible="reissueDeductVisible"
      :editData="rowData"
      @confirm="reissueDeductConfirm"
      @close="reissueDeductClose"
    ></replace-deduct>
    <!--    日志-->
    <log ref="_log" />
    <!-- 批量提交错误行信息 -->
    <!-- <error
      v-if="errorVisible"
      :visible="errorVisible"
      :detail="errorDetail"
      @close="closeError"
    ></error> -->
  </div>
</template>

<script>
import { inputList, tableColumns, canRebuildStatusList } from "./fields.js";
import FileImport from "./components/import.vue";
import DeductImport from "./components/applyBatchImport.vue";
import ExportFile from "_a/export-file/exportFile";
import Submit from "./components/submit.vue";
import Error from "./components/uploadError.vue";
import m2Table from "_a/m2-table/v-table";
import { tool } from "_o/api/baseMixin.js";
import Log from "./components/log";
import common from "../tool/common";
import ReplaceDeduct from "./components/replaceDeduct";
import {
  billingService,
  billingDetailService,
  batchSubmitService,
  batchCreateBillingProtocolService,
  flowSuspendService, flowPayedService,
  generateBillingBatch
} from "_o/api/settle";
import { _getProvinceCityList, _getAgentList } from "_g/api/general";
import { findO } from "@/mixins/base";

// 未提交状态 可编辑
export default {
  name: "check-management-check",
  components: {
    m2Table,
    FileImport,
    Submit,
    Error,
    ExportFile,
    Log,
    ReplaceDeduct,
    DeductImport
  },
  mixins: [tool, common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),

      isExportBtn: false,

      tableConfig: {
        searchParams: {},
        current: 1,
        total: 0,
        pageSize: 10,
        tableData: [],
      },
      fileVisible: false,
      detailVisible: false,
      detailData: {},

      errorVisible: false,
      errorDetail: {},
      selectedData: [],
      protoLoading: false,

      reissueDeductVisible: false,
      rowData: {},

      deductVisible: false
    };
  },
  created() {
    this.func = billingService;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.getAgentList();
  },
  methods: {
    confirm() {
      this.getList();
      this.close();
    },
    close(f) {
      this.fileVisible = false;
      f && this.getList();
    },
    async generateAgree() {
      if (!this.selectedData.length) {
        this.$Message.error("请选择数据");
        return;
      }
      this.protoLoading = true;
      const [err, data] = await this.toResult(batchCreateBillingProtocolService({
        billingUuids: this.selectedData.map((it) => it.uuid),
      }));
      this.protoLoading = false;

      if (err) {
        let res = err.data;
        if (res.data.failureCount > 0) {
          // failureBillingNoList
          this.$Modal.error({
            title: "提示",
            content: `生成协议成功${res.data.successCount}条, 失败${res.data.failureCount}条。`,
            onOk: () => {},
          });
        }
        return;
      }

      this.$Message.success("协议生成成功!");
      this.getList();
      this.selectedData = [];
    },
    async getCityList() {
      const { cityList } = await _getProvinceCityList({});
      findO("cityCode", "bind_key", this.inputList).dropList = cityList;
    },
    async getAgentList() {
      const { list } = await _getAgentList({});
      findO("agentUuid", "bind_key", this.inputList).dropList = list;
    },
    detailClose(b) {
      this.detailVisible = false;
      b && this.getList();
    },
    detailConfirm() {
      this.detailClose();
    },
    async batchSubmit() {
      let errMsg = "";
      if (!this.selectedData.length) {
        errMsg = "请选择数据"
      } else if (this.selectedData.some(it => `${it.billingStatus}` !== "0")) {
        errMsg = "仅可提交未提交转态的账单"
      }
      if (errMsg) {
        this.$Message.error(errMsg)
        return
      }

      let [err, data] = await this.toResult(batchSubmitService({
        billingUuids: this.selectedData.map((it) => it.uuid),
      }));
      if (err) {
        let res = err.data;
        if (res.data.failureCount > 0) {
          // failureBillingNoList
          let content = `批量提交成功${res.data.successCount}条, 失败${res.data.failureCount}条。`;
          this.$Modal.error({
            title: "提示",
            content,
            onOk: () => {},
          });
        }
        return;
      }
      let content = `批量提交成功${data.successCount}条, 失败${data.failureCount}条。`;
      this.$Modal.success({
        title: "提示",
        content,
        onOk: () => {
          this.getList();
          this.selectedData = [];
        },
      });
    },
    isPayed(row) {
      let self = this;
      this.$Modal.warning({
        title: "提示",
        closable: true,
        content: `确认该账单已付款?`,
        onOk: async function () {
          const [err, data] = await self.toResult(flowPayedService({ billingUuid: row.uuid }));
          if (err) {
            return;
          }
          self.$Message.success(`确认成功`);
          self.getList();
        },
      });
    },
    closeError() {
      this.errorVisible = false;
      this.errorDetail = {};
    },
    changeSelected(data) {
      this.selectedData = data;
    },
    async rowClickHandle(row) {
      let [err, data] = await this.toResult(billingDetailService({
        billingUuid: row.uuid,
      }));
      if (err) return;
      this.detailData = data;
      this.detailData.rowData = row;
      this.detailVisible = true;
    },
    setPageParams(p) {
      if (p.billingDate) {
        p.billingDate = p.billingDate.split("-").join("");
      }
      return p;
    },
    invalid(row) {
      let self = this;
      this.$Modal.warning({
        title: "提示",
        closable: true,
        content: `状态作废后不可恢复，确定需要作废该账单?`,
        onOk: async function () {
          const [err, data] = await self.toResult(flowSuspendService({ billingUuid: row.uuid }));
          if (err) {
            return;
          }
          self.$Message.success(`作废成功`);
          self.getList();
        },
      });
    },
    addSupply(row) {
      this.rowData = row;
      this.reissueDeductVisible = true;
    },
    reissueDeductClose() {
      this.reissueDeductVisible = false;
      this.rowData = {};
    },
    reissueDeductConfirm() {
      this.reissueDeductClose();
      this.getList();
    },
    async log(row) {
      let [err, data] = await this.toResult(billingDetailService({
        billingUuid: row.uuid,
      }));
      if (err) return;
      this.$refs._log.init(data.billingRecordResList);
    },
    confirmDeduct() {
      this.getList();
      this.closeDeduct();
    },
    closeDeduct(f) {
      this.deductVisible = false;
      f && this.getList();
    },
    batchReBuildBill() {
      let errMsg = "";
      if (!this.selectedData.length) {
        errMsg = "请选择数据"
      } else if (this.selectedData.some(it => !canRebuildStatusList.includes(it.billingStatus))) {
        //  add 提示
        const failIds = this.selectedData.filter(v => !canRebuildStatusList.includes(v.billingStatus)).map(v => v.billingNo).join("、")
        errMsg = `${failIds}账单不符合重生成条件，仅状态为“作废”“未提交”“合作伙伴申诉处理中”三个状态可操作重生账单、批量重生账单, 请确认后再操作。`
      }
      if (errMsg) {
        this.$Message.error(errMsg)
        return
      }
      this.reBuildBill(this.selectedData.map(v => v.uuid))
    },
    reBuildBill(row = []) {
      this.$Modal.warning({
        title: "提示",
        closable: true,
        content: `确认重生账单?`,
        onOk: async () => {
          const [err, data] = await this.toResult(generateBillingBatch({ billingUuids: row }));
          if (err) {
            this.$Message.error(err)
            return;
          }
          const { failureList } = data
          if (failureList && failureList.length) {
            let errMsg = failureList.map(v => `${v.billingNo || v.billingUuid}账单${v.remark}`).join(",")
            this.$Message.info({
              content: errMsg,
              duration: 5
            });
          } else {
            this.$Message.success(`成功`);
          }
          this.getList();

        },
      });
    }
  },
};
</script>

<style scoped></style>
