<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" width="70%" :visible="detailVisible" @close="closeDialog">
    <!-- 基本信息 -->
    <el-row class="detail-style">
      <el-col :span="12">
        <span class="propName">预警规则名称: &nbsp;</span> {{detailData.ruleName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">预警生效城市: &nbsp;</span>
        {{detailData.cityName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">预警开始时间: &nbsp;</span> {{detailData.validBeginTime}}
      </el-col>
      <el-col :span="12">
        <span class="propName">预警结束时间: &nbsp;</span> {{detailData.validEndTime}}
      </el-col>
      <el-col :span="12">
        <span class="propName">预警业务线: &nbsp;</span> {{detailData.businessType | businessTypeFormat}}
      </el-col>
      <el-col :span="12">
        <span class="propName">预警司机工资类型: &nbsp;</span>
        {{detailData.driverTag ? SalaryTypeFormatter(detailData.driverTag) : ""}}
      </el-col>
      <el-col :span="12">
        <span class="propName">奖励维度: &nbsp;</span>
        {{detailData.rulePeriod | rulePeriodFormat}}
      </el-col>
      <el-col :span="12">
        <span class="propName">薪酬流水比例预警值: &nbsp;</span>
        {{detailData.scaleAlarmThreshold ? detailData.scaleAlarmThreshold + "%" : ""}}
      </el-col>
      <el-col :span="12">
        <span class="propName">应发绩效奖励预警值: &nbsp;</span>
        {{detailData.rewardAlarmThreshold ? detailData.rewardAlarmThreshold + "元" : ""}}
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { cityListByAll, queryCitiesWithAgent } from "_o/api/salary/common";
import {
  approveReview,
  rejectReview,
  getreviewDetail
} from "_o/api/salary/reinstateCheck";
export default {
  filters: {
    businessTypeFormat(val) {
      switch (val) {
        case 2:
          return "专享";
        case 4:
          return "快享";
      }
    },
    rulePeriodFormat(val) {
      switch (val) {
        case 1:
          return "自然月";
        case 2:
          return "自然周";
        case 3:
          return "自然日";
      }
    }
  },
  props: {
    title: { required: false, type: String },
    detailData: { type: Object, required: false, default: {}},
    driverTypeList: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    detailVisible: { type: Boolean, required: false }
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    // 司机工资类别转换
    SalaryTypeFormatter(val) {
      let name = "暂无";
      this.driverTypeList.forEach((item, index) => {
        if (val == item.itemcode) {
          name = item.itemvalue;
        }
      });
      return name;
    }
  }
};
</script>

<style scoped>
.detail-text {
  font-weight: bold;
  font-size: 16px;
  margin: 15px 0 10px 0;
}

img {
  cursor: pointer;
}

.detail-style {
  font-size: 15px;
  margin: 0 0 10px 30px;
  line-height: 2;
}

.propName {
  font-weight: bold;
}

.footer {
  width: 93%;
  margin: 5px;
  display: flex;
  justify-content: center;
}
</style>
