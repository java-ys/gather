import axios from "_g/config/api.request";

export class ErrorResult extends Error {
  constructor(data) {
    super();
    this.code = data.code;
    this.message = data.msg;
  }
}

export const toResult = p => {
  return p
    .then(v => {
      if (!v.data.success) return Promise.reject(new ErrorResult(v.data));
      return Promise.resolve([null, v.data.data]);
    })
    .catch(e => Promise.resolve([e, null]));
};
/** 新建消息 */
export const add = data => {
  return axios.request({
    url: "/healthCar/business/add",
    data,
    method: "post"
  });
};
/** push列表 */
export const listMessage = data => {
  return axios.request({
    url: "/healthCar/business/listMessage",
    data,
    method: "post"
  });
};
/** 启用停用业务消息 */
export const update = data => {
  return axios.request({
    url: "/healthCar/business/update",
    data,
    method: "post"
  });
};

/** 提示文案列表 */
export const promptList = data => {
  return axios.request({
    url: "/promptInfoAdv/listByPage",
    data,
    method: "post"
  });
};

/** 提示文案详情 */
export const promptQueryById = data => {
  return axios.request({
    url: "/promptInfoAdv/queryById",
    data,
    method: "post"
  });
};

/** 提示文案更新 */
export const promptUpdate = data => {
  return axios.request({
    url: "/promptInfoAdv/update",
    data,
    method: "post"
  });
};

