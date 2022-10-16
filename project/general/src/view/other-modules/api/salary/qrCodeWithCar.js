import base from "./base"

// 录入二维码信息并生成二维码
export const addQrcodeWithCar = (params) => {
  return base.mainRequest("/api/v1/driver/withCardQrcode/add", params);
};

// 更新二维码信息
export const editQrcodeWithCar = (params) => {
  return base.mainRequest("/api/v1/driver/withCardQrcode/edit", params);
};
// 生效二维码
export const enableQrcodeWithCar = (params) => {
  return base.mainRequest("/api/v1/driver/withCardQrcode/enable", params);
};
// 失效
export const disableQrcodeWithCar = (params) => {
  return base.mainRequest("/api/v1/driver/withCardQrcode/disable", params);
};

// 二维码列表分页
export const getCodePageList = (params) => {
  return base.mainRequest("/api/v1/driver/withCardQrcode/list", params);
};

// //查看二维码详情
// export const getQrcodeInfo = (params) => {
//   return base.mainRequest('/api/driverResumeQrcode/getQrcodeInfo', params);
// };

