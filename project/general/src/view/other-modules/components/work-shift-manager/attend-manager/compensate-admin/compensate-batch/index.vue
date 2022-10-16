<template>
  <div>
    <div>
      <Button type="primary" style="margin-right: 10px;margin-bottom: 20px" @click="addRule">新建批量</Button>

      <m2-table
        :total="total"
        :current="currentPage"
        :pageSize="pageSize"
        :parColumns="tableColumns(this)"
        :parTableData="tableData"
        :isLoading="isLoading"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
      <Modal
        @on-cancel="cancel"
        v-model="modalShow"
        width="50%"
        title="批量补偿"
        footer-hide
        v-if="isLoadBatchComponent"
      >
        <batch :modalShow="modalShow" @handleCloseModal="closeModal" @sendFn="getCpstBatchData" ref="batchRef"></batch>
      </Modal>
    </div>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table.vue";

import { getConfigCityList } from "_g/api/common.js";
import { tableColumns, initTableColumns } from "./index.js";
import batch from "./batch.vue";
import { getCpstBatchList } from "_o/api/compensate.js";
// import { logList } from "_o/api/rest.js"; // 日志请求
export default {
  components: {
    batch,
    m2Table
  },
  data() {
    return {
      isLoadBatchComponent: false,
      initTableColumns,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableColumns,
      modalShow: false,
      tableData: [],
      isLoading: true
    };
  },
  mounted() {
    this.getCpstBatchData();
  },
  methods: {
    cancel() {
      this.$nextTick(() => {
        this.$refs.batchRef.handleReset("formValidate")
      })
    },
    addRule() {
      this.modalShow = true;
      this.isLoadBatchComponent = true;
    },
    changePage(val) {
      this.currentPage = val;
      this.getCpstBatchData();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getCpstBatchData();
    },
    closeModal(data) {
      this.modalShow = data;
    },

    // 列表分页
    getCpstBatchData() {
      let pageData = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.isLoading = true
      getCpstBatchList(pageData).then(res => {
        this.isLoading = false
        let { data } = res.data;
        if (res.data.success) {
          this.tableData = data && data.list ? data.list : [];
          this.total = data.totalCount;
        }
      });
    }
  }
};
</script>
<style lang="less">
.new-rule-modal {
  .ivu-modal-body {
    padding: 16px 0 !important;
  }
}
</style>
