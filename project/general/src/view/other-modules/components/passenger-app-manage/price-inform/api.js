/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-11 15:18:20
 * @Description:
 */
import axios from "_g/config/api4Route.request";

const postFn = (url, api) => data => api.request({
  url,
  method: "post",
  data
})

// const getFn = (url, api) => query => api.request({
//   url,
//   method: "get",
//   data: query
// })

/** 查询列表 */
export const queryPage = postFn("/api/common/v1/specialExpensesNotice/queryPage", axios)
/** 查询车型组配置明细 */
export const specialExpensesNoticeDetail = postFn(`/api/common/v1/specialExpensesNotice/detail`, axios)
/** 新增车型组 */
export const specialExpensesNoticeAdd = postFn("/api/common/v1/specialExpensesNotice/add", axios)
/** 启用/禁用 */
export const vehicleGroupSetStatus = postFn("admin/config/vehicleGroup/setStatus", axios)

/** 更新 */
export const specialExpensesNoticeUpdate = postFn("/api/common/v1/specialExpensesNotice/update", axios)


/** 更新 */
export const specialExpensesNoticeDelete = postFn("/api/common/v1/specialExpensesNotice/delete", axios)

