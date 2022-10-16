/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-28 10:02:33
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-25 09:42:48
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
  // {
  //   label: "司机类型",
  //   prop: "operationType",
  //   minWidth: 140,
  //   slot: "operationType"
  // },
  // {
  //   label: "首次绑车日期",
  //   prop: "firstBindCarDate",
  //   minWidth: 140
  // },
  {
    label: "司机工资类别",
    prop: "driverSalaryType",
    minWidth: 120,
    slot: "driverSalaryType"
  },
  {
    label: "薪酬月份",
    prop: "yearMonth",
    minWidth: 100
  },
  {
    label: "计算时间",
    prop: "computeTime",
    minWidth: 120
  },
  {
    label: "是否核算",
    prop: "salaryAuditFlag",
    minWidth: 120,
    slot: "salaryAuditFlag"
  },
  {
    label: "流程状态",
    prop: "flowStatus",
    minWidth: 120,
    slot: "flowStatus"
  },
  {
    label: "等级工资",
    prop: "gradeWage"
  },
  {
    label: "工龄工资",
    prop: "seniorityWage"
  },
  {
    label: "考勤工资",
    prop: "attendanceWage"
  },
  // {
  //   label: "司机推券佣金",
  //   prop: "promoteFee"
  // },
  {
    label: "能源补贴",
    prop: "electricSubsidy"
  },
  {
    label: "推荐司机奖励",
    prop: "recruitAward"
  },
  {
    label: "推荐乘客奖励",
    prop: "recommendAward"
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
    label: "司机服务奖励",
    prop: "qualityAward"
  },
  {
    label: "风控扣款",
    prop: "riskDeduct"
  },
  {
    label: "司机服务违规扣款",
    prop: "qualityDeduct"
  },
  {
    label: "税前补发补扣金额",
    prop: "manualReissueAmount"
  },
  {
    label: "上月应发欠款",
    prop: "deductedLastMonthAmount"
  },
  {
    label: "上月应发未发金额",
    prop: "nopaidLastMonthAmount"
  },
  {
    label: "月应发合计",
    prop: "totalSalaryPretax",
    slot: "totalSalaryPretax"
  },
  {
    label: "月应发合计调整值",
    prop: "correctionAmountPretax"
  },
  {
    label: "月应发合计（编辑后）",
    prop: "totalSalaryAfterEdit"
  },
  {
    label: "月扣除收现金",
    prop: "cashCollectionDeduct"
  },
  {
    label: "月扣除优惠减免",
    prop: "driverReduction"
  },
  {
    label: "月附加费用（高速费）",
    prop: "highwayFee"
  },
  {
    label: "月附加费用（路桥费）",
    prop: "tollFee"
  },
  {
    label: "月附加费用（停车费）",
    prop: "parkingFee"
  },
  {
    label: "月附加费用（其他费）",
    prop: "otherFee"
  },
  {
    label: "历史单当月附加费调价金额",
    prop: "historyOrderMonthPricingFee"
  },
  {
    label: "历史单当月附加费退款金额",
    prop: "refundFare"
  },
  {
    label: "附加费合计",
    prop: "totalSurchargeAmount",
    slot: "totalSurchargeAmount"
  },
  {
    label: "附加费合计调整值",
    prop: "surchargeCorrectionAmount"
  },
  {
    label: "附加费合计（编辑后）",
    prop: "totalSurchargeAmountAfterEdit"
  },
  {
    label: "上月实发欠款",
    prop: "deductedLastMonthAmountAfterTax"
  },
  {
    label: "上月实发未发金额",
    prop: "nopaidLastMonthAmountAfterTax"
  },
  {
    label: "社保所属期",
    prop: "socialSecurityMonth"
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
    label: "税后补发补扣金额",
    prop: "manualReissueAmountAfterTax"
  },
  {
    label: "月实发合计",
    prop: "totalSalary"
  },
  {
    label: "月工资劳务发放",
    prop: "monthAfterTaxAmount"
  },
  { slot: "action" }
];
