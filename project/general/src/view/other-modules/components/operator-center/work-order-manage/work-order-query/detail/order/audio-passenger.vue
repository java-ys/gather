<template>
  <Modal v-model="show" width="1200" footer-hide title="司乘录音" :mask-closable="false">
    <m2-table
      v-if="show"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="audioSiChengColumns"
      :parTableData="tableData"
      style="margin-top:12px"
      :height="260"
    ></m2-table>
  </Modal>
</template>

<script>
import {
  audioSiChengColumns,
} from "_o/components/operator-center/work-order-manage/work-order-query/detail/fields";
import m2Table from "_a/m2-table/v-table";
import {scAudioList} from "../apiMixin"

export default {
  name: "audio-passenger",// 司乘录音列表
  components: {
    m2Table
  },
  mixins: [scAudioList],
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
      audioSiChengColumns: audioSiChengColumns(this),
    };
  },
  methods: {
    async init(p = {}) {
      this.pageData = p
      await this.getList()
      this.show = true
    },
    async getList() {
      let { current, pageSize } = this
      const {list, total} = await this.getSiChengAudios({currPage: current, pageSize, routePlanId: this.pageData.routeId});
      this.tableData = list
      this.total = total
    },
  },
};
</script>

<style scoped>

</style>
