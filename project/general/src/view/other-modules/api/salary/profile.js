/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-02-28 15:26:29
 * @LastEditors: wangp
 * @LastEditTime: 2020-06-04 14:25:44
 */
import base from "./base"

// 司机档案分页列表
export const profileList = (params) => {
  return base.mainRequest("/api/v1/driver/info/list", params);
};

// 面试查询司机档案
export const interviewQueryDriverInfo = (params) => {
  return base.mainRequest("/api/v1/driver/info/queryDriverResumeDetailinfo", params);
};

//  面试更新维护司机档案
export const interviewDriverInfo = (params) => {
  return base.mainRequest("/api/v1/driver/info/interviewSaveOrUpdate", params);
};

// 新增司机档案信息
export const addDriverInfo = (params) => {
  return base.mainRequest("/api/v1/driver/info/addDriverInfo", params);
};

// 更新司机档案信息
export const updateDriverInfo = (params) => {
  return base.mainRequest("/api/v1/driver/info/updateDriverInfo", params);
};

// 司机档案详情
export const queryDriverInfoByUuid = (params) => {
  return base.mainRequest("/api/v1/driver/info/getDriverInfoById", params);
};

// 司机投入运营
export const putIntoOperation = (params) => {
  return base.mainRequest("/api/v1/driver/info/putIntoOperation", params);
};

// 司机取消运营
export const cancelOperation = (params) => {
  return base.mainRequest("/api/v1/driver/info/cancelOperation", params);
};

// 测试车机存储
export const checkFace = (params) => {
  return base.mainRequest("/api/v1/driver/info/checkFace", params);
};

// 拍照参数初始化
export const photoParamSet = (params) => {
  return base.photoServiceRequest("/param=set", params);
};

// 拍照接口1
export const photoParamGet = (params) => {
  return base.photoServiceRequest("/param=get", params);
};

// 拍照接口2
export const photoGrabImage = (params) => {
  return base.photoServiceRequest("/video=grabimage", params);
};

// 上传(旧)
export const uploadPhoto = (params) => {
  return base.imageRequest("/api/v1/driver/resume/uploadIdentityCard", params);
};

// 上传(新)
export const uploadImg = (params) => {
  return base.imageRequest("/api/driver/upload/uploadImg", params);
};

// 身份证ocr识别
export const IdCardIdentify = (params) => {
  return base.imageRequest("/api/v1/driver/info/identityCardForOcr", params);
};

// 驾驶证ocr识别
export const drivingLicenceIdentify = (params) => {
  return base.imageRequest("/api/v1/driver/info/driverLicenseForOcr", params);
};

export const driverSalaryTypeImport = (params) => {
  return base.imageRequest("/api/v1/driver/info/driverSalaryTypeImport", params);
};
