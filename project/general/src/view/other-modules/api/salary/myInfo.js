import base from "./base"

// 获取列表
export const queryImportantInfoList = (params) => {
  return base.mainRequest("/api/v1/driver/importantInfo/list", params);
};

// 修改手机号
export const modifyPhone = (params) => {
  return base.mainRequest("/api/v1/driver/importantInfo/modifyPhone", params);
};

// 修改身份证号
export const modifyIdentityCard = (params) => {
  return base.mainRequest("/api/v1/driver/importantInfo/modifyIdentityCard", params);
};

// 修改姓名
export const modifyName = (params) => {
  return base.mainRequest("/api/v1/driver/importantInfo/modifyName", params);
};
// 修改驾驶证档案编号
export const modifyFileNum = (params) => {
  return base.mainRequest("/api/v1/driver/importantInfo/modifyFileNum", params);
};

// 日志
export const getLog = params => {
  return base.mainRequest("/api/driver/logCommon/queryLogV2", params);
};
