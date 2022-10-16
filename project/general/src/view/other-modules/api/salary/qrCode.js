import base from "./base"

// 录入二维码信息并生成二维码/修改二维码信息
export const addOrUpdateQrcodeInfo = (params) => {
  return base.mainRequest("/api/driverResumeQrcode/addOrUpdateQrcodeInfo", params);
};

// 二维码详情分页
export const getCodePageList = (params) => {
  return base.mainRequest("/api/driverResumeQrcode/getCodePageList", params);
};

// 查看二维码详情
export const getQrcodeInfo = (params) => {
  return base.mainRequest("/api/driverResumeQrcode/getQrcodeInfo", params);
};

// 获取招募司机类型
export const queryOperationTypeByAgent = (params) => {
  return base.mainRequest("/api/v1/common/queryOperationTypeByAgent", params);
};

