import axios from "_g/config/api.request";
// 非车牌类限制策略

// 新增
export const nonSave = data => {
  return axios.request({
    url: "/admin/nonNumberPlate/save",
    method: "post",
    data: data
  });
};

// 编辑
export const nonUpdate = data => {
  return axios.request({
    url: "/admin/nonNumberPlate/update",
    method: "post",
    data: data
  });
};

// 启动/停用
export const nonActive = data => {
  return axios.request({
    url: "/admin/nonNumberPlate/statusChange",
    method: "post",
    data: data
  });
};

// 删除
export const nonDelete = data => {
  return axios.request({
    url: "/admin/nonNumberPlate/delete",
    method: "post",
    data: data
  });
};

// 详情
export const nonDetail = data => {
  return axios.request({
    url: "/admin/nonNumberPlate/getInfo",
    method: "post",
    data: data
  });
};

// 围栏
export const fetchFenceList = data => {
    return axios.request({
        url: "/admin/sysElectronicFence/selectInfoAll",
        method: "post",
        data: data
    });
};

// 分页   /m2-admin/admin/sysElectronicFence/getDetail
export const fetchPageList = data => {
    return axios.request({
        url: "/admin/nonNumberPlate/queryPage",
        method: "post",
        data: data
    });
};

// 围栏坐标点集合
export const fetchLngLatList = data => {
  return axios.request({
      url: "/admin/sysElectronicFence/getDetail",
      method: "post",
      data: data
  });
};