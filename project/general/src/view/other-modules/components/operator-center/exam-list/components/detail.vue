<template>
  <div>
    <Modal
      v-model="show"
      width="64%"
      title="答卷详情"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancel"
    >
      <Row type="flex" justify="space-around" class="mb-40">
        <Col span="6">
          <p class="t">考试名称</p>
          <p>{{pageData.taskName}}</p>
        </Col>
        <Col span="6">
          <p class="t">提交时间</p>
          <p>{{pageData.createTime}}</p>
        </Col>
      </Row>
      <Row type="flex" justify="space-around" class="mb-40">
        <Col span="6">
          <p class="t">司机code</p>
          <p>{{pageData.driverNo}}</p>
        </Col>
        <Col span="6">
          <p class="t">姓名</p>
          <p>{{pageData.driverName}}</p>
        </Col>
      </Row>
      <Row type="flex" justify="space-around" class="mb-40">
        <Col span="6">
          <p class="t">考试成绩</p>
          <p v-if="pageData.recStatus === 0">未通过</p>
          <p v-if="pageData.recStatus === 1">通过</p>
        </Col>
        <Col span="6">
        </Col>
      </Row>
      <m2-table
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
import { detailTableTitle } from "../fields";
import s from "_o/api/study-exam";
import { tool } from "_o/api/baseMixin.js";
import common from "../common";

export default {
  name: "exam-list-detail",
  props: ["visible", "modalData"],
  components: { m2Table },
  mixins: [tool, common],
  data() {
    return {
      show: this.visible,
      isLoading: false,
      tableData: [],
      pageData: {},
      total: 0,
      pageSize: 10,
      current: 1,
      tableColumns: detailTableTitle(this)
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
    getDetail() {
      if (!this.hasId) return;
      this.pageData = this.modalData;
    },
    _getList() {
      if (!this.hasId) return;
      this.func = s.taskResultDetail;
      // this.extraParams.driverUuid = this.modalData.driverNo;
      this.extraParams.batchId = this.modalData.id;
      this.getList();
    },
    cancel(refresh = false) {
      this.$emit("close", { refresh });
    },
    initData() {
      this.pageData = {};
    }
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
