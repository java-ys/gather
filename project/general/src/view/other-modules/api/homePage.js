import axios from "_g/config/api.request"

// 首页配置列表
export const homePageList = data => axios.request({
  url: "/admin/page/style/list",
  method: "post",
  data
})
// 新增
export const addHomePage = data => axios.request({
  url: "/admin/page/style/add",
  method: "post",
  data
})
// 删除
export const deleteRow = data => axios.request({
  url: "/admin/page/style/delete",
  method: "post",
  data
})
// 详情
export const getRowDetail = data => axios.request({
  url: "/admin/page/style/get",
  method: "post",
  data
})
// 启用/禁用
export const toggleStatus = data => axios.request({
  url: "/admin/page/style/setStatus",
  method: "post",
  data
})
// 菜单列表
export const menuList = data => axios.request({
  url: "/config/expandBizLine/menu/listData",
  method: "post",
  data
})
