/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2021-01-26 09:42:38
 * @LastEditors: wangp
 * @LastEditTime: 2021-01-26 09:44:32
 */
import base from "./base"

// 查询司机测评开关
export const querySwitch = (params) => {
  return base.mainRequest("/api/driver/evaluationSwitch/querySwitchOne", params);
};

// 修改司机测评开关
export const updateSwitch = (params) => {
  return base.mainRequest("/api/driver/evaluationSwitch/updateSwitch", params);
};

// 日志
export const queryLog = (params) => {
  return base.mainRequest("/api/driver/evaluationSwitch/queryLog", params);
};
