import axios from "_g/config/api4Route.request";
// 一口价

// 启用停用  uuid status
export const changeStatusService = data => axios.request({
  url: "/config/oneprice/v1/change/status",
  data,
  method: "post"
})
// 新增
export const createService = data => axios.request({
  url: "/config/oneprice/v1/create",
  data,
  method: "post"
})
// 详情  uuid
export const getDetailService = data => axios.request({
  url: "/config/oneprice/v1/detail",
  data,
  method: "post"
})
// 一口价策略列表
export const queryService = data => axios.request({
  url: "/config/oneprice/v1/page/query",
  data,
  method: "post"
})
// 更新状态
export const updateService = data => axios.request({
  url: "/config/oneprice/v1/update",
  data,
  method: "post"
})
// 司机流水补足 分页查询
export const getPageQuery = data => axios.request({
  url: "/config/replenishlRule/pageQuery",
  data,
  method: "post"
})
// 司机流水补足详情  uuid
export const queryDetailService = data => axios.request({
  url: "/config/replenishlRule/detail",
  data,
  method: "post"
})
// 司机流水补足新增 编辑  uuid
export const saveDetailService = data => axios.request({
  url: "/config/replenishlRule/save",
  data,
  method: "post"
})
// 司机流水补足更新状态
export const changeStatusServiceList = data => axios.request({
  url: "/config/replenishlRule/changeStatus",
  data,
  method: "post"
})
// 司机流水补足奖励明细
export const queryReplenishOrder = data => axios.request({
  url: "/config/replenishlRule/queryReplenishOrder",
  data,
  method: "post"
})
