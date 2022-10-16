/**
 * 卫星城
 */
import axios from "_o/config/api4Satellite.request";

// 卫星城关系查询
export const querySatellite = data => {
  return axios.request({
    url: "/config/satellite/page",
    method: "post",
    data: data
  });
};
// 卫星城关系添加
export const addSatellite = data => {
  return axios.request({
    url: "/config/satellite/add",
    method: "post",
    data: data
  });
};
// 卫星城关系添加
export const modifySatellite = data => {
  return axios.request({
    url: "/config/satellite/update",
    method: "post",
    data: data
  });
};

// 卫星城关系状态修改
export const changeSatelliteStatus = data => {
  return axios.request({
    url: "/config/satellite/status",
    method: "post",
    data: data
  });
};

// 删除卫星城关系
export const deleteSatellite = data => {
  return axios.request({
    url: "/config/satellite/delete",
    method: "post",
    data: data
  });
};
