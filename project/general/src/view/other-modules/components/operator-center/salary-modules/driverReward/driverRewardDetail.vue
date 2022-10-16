<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="司机奖励发放详情信息"
    width="60%"
    :visible="driverRewardDetailVisable"
    @close="closeDialog"
  >
    <el-row class="detail-style">
      <p class="detail-text">推荐人信息</p>
      <el-col :span="12">
        <span class="propName">姓名: &nbsp;</span> {{rewardDetailData.talentScout.name}}
      </el-col>
      <el-col :span="12">
        <span class="propName">编号: &nbsp;</span> {{rewardDetailData.talentScout.code}}
      </el-col>
      <el-col :span="12">
        <span class="propName">城市: &nbsp;</span> {{rewardDetailData.talentScout.cityName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">手机号: &nbsp;</span> {{rewardDetailData.talentScout.mobile}}
      </el-col>
      <el-col :span="12">
        <span class="propName">身份证号: &nbsp;</span> {{rewardDetailData.talentScout.idCard}}
      </el-col>
      <el-col :span="12">
        <span
          class="propName"
        >奖励状态: &nbsp;</span> {{rewardDetailData.rewardStatus == 0 ? '初始' : rewardDetailData.rewardStatus == 1 ? '已奖励' : '已取消'}}
      </el-col>
      <el-col :span="12">
        <span class="propName">奖励金额: &nbsp;</span> {{rewardDetailData.rewardAmount | rounding}}元
      </el-col>
      <el-col :span="12">
        <span class="propName">奖励日期: &nbsp;</span> {{rewardDetailData.rewardTime}}
      </el-col>
      <el-col :span="12">
        <span class="propName">所属运营商: &nbsp;</span> {{rewardDetailData.talentScout.agentName}}
      </el-col>
      <el-col :span="12">
        <span
          class="propName"
        >是否缴纳履约金: &nbsp;</span> {{rewardDetailData.talentScout.depositFlag == true ? '是' : '否'}}
      </el-col>
      <el-col :span="12">
        <span class="propName">履约金缴纳日期: &nbsp;</span> {{rewardDetailData.talentScout.depositTime}}
      </el-col>
    </el-row>
    <el-row class="detail-style">
      <p class="detail-text">被推荐人信息</p>
      <el-col :span="12">
        <span class="propName">姓名: &nbsp;</span> {{rewardDetailData.talent.name}}
      </el-col>
      <el-col :span="12">
        <span class="propName">城市: &nbsp;</span> {{rewardDetailData.talent.cityName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">手机号: &nbsp;</span> {{rewardDetailData.talent.mobile}}
      </el-col>
      <el-col :span="12">
        <span class="propName">身份证号: &nbsp;</span> {{rewardDetailData.talent.idCard}}
      </el-col>
      <el-col :span="12">
        <span class="propName">所属运营商: &nbsp;</span> {{rewardDetailData.talent.agentName}}
      </el-col>
      <el-col :span="12">
        <span
          class="propName"
        >是否缴纳履约金: &nbsp;</span> {{rewardDetailData.talent.depositFlag == true ? '是' : '否'}}
      </el-col>
      <el-col :span="12">
        <span class="propName">履约金缴纳日期: &nbsp;</span> {{rewardDetailData.talent.depositTime}}
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: "driverRewardDetail",
  filters: {
    rounding(value) {
      if (value == "" || value == null) {
        value = 0;
      }
      return Number(value).toFixed(2);
    }
  },
  props: {
    driverRewardDetailVisable: { type: Boolean, required: false, default: false },
    rewardDetailData: {
      type: Object, required: false, default: {
        talent: {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
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
