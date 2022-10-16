<template>
  <div class="record-con">
    <div v-for="(item, index) in recordInfo" :key="index">
      <Card v-if="['SJ_ZS_SS_END','SJ_APPEAL_FINAL'].includes(item.valKey)" class="card">
        <p slot="title">司机最终申诉结果</p>
        <Row>
          <Col span="8">处理人：{{ item.handlerName }}</Col>
          <Col span="8"
          >处理结果：司机{{
              item.valKey === "SJ_QR_END"
                ? "司机确认"
                : item.valKey === "SJ_QR_AUTO_END"
                  ? "司机超时自动确认"
                  : "申诉"
            }}</Col
          >
        </Row>
        <br />
        <Row>
          <Col>申诉订单: <span
            v-for="(it, k) in item.orderList || []"
            :key="k"
            @click="() => toOrderDetail(it)"
            style="margin-left: 4px; cursor: pointer; color: rgb(45, 140, 240);"
          >{{ it }}</span></Col>
        </Row>
        <br />
        <Row>
          <Col>申诉证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">申诉理由：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">司机处理开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">司机结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">司机用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
    </div>
    </div>
</template>

<script>
import ViewPicture from "../components/ViewPicture";
import ViewVideo from "../components/ViewVideo";

export default {
  name: "city-record",
  components: {
    ViewPicture,
    ViewVideo
  },
  props: {
    recordInfo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  methods: {}
}
</script>

<style lang="less">
.card {
  margin-bottom: 25px;
}
</style>
