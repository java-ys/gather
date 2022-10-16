import axios from "_g/config/api.request";

const postFn = (url, api) => data => api.request({
  url,
  method: "post",
  data
})

const getFn = (url, api) => query => api.request({
  url,
  method: "get",
  data: query
})

/** 查询跨级接单列表 */
export const queryCrossLevelList = postFn("/api/cross/level/order/list", axios)
/** 启用策略 */
export const postActivateStrategy = postFn("/api/cross/level/order/start", axios)
/** 停用策略 */
export const postDeactivateStrategy = postFn("/api/cross/level/order/stop", axios)
/** 查询跨级接单策略明细 */
export const getCrossLevelRule = id => getFn(`/api/cross/level/order/query/${id}`, axios)()
/** 新增保存跨级接单规则 */
export const createCrossLevelRule = postFn("/api/cross/level/order/add", axios)
/** 编辑保存跨级接单规则 */
export const updateCrossLevelRule = postFn("/api/cross/level/order/update", axios)
