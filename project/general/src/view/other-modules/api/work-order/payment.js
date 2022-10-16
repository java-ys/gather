import api4partner from "_o/config/api4partner.request"
import api4manager from "_o/config/api4manager.request"
import config from "../../../../config/config"

// 司机账单列表查询
export const getBillList = async data => {
  return api4partner.request({
    url: "/manage/order/bill/list",
    data,
    method: "post"
  })
}

// 结算明细查询
export const queryBillDetail = async data => {
  return api4partner.request({
    url: "/manage/order/bill/detail",
    data,
    method: "post"
  })
}
