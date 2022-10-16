/*
 * @Author: xuanleilei
 * @Date: 2022-04-02 14:40:40
 * @LastEditors: xuanleilei
 * @LastEditTime: 2022-05-16 10:56:42
 * @Description:
 */
import api4partner from "_o/config/api4partner.request";

// 服务核检工单新增
export const hjAddService = (params) => {
  return api4partner.request({
    url: "/manage/order/hj/add",
    method: "post",
    data: params,
  })
}

// 服务核检工单列表
export const hjListService = (params) => {
  return api4partner.request({
    url: "/manage/order/hj/list",
    method: "post",
    data: params,
  })
}

// 服务核检工单详情
export const hjDetailService = (params) => {
  return api4partner.request({
    url: "/manage/order/hj/queryById",
    method: "post",
    data: params,
  })
}

// 服务核检工单更新
export const hjUpdateService = (params) => {
  return api4partner.request({
    url: "/manage/order/hj/updateById",
    method: "post",
    data: params,
  })
}

const createRequest = url => data => api4partner.request({method: "post",url, data}).then(({data: res}) => res.success ? res.data : Promise.reject(res))

export const postCheckType = createRequest("/api/class/add");
export const queryCheckTypeList = createRequest("/api/class/list")