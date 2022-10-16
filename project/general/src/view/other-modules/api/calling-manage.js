import axios4Common from "_o/config/api4Common.request"

// 列表查询接口
export const queryPage = data => axios4Common.request({
  url: "/api/common/v1/appPageConfig/queryPage",
  method: "post",
  data: data
})
// 新增
export const addAppPageConfig = data => axios4Common.request({
  url: "/api/common/v1/appPageConfig/add",
  method: "post",
  data: data
})
// 编辑
export const editAppPageConfig = data => axios4Common.request({
  url: "/api/common/v1/appPageConfig/update",
  method: "post",
  data: data
})
// 详情
export const getAppPageConfig = data => axios4Common.request({
  url: "/api/common/v1/appPageConfig/detail",
  method: "post",
  data: data
})
