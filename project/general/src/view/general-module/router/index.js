/**
 * @description 综合模块
 */
// 401, 404, 500, 错误日志
import ErrorCenter from "./module/error-center";
// 登录、修改密码
import LoginCenter from "./module/login-related";

import Customer from "./module/customer"

import Home from "./module/home";

const isDev = process.env.NODE_ENV === "development";

let exportList = [Home, ...ErrorCenter, ...Customer];

if (isDev) {
  exportList = [...exportList, ...LoginCenter];
}

export default exportList;
