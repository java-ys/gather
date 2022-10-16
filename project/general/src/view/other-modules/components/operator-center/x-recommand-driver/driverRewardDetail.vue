<template>
    <Modal
        title="司机奖励发放详情信息"
        width="60%"
        :value="driverRewardDetailVisable"
        @on-cancel="closeDialog"
        @on-ok="closeDialog"
    >
        <Row class="detail-style">
          <p class="detail-text">推荐人信息</p>
            <Col :span="12">
                <span class="propName">姓名: &nbsp;</span> {{rewardDetailData.name}}
            </Col>
            <Col :span="12">
                <span class="propName">编号: &nbsp;</span> {{rewardDetailData.code}}
            </Col>
            <Col :span="12">
                <span class="propName">城市: &nbsp;</span> {{rewardDetailData.cityName}}
            </Col>
            <Col :span="12">
                <span class="propName">手机号: &nbsp;</span> {{rewardDetailData.mobile}}
            </Col>
            <Col :span="12">
                <span class="propName">身份证号: &nbsp;</span> {{rewardDetailData.identityCard}}
            </Col>
            <Col :span="12">
                <span class="propName">奖励状态: &nbsp;</span> {{rewardDetailData.rewardStatus == 0 ? '初始' : rewardDetailData.rewardStatus == 1 ? '已奖励' : '已取消'}}
            </Col>
            <Col :span="12">
                <span class="propName">奖励金额: &nbsp;</span> {{rewardDetailData.rewardAmount | rounding}}元
            </Col>     
            <Col :span="12">
                <span class="propName">奖励日期: &nbsp;</span> {{rewardDetailData.rewardTime}}
            </Col>                   
            <Col :span="12">
                <span class="propName">所属运营商: &nbsp;</span> {{rewardDetailData.agentName}}
            </Col>
            <Col :span="12">
                <span class="propName">是否缴纳履约金: &nbsp;</span> {{rewardDetailData.depositFlag == true ? '是' : '否'}}
            </Col>            
            <Col :span="12">
                <span class="propName">履约金缴纳日期: &nbsp;</span> {{rewardDetailData.depositTime}}
            </Col>                                            
        </Row>
        <Row class="detail-style">
           <p class="detail-text">被推荐人信息</p>       
            <Col :span="12">
                <span class="propName">姓名: &nbsp;</span> {{rewardDetailData.byName}}
            </Col>
            <Col :span="12">
                <span class="propName">城市: &nbsp;</span> {{rewardDetailData.byCityName}}
            </Col>
            <Col :span="12">
                <span class="propName">手机号: &nbsp;</span> {{rewardDetailData.byMobile}}
            </Col>                                  
            <Col :span="12">
                <span class="propName">身份证号: &nbsp;</span> {{rewardDetailData.byIdCard}}
            </Col>
            <Col :span="12">
                <span class="propName">所属运营商: &nbsp;</span> {{rewardDetailData.byAgentName}}
            </Col>                                     
            <Col :span="12">
                <span class="propName">是否缴纳履约金: &nbsp;</span> {{rewardDetailData.byDepositFlag == true ? '是' : '否'}}
            </Col>
            <Col :span="12">
                <span class="propName">履约金缴纳日期: &nbsp;</span> {{rewardDetailData.byDepositTime}}
            </Col>
        </Row>         
    </Modal>
</template>

<script>
export default {
    name: "driverRewardDetail",
    props: {
      driverRewardDetailVisable: {type: Boolean, required: false, default: false},
      rewardDetailData: {type: Object, required: false, default: {
        talent: {}
      }}
    },
    data() {
        return {
        }
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialogHandle', 'detail');
      }        
    },
    filters: {
      rounding (value) {
        if(value == "" || value == null) {
          value = 0;
        }
      return Number(value).toFixed(2);
      }
    }      
}
</script>

<style scoped>
  .detail-style {
    font-size: 15px;
    margin: 0 0 10px 30px;
    line-height: 1.6;
  }
  .detail-text {
    font-weight: bold;
    font-size: 16px;
    margin: 15px 0 10px 8px;
  }
  .propName {
    font-weight: bold;
  }
</style>