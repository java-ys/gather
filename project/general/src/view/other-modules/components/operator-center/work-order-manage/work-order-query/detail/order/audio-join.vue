<template>
  <Modal v-model="show" width="1200" footer-hide title="带车加盟录音" :mask-closable="false">
    <m2-table
      :total="total"
      v-if="show"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="audioTableColumns"
      :parTableData="tableData"
      style="margin-top:12px"
      :height="260"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></m2-table>
  </Modal>
</template>

<script>
import {
  audioTableColumns
} from "_o/components/operator-center/work-order-manage/work-order-query/detail/fields";
import m2Table from "_a/m2-table/v-table";
import {audioList} from "../apiMixin"

export default {
  name: "audio-join",// 带车加盟录音列表
  components: {
    m2Table
  },
  mixins: [audioList],
  watch: {
    show(v) {
      if(!v) {
        this.tableData = [];
        this.current = 1
        this.pageSize = 10
        this.total = 0
      }
    }
  },
  data() {
    return {
      pageData: {},
      show: false,
      isLoading: false,
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      audioTableColumns: audioTableColumns(this),
    };
  },
  methods: {
    async init(p = {}) {
      this.pageData = p;
      await this.getList();
      this.show = true
    },
    async getList() {
      let { current, pageSize } = this
      const {list, total} = await this.getAudios({currPage: current, pageSize, orderNo: this.pageData.routeNo});
      this.tableData = list
      this.total = total
    },
    changePage(current) {
      this.current = current
      this.getList()
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList()
    },
  },
};
</script>

<style scoped>

</style>
