import axios from "_g/config/route-gateway"
import axiosMarketing from "_g/config/api4Market.request"

// 获取列表
export const queryRecommendList = (data) => {
  return axios.request({
    url: "/admin/recommendationController/page",
    method: "post",
    data: data
  })
}
// 获取列表
export const queryChangeStatus = (data) => {
  return axios.request({
    url: "/admin/recommendationController/changeStatus",
    method: "post",
    data: data
  })
}
// 新增
export const queryAddStrategy = (data) => {
  return axios.request({
    url: "/admin/recommendationController/addStrategy",
    method: "post",
    data: data
  })
}
// 更新
export const queryUpdateStrategy = (data) => {
  return axios.request({
    url: "/admin/recommendationController/update",
    method: "post",
    data: data
  })
}
// 更新
export const queryStrategyDetail = (data) => {
  return axios.request({
    url: "/admin/recommendationController/info",
    method: "post",
    data: data
  })
}
// 更新
export const queryBindGift = (data) => {
  return axiosMarketing.request({
    url: "/api/marketing/grantReward/bindingReward",
    method: "post",
    data: data
  })
}
