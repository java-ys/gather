import axios from "_o/config/api4Finance.request";

// 获取重复付款退款审核列表-财务
export const fetchRefundListForFinanceStaff = data => {
  return axios.request({
    url: "/admin/finance/doublePayment/refund/list",
    data,
    method: "post"
  });
};

// 获取重复付款退款审核列表-客服
export const fetchRefundListForCustomerServiceStaff = data => {
  return axios.request({
    url: "/admin/finance/doublePayment/customerService/list",
    data,
    method: "post"
  });
};

// 退款操作，财务用 refundSource: 1
export const refundActionForFinanceStaff = payload => {
  return axios.request({
    url: "/admin/finance/doublePayment/refund",
    data: {
      ...payload,
      refundSource: 1
    },
    method: "post"
  });
};

// 退款操作，客服用 refundSource: 2
export const refundActionForCustomerServiceStaff = payload => {
  return axios.request({
    url: "/admin/finance/doublePayment/refund",
    data: {
      ...payload,
      refundSource: 2
    },
    method: "post"
  });
};

// 标记退款成功，财务用
export const markRefundSuccessAction = payload => {
  return axios.request({
    url: "/admin/finance/doublePayment/refund/markSuccess",
    data: {
      ...payload,
      refundSource: 1
    },
    method: "post"
  });
};
