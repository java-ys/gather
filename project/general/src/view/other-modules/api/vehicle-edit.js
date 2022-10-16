/*
 * @Author: NapierPLUS
 * @Date: 2021-08-25 17:41:59
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-10-14 15:12:13
 * @Description: 
 */
import managerService from "_g/config/api.request"
/** 获取车辆信息修改分页查询 */
export const queryEditByPage = (data) => {
  return managerService.request({
    url: "/api/vehicleEdit/pageOfQuery",
    data,
    method: "POST"
  })
}
/** 审核 */
export const audit = (data) => {
  return managerService.request({
    url: "/api/vehicleEdit/audit",
    data,
    method: "POST"
  })
}

/** 根据id查看详情 */
export const queryDetailById = (data) => {
    return managerService.request({
      url: "/api/vehicleEdit/queryDetailById",
      data,
      method: "POST"
    })
  }

  

/** 根据vin查询操作记录 */
export const pageOfAuditQuery = (data) => {
    return managerService.request({
      url: "/api/vehicleEdit/pageOfAuditQuery",
      data,
      method: "POST"
    })
  }