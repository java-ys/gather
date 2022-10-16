import axios from "_o/config/api4Assets.request"

/**
 * 获取品牌列表
 * @param data
 * @returns {promise}
 */
export const queryBrandList = (data = {}) => {
  return axios.request({
    url: "/api/assets/brand/queryBrandList",
    data,
    method: "POST"
  })
}
/**
 * 根据品牌名获取车系
 * @param data
 * @returns {promise}
 */
export const querySeriesListByBrandId = (data) => {
  return axios.request({
    url: "/api/assets/series/querySeriesListByBrandId",
    data,
    method: "POST"
  })
}
/**
 * 根据车系查车型
 * @param data
 * @returns {promise}
 */
export const queryLevelBySeriesId = (data) => {
  return axios.request({
    url: "/api/assets/level/queryLevelBySeriesId",
    data,
    method: "POST"
  })
}
/**
 * 车型模糊查询
 * @param data
 * @returns {promise}
 */
export const queryLevelByLikeName = (data) => {
  return axios.request({
    url: "/api/assets/level/selectListName",
    data,
    method: "POST"
  })
}
