<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="奖励规则详情"
    width="70%"
    :visible="detailVisible"
    @close="closeDialog"
  >
    <!-- 基本信息 -->
    <el-row style="width: 93%;margin: 5px 30px;">
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
      <el-col :span="12">
        <span class="propName">业务线: &nbsp;</span>
        {{businessTypeWrapper(detailData.businessType)}}
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
        {{statusWrapper(detailData.ruleStatus)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">司机类型: &nbsp;</span>
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
    </el-row>
    <el-row style="width: 93%;margin: 30px 30px">
      <el-tabs v-model="activeName" type="card">
        <!--<el-tab-pane label="活动绩效限制" name="performanceLimit">-->
        <!--<el-card style="margin-top: 10px">-->
        <!--&lt;!&ndash; <div slot="header" class="clearfix">-->
        <!--<p class="detail-text">活动绩效限制</p>-->
        <!--</div> &ndash;&gt;-->
        <!--<el-row class="row-style">-->
        <!--<el-col :span="24" v-if="performanceLimitData.weekSuccessRate">-->
        <!--<span-->
        <!--&gt;周时段累计成单率 >=-->
        <!--{{ performanceLimitData.weekSuccessRate }} </span-->
        <!--&gt;<span>&nbsp;%</span>-->
        <!--</el-col>-->
        <!--<el-col :span="24" v-if="performanceLimitData.starLimit">-->
        <!--<span>周时段星级 >= {{ performanceLimitData.starLimit }} </span>-->
        <!--</el-col>-->
        <!--<el-col-->
        <!--:span="12"-->
        <!--v-if="performanceLimitData.dayMinOnlineDuration"-->
        <!--&gt;-->
        <!--<span-->
        <!--&gt;日在线时长 >=-->
        <!--{{ performanceLimitData.dayMinOnlineDuration }} </span-->
        <!--&gt;<span>&nbsp;小时</span>-->
        <!--</el-col>-->
        <!--<el-col :span="12" v-if="performanceLimitData.dayMinPeakDuration">-->
        <!--<span-->
        <!--&gt;日高峰时长 >=-->
        <!--{{ performanceLimitData.dayMinPeakDuration }} </span-->
        <!--&gt;<span>&nbsp;小时</span>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--</el-card>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="日订单量达标奖励" name="orderQuantityAward">
          <el-card style="margin-top: 10px">
            <!-- <div slot="header" class="clearfix">
              <p class="detail-text">订单量达标奖励</p>
            </div> -->
            <el-card
              v-for="(item, index) in orderAwardData"
              :key="index"
              style="margin-top: 10px"
            >
              <el-row class="row-style">
                <el-col :span="24">
                  <span>生效日期:&nbsp;&nbsp;{{dateFormatter(item.dataTimeList[0])}}</span>
                </el-col>
                <el-col :span="24"> <span>奖励限制：自然日</span> </el-col>
                <el-col :span="12">
                  <span>奖励规则：自然日累计成单数达 {{item.lowerThreshold}}单
                  </span>
                </el-col>
                <el-col :span="12">
                  <span>奖励金额 {{item.rewardValue}}元 </span>
                </el-col>
              </el-row>
            </el-card>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="日流水达标固定奖励" name="floatWaterAward">
          <el-card style="margin-top: 10px">
            <!-- <div slot="header" class="clearfix">
              <p class="detail-text">浮动流水奖励</p>
            </div> -->
            <el-card
              v-for="(item, index) in floatWaterAwardData"
              :key="index"
              style="margin-top: 10px"
            >
              <el-row class="row-style">
                <el-col :span="24">
                  <span>生效日期:&nbsp;&nbsp;{{dateFormatter(item.dataTimeList[0])}}</span>
                </el-col>
                <el-col :span="24"> <span>奖励限制：自然日</span> </el-col>
                <el-col :span="12">
                  <span>奖励规则：自然日订单流水达 {{item.lowerThreshold}}元
                  </span>
                </el-col>
                <el-col :span="12">
                  <span>奖励金额 {{item.rewardValue}}元 </span>
                </el-col>
              </el-row>
            </el-card>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="日流水达标抽成奖励" name="floatWaterDrawBonus">
          <el-card style="margin-top: 10px">
            <!-- <div slot="header" class="clearfix">
              <p class="detail-text">浮动流水奖励</p>
            </div> -->
            <el-card
              v-for="(item, index) in floatWaterDrawBonusData"
              :key="index"
              style="margin-top: 10px"
            >
              <el-row class="row-style">
                <el-col :span="24">
                  <span>生效日期:&nbsp;&nbsp;{{dateFormatter(item.dataTimeList[0])}}</span>
                </el-col>
                <el-col :span="24"> <span>奖励限制：自然日</span> </el-col>
                <el-col :span="12">
                  <span>奖励规则：自然日订单流水达 {{item.lowerThreshold}}元
                  </span>
                </el-col>
                <el-col :span="12">
                  <span>奖励流水 {{item.rewardValue}}% </span>
                </el-col>
              </el-row>
            </el-card>
          </el-card>
        </el-tab-pane>



        <el-tab-pane label="高峰时段流水额外抽成奖励" name="royaltyAward">
          <el-card style="margin-top: 10px">
            <!-- <div slot="header" class="clearfix">
              <p class="detail-text">流水时段抽成奖励</p>
            </div> -->
            <el-card
              v-for="(item, index) in royaltyAwardData"
              :key="index"
              style="margin-top: 10px"
            >
              <el-row class="row-style">
                <el-col :span="12">
                  <span>生效日期:&nbsp;&nbsp;{{dateFormatter(item.dataTimeList[0])}}</span>
                </el-col>
                <el-col :span="12">
                  <span>日奖励上限：{{item.maxAmount}}</span>
                </el-col>
                <el-col :span="24"> <span>奖励规则： </span> </el-col>
                <el-col :span="24">
                  <el-table
                    :data="item.cfgList"
                    style="width: 96%"
                    size="mini"
                    :header-cell-style="{ background: '#F5F4F2' }"
                    fit
                    highlight-current-row
                  >
                    <el-table-column
                      prop="periodStart"
                      label="开始时段"
                      min-width="150"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="periodEnd"
                      label="结束时段"
                      min-width="150"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="lowerThreshold"
                      label="时段订单流水达(元)"
                      min-width="110"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="rewardValue"
                      label="奖励时段流水(%)"
                      min-width="110"
                    >
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-card>
          </el-card>
        </el-tab-pane>
        <!--<el-tab-pane label="流水时段固定奖励" name="fixedAward">-->
        <!--<el-card style="margin-top: 10px">-->
        <!--&lt;!&ndash; <div slot="header" class="clearfix">-->
        <!--<p class="detail-text">流水时段固定奖励</p>-->
        <!--</div> &ndash;&gt;-->
        <!--<el-card-->
        <!--v-for="(item, index) in fixedAwardData"-->
        <!--:key="index"-->
        <!--style="margin-top: 10px"-->
        <!--&gt;-->
        <!--<el-row class="row-style">-->
        <!--<el-col :span="12">-->
        <!--<span-->
        <!--&gt;生效日期:&nbsp;&nbsp;{{-->
        <!--dateFormatter(item.dataTimeList[0])-->
        <!--}}</span-->
        <!--&gt;-->
        <!--</el-col>-->
        <!--<el-col :span="24"> <span>奖励规则： </span> </el-col>-->
        <!--<el-col :span="24">-->
        <!--<el-table-->
        <!--:data="item.cfgList"-->
        <!--style="width: 96%"-->
        <!--size="mini"-->
        <!--:header-cell-style="{ background: '#F5F4F2' }"-->
        <!--fit-->
        <!--highlight-current-row-->
        <!--&gt;-->
        <!--<el-table-column-->
        <!--prop="periodStart"-->
        <!--label="开始时段"-->
        <!--min-width="150"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="periodEnd"-->
        <!--label="结束时段"-->
        <!--min-width="150"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="lowerThreshold"-->
        <!--label="时段订单流水达(元)"-->
        <!--min-width="110"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="rewardValue"-->
        <!--label="奖励金额(元)"-->
        <!--min-width="110"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--</el-card>-->
        <!--</el-card>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </el-row>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util";
import { getYearWeek, sortByProperty } from "_o/common/common";

export default {
  props: [
    "detailVisible",
    "detailData",
    "driverTypeList",
    "isEdit",
    "submitType",
    "performanceLimitData",
    "orderAwardData",
    "floatWaterAwardData",
    "royaltyAwardData",
    "fixedAwardData",
    "floatWaterDrawBonusData"
  ],
  data() {
    return {
      activeName: "orderQuantityAward"
    };
  },
  created() {
    this.setPeriod();
  },
  methods: {
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
    SalaryTypeFormatter(type) {
      let key = "";
      let arr = this.driverTypeList.map((item, index) => {
        if (type == item.itemcode) {
          key = item.itemvalue;
        }
      });
      return key;
    },
    setPeriod() {},
    dateFormatter(val) {
      let Y; let M; let D; let
        YMD;
      Y = new Date(val).getFullYear();
      M = new Date(val).getMonth() + 1;
      D = new Date(val).getDate();
      M < 10 ? (M = "0" + M) : "";
      D < 10 ? (D = "0" + D) : "";
      YMD = Y + "-" + M + "-" + D;
      return YMD;
    },
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    statusWrapper(val) {
      if (val == "0") {
        return "初始";
      } else if (val == "1") {
        return "审核中";
      } else if (val == "2") {
        return "审批通过";
      } else if (val == "3") {
        return "驳回";
      } else if (val == "5") {
        return "启用";
      } else if (val == "6") {
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
          return "包车";
        case 4:
          return "快享";
        default:
          return "未知业务线";
      }
    },
    cycleWrapper(value) {
      switch (value) {
        case "1":
          return "按周";
        case "2":
          return "按月";
        default:
          return "未知";
      }
    },
    handlePreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
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

.row-style {
  width: 93%;
  margin: 10px 30px;
}

.propName {
  font-weight: bold;
}
</style>
