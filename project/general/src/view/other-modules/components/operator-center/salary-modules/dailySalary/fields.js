/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-27 17:21:54
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-25 09:40:20
 */

export const columns = [
  { label: "司机ID", prop: "driverNo", minWidth: 120 },
  { label: "司机姓名", prop: "driverName", minWidth: 100 },
  { label: "手机号", prop: "driverMobile", minWidth: 120 },
  { label: "身份证号", prop: "driverIdcard", minWidth: 145 },
  {
    label: "所属城市",
    prop: "cityName",
    minWidth: 90
  },
  {
    label: "所属运营商",
    prop: "agentName",
    minWidth: 110
  },
  {
    label: "入职日期",
    prop: "entryDate",
    minWidth: 80,
    slot: "entryDate"
  },
  {
    label: "计薪日期",
    prop: "salaryDay",
    minWidth: 80,
    slot: "salaryDay"
  },
  {
    label: "计算时间",
    prop: "computeTime",
    minWidth: 120
    // slot: "computeTime"
  },
  {
    label: "日工资合计",
    prop: "totalBonus",
    minWidth: 80
  },
  {
    label: "日基本流水抽成奖励",
    prop: "ladderFlowBonus",
    minWidth: 80
  },
  {
    label: "日订单量达标奖励",
    prop: "ordReachBonus",
    minWidth: 80
  },
  {
    label: "日高峰时段流水额外抽成奖励",
    prop: "timeFrameBonus",
    minWidth: 80
  },
  {
    label: "日流水达标奖励",
    prop: "floatFlowBonus",
    minWidth: 80
  },
  {
    label: "日活动奖励",
    prop: "activityBonus",
    minWidth: 80
  }
];
