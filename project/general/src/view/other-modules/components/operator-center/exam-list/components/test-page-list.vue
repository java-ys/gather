<template>
  <div>
    <Modal
      v-model="show"
      width="64%"
      title="选择考试并查看"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancel"
    >
      <m2-table
        :isShowPage="false"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></m2-table>
    </Modal>
  </div>
</template>

<script>
  import m2Table from "_a/m2-table/v-table";
  import { testPageListTableTitle } from "../fields";
  import s from "_o/api/study-exam";
  import { tool } from "_o/api/baseMixin.js";
  import common from "../common";

  export default {
    name: "test-page-list",
    props: ["visible", "modalData"],
    components: { m2Table },
    mixins: [tool, common],
    data() {
      return {
        show: this.visible,
        isLoading: false,
        tableData: [],
        pageData: {},
        pageSize: 10,
        current: 1,
        tableColumns: testPageListTableTitle(this)
      };
    },
    watch: {
      visible() {
        this.show = this.visible;
        if (this.show) {
          this._getList();
          this.getDetail();
        } else {
          this.initData();
        }
      }
    },
    computed: {
      hasId() {
        return this.modalData && this.modalData.id;
      }
    },
    methods: {
      openDetail(row) {
        this.$emit("open-detail", row)
      },
      getDetail() {
        if (!this.hasId) return;
        this.pageData = this.modalData;
      },
      _getList() {
        if (!this.hasId) return;
        // this.func = s.taskResultDetail;
        this.func = s.batchList;
        this.extraParams.id = this.modalData.id;
        this.getList();
      },
      cancel(refresh = false) {
        this.$emit("close", { refresh });
      },
      initData() {
        this.pageData = {};
      },

      // changePage() {},
      // changePageSize() {}
    }
  };
</script>

<style scoped lang="less">
  .mb-40 {
    margin-bottom: 40px;
  }
  .t {
    font-size: 16px;
    margin-bottom: 10px !important;
  }
</style>
