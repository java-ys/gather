<template>
  <div>
    <Modal
      v-model="isShow"
      :width="900"
      title="推荐奖励活动详情"
      :mask-closable="false"
      @on-cancel="$emit('close')">
      <div>
        <div class="basic-info">
          <div>
            <span class="title">推荐奖励名称：</span>
            <span>{{info.ruleName}}</span>
          </div>
          <div>
            <span class="title">省/市：</span>
            <span>{{info.provinceName}} {{info.cityName===info.provinceName?'': info.cityName}}</span>
          </div>
          <div>
            <span class="title">有效时间：</span>
              <span>{{detailInfo.validTime}} 至 {{detailInfo.expireTime}}</span>
          </div>
          <div>
            <span class="title">奖励条件：</span>
            <Radio :value="true" disabled>{{rewardConditionsMap[detailInfo.rewardEvent]}}</Radio>
          </div>
          <div>
            <span class="title"></span>
            <span>{{rewardConditionsMap[detailInfo.rewardEvent]}} >= {{detailInfo.rewardDelay}}天</span>
          </div>
          <div>
            <span class="title">司机来源：</span>
            <Checkbox :value="true" disabled v-for="item in detailInfo.operatorRewardDetailList" :key="item.channelType" class="right15">
              {{driverOriginMap[item.channelType]}}
            </Checkbox>
          </div>
          <div v-for="item in detailInfo.operatorRewardDetailList" :key="item.channelType" class="item-box">
            <div>
              <span class="title">{{driverOriginPushMap[item.channelType]}}奖励：</span>
              <Radio :value="true" disabled>{{item.rewardType===0?'固定金额':'梯度奖励'}}</Radio>
            </div>
            <div v-if="item.rewardType===0">
              <span class="title"></span>
              <span>奖励现金：</span>
              <span class="width100">{{item.cashStr}}元/人</span>
              <span class="width100" style="text-align:right;">奖励上限：</span>
              <span>{{item.rewardLimit===-1?'不限额度':`${item.rewardLimitStr}元`}}</span>
            </div>
            <div v-else>
              <div v-for="(ladder,i) in item.rewardRuleList" :key="i">
                <span class="title"></span>
                <span>梯度{{i+1}}：</span>
                <span class="minwidth100">{{ladder.lowerLimit}} — {{ladder.upperLimit}}人</span>
                <span class="width100 left15" style="text-align:right;">奖励现金：</span>
                <span class="width100">{{ladder.cashStr}}元/人</span>
                <span v-if="i===item.rewardRuleList.length-1">
                  <span class="width100 left15" style="text-align:right;">奖励上限：</span>
                  <span>{{item.rewardLimit===-1?'不限额度':`${item.rewardLimitStr}元`}}</span>
                </span>
              </div>
            </div>
          </div>
          <div>
            <span class="title">活动规则：</span>
            <Input
              v-model="detailInfo.ruleContent"
              type="textarea"
              disabled
              :rows="5"
              style="width: 500px"
            />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="$emit('close')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  axiosAgentRuleDetail
} from "_o/api/operator-carrier";
import { 
  rewardConditionsMap
} from '../addRule/fields.js'
import { driverOriginMap,driverOriginPushMap } from "_o/components/operator-center/agent-recruit-driver/status-map"

export default {
  name: "add-ad-modal",
  props: {
    show: {
      type: Boolean
    },
    info: {}
  },
  data() {
    return {
      rewardConditionsMap,
      driverOriginMap,
      driverOriginPushMap,
      isShow: false,
      detailInfo:{}
    };
  },
  methods: {
    // 获取详情
    getDetail(value) {
      this.detailInfo = {}
      axiosAgentRuleDetail({
        id: this.info.id
      }).then(res => {
        let data = res.data.data||{}
        data.validTime = this.$moment(data.validTime).format("YYYY-MM-DD")
        data.expireTime = this.$moment(data.expireTime).format("YYYY-MM-DD")
        this.detailInfo = data
      })
    },

  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        this.getDetail();
      }
    }
  }
};
</script>
<style scoped lang="less">
.basic-info{
  padding-left:30px;
  .title{
    width:120px;
    text-align: right;
    vertical-align: top;
    padding-right: 8px;
    color:#333;
    display: inline-block;
  }
  div{
    margin-bottom:22px;
  }
}
.minwidth100{
  min-width: 100px;
  display: inline-block;
}
</style>
