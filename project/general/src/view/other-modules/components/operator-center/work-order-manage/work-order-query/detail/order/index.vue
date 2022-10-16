<template>
  <div>
    <div class="risk-l">风控订单明细</div>
    <m2-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      :isShowPage="false"
      :height="400"
    />
    <video-c ref="_video"></video-c>
    <audio-p ref="_audio_p"></audio-p>
    <audio-j ref="_audio_j"></audio-j>
  </div>
</template>

<script>
import {columns} from "./fields";
import {riskOrderList} from "../apiMixin"
import m2Table from "_a/m2-table/v-table";

import VideoC from "./video"
import AudioP from "./audio-passenger"
import AudioJ from "./audio-join"

export default {
  name: "rise-order",
  components: {
    m2Table,
    VideoC,
    AudioP,
    AudioJ
  },
  props: {
    basicInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  mixins: [riskOrderList],
  data() {
    return {
      current: 0,
      total: 0,
      pageSize: 20,
      tableData: [],
      columns: columns(this)
    }
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const { woCode } = this.$route.query;
      const { list } = await this.getRiskOrderList({woCode});
      this.$store.commit("setRiskList", list)
      this.tableData = list
    },
    videoClick(row) {
      this.$refs._video.init(this.basicInfo, row)
    },
    scClick(row) {
      this.$refs._audio_p.init(row)
    },
    audioClick(row) {
      this.$refs._audio_j.init(row)
    },
    toOrderDetail(row) {
      const { typeModule } = this.basicInfo
      if (typeModule === 1) {
        this.$Message.info("出租车订单，无法跳转");
        return;
      }
      this.$router.push({
        name: 'order-detail',
        params: { id: row.routeId }
      });
    },
  }
}
</script>

<style scoped lang="less">
.risk-l {
  margin-bottom: 10px; font-weight: bold;color: #17233d; font-size: 14px; padding-left: 16px;
}
</style>
