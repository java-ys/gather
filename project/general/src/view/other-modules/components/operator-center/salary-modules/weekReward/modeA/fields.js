/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-27 17:21:54
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-25 09:41:04
 */
export const columns = [
  { label: "司机ID", prop: "driverCode", minWidth: 120 },
  { label: "姓名", prop: "driverName" },
  { label: "手机号", prop: "driverMobile", minWidth: 120 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 150 },
  {
    label: "所属城市",
    prop: "cityName"
  },
  // {
  //   label: "司机档案所属区县",
  //   prop: "countryName"
  // },
  {
    label: "所属运营商",
    prop: "agentName",
    minWidth: 100
  },
  {
    label: "所属劳务公司",
    prop: "laborServiceCompany",
    minWidth: 100
  },
  {
    label: "入职时间",
    prop: "entryDate",
    minWidth: 140,
    slot: "entryDate"
  },
  {
    label: "运营模式",
    prop: "operationType",
    minWidth: 140,
    slot: "operationType"
  },
  {
    label: "首次绑车时间",
    prop: "firstBindCarDate",
    minWidth: 140
  },
  {
    label: "司机工资类别",
    prop: "driverSalaryType",
    minWidth: 120,
    slot: "driverSalaryType"
  },
  {
    label: "当周新入职",
    prop: "isFullWeek",
    minWidth: 120,
    slot: "isFullWeek"
  },
  {
    label: "周收入周期",
    prop: "period",
    minWidth: 120,
    slot: "period"
  },
  {
    label: "计算时间",
    prop: "computeTime",
    minWidth: 140
  },
  {
    label: "是否核算",
    prop: "salaryAuditFlag",
    slot: "salaryAuditFlag"
  },
  {
    label: "流程状态",
    prop: "flowStatus",
    slot: "flowStatus"
  },
  {
    label: "周基本流水抽成",
    prop: "performanceGradientAmount",
    slot: "performanceGradientAmount"
  },
  {
    label: "司机任务奖励",
    prop: "taskBonus",
    slot: "taskBonus"
  },
  {
    label: "非本周订单司机有责调价补扣款",
    prop: "manualSubadjFlow"
  },
  {
    label: "跨城费",
    prop: "acrossCityFare"
  },
  {
    label: "节日服务费",
    prop: "holidayServiceFare"
  },
  // {
  //   label: "司机推券奖励",
  //   prop: ""
  // },
  {
    label: "营销奖励",
    prop: "marketingAward"
  },
  {
    label: "推荐司机奖励",
    prop: "recruitmentReward"
  },
  {
    label: "推荐乘客奖励",
    prop: "recommendAward"
  },
  {
    label: "A转UP补贴",
    prop: "aToUpSubsidy",
  },
  {
    label: "司机座谈会补贴",
    prop: "symposiumSubsidy",
  },
  {
    label: "线下活动奖励",
    prop: "offlineActivityReward",
  },
  {
    label: "租金返还补贴",
    prop: "rentalReturn",
  },
  {
    label: "其他补贴",
    prop: "otherSubsidy",
  },
  {
    label: "日进斗金奖励",
    prop: "dayGoldAmount"
  },
  {
    label: "车队长补贴",
    prop: "carCaptainSubsidy"
  },
  {
    label: "城市补发金额",
    prop: "cityAward"
  },
  {
    label: "城市扣减金额",
    prop: "cityDeduction"
  },
  {
    label: "司机关怀奖励",
    prop: "careAward"
  },
  {
    label: "司机服务奖励",
    prop: "qualityAward"
  },
  {
    label: "风控扣款",
    prop: "riskControlDeduction"
  },
  {
    label: "司机服务违规扣款",
    prop: "qualityControlDeduction"
  },
  {
    label: "税前补发补扣金额",
    prop: "manualReissueAmount"
  },
  {
    label: "上周应发欠款",
    prop: "deductedLastWeekAmount"
  },
  {
    label: "上周应发未发金额",
    prop: "nopaidLastWeekAmount"
  },
  {
    label: "周应发合计",
    prop: "afterCorrectionTotalPretax",
    slot: "afterCorrectionTotalPretax"
  },
  {
    label: "周收入合计调整值",
    prop: "correctionAmount"
  },
  {
    label: "周应发合计(编辑后)",
    prop: "afterCorrectionTotal"
  },
  {
    label: "上周实发欠款",
    prop: "deductedLastWeekAmountAfterTax"
  },
  {
    label: "上周实发未发金额",
    prop: "nopaidLastWeekAmountAfterTax"
  },
  {
    label: "社保扣款",
    prop: "socialSecurityFee"
  },
  {
    label: "代扣个税",
    prop: "personalIncomeTax"
  },
  {
    label: "感谢费",
    prop: "thankFare"
  },
  {
    label: "税后补发补扣金额",
    prop: "manualReissueAmountAfterTax"
  },
  {
    label: "周收入合计实发",
    prop: "totalAmount"
  },
  {
    label: "周收入劳务发放",
    prop: "weekAfterTaxAmount"
  },
  {
    label: "是否预警",
    prop: "alarmFlag",
    slot: "alarmFlag"
  },
  {
    label: "预警结果",
    prop: "alarmResult",
    slot: "alarmResult"
  },
  {
    label: "原因说明",
    prop: "correctionReason"
  },
  { slot: "action" }
];
