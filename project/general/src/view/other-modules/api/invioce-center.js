/**
 * 财务开票管理 接口
 */

import axios4Invioce from "_o/config/api4Invioce.request"

/**
 * 开票历史记录分页查询
 */
export const getHistoryList = (data) => {
  return axios4Invioce.request({
    url: "/api/invoice/v1/history",
    method: "post",
    data
  })
}

/**
 * 发票操作日志分页查询
 */
export const getOperatorLogList = (data) => {
  return axios4Invioce.request({
    url: "/api/invoice/v1/invoiceOperatorLog",
    method: "post",
    data
  })
}

/**
 * 行程分页查询---个人行程开票
 */
export const getRouteList = (data) => {
  return axios4Invioce.request({
    url: "api/invoice/v1/routeList",
    method: "post",
    data
  })
}

/**
 * 查询开票详情
 */
export const getDetailInfo = (data) => {
  return axios4Invioce.request({
    url: "api/invoice/v1/detail/" + data,
    method: "post",

  })
}

/**
 * 发送电子发票和行程单
 */
export const resend = (data) => {
  return axios4Invioce.request({
    url: "api/invoice/v1/resend",
    method: "post",
    data
  })
}

/**
 * 红冲发票
 */
export const deleteInvoice = (data) => {
  return axios4Invioce.request({
    url: "api/invoice/v1/invalidate/" + data,
    method: "post",

  })
}

/**
 * 修改发票
 */
export const modifyInvoice = (data) => {
  return axios4Invioce.request({
    url: "api/invoice/v1/modify",
    method: "post",
    data
  })
}

/**
 * 开票
 */
export const applyInvoice = (data) => {
  return axios4Invioce.request({
    url: "api/invoice/v1/billing",
    method: "post",
    data
  })
}
