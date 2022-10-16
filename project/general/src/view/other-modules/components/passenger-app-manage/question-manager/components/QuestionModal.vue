<template>
  <Modal
    :value="questionShow"
    :title="modalTitle"
    :width="900"
    :loading="modalLoading"
    :footer-hide="footerHide"
    :transfer="true"
    @on-cancel="closeModal"
    @on-ok="confirmModal"
  >
    <VTable
      style="margin-top: 25px;"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      :pageSizeOpts="[10,20,30,40,50]"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="selectRow"
    >
    </VTable>
    <p>没有符合业务的问题？<a class="to-add-question" href="javascript: void(0)" @click="toAddQuestion">新增配置&gt;</a></p>
  </Modal>
</template>

<script>
import { queryPage } from "_o/api/question-manage";

/**
 * @Desc: m2-web-general
 * @Author: zhangke
 * @CreateTime: 2022/3/11 10:38 AM
 */
export default {
  name: "QuestionModal",
  props: {
    questionShow: {
      type: Boolean,
      required: true,
      default: false
    },
    strategyType: {
      type: Number,
      required: true,
      default: 1
    },
    footerHide: {
      type: Boolean,
      default: false
    },
    modalTitle: { type: String, default: "选择问题" }
  },
  data() {
    return {
      total: 0,
      current: 1,
      pageSize: 20,
      modalLoading: false,
      columns: [{
        type: "selection"
      }, {
        title: "标题",
        key: "title"
      }, {
        title: "注释",
        key: "questionContent"
      }],
      selectedRow: [],
      tableData: []
    }
  },
  watch: {
    questionShow(value) {
      if (value) {
        this.getList()
      }
    }
  },
  methods: {
    // 翻页
    changePage(pageNum) {
      this.current = pageNum
      this.getList()
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    toAddQuestion() {
      this.$router.push({
        name: "question-manage"
      });
      // this.$router.push({
      //   path: "/marketing-operation-admin/payment-questions"
      // })
    },
    selectRow(arr) {
      this.selectedRow.splice(0, this.selectedRow.length, ...arr)
    },
    closeModal() {
      this.$emit("close")
      this.selectedRow.splice(0)
      this.tableData.splice(0)
    },
    confirmModal() {
      this.$emit("confirm", JSON.parse(JSON.stringify(this.selectedRow)))
      this.selectedRow.splice(0)
      this.tableData.splice(0)
    },
    getList() {
      this.modalLoading = true
      queryPage({
        currPage: this.current,
        pageSize: this.pageSize,
        strategyType: this.strategyType
      }).then(res => {
        if (res && res.data && res.data.data && res.data.data.list) {
          this.tableData.splice(0, this.tableData.length, ...(res.data.data.list || []))
        }
      }).finally(() => {
        this.modalLoading = false
      })
    }
  }
}
</script>

<style scoped>
.to-add-question {
  color: #00a0e9;
  font-size: 14px;
}
</style>
