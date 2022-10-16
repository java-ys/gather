import HttpRequest from "@/libs/axios";
import config from "@/config/config";
import authAxios from "../config/auth.request";
import aesAuthAxios from "../config/aesOauth.request";
import qs from "qs";
const headersObject = config.headers; // 取出headers对象

const Authorization = "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
// 登录用axios
const loginAxios = new HttpRequest(baseUrl);
// 请求鉴权API用axios
const axios = new HttpRequest(baseUrl + "/auth-api/api");

/**
 * 获取加密秘钥
 * @returns {string} 加密后的字符串
 */
export const aesAuth = () => {
  return aesAuthAxios.request({
    url: "/auth/getKey",
    data: {},
    method: "post",
    headers: {
      Authorization,
      "Content-Type": "application/json;",
      ...headersObject
    }
  });
};

export const login = ({ userName, password, random }) => {
  const data = {
    username: userName,
    password: password,
    random,
    // grant_type: "password",
    // scope: "all"
  };
  return aesAuthAxios.request({
    url: "/auth/login",
    data: data,
    method: "post",
    headers: {
      // Authorization: "Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization,
      "Content-Type": "application/json;",
      ...headersObject
    }
  });
};

export const getNavList = () => {
  return axios.request({
    url: "/auth/resource/queryResourceByAccountId",
    data: {
      systemId: 5
    },
    method: "post"
  });
};

export const getUserInfo = token => {
  return axios.request({
    url: "/v1/staff/selectLoginStaffInfo",
    token,
    method: "post"
  });
};

export const logout = token => {
  return aesAuthAxios.request({
    url: "/auth/logout",
    method: "get"
  });
};

export const changePwd = parameter => {
  return aesAuthAxios.request({
    url: "/auth/updatePassword",
    data: parameter,
    method: "post",
    headers: {
      "Authorization": parameter.token,
      "Content-Type": "application/json;",
      ...headersObject
    }
  });
};

export const updatePasswordByPhone = parameter => {
  return aesAuthAxios.request({
    url: "/auth/phoneRetrievePassword",
    data: parameter,
    method: "post",
    headers: {
      Authorization,
      "Content-Type": "application/json;",
      ...headersObject
    }
  });
};