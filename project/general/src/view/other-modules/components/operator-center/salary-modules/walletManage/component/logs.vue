<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="日志"
    width="50%"
    :visible="visible"
    @close="close"
  >
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 30px"
      size="mini"
      v-loading="loading"
      element-loading-text="正在加载"
      fit
      highlight-current-row
    >
      <el-table-column label="序号" type="index" :index="calIndex" width="80">
      </el-table-column>
      <el-table-column prop="operateContent" label="操作内容" min-width="100">
      </el-table-column>
      <el-table-column prop="operateTime" label="操作时间" width="160">
      </el-table-column>
      <el-table-column prop="operateType" label="操作类型" width="120">
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="100">
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagi"
      layout="total, prev, pager, next"
      :page-size="pageSize"
      :current-page.sync="currPage"
      :total="totalCount"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
import { logsService } from "../api";
import mixin from "../mixin";

export default {
  props: {
    visible: { type: Boolean, required: false, default: false }
  },
  inject: ["getRow"],
  mixins: [mixin],
  data() {
    return {
      list: [],
      totalCount: 0,
      pageSize: 10
    };
  },
  computed: {
    currentRow: {
      cache:false,
      get() {
        let rowTmp = this.getRow();
        console.log(rowTmp)
        let tmp = { ...rowTmp };
        return tmp;
      }
    }
  },
  watch: {
    visible(v) {
      v && this.getList();
    }
  },
  methods: {
    getList() {
      this.call(logsService, {
        businessId: this.currentRow.driverUuid,
        bizType: 9,
        currPage: this.currPage,
        pageSize: this.pageSize
      });
    },
    error({ msg }) {
      msg = msg || "获取日志失败";
      this.$alert(msg);
    },
    success(data) {
      if (data) {
        const { totalCount, list } = data
        this.list = list;
        this.totalCount = totalCount;
      }
    },
    close() {
      this.modalClose();
    },
    modalClose() {
      this.$emit("close-dialog");
    },
    handleCurrentChange(nowPage) {
      this.currPage = nowPage;
      this.getList();
    },
    calIndex(v) {
      return v + 1 + (this.currPage - 1) * this.pageSize;
    }
  }
};
</script>

<style scoped lang="scss">
.pagi {
  text-align: right;
  margin: 20px 20px 0 0;
}
</style>
