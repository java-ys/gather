<template>
  <div class="log_wrap">
    <Modal
      v-model="isShow"
      :width="720"
      :title="modalTitle"
      :mask-closable="false"
      class="log-name_modal"
      @on-cancel="handleCancel"
    >
      <VTable
        style="margin-top: 20px;"
        class="log-table-container"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        :isLoading="isLoading"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </VTable>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import { logPageData, logTableTitle } from "../../config/fields"
import { queryPageCheckTaskLogList } from "_o/api/task-manager";

export default {
  name: "taslLog",
  props: {
    basicUuid: {
      type: String,
      default() {
        return ""
      }
    }
  },
  data() {
    return {
      modalTitle: "日志信息",
      isShow: false,
      tableColumns: [],
      ...logPageData,
      isLoading: false
    }
  },
  created() {
    this.isShow = true
    this.tableColumns = logTableTitle()
    this.getTaskLog()
  },
  methods: {
    handleCancel() {
      this.isShow = false
      this.$emit("update:visible")
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTaskLog()
    },
    changePage(val) {
      this.current = val
      this.getTaskLog()
    },
    async getTaskLog() {
      this.isLoading = true
      const res = await queryPageCheckTaskLogList({
        basicUuid: this.basicUuid,
        currPage: this.current,
        pageSize: this.pageSize
      })
      if (!res) {
        this.isLoading = false
        return false
      }
      if (res.data && res.data.data && res.data.success) {
        this.$Message.success("拉取日志成功")
        this.tableData = res.data.data.list || [];
        this.tableData = this.tableData.map((item, index) => ({
          ...item,
          index: index + 1
        }))
        this.total = res.data.data.totalCount || 0;
        this.isLoading = false
      } else {
        this.isLoading = false
        this.$Message.error(res.data.msg);
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .log_wrap {

  }
</style>
