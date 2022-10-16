<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-25 14:53:12
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-10 01:49:49
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="基本流水抽成规则详情"
    width="70%"
    :visible="detailVisible"
    @close="closeDialog"
  >
    <!-- 基本信息 -->
    <el-row class="detail-style">
      <p class="detail-text">基本信息</p>
      <el-col :span="12">
        <span class="propName">规则代码: &nbsp;</span> {{detailData.ruleCode}}
      </el-col>
      <el-col :span="12">
        <span class="propName">规则名称: &nbsp;</span> {{detailData.ruleName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">城市: &nbsp;</span> {{detailData.cityName}}
      </el-col>
      <!-- <el-col :span="12">
        <span class="propName">司机档案所属区县: &nbsp;</span> {{ detailData.countryName }}
      </el-col>       -->
      <el-col :span="12">
        <span class="propName">产品线: &nbsp;</span>
        {{businessTypeWrapper(detailData.businessType)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">业务线: &nbsp;</span>
        {{businessLinesTypeWrapper(detailData.businessLines)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">生效起始周: &nbsp;</span>
        {{weekFormatter(detailData.validBeginTime)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">生效结束周: &nbsp;</span>
        {{weekFormatter(detailData.validEndTime)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">状态: &nbsp;</span>
        {{statusWrapper(detailData)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">运营模式: &nbsp;</span>
        {{operationTypeFormatter(detailData.operationType)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">司机工资类别: &nbsp;</span>
        {{SalaryTypeFormatter(detailData.driverTag)}}
      </el-col>
      <el-col :span="24">
        <span class="propName">运营商: &nbsp;</span>
        <span v-for="(agent, index) in detailData.agentInfoList" :key="agent.agentUuid">{{agent.agentName}} {{(index === detailData.agentInfoList.length - 1) ? '' : ','}} </span>
      </el-col>
      <!--      <el-col v-if="detailData.operationType === 2" :span="12">-->
      <!--        <span class="propName">展示预估流水分成: &nbsp;</span>-->
      <!--        {{predictRevenueFormatter(detailData.predictRevenue)}}-->
      <!--      </el-col>-->
    </el-row>
    <!-- 抽成奖励 -->
    <el-row v-if="detailData.commissionMode == 1 || detailData.commissionMode == 3" class="detail-style">
      <el-col :span="24"><p class="detail-text">
        奖励规则：流水抽成奖励
      </p></el-col>
      <el-col :span="6" class="propName">
        <span>订单流水周期：{{statPeriodFormat(detailData.statPeriod)}}</span>
      </el-col>
      <el-col v-if="detailData.commissionMode == 1" :span="6" class="propName">
        <span>奖励上限：{{detailData.upperThreshold}}元</span>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="ruleDetailData"
          style="width: 96%"
          size="mini"
          :header-cell-style="{ background: '#F5F4F2' }"
          fit
          highlight-current-row
        >
          <el-table-column
            prop="flowRange"
            label="订单流水区间(元)"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="rewardValue"
            label="奖励订单流水(%)"
            min-width="110"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 固定奖励 -->
    <el-row v-if="detailData.commissionMode == 2 || detailData.commissionMode == 3" class="detail-style">
      <el-col :span="24"><p class="detail-text">
        奖励规则：流水固定奖励
      </p></el-col>
      <el-col :span="6" class="propName">
        <span>订单流水周期：{{statPeriodFormat(detailData.statPeriod)}}</span>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="fixedAwardData"
          style="width: 96%"
          size="mini"
          :header-cell-style="{ background: '#F5F4F2' }"
          fit
          highlight-current-row
        >
          <el-table-column
            prop="flowRange"
            label="周流水(元)"
            min-width="110"
          >
          </el-table-column>
          <el-table-column
            prop="rewardValue"
            label="奖励金额(元)"
            min-width="110"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util";
import { getYearWeek } from "_o/common/common";
import { businessLineMap } from "./fields";
export default {
  props: ["detailVisible", "detailData", "ruleDetailData", "fixedAwardData", "driverTypeList"],
  data() {
    return {
      businessLineMap
    };
  },
  created() {
    this.setData();
  },
  methods: {
    businessLinesTypeWrapper(value) {
      let businessName = "";
      if (value) {
        businessName = value.map(it => {
          if (it === 0) {
            return "全部";
          } else {
            return this.businessLineMap[it]
          }
        }).toString();
      }
      return businessName
    },
    operationTypeFormatter(value) {
      switch (value) {
        case 1:
          return "自营司机";
        case 2:
          return "UP司机";
        default:
          return "";
      }
    },
    // predictRevenueFormatter(value) {
    //   switch (value) {
    //     case 0:
    //       return "否";
    //     case 1:
    //       return "是";
    //     default:
    //       return "";
    //   }
    // },
    SalaryTypeFormatter(type) {
      let key = "";
      let arr = this.driverTypeList.map((item, index) => {
        if (type == item.itemcode) {
          key = item.itemvalue;
        }
      });
      return key;
    },
    setData() {
      // 抽成奖励
      this.ruleDetailData.forEach(item => {
        item.flowRange = item.orderIntervalStart + "-" + item.orderIntervalEnd;
      });
      // 固定奖励
      this.fixedAwardData.forEach(item => {
        item.flowRange = ">=" + item.orderIntervalStart;
      })
    },
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    statPeriodFormat(val) {
      if (val == "3") return "日流水";
      if (val == "2") return "周流水";
    },
    statusWrapper(detail) {
      if (detail.ruleStatus == "0") {
        return "初始";
      } else if (detail.ruleStatus == "1") {
        return "审核中";
      } else if (detail.ruleStatus == "2") {
        return "审批通过";
      } else if (detail.ruleStatus == "4") {
        return "过期";
      } else if (detail.processFlag == "3") {
        return "驳回";
      } else if (detail.processFlag == "5") {
        return "启用";
      } else if (detail.processFlag == "6") {
        return "停用";
      }
    },
    parseTimeDetail(time) {
      return parseTime(time, "{y}-{m}");
    },
    weekFormatter(time) {
      return getYearWeek(time);
    },
    // 1出租车，2专车，3跨城，4快车
    businessTypeWrapper(value) {
      switch (value) {
        case 1:
          return "出租车";
        case 2:
          return "专享";
        case 6:
          return "惠享";
        case 4:
          return "快享";
        default:
          return "未知业务线";
      }
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
  line-height: 1.6;
}

.propName {
  font-weight: bold;
}
</style>
