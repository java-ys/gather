<template>
  <div>
    <Modal v-model="show" width="60%" title="任务奖励详情" @on-cancel="cancel"  @on-ok="cancel">
      <Row>
        <Col span="6">司机姓名：{{ detailsObj.driverName }}</Col>
        <Col span="6">自然周：{{ detailsObj.beginTimeDesc }}</Col>
      </Row>
      <Row>
        <Col span="6">司机类型：{{ driveTypeMap[detailsObj.driverType] }}</Col>
        <Col span="6">确认入职日期：{{ detailsObj.driverTime }}</Col>
        <Col span="6"
          >是否新入职：{{ detailsObj.newDriver == 1 ? "是" : "否" }}</Col
        >
      </Row>
      <TTable
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        :isShowPage="false"
      >
      </TTable>
    </Modal>
  </div>
</template>

<script>
import { tool, getObjKeys, isFunc } from "_o/api/baseMixin.js";
import { driveTypeMap, subTableTitle, listPageData } from "../fields";
import { listFlow } from "_o/api/task-manager";
export default {
  name: "dialog-detail",
  props: ["visible", "detailsObj"],
  components: {},

  mixins: [tool],
  filters: {
    titleFilter(value) {
      return titleList[value];
    },
  },
  data() {
    return {
      show: this.visible,
      driveTypeMap,
      isLoading: false,
      ...listPageData,
    };
  },
  created() {
    this.tableColumns = subTableTitle(this);
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        this.getDetail();
      } else {
        // this.initData();
      }
    },
  },
  methods: {
    getDetail() {
      this.isLoading = true;
      const { driverUuid, startTime, endTime } = this.detailsObj;
      let params = {
        driverUuid,
        startTime,
        endTime,
      };
      listFlow(params).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.tableData = data || [];
          this.total = data.totalCount || 0;
          this.current = data.currPage !== 0 ? data.currPage : 1;
          this.pageSize = data.pageSize || 10;
          this.isLoading = false;
        }
      });
    },

    cancel() {
      this.$emit("on-close");
    },
  },
};
</script>

<style lang="less" scoped>
.ivu-row {
  margin-bottom: 8px;
}
</style>
