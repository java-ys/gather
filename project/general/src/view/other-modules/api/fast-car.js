import axiosResume from "_g/config/api4Route.request"

// 获取列表
export const getFastCarList = data => axiosResume.request({
  url: "/config/fast/query",
  method: "POST",
  data,
})

// 新增
export const fastCarAdd = data => axiosResume.request({
  url: "/config/fast/save",
  method: "POST",
  data,
})

// 编辑
export const fastCarEdit = data => axiosResume.request({
  url: "/config/fast/updatefast",
  method: "POST",
  data,
})

// 详情
export const fastCarDetail = data => axiosResume.request({
  url: "/config/fast/fastDetail",
  method: "POST",
  data,
})

// 停用
export const fastCarDel = data => axiosResume.request({
  url: "/config/fast/del",
  method: "POST",
  data,
})
