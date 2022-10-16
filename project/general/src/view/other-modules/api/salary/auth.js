import base from "./base";


// 登录 ?username=sysadmin&password=123456&grant_type=password&scope=test
// /oauth/login
export const formLogin = (params) => {
  return base.authRequest("/api/login/login", params);
};

// 刷新token /oauth/token /oauth/refresh/token
export const refreshToken = (params) => {
  return base.authRequest("/oauth/refresh/token", params);
};

// 无痛刷新
export const reToken = (params) => {
  return base.refreshRequest("/api/v1/tokenManager/refreshToken", params);
};

// 退出登录
export const outLogin = () => {
  return base.authRequest("/api/login/logout", {});
};

// 获取加密秘钥
export const getKey = () => {
  return base.authRequest("/api/login/random/key", { type: "AES" });
};
