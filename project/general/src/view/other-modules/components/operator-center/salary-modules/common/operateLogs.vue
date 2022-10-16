<template>
  <el-dialog
    id="logs-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="currentLog + '的日志信息'"
    :visible="logVisible"
    width="70%"
    style="margin: 15px; padding: 15px"
    @close="closeDialog"
  >
    <el-table
      id="logs-table"
      :data="logTableData"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        label="ID"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="operateType"
        label="操作类型"
        min-width="85"
      >
      </el-table-column>
      <el-table-column
        prop="operateContent"
        label="操作内容"
        min-width="130"
      >
      </el-table-column>
      <el-table-column
        prop="operateTime"
        label="操作时间"
        :formatter="timeFormatter"
        min-width="130"
      >
      </el-table-column>
      <el-table-column
        v-if="!isName"
        prop="operator"
        label="操作人"
        min-width="85"
      >
      </el-table-column>
      <el-table-column
        v-if="isName"
        prop="operatorName"
        label="操作人"
        min-width="85"
      >
      </el-table-column>
      <!--        :formatter="operatorFormatter"-->
      <el-table-column
        prop="ipAddr"
        label="IP地址"
        min-width="120"
      >
      </el-table-column>
    </el-table>
    <el-row id="logs-row" style="margin: 20px 20px 0 0;">
      <el-pagination
        id="logs-pagination"
        style="float: right"
        :page-size="logPageSize"
        :current-page="logCurrPage"
        layout="total, prev, pager, next"
        :total="logTotalCount"
        @current-change="handleCurrent"
      >
      </el-pagination>
    </el-row>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util";
export default {
  props: {
    currentLog: { type: String, required: false },
    logVisible: { type: Boolean, required: false },
    logTableData: { type: Array, required: false },
    logTotalCount: { type: Number, required: false, default: 0 },
    logCurrPage: { type: Number, required: false, default: 1 },
    currentId: { type: String | Number, required: false },
    isName: { type: Boolean, default: false },
  },
  data() {
    return {
      // logCurrPage: 1,
      logPageSize: 10,
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "log");
    },
    handleCurrent(val) {
      let params = { currentId: this.currentId, currentLog: this.currentLog, currPage: val, pageSize: this.pageSize };
      this.$emit("handleLogsPage", params);
      // this.getData({currPage: val, pageSize: this.pageSize});
    },
    timeFormatter(row) {
      return parseTime(row.operateTime);
    },
    operatorFormatter(row) {
      return "1";
    }
  }
}
</script>
