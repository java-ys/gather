import { mapToList } from "@/libs/util.js";
// 推荐司机奖励状态
export const rewardStatusMap = {
  0: "初始",
  1: "已奖励",
  2: "已取消"
}
export const rewardStatusList = mapToList(rewardStatusMap)
// 运营商-推荐司机渠道
export const driverOriginMap = {
  0: '官网',
  1: '乘推司',
  2: '司推司',
  3: '运营商',
  4: '精准媒体'
}
export const driverOriginList = mapToList(driverOriginMap)

export const driverOriginPushMap = {
  0: '官网推司',
  1: '乘推司',
  2: '司推司',
  3: '运营商推司',
  4: '精准媒体推司'
}