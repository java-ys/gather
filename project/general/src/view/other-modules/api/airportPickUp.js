/*
 * @Author: Evil Cheng
 * @Date: 2021-11-09 11:27:29
 * @LastEditTime: 2021-12-02 10:06:27
 * @Description:接送机接口
 */
import routeAxios from "_g/config/api4Route.request";

/**
 * @description: 接送机--改派策略--新增接口
 * @param {*}
 * @return {*}
 */
export const createReassignStrategy = data => {
  return routeAxios.request({
    url: "/config/airportOrderReassignStrategy/add",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--改派策略--编辑
 * @param {*}
 * @return {*}
 */
export const updateReassignStrategy = data => {
  return routeAxios.request({
    url: "/config/airportOrderReassignStrategy/edit",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--改派策略--查询列表
 * @param {*}
 * @return {*}
 */
export const queryReassignStrategy = data => {
  return routeAxios.request({
    url: "/config/airportOrderReassignStrategy/pageQuery",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--改派策略--更新状态
 * @param {*}
 * @return {*}
 */
export const updateReassignStrategyStatus = data => {
  return routeAxios.request({
    url: "/config/airportOrderReassignStrategy/change",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--改派策略--查询详情
 * @param {*}
 * @return {*}
 */
export const queryReassignStrategyDetail = data => {
  return routeAxios.request({
    url: "/config/airportOrderReassignStrategy/getDetail",
    data,
    method: "post"
  });
};


/**
 * @description: 接送机--派单策略--查询列表
 * @param {*}
 * @return {*}
 */
export const queryDispatchStrategy = data => {
  return routeAxios.request({
    url: "/admin/transferRuleController/pageTransferRule",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--派单策略--新增策略
 * @param {*}
 * @return {*}
 */
export const createDispatchStrategy = data => {
  return routeAxios.request({
    url: "/admin/transferRuleController/addStrategy",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--派单策略--编辑策略
 * @param {*}
 * @return {*}
 */
export const updateDispatchStrategy = data => {
  return routeAxios.request({
    url: "/admin/transferRuleController/updateTransferRule",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--派单策略--详情
 * @param {*}
 * @return {*}
 */
export const queryDispatchStrategyInfo = data => {
  return routeAxios.request({
    url: "/admin/transferRuleController/infoTransferRule",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--派单策略--启用
 * @param {*}
 * @return {*}
 */
export const updateDispatchStrategyStatus = data => {
  return routeAxios.request({
    url: "/admin/transferRuleController/statusTransferRule",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--定价策略--创建
 * @param {*}
 * @return {*}
 */
export const createPricingStrategy = data => {
  return routeAxios.request({
    url: "/config/airportPickUpStrategy/save",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--定价策略--查询列表
 * @param {*}
 * @return {*}
 */
export const queryPricingStrategy = data => {
  return routeAxios.request({
    url: "/config/airportPickUpStrategy/pageQuery",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--定价策略--详情
 * @param {*}
 * @return {*}
 */
export const queryPricingStrategyDetail = data => {
  return routeAxios.request({
    url: "/config/airportPickUpStrategy/detail",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--定价策略--编辑
 * @param {*}
 * @return {*}
 */
export const updatePricingStrategy = data => {
  return routeAxios.request({
    url: "/config/airportPickUpStrategy/update",
    data,
    method: "post"
  });
};

