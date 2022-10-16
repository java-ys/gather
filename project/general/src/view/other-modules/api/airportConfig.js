/*
 * @Author: Evil Cheng
 * @Date: 2021-11-09 11:27:29
 * @LastEditTime: 2021-11-23 16:13:24
 * @Description:接送机权益文案配置接口
 */
import routeAxios from "_g/config/api4Route.request";

/**
 * @description: 接送机--权益文案配置新增
 * @param {
 * type: 1 ：接机权益文案配置 2 ：送机权益文案配置 3 ：一口价预定须知 4 ：常见问题配置
 * }
 * @return {*}
 */
export const createEquityText = data => {
  return routeAxios.request({
    url: "/config/transferWordStrategy/create",
    data,
    method: "post"
  });
};


/**
 * @description: 接送机--权益文案配置 详情
 * @param {*}
 * @return {*}
 */
export const queryEquityTextDetail = data => {
  return routeAxios.request({
    url: "/config/transferWordStrategy/detail",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--权益文案配置编辑
 * @param {*}
 * @return {*}
 */
export const updateEquityText = data => {
  return routeAxios.request({
    url: "/config/transferWordStrategy/update",
    data,
    method: "post"
  });
};


/**
 * @description: 接送机--权益文案配置 删除
 * @param {*}
 * @return {*}
 */
export const deleteEquityText = data => {
  return routeAxios.request({
    url: "/config/transferWordStrategy/delete",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--权益文案配置--查询列表
 * @param {*}
 * @return {*}
 */
export const queryEquityText = data => {
  return routeAxios.request({
    url: "/config/transferWordStrategy/pageQuery",
    data,
    method: "post"
  });
};

/**
 * @description: 接送机--权益文案配置排序
 * @param {*}
 * @return {*}
 */
export const sortEquityText = data => {
  return routeAxios.request({
    url: "/config/transferWordStrategy/move",
    data,
    method: "post"
  });
};
