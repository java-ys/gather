import axios from "_g/config/api.request";
import axiosAssets from "_o/config/api4Assets.request"

// 地推单列表接口
export const queryGroundPushOrderList = params => {
  return axios.request({
    url: "/admin/supply/order/list",
    data: params,
    method: "POST"
  });
};

// 地推添加
export const addGroundPush = params => {
  return axios.request({
    url: "/admin/supply/order/add",
    data: params,
    method: "POST"
  });
};

// 地推单更新
export const updateGroundPush = params => {
  return axios.request({
    url: "/admin/supply/order/update",
    data: params,
    method: "POST"
  });
};

// 地推单详情
export const groundPushDetail = params => {
  return axios.request({
    url: "/admin/supply/order/get",
    data: params,
    method: "POST"
  });
};

// 地推单作废
export const updateGroundPushStatus = params => {
  return axios.request({
    url: "/admin/supply/order/status/update",
    data: params,
    method: "POST"
  });
};

// 运营商城市
export const querySupplierList = params => {
  return axiosAssets.request({
    url: "/api/assets/v1/supplier/querySupplierList",
    data: params,
    method: "POST"
  });
};

// 获取看板汇总数据
export const queryBoardSummary = params => {
  return axios.request({
    url: "/admin/supply/board/get",
    data: params,
    method: "POST"
  });
};
