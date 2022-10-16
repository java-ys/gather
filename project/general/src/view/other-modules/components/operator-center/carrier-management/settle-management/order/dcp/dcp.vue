<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <div class="button-wrap">
      <Button type="primary" @click="batchSubmit" v-hasAuth="'dcp-batch'">批量提交</Button>
       <export-file
        :isDisabled="isExportBtn"
        v-hasAuth="'dcp-export'"
        baseUrlKey="_baseUrl"
        exportUrl="/admin/dcp/bill/batchExport"
        exportFileName="DCP结算账单列表.xlsx"
        :queryData="searchData"
        btnText="批量导出"
        :disabled="!total || total === 0"
      ></export-file>
      <Button type="primary" @click="fileVisible = true" v-hasAuth="'dcp-import'">批量导入</Button>
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
    <!-- 提交 -->
    <submit
      v-if="detailVisible"
      :visible="detailVisible"
      :detail="detailData"
      @close="detailClose"
      @confirm="detailConfirm"
    ></submit>

    <!-- 批量提交错误行信息 -->
    <!-- <error
      v-if="errorVisible"
      :visible="errorVisible"
      :detail="errorDetail"
      @close="closeError"
    ></error> -->

    <add
      v-if="showAdd"
      :visible="showAdd"
      :editData="editRow"
      :mold="mold"
      @close="closeAdd"
      @confirm="confirmAdd"
    ></add>

    <driver-detail
      v-if="driverDetailShow"
      :agentUuid="detailData.agentUuid"
      :visible="driverDetailShow"
      @close="driverDetailClose"
    ></driver-detail>
    <log
      ref="_log"
    />
  </div>
</template>

<script>
import ExportFile from "_a/export-file/exportFile";
import m2Table from "_a/m2-table/v-table";
import { tool } from "_o/api/baseMixin.js";
import {
  billingDetailService,
  dcpBillService,
  dcpBillSubmitService,
  dcpBillDetailService
} from "_o/api/settle";
import Submit from "../components/submit.vue";
import Error from "../components/uploadError.vue";
import Log from "../components/log";
import FileImport from "./import.vue";
import DriverDetail from "./driverDetail";
import { inputList, tableColumns } from "./fields.js";
import common from "../../tool/common";
import Add from "./add"
import { _getProvinceCityList, _getAgentList } from "_g/api/general";

// 未提交状态 可编辑
export default {
  name: "check-management-check",
  components: {
    m2Table,
    FileImport,
    Submit,
    Error,
    ExportFile,
    Add,
    DriverDetail,
    Log
  },
  mixins: [tool, common],
  data() {
    return {
      showAdd: false,
      mold: 1,
      editRow: {}, // 补发 扣减 编辑

      driverDetailShow: false,

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
    };
  },
  created() {
    this.func = dcpBillService;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.getAgentList()
  },
  methods: {
    // 确认新增
    confirm() {
      this.getList();
      this.close();
    },
    // 取消新增
    close(f) {
      this.fileVisible = false;
      f && this.getList();
    },
    async getCityList() {
      const { cityList } = await _getProvinceCityList({});
      this.findBindKey("cityCode").dropList = cityList;
    },
    async getAgentList() {
      const { list } = await _getAgentList({});
      this.findBindKey("agentUuid").dropList = list;
    },
    findBindKey(key) {
      return this.inputList.find(it => it.bind_key === key) || {};
    },
    detailClose(b) {
      this.detailVisible = false;
      b && this.getList();
    },
    detailConfirm() {
      this.detailClose();
    },
    async batchSubmit() {
      if (!this.selectedData.length) {
        this.$Message.error("请选择数据");
        return;
      }

      let [err, data] = await this.toResult(
        dcpBillSubmitService({
          // type: 1 申诉 2 确认
          // appealDesc
          billingUuids: this.selectedData.map((it) => it.uuid),
        })
      );
      if (err) {
        let res = err.data;
        if (res.data.failureCount > 0) {
          // failureBillingNoList
          this.$Modal.error({
            title: "提示",
            content: `批量提交成功${res.data.successCount}条, 失败${res.data.failureCount}条。`,
            onOk: () => {},
          });
        }
        return;
      }
      this.$Modal.success({
        title: "提示",
        content: `批量提交成功${data.successCount}条, 失败${data.failureCount}条。`,
        onOk: () => {
          this.getList();
          this.selectedData = [];
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
      let [err, data] = await this.toResult(
        billingDetailService({
          billingUuid: row.uuid,
        })
      );
      if (err) return;
      this.detailData = data;
      this.detailData.rowData = row;
      this.detailVisible = true;
    },
    openDriverList(row) {
      this.detailData.agentUuid = row.agentUuid;
      this.driverDetailShow = true
    },
    setPageParams(p) {
      if (p.brokerageMonth) {
        p.brokerageMonth = p.brokerageMonth.split("-").join("");
      }
      return p;
    },
    confirmAdd() {
      this.getList();
      this.closeAdd();
    },
    closeAdd() {
      this.showAdd = false
    },
    addSupply(row) {
      this.mold = 1
      this.editRow = row
      this.showAdd = true
    },
    addDeduction(row) {
      this.mold = 2
      this.editRow = row
      this.showAdd = true
    },
    async log(row) {
      let [err, data] = await this.toResult(
        dcpBillDetailService({
          billingUuid: row.uuid,
        })
      );
      if (err) return;
      this.$refs._log.init(data.billingRecordResList)
    },
    driverDetailClose() {
      this.driverDetailShow = false
    }
  },
};
</script>

<style scoped>
</style>
