<template>
  <div class="passenger-content">
    <Tabs v-model="titleName">
      <TabPane
        label="奖励规则"
        name="name1"
      >
        <div class="passenger-recommand-detail">
          <div class="basic-info">
            <div>
              <Form
                ref="form"
                :model="basicInfo"
                label-position="left"
                style="padding-left: 30px;"
              >
                <Row
                  v-for="list in basicInfoFields1"
                  :key="list.index"
                >
                  <Col
                    v-for="item in list"
                    :key="item.index"
                    :span="item.span"
                  >
                  <FormItem
                    :label="item.title"
                    :label-width="item.labelWidth"
                  >
                    <span v-if="item.render">{{
                      item.render(basicInfo[item.value], basicInfo)
                    }}</span>
                    <span v-else>{{ basicInfo[item.value] }}</span>
                  </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div style="padding: 0 30px">
            <Form>
              <p style="line-height: 32px;font-size: 14px">
                推荐奖励：
              </p>

              <FormItem v-if="single">
                <span style="width: 100%">
                  司机报名奖
                </span>
                <span style="margin-left: 15px;color: #b2afaf">每个司机报名成功，对推荐人奖励</span>
                <div>
                  <div class="passenger-name">
                    <span></span>优惠券奖励
                  </div>
                  <coupon-detail
                    :limitNumber="1"
                    :isEvery="true"
                    :isEdit="false"
                    :listData="listData"
                  ></coupon-detail>
                  <div class="new-label">
                    <FormItem label="奖励上限：">
                      <span>{{ formData.couponLimit }}</span>
                      </Select>
                    </FormItem>
                  </div>
                </div>
              </FormItem>
              <FormItem v-if="single1">
                <span style="line-height: 32px;font-size: 14px">司机营运奖励：</span>
                <span style="margin-left: 15px;color: #b2afaf">司机缴纳保证金达到一定时间后，对推荐人奖励</span>
                <div>
                  <div>
                    <FormItem
                      label="缴纳保证金满"
                      class="new-label2"
                    >
                      <span>{{ formData.rewardDelay }}</span>天
                    </FormItem>
                    <FormItem
                      label="奖励类型"
                      class="new-label2"
                      style="margin-top: 10px"
                    >
                      <span style="margin-right: 10px">优惠券</span>
                      <span>现金</span>
                    </FormItem>
                  </div>
                  <div v-if="couponModal">
                    <div class="passenger-name">
                      <span></span>优惠券奖励
                    </div>
                    <coupon-detail
                      :limitNumber="1"
                      :listData="listData2"
                      :isEvery="true"
                    ></coupon-detail>
                    <div class="new-labe2">
                      <FormItem label="奖励上限：">
                        <span>{{ formData.couponLimit2 }}</span>
                      </FormItem>
                    </div>
                  </div>
                  <div v-if="cashModal">
                    <div class="passenger-name">
                      <span></span>现金奖励
                    </div>
                    <div class="new-label">
                      <FormItem label="奖励现金：">
                        <span>{{ formData.cashValue }}元</span>
                      </FormItem>
                      <FormItem label="奖励上限：">
                        <span>{{ formData.cashMax }}</span>
                      </FormItem>
                    </div>
                  </div>
                </div>
              </FormItem>

              <FormItem label="活动规则：">
                <Input
                  v-model="basicInfo.ruleContent"
                  type="textarea"
                  disabled
                  :rows="4"
                  placeholder="请输入..."
                  style="width: 360px"
                />
              </FormItem>
            </Form>
          </div>
        </div>
      </TabPane>
      <TabPane
        label="奖励信息"
        name="name2"
      >
        <award-info :ruleId="ruleId"></award-info>
      </TabPane>
    </Tabs>
    <div class="footer-button">
      <Button
        key="1"
        style="margin-right: 10px"
        @click="cancelClick"
      >
        关闭
      </Button>
      <Button
        key="3"
        type="primary"
        style="margin-right: 10px"
        @click="nextCilck"
      >
        {{ titleName == 'name1'? '下一页':'上一页' }}
      </Button>
    </div>
  </div>
</template>

<script>
import {
  basicInfoFields1,
} from "./conf";
import couponDetail from "../new-activity/coupon-detail/index.vue";
import awardInfo from "./awardInfo.vue";
import {
  getDetailBasicInfo,
  getListData,
  exportListData,
  batchReward,
  rewardData,
  cancalRewardData,
  getDetailRecord,
  axiosGetBankList
} from "_o/api/operator-carrier";
export default {
  name: "passenger-recommand-detail",
  components: { couponDetail, awardInfo },
  data() {
    return {
      basicInfoFields1,
      titleName: "name1",
      basicInfo: {

      },
      formData: {},
      single: false,
      single1: false,
      cashModal: false,
      couponModal: false,
      ruleId: this.$route.params.ruleId,
      listData: [],
      listData2: [],
    };
  },
  mounted() {
    this.getBasicInfo();
  },
  methods: {
    cancelClick() {
      this.$router.push({
        name: "passenger-recommand-driver"
      });
    },
    nextCilck() {
      if (this.titleName == "name1") {
        this.titleName = "name2"
      } else {
        this.titleName = "name1"
      }
    },
    getBasicInfo() {
      getDetailBasicInfo({
        ruleId: this.$route.params.ruleId
      }).then(res => {
        let detailList = res.data.data.detailList;
        detailList.forEach((element, index) => {
          // 司机报名奖优惠券奖励
          if (element.rewardType == "0" && element.rewardEvent == "0") {
            this.single = true;
            this.listData = [detailList[index]];
            if (element.couponLimit == "-1") {
              this.formData.couponLimit = "不限次数";
            } else {
              this.formData.couponLimit = element.couponLimit + "次"
            }
          }
          if (element.rewardType == "0" && element.rewardEvent == "1") {
            this.formData.rewardDelay = element.rewardDelay;
            this.listData2 = [detailList[index]];
            if (element.couponLimit == "-1") {
              this.formData.couponLimit2 = "不限次数";
            } else {
              this.formData.couponLimit2 = element.couponLimit + "次"
            }
            this.single1 = true;
            this.couponModal = true;
          }
          if (element.rewardType == "1" && element.rewardEvent == "1") {
            this.formData.rewardDelay = element.rewardDelay;
            this.formData.cashValue = element.cashValue;
            console.log(element.cashValue)
            if (element.cashMax == "-1") {
              this.formData.cashMax = "不限额度";
            } else {
              this.formData.cashMax = element.cashMax + "元"
            }
            this.single1 = true;
            this.cashModal = true;
          }
        });
        let data = res.data.data;
        this.basicInfo = data;
      });
    },
  }
};
</script>

<style lang="less">
 .new-label2 .ivu-form-item-label{
      width: 96px!important;
  }
  .passenger-content{
    .footer-button {
      text-align: center;
      padding-right: 40px
    }
  }
  .new-label2:nth-child(2) .ivu-form-item-label{
      width: 70px!important;
  }
  .new-label{
    display: flex;
    .ivu-form-item{
      width: 210px;
    }
    .ivu-form-item-label{
      width: 82px!important;
    }
  }

</style>
