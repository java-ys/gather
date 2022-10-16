<template>
  <Modal v-model="show" width="64%" footer-hide title="详情" :mask-closable="false">
    <div class="title">{{pageData.taskName}}</div>
    <div class="item-c">
      <Row>
        <Col span="5">城市: {{pageData.cityCode}}</Col>
        <Col span="5">产品线: 快享</Col>
        <Col span="5">任务类型: 单次</Col>
        <Col span="9">触发时间: {{pageData.startTime}}0 至 {{pageData.endTime}}</Col>
      </Row>
      <Row class="mt-10">
        <Col span="5">
          <Select
            v-model="mm"
            clearable
            placeholder="请选择针对城市"
            style="width: 120px"
          >
            <Option
              v-for="item in list"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Button type="primary" @click="search">查询</Button>
        </Col>
      </Row>
    </div>

    <div class="item-c">
      <div class="title">触达详情</div>
      <Table border :columns="columns1" :data="data1"></Table>
      <p class="but-c"><Button type="primary">下载数据</Button></p>
    </div>

    <div class="item-c">
      <p class="title">回款详情</p>
      <Table border :columns="columns2" :data="data2"></Table>
      <p class="but-c"><Button type="primary">下载数据</Button></p>
    </div>

    <div class="item-c">
      <div class="title">券核销情况</div>
      <div class="ticket-con">
        <div class="lef bc">
          <p>优惠券 支付有礼7折券</p>
          <p>最高抵扣15元 1张</p>
        </div>
        <div class="right-c">
          <div class="ticket-c bc">
            <div class="i-l flex1">补贴率</div>
            <div class="i-l flex1">RIO</div>
            <div class="i-l flex1">用券率</div>
            <div class="i-l flex1">用券数</div>
            <div class="i-l flex1">实付优惠券(元)</div>
            <div class="i-l flex1">用券订单流水(元)</div>
          </div>
          <div class="ticket-c">
            <div class="i-l flex1">29.22%</div>
            <div class="i-l flex1">2.35</div>
            <div class="i-l flex1">0.22</div>
            <div class="i-l flex1">70</div>
            <div class="i-l flex1">400</div>
            <div class="i-l flex1">300</div>
          </div>

          <div class="ticket-c bc">
            <div class="i-l flex1">已发放额度</div>
            <div class="i-l flex1">已使用额度</div>
            <div class="i-l flex1">已发放人数</div>
            <div class="i-l flex1">已废弃额度</div>
            <div class="i-l flex1">总额度</div>
          </div>

          <div class="ticket-c">
            <div class="i-l flex1">1111</div>
            <div class="i-l flex1">70</div>
            <div class="i-l flex1">80</div>
            <div class="i-l flex1">0</div>
            <div class="i-l flex1">0</div>
          </div>
          <div class="ticket-c bc">
            <div class="i-l flex1">已发放张数</div>
            <div class="i-l flex1">已使用张数</div>
            <div class="i-l flex1">使用人数</div>
            <div class="i-l flex1">已作废张数</div>
            <div class="i-l flex1">优惠券总张数(元)</div>
          </div>
          <div class="ticket-c">
            <div class="i-l flex1">1511</div>
            <div class="i-l flex1">70</div>
            <div class="i-l flex1">80</div>
            <div class="i-l flex1">0</div>
            <div class="i-l flex1">0</div>
          </div>
        </div>
      </div>
      <!-- <Table border :columns="columns3" :data="data3"></Table> -->
      <p class="but-c"><Button type="primary">下载数据</Button></p>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      pageData: {},
      show: false,
      mm: "",
      data1: [],
      data2: [],
      data3: [],
      list: [
        {
          label: "语音外呼",
          value: 0,
        },
        {
          label: "优惠券发放",
          value: 1,
        },
        {
          label: "触达",
          value: 2,
        },
      ],
    };
  },
  created() {
    this.columns1 = [
      { title: "发送时间", key: "createTime" },
      { title: "发送人数", key: "nodeName" },
      { title: "发送成功量", key: "nodeHandler" },
      { title: "发送成功率", key: "handle" },
      { title: "阅读量", key: "handleOpinion" },
      { title: "激活人数(触发60分钟内打开APP用户数)", key: "handleOpinion" },
      { title: "激活率(激活人数/发送成功量)", key: "handleOpinion" },
    ];
    this.columns2 = [
      { title: "发送时间", key: "createTime" },
      { title: "发送人未付金额", key: "nodeName" },
      { title: "发送成功人未付金额", key: "nodeHandler" },
      { title: "激活人数未付金额", key: "handle" },
      { title: "24小时支付人数", key: "handleOpinion" },
      { title: "24小时支付金额", key: "handleOpinion" },
      { title: "催回人数比(24小时支付人数/发送成功人)", key: "handleOpinion" },
      {
        title: "回款比(24小时支付金额/发送成功人未付金额)",
        key: "handleOpinion",
      },
    ];
  },
  methods: {
    init(p) {
      this.pageData = p
      this.show = true
    },
    search() {},
  },
};
</script>

<style scoped>
.title {
  line-height: 44px;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 28px;
}
.but-c {
  margin-top: 10px;
  text-align: right;
}
.item-c {
  margin-bottom: 40px;
}
.ticket-con {
  display: flex;
  flex-direction: row;
}
.ticket-c {
  display: flex;
  flex-direction: row;
  height: 30px;
  line-height: 30px;
}
.lef {
  height: 180px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bc {
  background-color: rgb(248, 248, 249);
}
.i-l {
  text-align: center;
}
.right-c {
  flex: 1;
}
.flex1 {
  flex: 1;
}
.mt-10 {
  margin-top: 10px;
}
</style>