<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="入账记录"
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
      <el-table-column prop="orderNo" label="流水号" min-width="140">
      </el-table-column>
      <el-table-column prop="accountingDate" label="入账时间" width="160">
      </el-table-column>
      <el-table-column prop="accountingAmt" label="入账金额(元)" width="120">
      </el-table-column>
      <el-table-column prop="remark" label="入账类型" min-width="100">
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="100">
          <template slot-scope="scope">
            {{"入账成功"}}
          </template>      
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
import { accountBookFlows } from "../api";
import { typeList } from "../filed";
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
    typeFormatter(row) {
      const v = typeList.find((item) => item.value - row.flowType == 0);
      return v ? v.label : "";
    },
    getList() {
      this.call(accountBookFlows, {
        driverUuid: this.currentRow.driverUuid,
        changedType: 1,
        currPage: this.currPage,
        pageSize: this.pageSize
      });
    },
    error({ msg }) {
      msg = msg || "获取入账记录失败";
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
