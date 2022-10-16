<template>
  <el-dialog id="record-dialog" :close-on-click-modal="false" :close-on-press-escape="false" :title="'风控导入记录'" :visible="recordVisible" width="50%" style="margin: 15px; padding: 15px" @close="closeDialog">
    <el-table id="logs-table" :data="recordTableData" style="width: 100%;">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="" label="导入文件" min-width="120">
      </el-table-column>
      <el-table-column prop="" label="导入时间" min-width="120">
      </el-table-column>
      <el-table-column prop="" label="操作人" min-width="120">
      </el-table-column>
    </el-table>
    <el-row id="records-row" style="margin: 20px 20px 0 0;">
      <el-pagination id="record-pagination" style="float: right" :page-size="recordCurrPage" :current-page="recordCurrPage" layout="total, prev, pager, next" :total="recordTotalCount" @current-change="handleCurrent">
      </el-pagination>
    </el-row>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util";
export default {
  props: {
    currentLog: { type: String, required: false },
    recordVisible: { type: Boolean, required: false },
    recordTableData: { type: Array, required: false },
    recordTotalCount: { type: Number, required: false, default: 0 },
    currentId: { type: String, required: false }
  },
  data() {
    return {
      recordCurrPage: 1,
      recordPageSize: 10
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "riskRecord");
    },
    handleCurrent(val) {
      // let params = {currentId: this.currentId, currentLog: this.currentRecord, currPage: val, pageSize: this.recordPageSize};
      // this.$emit('handleLogsPage', params);
    },
    timeFormatter(row) {
      return parseTime(row.operateTime);
    }
  }
};
</script>
