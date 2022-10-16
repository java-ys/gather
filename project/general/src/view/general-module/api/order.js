/*
 * 订单api接口
 */
import axios from "_g/config/api.request";

// 订单详情-获取途经点列表
export const getRoutePointRecord = data => {
  return axios.request({
    url: "/admin/order/routePointModifyRecord",
    data,
    method: "post"
  });
};

// 订单详情-订单轨迹-获取规划路径数据
export const axiosPlanningPath = data => {
  return axios.request({
    url: "/admin/order/planningPath",
    data,
    method: "post"
  });
};

// 订单详情-订单轨迹-获取实际路径数据
export const axiosActualTrack = data => {
  return axios.request({
    url: "/admin/order/actualTrackNew",
    data,
    method: "post"
  });
};

// 订单详情列表
export const getOrderDetail = data => {
  return axios.request({
    url: "/admin/order/getOrderDetailByOrderId",
    data,
    method: "post"
  });
};
// 包车-订单详情列表
export const getCharteredOrderDetail = data => {
  return axios.request({
    url: "/admin/order/charter/detail",
    data,
    method: "post"
  });
};

// 获取详情车辆位置
export const getCarPosition = params => {
  return axios.request({
    url: "/admin/order/getVehicleHisPosition",
    method: "post",
    data: params
  });
};

// 获取详情车辆状态
export const getCarStatus = params => {
  return axios.request({
    url: "/admin/order/getVehicleHisStatus",
    method: "post",
    data: params
  });
};

// 获取订单导览点
export const navigationLog = params => {
  return axios.request({
    url: "/admin/order/navigationLog",
    method: "post",
    data: params
  });
};
