import base from "./base"

// 面试分页列表
export const selectNoticeList = (params) => {
  return base.mainRequest("/api/driver/interview/selectNoticeList", params);
};

// 司机测评
export const driverEvaluating = (params) => {
  return base.mainRequest("/api/driver/interview/driverEvaluating", params);
};

// 面试信息详情
export const interviewDetail = (params) => {
  return base.mainRequest("/api/driver/interview/interviewDetail", params);
};

// 新增面试
export const addInterview = (params) => {
  return base.mainRequest("/api/driver/interview/addInterview", params);
};

// 编辑面试
export const editInterview = (params) => {
  return base.mainRequest("/api/driver/interview/editInterview", params);
};

// 性格测试通过
export const characterCheckPass = (params) => {
  return base.mainRequest("/api/driver/interview/characterCheckPass", params);
};

// 性格测试不通过
export const characterCheckCancel = (params) => {
  return base.mainRequest("/api/driver/interview/characterCheckCancel", params);
};

// 面试信息详情(新)
export const interviewNoticeDetail = (params) => {
  return base.mainRequest("/api/driver/interview/interviewNoticeDetail", params);
};

// 上传图片
export const uploadImgss = (params) => {
  return base.mainRequest("/api/driver/upload/uploadImg", params);
};

// 人脸上传图片
export const uploadFaceImgss = (params) => {
  return base.mainRequest("/api/v1/driver/resume/uploadIdentityCard", params);
};

// 路试分页列表
export const queryPage = (params) => {
  return base.mainRequest("/api/driver/roadTest/queryPage", params);
};
// 路试 详情
export const roadTestDetail = (params) => {
  return base.mainRequest("/api/driver/roadTest/detail", params);
};
// 新增路试
export const addRoadTest = (params) => {
  return base.mainRequest("/api/driver/roadTest/edit", params);
};
