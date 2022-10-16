<template>
  <div>
    <Modal v-model="show" width="40%" title="操作记录" :mask-closable="false" @on-cancel="cancel">
      <div>
        <m2-table
          :isLoading="isLoading"
          :parColumns="tableColumns"
          :parTableData="tableData"
          :isShowPage="false"
        ></m2-table>
      </div>
      <div slot="footer">
        <Button type="primary" v-lazy-click="cancel">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { recordTableTitle } from "./fields";
import { tool } from "_o/api/baseMixin.js";
import { operationRecordService } from "_o/api/coupon-manage";

export default {
  props: ["visible", "modalData"],
  mixins: [tool],
  components: {
    m2Table
  },
  data() {
    return {
      isLoading: true,
      show: this.visible,
      tableData: [],
      pageSize: 20,
      current: 1,
      tableColumns: recordTableTitle(this)
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        this.getList();
      }
    }
  },
  methods: {
    async getList() {
      this.truy("isLoading");
      let p = {
        currPage: this.current,
        pageSize: this.pageSize,
        id: this.modalData.id
      };
      const [err, data] = await this.toResult(operationRecordService(p));
      this.falsy("isLoading");
      if (err || !data) {
        return;
      }
      this.tableData = data.list;
    },
    cancel() {
      this.$emit("close", {});
    }
  }
};
</script>

<style lang="less" scoped>
</style>