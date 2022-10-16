/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-07-20 10:26:28
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-27 18:41:02
 */

export const weekList = [
  { label: "奖励周", slot: "rewardWeek" },
  // { label: "奖励项", slot: "batchType" },
  { label: "奖励/扣款", slot: "itemType" },
  { label: "类目", slot: "batchType" },
  { label: "城市", prop: "cityName", align: "center" },
  { label: "司机数", prop: "batchCount", align: "center", minWidth: 60 },
  { label: "总金额", prop: "totalAmount", align: "center", minWidth: 60 },
  { label: "导入时间", prop: "createdTime", align: "center" },
  { label: "操作人", prop: "applicantName", align: "center", minWidth: 80 },
  { label: "状态", slot: "batchStatus" },
  { label: "审批人", prop: "auditorName", align: "center", minWidth: 80 },
  { label: "审批时间", prop: "auditPassedTime", align: "center", minWidth: 80 },
  { label: "备注", prop: "remark", align: "center" },
  { slot: "action" }
];

export const monthList = [
  { label: "薪酬月份", slot: "rewardMonth" },
  { label: "奖励/扣款", slot: "itemType" },
  { label: "类目", slot: "batchType" },
  { label: "城市", prop: "cityName" },
  { label: "司机数", prop: "batchCount", minWidth: 60 },
  { label: "总金额", prop: "totalAmount", align: "center", minWidth: 60 },
  { label: "导入时间", prop: "createdTime" },
  { label: "操作人", prop: "applicantName", align: "center", minWidth: 80 },
  { label: "状态", slot: "batchStatus" },
  { label: "审批人", prop: "auditorName", align: "center", minWidth: 80 },
  { label: "审批时间", prop: "auditPassedTime", align: "center", minWidth: 80 },
  { label: "备注", prop: "remark" },
  { slot: "action" }
];

export const weekColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机id", prop: "driverCode", minWidth: 80 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 100 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "金额（元）", prop: "itemAmount", minWidth: 60 },
  { label: "奖励周", prop: "weekOfYear", minWidth: 60 },
  { label: "年份", prop: "periodYear", minWidth: 60 },
  { label: "状态", slot: "auditStatus" },
  { label: "备注", prop: "remark", minWidth: 60 }
];

export const monthColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机id", prop: "driverCode", minWidth: 80 },
  { label: "身份证号", prop: "driverIdentityCard", minWidth: 100 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "金额（元）", prop: "itemAmount", minWidth: 60 },
  { label: "薪酬月份", prop: "monthOfYear", minWidth: 60 },
  { label: "年份", prop: "periodYear", minWidth: 60 },
  { label: "备注", prop: "remark", minWidth: 60 }
];
