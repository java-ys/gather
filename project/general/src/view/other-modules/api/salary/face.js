import base from "./base"

export const getMonthStatData = (params) => {
  return base.mainRequest("/api/driver/resumeRc/getMonthStatData", params);
};

// 忘记密码-获取图形验证码
export const getImagesInfo = (params) => {
  return base.imageRequest("/api/driver/system/getImageInfo", params);
};

// 忘记密码-找回
export const forgetPassword = (params) => {
  return base.imageRequest("/api/driver/system/forgetPassword", params);
  // return base.imageRequest('/api/driver/system/forgetPwd', params);
};

// 获取短信验证码
export const getSmsInfo = (params) => {
  return base.imageRequest("/api/driver/system/getSmsInfo", params);
};

// 修改密码
export const updatePassword = (params) => {
  // return base.imageRequest('/api/driver/system/updatePwd', params);
  return base.imageRequest("/api/driver/system/updatePassword", params);
};
// 重复报名查询-获取图形验证码
export const repeatResumeGetImagesInfo = (params) => {
  return base.imageRequest("/api/v1/driver/repeatResume/getImageCode", params);
};
// 重复报名查询-获取短信验证码
export const repeatResumeSendSms = (params) => {
  return base.imageRequest("/api/v1/driver/repeatResume/sendSms", params);
};
// 重复报名查询-list
export const repeatResumQueryRepeat = (params) => {
  return base.mainRequest("/api/v1/driver/repeatResume/queryRepeat", params);
};
