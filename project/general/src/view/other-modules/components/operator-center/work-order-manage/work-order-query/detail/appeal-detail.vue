<template>
  <div>
    <div v-for="(item, index) in recordInfo" :key="index">
    <Card class="card">
      <p slot="title">司机最终申诉</p>
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

      <Card class="card">
        <p slot="title">城市申诉处理</p>
        <Row>
          <Col span="6">申诉处理人：{{ item.handlerNo }}</Col>
          <Col span="6">初审申诉处理人姓名：{{ item.handlerName }}</Col>
          <Col span="6"
          >初审申诉判责结果：申诉{{ item.auditResult === 1 ? item.judgeResult === 1 ? "通过": "通过,司机无责" : "驳回" }}</Col
          >
        </Row>
        <br />
        <template v-if="item.auditResult === 1 && item.judgeResult === 1">
          <Row v-for="(item, index) in item.illegalList" :key="index">
            <Col span="6"
            >初审判责类型{{ index > 0 ? index + 1 : "" }}：{{
                item.judgeType
              }}</Col
            >
            <Col span="6">违规等级：{{ item.illegalLevel }}</Col>
            <Col span="6">处罚类型：{{ item | punishTypeF }}</Col>
            <Col span="6">处罚标准：{{ item | standardF }}</Col>
            <br />
            <br />
          </Row>
        </template>
        <br />
        <Row>
          <Col>初审申诉处理判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">初审申诉处理描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">初审申诉处理开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">初审申诉结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">初审申诉用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>

      <Card class="card">
        <p slot="title">总部审核组</p>
        <Row>
          <Col span="6">申诉处理人：{{ item.handlerNo }}</Col>
          <Col span="6">初审申诉处理人姓名：{{ item.handlerName }}</Col>
          <Col span="6"
          >初审申诉判责结果：申诉{{ item.auditResult === 1 ? item.judgeResult === 1 ? "通过": "通过,司机无责" : "驳回" }}</Col
          >
        </Row>
        <br />
        <template v-if="item.auditResult === 1 && item.judgeResult === 1">
          <Row v-for="(item, index) in item.illegalList" :key="index">
            <Col span="6"
            >初审判责类型{{ index > 0 ? index + 1 : "" }}：{{
                item.judgeType
              }}</Col
            >
            <Col span="6">违规等级：{{ item.illegalLevel }}</Col>
            <Col span="6">处罚类型：{{ item | punishTypeF }}</Col>
            <Col span="6">处罚标准：{{ item | standardF }}</Col>
            <br />
            <br />
          </Row>
        </template>
        <br />
        <Row>
          <Col>初审申诉处理判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">初审申诉处理描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">初审申诉处理开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">初审申诉结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">初审申诉用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
      </div>
  </div>
</template>

<script>
export default {
  name: "appeal-detail",
  props: {
    recordInfo: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
