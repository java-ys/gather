/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-27 17:21:54
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-24 17:49:22
 */

export const weekColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机id", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverCardId", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 60 },
  { label: "金额（元）", prop: "amount", minWidth: 60 },
  { label: "奖励周", prop: "salaryIndex", minWidth: 60 },
  { label: "年份", prop: "year", minWidth: 60 },
  { label: "备注", prop: "remark", minWidth: 80 },
  { label: "失败原因", prop: "remarks", minWidth: 80, slot: "remarks" }
];

export const monthColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机id", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverCardId", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 50 },
  { label: "金额（元）", prop: "amount", minWidth: 50 },
  { label: "薪酬月份", prop: "salaryIndex", minWidth: 50 },
  { label: "年份", prop: "year", minWidth: 50 },
  { label: "备注", prop: "remark", minWidth: 80 },
  { label: "失败原因", prop: "remarks", minWidth: 80, slot: "remarks" }
];

export const weekTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机id", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverCardId", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 50 },
  { label: "个税（元）", prop: "tax", minWidth: 50 },
  { label: "奖励周", prop: "rewardTime", minWidth: 50 },
  { label: "年份", prop: "year", minWidth: 50 },
  { label: "备注", prop: "remark", minWidth: 80 },
  { label: "失败原因", prop: "remarks", minWidth: 80, slot: "remarks" }
];

export const monthTaxColumns = [
  { label: "司机姓名", prop: "driverName", minWidth: 60 },
  { label: "司机id", prop: "driverCode", minWidth: 60 },
  { label: "身份证号", prop: "driverCardId", minWidth: 60 },
  { label: "城市", prop: "cityName", minWidth: 50 },
  { label: "个税（元）", prop: "tax", minWidth: 50 },
  { label: "公积金（元）", prop: "providentFundFee", minWidth: 50 },
  { label: "公积金月份", prop: "providentFundFeeMonth", minWidth: 50 },
  { label: "社保（元）", prop: "socialSecurityFee", minWidth: 50 },
  { label: "社保月份", prop: "socialSecurityFeeMonth", minWidth: 50 },
  { label: "薪酬月份", prop: "rewardTime", minWidth: 50 },
  { label: "年份", prop: "year", minWidth: 50 },
  { label: "备注", prop: "remark", minWidth: 80 },
  { label: "失败原因", prop: "remarks", minWidth: 80, slot: "remarks" }
];
