import api4Route from "_g/config/api4Route.request"

// 费用列表查询接口
export const queryPage = data => api4Route.request({
  url: "/api/common/v1/qaInfo/queryPage",
  method: "post",
  data: data
})
// 新增
export const addPageConfig = data => api4Route.request({
  url: "/api/common/v1/qaInfo/add",
  method: "post",
  data: data
})
// 编辑
export const editPageConfig = data => api4Route.request({
  url: "/api/common/v1/qaInfo/update",
  method: "post",
  data: data
})

// 详情
export const getPageConfig = data => api4Route.request({
  url: "/api/common/v1/qaInfo/detail",
  method: "post",
  data: data
})

// 删除
export const deletePageConfig = data => api4Route.request({
  url: "/api/common/v1/qaInfo/delete",
  method: "post",
  data: data
})
