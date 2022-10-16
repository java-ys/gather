import axios from "_g/config/api.request";

// 乘客基本信息*/
export const queryList = params => {
  return axios.request({
    url: "/admin/passenger/queryList",
    data: params,
    method: "POST"
  });
};

// 乘客详细信息*/
export const passengerDetail = params => {
  return axios.request({
    url: "/admin/passenger/queryDetail",
    data: params,
    method: "POST"
  });
};

// 订单记录*/
export const queryOrderList = params => {
  return axios.request({
    url: "/admin/passenger/queryOrderList",
    data: params,
    method: "POST"
  });
};

// 充值记录*/
export const queryRechargeList = params => {
  return axios.request({
    url: "/admin/passenger/queryRechargeList",
    data: params,
    method: "POST"
  });
};

// 消费记录*/
export const queryConsumptionList = params => {
  return axios.request({
    url: "/admin/passenger/queryConsumptionList",
    data: params,
    method: "POST"
  });
};

// 退款记录*/
export const queryRefundList = params => {
  return axios.request({
    url: "admin/passenger/refundRecord",
    data: params,
    method: "POST"
  });
};

// 优惠券信息*/
export const queryCouponList = params => {
  return axios.request({
    url: "/admin/passenger/listCoupon",
    data: params,
    method: "POST"
  });
};

// 封号记录*/
export const queryDisableAccountList = params => {
  return axios.request({
    url: "/admin/passenger/queryDisableAccountList",
    data: params,
    method: "POST"
  });
};

// 紧急联系人*/
export const queryEmergencyContactList = params => {
  return axios.request({
    url: "/admin/passenger/queryEmergencyContactList",
    data: params,
    method: "POST"
  });
};

// 行程分享记录*/
export const queryTripShareList = params => {
  return axios.request({
    url: "/admin/passenger/queryTripShareList",
    data: params,
    method: "POST"
  });
};

/** 封号 */
export const block = params => {
  return axios.request({
    url: "admin/passenger/block",
    data: params,
    method: "POST"
  });
};

/** 解封 */
export const deblock = params => {
  return axios.request({
    url: "/admin/passenger/deblock",
    data: params,
    method: "POST"
  });
};

/** 优惠券模板列表 */
export const templateList = params => {
  return axios.request({
    url: "/admin/template/list",
    data: params,
    method: "POST"
  });
};

/** 优惠券模板新增 */
export const templateSave = params => {
  return axios.request({
    url: "/admin/template/save",
    data: params,
    method: "POST"
  });
};

/** 优惠券模板修改 */
export const templateUpdate = params => {
  return axios.request({
    url: "/admin/template/update",
    data: params,
    method: "POST"
  });
};

/** 优惠券模板详情 */
export const templateInfo = params => {
  return axios.request({
    url: "/admin/template/info",
    data: params,
    method: "POST"
  });
};

/** 一次性发券新增 */
export const oneOffCoupon = params => {
  return axios.request({
    url: "/admin/coupon/grantCoupon",
    data: params,
    method: "POST"
  });
};

/** 一次性发券记录 */
export const oneOffCouponList = params => {
  return axios.request({
    url: "/admin/coupon/queryRecord",
    data: params,
    method: "POST"
  });
};

/** 一次性发券详情 */
export const oneOffCouponDetail = params => {
  return axios.request({
    url: "/admin/coupon/queryCoupon",
    data: params,
    method: "POST"
  });
};

/** 一次性发券记录乘客数量查询 */
export const passengerNumber = params => {
  return axios.request({
    url: "/admin/coupon/count",
    data: params,
    method: "POST"
  });
};

/** 一次性发券记录乘客详情查询 */
export const passengerMobile = params => {
  return axios.request({
    url: "/admin/coupon/listMobile",
    data: params,
    method: "POST"
  });
};

/** 优惠券列表 */
export const couponList = params => {
  return axios.request({
    url: "/admin/coupon/list",
    data: params,
    method: "POST"
  });
};

/** 优惠券新增 */
export const couponSave = params => {
  return axios.request({
    url: "/admin/coupon/save",
    data: params,
    method: "POST"
  });
};

/** 优惠券修改 */
export const couponUpdate = params => {
  return axios.request({
    url: "/admin/coupon/update",
    data: params,
    method: "POST"
  });
};

/** 优惠券详情 */
export const couponInfo = params => {
  return axios.request({
    url: "/admin/coupon/info/" + params,
    method: "GET"
  });
};

/** 查询优惠券模板 */
export const templateAll = params => {
  return axios.request({
    url: "/admin/template/listAll",
    data: params,
    method: "POST"
  });
};

/** 订单列表 */
export const orderList = params => {
  return axios.request({
    url: "/admin/order/queryOrderListByPage",
    data: params,
    method: "POST"
  });
};

/** 订单详情 */
export const orderDetail = params => {
  return axios.request({
    url: "/admin/order/getOrderDetailByOrderId",
    data: params,
    method: "POST"
  });
};

/** 包车订单列表 */
export const CharteredOrderList = params => {
  return axios.request({
    url: "/admin/order/charter/listByPage",
    data: params,
    method: "POST"
  });
};

/** 订单取消 */
export const orderCancel = params => {
  return axios.request({
    url: "/admin/order/cancelOrder",
    params,
    method: "POST"
  });
};

/** 订单轨迹 */
export const orderPath = params => {
  return axios.request({
    url: "/admin/order/queryNewOrderHistoryTrackByTime",
    data: params,
    method: "POST"
  });
};

/** 途径点修改记录 */
export const wayRecord = params => {
  return axios.request({
    url: "/admin/order/queryPassingPointByOrderUuid",
    data: params,
    method: "POST"
  });
};
/** 途径点修改记录 */
export const queryRoutePointRecord = data => {
  return axios.request({
    url: "/admin/order/queryRoutePointRecord",
    data,
    method: "POST"
  });
};

// 获取预付款记录
export const getPaymentList = params => {
  return axios.request({
    url: "admin/passenger/advencePayment",
    method: "post",
    data: params
  });
};

// 获取乘客评价标签List
export const getPassengerTags = params => {
  return axios.request({
    url: "/admin/order/evaluateTags",
    method: "post",
    data: params
  });
};

// 获取取消原因
export const getCancelReason = params => {
  return axios.request({
    url: "admin/order/cancelReason",
    method: "post",
    data: params
  });
};


/**
 * 实名认证审核
 * */ 

//  实名认证列表
export const certificateList = params => {
  return axios.request({
    url: "admin/certificate/queryPage",
    method: "post",
    data: params
  });
};

//  实名认证详情
export const certificateDetail = params => {
  return axios.request({
    url: "admin/certificate/detail",
    method: "post",
    data: params
  });
};

//  实名认证通过
export const certificatePass = params => {
  return axios.request({
    url: "admin/certificate/reviewPass",
    method: "post",
    data: params
  });
};

//  实名认证拒绝
export const certificateReject = params => {
  return axios.request({
    url: "admin/certificate/reviewReject",
    method: "post",
    data: params
  });
};
