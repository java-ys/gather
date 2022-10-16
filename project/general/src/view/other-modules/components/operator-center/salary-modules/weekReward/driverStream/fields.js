/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-27 17:21:54
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-25 09:41:04
 */

export const columns = [
  { label: "姓名", prop: "driverName" },
  { label: "司机ID", prop: "driverCode", minWidth: 120 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 150 },
  {
    label: "所属城市",
    prop: "cityName",
  },
  {
    label: "所属区/县",
    prop: "countryName"
  },
  { label: "手机号", prop: "driverMobile", minWidth: 120 },
  {
    label: "所属运营商",
    prop: "agentName",
    minWidth: 100,
  },
  {
    label: "入职时间",
    prop: "entryDate",
    minWidth: 140,
    slot: "entryDate",
  },
  {
    label: "运营模式",
    prop: "operationType",
    minWidth: 140,
    slot: "operationType",
  },
  {
    label: "首次绑车时间",
    prop: "firstBindCarDate",
    minWidth: 140,
  },
  {
    label: "司机工资类型",
    prop: "driverSalaryType",
    minWidth: 120,
    slot: "driverSalaryType",
  },
  {
    label: "当周新入职",
    prop: "isFullWeek",
    minWidth: 120,
    slot: "isFullWeek",
  },
  {
    label: "周奖励周期",
    prop: "periodBeginTime",
    minWidth: 120,
    slot: "periodBeginTime",
  },
  {
    label: "计算时间",
    prop: "computeTime",
    minWidth: 140,
  },
  {
    label: "发放状态",
    prop: "salaryStatus",
    slot: "salaryStatus",
  },
  {
    label: "流程状态",
    prop: "flowStatus",
    slot: "flowStatus",
  },
  {
    label: "周基本流水收入",
    prop: "performanceGradientAmount",
    slot: "performanceGradientAmount",
  },
  {
    label: "司机任务奖励",
    prop: "taskBonus",
    slot: "taskBonus",
  },
  {
    label: "保底策略补发",
    prop: "guaranteedAmt",
  },
  {
    label: "非本周订单司机有责调价补扣款",
    prop: "manualSubadjFlow",
  },
  {
    label: "基础信息费",
    prop: "basicInfoFee",
  },
  {
    label: "节日服务费",
    prop: "holidayServiceFare",
  },
  {
    label: "跨城费",
    prop: "acrossCityFare",
  },
  {
    label: "营销奖励",
    prop: "marketingAward",
  },
  {
    label: "推荐司机奖励",
    prop: "recruitmentReward",
  },
  {
    label: "推荐乘客奖励",
    prop: "recommendAward",
  },
  {
    label: "日进斗金奖励",
    prop: "dayGoldAmount",
  },
  {label: "车队长补贴", prop: "carCaptainSubsidy"},
  {
    label: "城市补发金额",
    prop: "cityAward",
  },
  {label: "线下活动奖励", prop: "offlineActivityReward",},
  {label: "租金返还补贴", prop: "rentalReturn",},
  {label: "A转UP补贴", prop: "aToUpSubsidy",},
  {label: "座谈会补贴", prop: "symposiumSubsidy",},
  {label: "其他激励补贴", prop: "otherSubsidy",},
  {label: "城市扣减金额", prop: "cityDeduction",},
  {label: "司机关怀奖励", prop: "careAward",},
  {label: "司机服务奖励", prop: "qualityAward",},
  {label: "风控扣款", prop: "riskControlDeduction",},
  {label: "司机服务违规扣款", prop: "qualityControlDeduction",},
  {label: "计税合计", prop: "afterCorrectionTotalPretax", slot: "afterCorrectionTotalPretax",},
  {label: "感谢费", prop: "thankFare",},
  {label: "周扣除收现金", prop: "offlinePayment",},
  {label: "周扣除优惠减免", prop: "driverReliefFare",},
  {label: "周附加费用(高速费)", prop: "highwayFare",},
  {label: "周附加费用(路桥费)", prop: "roadBridgeFare",},
  {label: "周附加费用(停车费)", prop: "parkingFare",},
  {label: "周附加费用(其他费)", prop: "otherFare",},
  {label: "历史单当周附加费调价金额", prop: "adjustFare",},
  {label: "历史单当周附加费退款金额", prop: "refundFare",},
  {label: "附加费合计", prop: "totalSurchargeAmount", slot: "totalSurchargeAmount",},
  {label: "税后补发补扣金额", prop: "manualReissueAmountAfterTax",},
  {label: "上周实发欠款", prop: "deductedLastWeekAmountAfterTax",},
  {label: "上周未发放金额", prop: "nopaidLastWeekAmountAfterTax",},
  {label: "车辆租金代扣金额", prop: "vehicleRentalWithholdingAmount",},
  {label: "周实发合计", prop: "totalAmount",},
  { slot: "action" },
];
