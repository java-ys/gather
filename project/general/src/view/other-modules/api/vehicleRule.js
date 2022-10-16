/*
 * @Author: Evil Cheng
 * @Date: 2022-03-14 10:58:52
 * @LastEditTime: 2022-03-14 13:52:01
 * @Description:
 */

import routeAxios from "_g/config/api4Route.request";

export const createRule = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/add",
    data,
    method: "post",
  });
};
export const deleteRule = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/delete",
    data,
    method: "post",
  });
};

export const queryRuleDetail = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/detail",
    data,
    method: "post",
  });
};

export const queryRuleList = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/queryPage",
    data,
    method: "post",
  });
};

export const updateRule = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/update",
    data,
    method: "post",
  });
};

export const moveRuleDown = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/shiftDown",
    data,
    method: "post",
  });
};

export const moveRuleUp = (data) => {
  return routeAxios.request({
    url: "/api/common/v1/qaInfo/shiftUp",
    data,
    method: "post",
  });
};

