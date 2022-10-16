import base from "./base";

// 主副司机管理-列表
export const mainSubList = (params) => {
  return base.mainRequest("/api/deputy/driver/pageQuery", params);
};

// 主副司机管理-审核解绑
export const mainSubExamine = (params) => {
  return base.mainRequest("/api/deputy/driver/auditUntie", params);
};

// 主副司机管理-日志
export const mainSubLogs = (params) => {
  return base.mainRequest("/api/deputy/driver/queryLog", params);
};

// 主副司机管理-解绑
export const mainSubUnbundling = (params) => {
  return base.mainRequest("/api/deputy/driver/untie", params);
};
