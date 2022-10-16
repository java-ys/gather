/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-01-15 15:29:43
 * @Description:
 */
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
export const queryCrossLevelList = postFn("/config/price/premiumStrategy/pageQuery", axios)
/** 查询跨级接单策略明细 */
export const getCrossLevelRule = id => getFn(`/config/price/premiumStrategy/detail`, axios)()
/** 新增保存跨级接单规则 */
export const createCrossLevelRule = postFn("/config/price/premiumStrategy/add", axios)
/** 编辑保存跨级接单规则 */
export const updateCrossLevelRule = postFn("/api/cross/level/order/update", axios)
