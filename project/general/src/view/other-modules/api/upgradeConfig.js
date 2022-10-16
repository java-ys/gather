import axiosResume from "_g/config/api4Route.request"

// 获取列表
export const getUpgradeConfigList = data => axiosResume.request({
  url: "/config/upCarLevelStrategy/query",
  method: "POST",
  data,
})
// 停用
export const disableUpgradeStrategy = data => axiosResume.request({
  url: "/config/upCarLevelStrategy/delete",
  method: "POST",
  data
})
// 新增
export const addUpgradeConfig = data => axiosResume.request({
  url: "/config/upCarLevelStrategy/add",
  method: "POST",
  data
})
// 编辑
export const editUpgradeConfig = data => axiosResume.request({
  url: "/config/upCarLevelStrategy/edit",
  method: "POST",
  data
})
// 详情
export const getUpgradeConfigDetail = data => axiosResume.request({
  url: "/config/upCarLevelStrategy/detail",
  method: "POST",
  data
})

// 端内查 渠道类型
export const getOwnSource = data => axiosResume.request({
  url: "/admin/source/getOwnSource",
  method: "POST",
  data
})
// 端外 查 渠道类型
export const getThirdSource = data => axiosResume.request({
  url: "/admin/source/getThirdSource",
  method: "POST",
  data
})
