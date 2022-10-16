<template>
  <div class="passenger-content">
    <div class="passenger-recommand-detail">
      <Row class="basic-info" type="flex">
        <Col :span="6">
          <label>推荐奖励名称：</label>
          <span>{{ basicInfo.ruleName }}</span>
        </Col>
        <Col :span="6">
          <label>推荐人类型：</label>
          <span>{{ basicInfo.configType | recommenderFilter }}</span>
        </Col>
        <Col :span="24">
          <label>省/市：</label>
          <span>{{ basicInfo.provinceName }} / {{ basicInfo.cityName }}</span>
        </Col>
        <Col :span="24">
          <label>有效时间：</label>
          <span>{{ basicInfo.validTime }} 至 {{ basicInfo.expireTime }}</span>
        </Col>
        <Col :span="24">
          <label>活动规则：</label>
          <Input
            v-model="basicInfo.ruleContent"
            type="textarea"
            disabled
            :rows="4"
            style="width: 360px"
          />
        </Col>
      </Row>

      <Card v-for="(values, key, index) in basicInfo.groupByRewardObjectRes" :key="index" class="award-item">
        <div slot="title">
          <label class="item-title">{{ key | rewardObjectFilter }}</label>
        </div>

        <!-- configType: 1 司机  2 乘客 -->
        <!-- ============司推司=========== -->  
        <template v-if="basicInfo.configType === 1">
          <Row v-for="(item, index) in values" :key="index">
            <Col class="item-fst-title">
              <label>{{ item.rewardEvent | rewardEventFilter}}</label>
              <span class="tips">
                {{ item.rewardEvent | rewardEventTipsFilter }}
              </span>
            </Col>
            <Col>
              <label>奖励达成条件: </label> <span>{{ item.rewardCondition | rewardConditionFilter }}</span>
            </Col>
            <Col>
              <label>奖励金额: </label> <span> {{ item.cashValue }} 元</span>
            </Col>
          </Row>
        </template>

        <!-- ============乘推司=========== -->  
        <template v-if="basicInfo.configType === 2">
          <Row v-for="(item, index) in values" :key="index">
            <Col class="item-fst-title">
              <label>{{ item.rewardEvent | rewardEventFilter}}</label>
              <span class="tips">
                {{ item.rewardEvent | rewardEventTipsFilter }}
              </span>
            </Col>
            <template v-if="item.single">
              <div class="award-content">
                <div class="sub-title"><span></span>优惠券奖励</div>
                <coupon-detail
                  :limitNumber="1"
                  :isEvery="true"
                  :isEdit="false"
                  :listData="[item]"
                ></coupon-detail>
                <div >
                  <div>
                    <label>奖励上限：</label>
                    <span>{{ item.couponLimit | maxFilter(0) }}</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="item.single1">
              <div class="award-content">
                <Col>
                <label>确认入职：</label>
                  <span>{{ item.rewardDelay }}</span>天
                </Col>
                <Col>
                  <label>奖励类型：</label>
                  <span style="margin-right: 10px" v-if="item.couponModal">优惠券</span>
                  <span v-if="item.cashModal">现金</span>
                </Col>
                <div v-if="item.couponModal">
                  <div class="sub-title"><span></span>优惠券奖励</div>
                  <coupon-detail
                    :limitNumber="1"
                    :listData="[item]"
                    :isEvery="true"
                  ></coupon-detail>
                    <Col>
                      <label>奖励上限：</label>
                      <span>{{ item.couponLimit | maxFilter(0) }}</span>
                    </Col>
                </div>
                <Col v-if="item.cashModal">
                  <div class="sub-title"><span></span>现金奖励</div>
                    <Row class="inner-row" type="flex">
                      <Col :span="3">
                      <label>奖励现金：</label>
                      <span>{{ item.cashValue }}元</span>
                    </Col>
                    <Col>
                      <label>奖励上限：</label>
                      <span>{{ item.cashMax | maxFilter(1) }}</span>
                    </Col>
                    </Row>
                </Col>
              </div>
            </template>
          </Row>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { basicInfoFields1, driverTypes } from "./conf";
import couponDetail from "../new-activity/coupon-detail/index.vue";
import { getDetailBasicInfo, queryRuleDetail } from "_o/api/operator-carrier";

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

/**
 * @description 将接口详情数据 rewardObject(被推荐司机类型) 分组
 */
function formatDetails(data) {
  const detail = JSON.parse(JSON.stringify(data))
  const groupByRewardObjectRes = groupBy(detail.detailList, 'rewardObject')
  
  detail.groupByRewardObjectRes = groupByRewardObjectRes

  return detail
}

export default {
  name: "passenger-recommand-detail",
  components: { couponDetail },
  data() {
    return {
      basicInfoFields1,
      titleName: "name1",
      basicInfo: {},
      ruleId: this.$route.params.ruleId
    };
  },
  filters: {
    // type 0:次数上限  1:金额上限
    maxFilter(value, type) {
      const units = ['次', '元']
      const infiniteText = ['不限次数', '不限金额']
      return value > 0 ? `${value}${units[type]}` : infiniteText[type]
    },
    rewardObjectFilter(value) {
      return driverTypes.find(item => +item.value === +value).label
    },
    rewardConditionFilter(value) {
      const texts = ['', '确认入职', '绑车时间']
      return texts[value]
    },
    recommenderFilter(value) {
      const texts = ['', '司机', '乘客']
      return texts[value]
    },
    rewardEventFilter(value) {
      const texts = ['司机报名奖励', '司机运营奖励']
      return texts[value]
    },
    rewardEventTipsFilter(value) {
      const texts = ['每个司机报名成功，对推荐人奖励', '司机确认入职达到一定时间后，对推荐人奖励']
      return texts[value]
    }
  },
  mounted() {
    this.getBasicInfo();
  },
  methods: {
    getBasicInfo() {
      queryRuleDetail({
        ruleId: this.$route.params.ruleId,
      }).then((res) => {

        const {data}  = res
        if(!data.success) return
        const detailList = data.data.detailList;

        detailList.forEach((element, index) => {
          // 司机报名奖优惠券奖励
          if (element.rewardType == "0" && element.rewardEvent == "0") {
            element.single = true;
          }
          if (element.rewardType == "0" && element.rewardEvent == "1") {
            element.single1 = true;
            element.couponModal = true;
          }
          if (element.rewardType == "1" && element.rewardEvent == "1") {
            element.single1 = true;
            element.cashModal = true;
          }
        });

        const sss = formatDetails(data.data)


        this.basicInfo = formatDetails(data.data)
      });
    }
   
  },
};
</script>

<style lang="less" scope>
  .passenger-content{
    padding: 20px;
    .basic-info{
      padding-bottom: 20px;
    }
  }
  .passenger-recommand-detail{
    .ivu-col {
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      label {
        font-weight: bold;
      }
    }
  }

  .inner-row{
    .ivu-col{
      margin-bottom: 0;
    }
  }

  .award-content{
    padding-left: 20px;
  }

  .award-item{
    margin-top: 30px;
  }
  .item-fst-title{
    padding-top: 20px;
  }
  .item-title{
    font-weight: bold;
  }
  .st-title{
    padding: 0 10px;
    margin-bottom: 10px;
  }
  .sub-title{
    position: relative;
    padding: 0 10px;
    margin-bottom: 10px;
    &::after{
      content: '';
      position: absolute;
      height: 60%;
      width: 4px;
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background: #02a7f0;
    }
  }
  .tips{
    color: #b2afaf;
    font-size: 12px;
    margin-left: 10px;
  }
</style>
