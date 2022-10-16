import base from "./base"

// 背调审核分页查询
export const verifyPageList = (params) => {
  return base.mainRequest("/api/driver/resumeRc/verifyPageList", params);
};

// 背调审核
export const verify = (params) => {
  return base.mainRequest("/api/driver/resumeRc/verify", params);
};

// 背调审核日志
export const record = (params) => {
  return base.mainRequest("/api/driver/resumeRc/verify/record", params);
};

// 背调审核日志
export const getLog = (params) => {
  return base.mainRequest("/api/v1/driver/resume/log/list", params);
};

// 背调审核详情
// export const detail = (params) => {
//   return base.mainRequest('/api/driver/resumeRc/verify/detail', params);
// };
