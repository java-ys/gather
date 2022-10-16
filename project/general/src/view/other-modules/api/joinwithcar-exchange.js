import changeService from "_o/config/api4joinwithcarExchange.request"
/** 获取换车订单分页查询 */
export const queryChangeCarOrderByPage = (data) => {
  return changeService.request({
    url: "/api/operate/change/car/queryChangeCarOrderByPage",
    data,
    method: "POST"
  })
}
/** 换车订单审核 */
export const auditPass = (data) => {
  return changeService.request({
    url: "/api/operate/change/car/auditPass",
    data,
    method: "POST"
  })
}
/** 换车订单审核 */
export const auditNoPass = (data) => {
  return changeService.request({
    url: "/api/operate/change/car/auditNoPass",
    data,
    method: "POST"
  })
}
/** 换车订单审核 */
export const queryChangeCarOrderDetail = (data) => {
  return changeService.request({
    url: "/api/operate/change/car/queryChangeCarOrderDetail",
    data,
    method: "POST"
  })
}
// 修改车牌号
export const editPlateNum = (data) => {
  return changeService.request({
    url: "/admin/carManager/editPlateNum",
    data,
    method: "post"
  })
}
