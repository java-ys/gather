import base from "./base"

// 背景调查页分页查询
export const getList = (params) => {
  return base.mainRequest("/api/driver/resumeRc/queryResumeRcPageList", params);
};

// 背景调查页--直接淘汰
export const eliminate = (params) => {
  return base.mainRequest("/api/driver/resumeRc/eliminate", params);
};

// 背调页--查看详情
export const getDetail = (params) => {
  return base.mainRequest("/api/driver/resumeRc/getRecentRc", params);
};

// 背调
export const check = (params) => {
  return base.mainRequest("/api/driver/resumeRc/resumeReferenceCheck", params);
};

// 根据批次号查询背调详细结果
export const getCheckDetail = (params) => {
  return base.mainRequest("/api/driver/resumeRc/getRcResult", params);
};

// 背调修改
export const backgroundEdit = (params) => {
  return base.mainRequest("/api/v2/driver/background-check/edit", params);
};

// 线下背调结果编辑
export const edit = (params) => {
  return base.mainRequest("/api/driver/resumeRc/changeResumeReference/edit", params);
};

// 线下背景调查撤回
export const revokeResumeReferenceCheck = (params) => {
  return base.mainRequest("/api/driver/resumeRc/revokeResumeReferenceCheck", params);
};

// 背调详情
export const getResumeDetail = (params) => {
  return base.mainRequest("/api/driver/resumeRc/verify/detail", params);
};

// 获取线上背调详情
export const getCheckResultList = (params) => {
  return base.mainRequest("/api/resumeflow/background/checkResultList", params);
};

// 线上背调
export const checkOnlineBack = (params) => {
  return base.mainRequest("/api/resumeflow/background/check", params);
};
