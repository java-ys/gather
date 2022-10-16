import axios from "_g/config/api4Route.request"
// 获取列表
export const queryList = data => axios.request({
  url: "/config/holidaySurcharge/query",
  data,
  method: "post"
})
// 新增
export const queryAddItem = data => axios.request({
  url: "/config/holidaySurcharge/add",
  data,
  method: "post"
})
// 详情
export const queryItemDetail = data => axios.request({
  url: "/config/holidaySurcharge/detail",
  data,
  method: "post"
})
// 编辑
export const queryEditItem = data => axios.request({
  url: "/config/holidaySurcharge/edit",
  data,
  method: "post"
})
// 更新状态
export const queryChangeStatus = data => axios.request({
  url: "/config/holidaySurcharge/change",
  data,
  method: "post"
})
