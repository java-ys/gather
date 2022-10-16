import axios from "_g/config/api.request";

/** 原密码修改 */
export const updateNewPassword = data => {
  return axios.request({
    url: "/user/userAccount/updateNewPassword",
    data,
    method: "POST",
    headers: {
      Authorization: "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO"
    }
  });
};

/**
 * 获取图形随机码
 */
export const getImageInfo = data => {
  return axios.request({
    url: "/user/userAccount/getImageInfo",
    method: "POST",
    data: data,
    headers: {
      Authorization: "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO"
    }
  });
};
/**
 * 获取短信验证
 */
export const getSmsInfo = data => {
  return axios.request({
    url: "/user/userAccount/getSmsInfo",
    method: "POST",
    data: data,
    headers: {
      Authorization: "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO"
    }
  });
};

/**
 * 获取短信验证
 */
export const updatePasswordByPhone = data => {
  return axios.request({
    url: "/user/userAccount/updatePasswordByPhone",
    method: "POST",
    data: data,
    headers: {
      Authorization: "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO"
    }
  });
};

/**
 * 获取用户信息
 */
export const userInfoMsg = data => {
  return axios.request({
    url: "/user/userAccount/getUserInfoMsg",
    method: "POST",
    data: data,
    // headers: {
    //   Authorization: "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO"
    // }
  });
};
