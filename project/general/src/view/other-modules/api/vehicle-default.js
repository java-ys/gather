import axios from "_g/config/api4Route.request";

export const listService = (data) => {
  return axios.request({
    url: "config/vehiclepolicy/pageQuery",
    data,
    method: "post",
  });
};

export const detailService = (data) => {
  return axios.request({
    url: "config/vehiclepolicy/detail",
    data,
    method: "post",
  });
};
export const addService = (data) => {
  return axios.request({
    url: "config/vehiclepolicy/save",
    data,
    method: "post",
  });
};

export const updateService = (data) => {
  return axios.request({
    url: "config/vehiclepolicy/update",
    data,
    method: "post",
  });
};
