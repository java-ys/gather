/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-02-28 10:18:39
 * @Description:
 */
import axios from "_g/config/api.request";

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

/** 查询车型组列表 */
export const vehicleGroupList = postFn("/admin/config/vehicleGroup/list", axios)
/** 查询车型组配置明细 */
export const vehicleGroupDetail = postFn(`/admin/config/vehicleGroup/get`, axios)
/** 新增车型组 */
export const vehicleGroupAdd = postFn("/admin/config/vehicleGroup/add", axios)
/** 编辑车型组 */
export const vehicleGroupEdit = postFn("/admin/config/vehicleGroup/edit", axios)
/** 启用/禁用 */
export const vehicleGroupSetStatus = postFn("admin/config/vehicleGroup/setStatus", axios)

/** 删除（没用到 */
export const vehicleGroupDelete = postFn("admin/config/vehicleGroup/delete", axios)
