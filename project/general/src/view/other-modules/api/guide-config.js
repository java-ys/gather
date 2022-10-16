/*
 * @Author: unknown
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-12-07 14:52:08
 * @Description:
 */
import commonAxios from "_g/config/api4Route.request";
// 获取策略列表
export const secretFreeGuidanceQueryPage = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/queryPage",
    data,
    method: "post"
  });
};
// 新建策略
export const secretFreeGuidanceAdd = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/add",
    data,
    method: "post"
  });
}
// 更新策略
export const secretFreeGuidanceUpdate = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/update",
    data,
    method: "post"
  });
}
// 策略详情
export const secretFreeGuidanceDetail = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/detail",
    data,
    method: "post"
  });
}
// 获取频率
export const getSfFrequency = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/getSfFrequency",
    data,
    method: "post"
  });
}
// 更新频率
export const updateSfFrequency = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/upsetSfFrequency",
    data,
    method: "post"
  });
}
// 查询任务
export const selectTaskPage = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/selectTaskPage",
    data,
    method: "post"
  });
}
// 上下线
export const upOrDownLine = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/upOrDownLine",
    data,
    method: "post"
  });
}
// 操作日志
export const queryLogPage = data => {
  return commonAxios.request({
    url: "/api/common/v1/secretFreeGuidance/queryLogPage",
    data,
    method: "post"
  });
}
