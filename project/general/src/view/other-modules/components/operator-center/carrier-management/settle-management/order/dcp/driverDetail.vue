<template>
  <div>
    <Modal
      v-model="visible"
      title="明细列表"
      width="1300"
      :mask-closable="false"
      :closable="false"
    >
      <m2-table
        ref="_t3_table"
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
      <div slot="footer">
        <Button type="primary" v-lazy-click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { detailColumn } from "./detailFields";
import { dcpGetDriverBillPageService } from "_o/api/settle";
import { tool } from "_o/api/baseMixin.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    agentUuid: {
      default: ""
    }
  },
  components: {
    m2Table
  },
  mixins: [tool],
  data() {
    return {
      tableColumns: detailColumn(this),
      isLoading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 30, 50, 100],
      tableData: [],
      height: 500
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let p = {
        currPage: this.current,
        pageSize: this.pageSize,
        agentUuid: this.agentUuid
      };
      const [err, data] = await this.toResult(dcpGetDriverBillPageService(p));
      if (err) {
        return;
      }
      if (data.list) this.tableData = data.list;
    },
    async cancel() {
      this.$emit("close", {}); // 把传来的传回去保持不变
    },
    selectRow(row) {
      this.$emit("close", row);
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
    changePage(current) {
      this.current = current;
      this.getList();
    }
  }
};
</script>
