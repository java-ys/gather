import axios from "_g/config/api.request";
// --------------------城市电子围栏管理------------------------

// 城市电子围栏 --- 获取省市区联动
export const getProvinceCityDistrictTree = data => {
  return axios.request({
    url: "/common/areaThreeLevelTree",
    method: "get",
    params: data
  });
};

// 城市电子围栏 --- 获取围栏图层列表
export const getLayerFence = data => {
  return axios.request({
    url: "/admin/fence/v2/rail-layer-list",
    method: "get",
    params: data
  });
};

// 城市电子围栏 --- 获取场景树
export const getSceneTree = data => {
  return axios.request({
    url: "/admin/fence/v2/scene-tree",
    method: "get",
    params: data
  });
};

// 城市电子围栏 --- 保存围栏
export const saveFence = data => {
  return axios.request({
    url: "/admin/fence/v2/save",
    method: "post",
    data
  });
};

// 城市电子围栏 --- 更新围栏
export const updateFence = data => {
  return axios.request({
    url: "/admin/fence/v2/update",
    method: "post",
    data
  });
};

// 城市电子围栏 --- 围栏状态更新
export const changeFenceStatus = data => {
  return axios.request({
    url: "/admin/fence/v2/update-status",
    method: "post",
    data
  });
};

// 城市电子围栏 --- 查看围栏详情
export const getFenceDetail = data => {
  return axios.request({
    url: "/admin/fence/v2/detail",
    method: "post",
    data
  });
};

// 城市电子围栏 --- 围栏分页条件查询
export const queryFenceByPaging = data => {
  return axios.request({
    url: "/admin/fence/v2/page-condition-list",
    method: "post",
    data
  });
};

// 城市电子围栏 --- 关联围栏分页条件查询
export const queryRelationFence = data => {
  return axios.request({
    url: "/admin/fence/v2/page-relation",
    method: "post",
    data
  });
};

// 城市电子围栏 --- 根据城市和类型查询围栏信息
export const queryFenceByLayer = data => {
  return axios.request({
    url: "/admin/fence/v2/list-by-city-type",
    method: "post",
    data
  });
};
