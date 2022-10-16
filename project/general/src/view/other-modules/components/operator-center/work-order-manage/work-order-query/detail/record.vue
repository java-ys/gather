<template>
  <div>
    <div v-for="(item, index) in recordInfo" :key="index">
      <Card v-if="item.valKey === 'CS'" class="card">
        <p slot="title">初审判责处理</p>
        <Row>
          <Col span="6">初审判责人工号：{{ item.handlerNo }}</Col>
          <Col span="6">初审判责人姓名：{{ item.handlerName }}</Col>
          <Col span="6"
            >初审判责结果：司机{{ item.judgeResult === 1 ? "有" : "无" }}责</Col
          >
        </Row>
        <br />
        <Row v-for="(item, index) in item.illegalList" :key="index">
          <Col span="6"
            >初审判责类型{{ index > 0 ? index + 1 : "" }}：{{
              item.judgeType
            }}</Col
          >
          <Col span="6">违规等级：{{ item.illegalLevel }}</Col>
          <Col span="6">处罚类型：{{ item | punishTypeF }}</Col>
          <Col span="6">处罚标准：{{ item | standardF }}</Col>
        </Row>
        <Row v-if="banFlag" style="margin-top: 1.2em;">
          <Col span="6">处罚类型：封禁</Col>
          <Col span="6">封禁至：{{banTime}}</Col>
        </Row>
        <br />
        <Row>
          <Col>初审判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col v-if="item.judgeTags&&item.judgeTags.length">初审判责标签：{{judgeLabelMap.filter(it=>item.judgeTags.indexOf(it.illegalCode)>-1).map(it=>it.illegalType).join(',')}}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">初审判责描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">初审判责开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">初审判责结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">初审判责用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
      <Card v-else-if="item.valKey === 'ZS'" class="card">
        <p slot="title">终审判责处理</p>
        <Row>
          <Col span="8">终审判责人工号：{{ item.handlerNo }}</Col>
          <Col span="8">终审判责人姓名：{{ item.handlerName }}</Col>
          <Col span="8"
            >终审判责结果：
            {{ item.auditResult === 1 ? "" : "不" }}通过初审判责结果</Col
          >
        </Row>
        <br />
        <Row>
          <Col>终审判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">终审判责描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">终审判责开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">终审判责结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">终审判责用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
      <Card v-else-if="item.valKey === 'SJ_SS'" class="card">
        <p slot="title">司机确认违规处理结果</p>
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
      <Card v-else-if="item.valKey === 'SJ_SF_SSZ' || item.valKey === 'SYSTEM_SF_SSZ'" class="card">
        <p slot="title">第三方判责处理</p>
        <Row>
          <Col span="8">第三方判责人工号：{{ item.handlerNo }}</Col>
          <Col span="8">第三方判责人姓名：{{ item.handlerName }}</Col>
          <Col span="8"
          >第三方判责结果：
            {{ item.auditResult === 1 ? "" : "不" }}通过初审判责结果</Col
          >
        </Row>
        <br />
        <Row>
          <Col>第三方判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">第三方判责描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">第三方判责开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">第三方判责结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">第三方判责用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
      <Card v-else-if="item.valKey === 'SJ_CS_SS'" class="card">
        <p slot="title">初审申诉处理</p>
        <Row>
          <Col span="6">初审申诉处理人：{{ item.handlerNo }}</Col>
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
      <Card v-else-if="item.valKey === 'SJ_ZS_SS'" class="card">
        <p slot="title">终审申诉处理</p>
        <Row>
          <Col span="8">终审申诉处理人：{{ item.handlerNo }}</Col>
          <Col span="8">终审申诉处理人姓名：{{ item.handlerName }}</Col>
          <Col span="8"
            >终审申诉判责结果：{{
              item.auditResult === 1 ? "通过" : "驳回"
            }}初审申诉判责结果</Col
          >
        </Row>
        <br />
        <Row>
          <Col>终审申诉处理判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">终审申诉处理描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">终审申诉处理开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">终审申诉结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">终审申诉用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
      <Card v-if="item.valKey === 'APPEAL_ONCE_MORE'" class="card">
        <p slot="title">更改判责处理</p>
        <Row>
          <Col span="6">处理人工号：{{ item.handlerNo }}</Col>
          <Col span="6">处理人姓名：{{ item.handlerName }}</Col>
          <Col span="6"
            >更改判责结果：司机{{ item.judgeResult === 1 ? "有" : "无" }}责</Col
          >
        </Row>
        <br />
        <Row v-for="(item, index) in item.illegalList" :key="index">
          <Col span="6"
            >判责类型{{ index > 0 ? index + 1 : "" }}：{{
              item.judgeType
            }}</Col
          >
          <Col span="6">违规等级：{{ item.illegalLevel }}</Col>
          <Col span="6">处罚类型：{{ item | punishTypeF }}</Col>
          <Col span="6">处罚标准：{{ item | standardF }}</Col>
          <br />
          <br />
        </Row>
        <Row>
          <Col>更改判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">更改判责描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">处理时间：{{ item.handlerStartTime }}</Col>
          <!-- <Col span="8">二次申诉开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">二次申诉结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">二次申诉用时：{{ item.handlerCostTimeText }}</Col> -->
        </Row>
      </Card>
      <Card v-if="['SJ_ZS_SS_END', 'SJ_APPEAL_FINAL'].includes(item.valKey)" class="card">
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
      <Card v-if="['SJ_CITY','SJ_CITY_AUTO_END', 'SJ_CITY_END'].includes(item.valKey)" class="card">
        <p slot="title">城市审核申诉处理</p>
        <Row>
          <Col span="8">申诉处理人：{{ item.handlerNo }}</Col>
          <Col span="8">申诉处理人姓名：{{ item.handlerName }}</Col>
          <Col span="8"
          >申诉判责结果：{{
              item.auditResult === 1 ? "通过" : "驳回"
            }}初审申诉判责结果</Col
          >
        </Row>
        <br />
        <Row>
          <Col>申诉处理判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">申诉处理描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">申诉处理开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">申诉结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">申诉用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
      <Card v-if="['SJ_HEAD','SJ_HEAD_END'].includes(item.valKey)" class="card">
        <p slot="title">总部审核申诉处理</p>
        <Row>
          <Col span="6">申诉处理人：{{ item.handlerNo }}</Col>
          <Col span="6">申诉处理人姓名：{{ item.handlerName }}</Col>
          <Col span="6"
          >申诉判责结果：申诉{{ item.auditResult === 1 ? item.judgeResult === 1 ? "通过": "通过,司机无责" : "驳回" }}</Col
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
          <Col>申诉处理判责证据：</Col>
          <Col>
            <ViewPicture :data="item.pictures" class="view"></ViewPicture>
            <ViewVideo :data="item.videos"></ViewVideo>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span="24">申诉处理描述：{{ item.judgeDesc }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="24">判责小结描述：{{ item.briefSummary }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">申诉处理开始时间：{{ item.handlerStartTime }}</Col>
          <Col span="8">申诉结束时间：{{ item.handlerEndTime }}</Col>
          <Col span="8">申诉用时：{{ item.handlerCostTimeText }}</Col>
        </Row>
      </Card>
    </div>
  </div>
</template>

<script>
import ViewPicture from "../components/ViewPicture";
import ViewVideo from "../components/ViewVideo";
import { judgeLabelMap } from "./fields.js";
export default {
  name: "record",
  components: {
    ViewPicture,
    ViewVideo
  },
  props: {
    recordInfo: {
      type: Array,
      default: () => []
    },
    banFlag: Boolean,
    banTime: String,
  },
  filters: {
    standardF(it) {
      let { forfeit, serviceScore } = it || {}
      let s = []
      if(forfeit && forfeit > 0) {
        s.push(-forfeit)
      }
      if(serviceScore && serviceScore.transientValue) {
        s.push(serviceScore.transientValue)
      }
      return s.length ? s.join(", ") : "-"
    },
    punishTypeF(it) {
      let { forfeit, serviceScore, course } = it || {}
      let s = []
      if(forfeit && forfeit > 0) {
        s.push("金额")
      }
      if(serviceScore && serviceScore.value) {
        s.push("服务分")
      }
      if(course) {
        s.push("课程学习")
      }
      return s.join(", ")
    },
  },
  data(){
      return {
          judgeLabelMap
      }
  },
  methods: {
    toOrderDetail(c) {
      this.$router.push({
        name: 'order-detail',
        params: { id: c }
      });
    },
  }
};
</script>

<style lang="less" scoped>
.card {
  margin: 0 0 25px;
}

.view {
  margin: 10px 0;
}
</style>
