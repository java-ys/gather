import axios from "_g/config/route-gateway"

// 查询车型列表
export const queryCarList = data => axios.request({
  url: "/car/level/Show/carlevelList",
  method: "post",
  data
})
// 新增
export const addStrategy = data => axios.request({
  url: "/car/level/Show/add",
  method: "post",
  data
})
// 编辑
export const editStrategy = data => axios.request({
  url: "/car/level/Show/edit",
  method: "post",
  data
})
// 列表查询
export const queryList = data => axios.request({
  url: "/car/level/Show/PageList",
  method: "post",
  data
})
// 详情
export const queryDetail = data => axios.request({
  url: "/car/level/Show/info",
  method: "post",
  data
})
// 删除
export const deleteStrategy = data => axios.request({
  url: "/car/level/Show/delete",
  method: "post",
  data
})
