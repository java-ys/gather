import axios from "_g/config/api4Route.request";

// 新建，编辑策略
export const saveCarpoolStrategy = (data) => {
  return axios.request({
    url: "/config/carpoolRule/save",
    data,
    method: "post",
  });
};

// 查询拼车策略
export const queryCarpoolStrategy = (data) => {
  return axios.request({
    url: "/config/carpoolRule/pageQuery",
    data,
    method: "post",
  });
};

// 拼车策略详情
export const queryCarpoolDetail = (data) => {
  return axios.request({
    url: "/config/carpoolRule/detail",
    data,
    method: "post",
  });
};

// 停用拼车策略
export const stopCarpoolStrategy = (data) => {
  return axios.request({
    url: "/config/carpoolRule/disabled",
    data,
    method: "post",
  });
};
