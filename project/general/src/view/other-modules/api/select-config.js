import axios from "_g/config/route-gateway";

// 获取列表--
export const getAllList = data => {
  return axios.request({
    url: "/config/select/route/list",
    data,
    method: "post"
  });
};
//新增策略
export const insertRule = data => {
  return axios.request({
    url: "/config/select/route/add",
    data,
    method: "post"
  });
};

export const updaterule = data => {
  return axios.request({
    url: "/config/select/route/updateLimit",
    data,
    method: "post"
  });
};
export const updatestatus = data => {
  return axios.request({
    url: "/config/select/route/updateStatus",
    data,
    method: "post"
  });
};
