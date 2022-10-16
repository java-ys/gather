import base from "./base"

// 简历分页列表
export const resumeList = (params) => {
  return base.mainRequest("/api/v1/driver/resume/list", params);
};

// 简历分页列表
export const resumeAssignment = (params) => {
  return base.mainRequest("/api/v1/driver/resume/list", params);
};

// 简历日志
export const resumeLog = (params) => {
  return base.mainRequest("/api/v1/driver/resume/log/list", params);
};

// 简历指派
export const resumeAssign = (params) => {
  return base.mainRequest("/api/v1/driver/resume/resumeAssign", params);
};

// 重新分配简历
export const resumeReAssign = (params) => {
  return base.mainRequest("/api/v1/driver/resume/resumeReAssign", params);
};

// 批量指派
export const resumeBatchAssign = (params) => {
  return base.mainRequest("/api/v1/driver/resume/batchResumeAssign", params);
};


// 简历录入或更新
export const saveOrUpdate = (params) => {
  return base.mainRequest("api/v1/driver/resume/saveOrUpdate", params);
};

// 简历详情
export const resumeDetail = (params) => {
  return base.mainRequest("api/v1/driver/resume/queryDriverResumeByUuid", params);
};

// 简历分页列表
export const resumePage = (params) => {
  return base.mainRequest("/api/v1/driver/resume/list", params);
  // return request('/api/v3/system/token/system/searcheNoticePage', params);
};

// 数据中心-简历列表
export const dataResumeList = (params) => {
  return base.mainRequest("/api/v1/driver/resume/reumseList", params);
  // return request('/api/v3/system/token/system/searcheNoticePage', params);
};

// 批量导出
export const batchExport = (params) => {
  return base.mainRequest("api/v1/driver/resume/batchExport", params);
};

// 批量指派
export const batchResumeAssign = (params) => {
  return base.mainRequest("api/v1/driver/resume/batchResumeAssign", params);
};

// 取消指派
export const cancelResumeAssign = (params) => {
  return base.mainRequest("api/v1/driver/resume/cancelResumeAssign", params);
};

// 批量取消指派
export const batchCancelResumeAssign = (params) => {
  return base.mainRequest("api/v1/driver/resume/batchCancelResumeAssign", params);
};

// 简历日志
export const getLog = (params) => {
  return base.mainRequest("api/v1/driver/resume/log/list", params);
};

// 下载简历录入模板
export const getTemplate = () => {
  return base.mainRequest("api/v1/driver/resume/batchImport/tplDownload");
};

// 二次筛选分页
export const secondaryScreeningPage = (params) => {
  return base.mainRequest("/api/v1/driver/resume/secondaryScreeningOfResumeList", params);
};

// 轨迹查询
export const getStatusTrace = (params) => {
  return base.mainRequest("/api/v1/driver/resume/getObjectById", params);
};


// 修改司机运营类型
// export const resumeChangeOperationTypeService = (params) => {
//   return base.mainRequest('/api/v1/driver/resume/changeOperationType', params);
// };

// 切换司机类型
export const resumeChangeOperationTypeService = (params) => {
  return base.mainRequest("/api/v1/driver/resume/switchJointType", params);
};

// 切换司机模式
export const changeResumeType = (params) => {
  return base.mainRequest("/api/v1/driver/resume/changeResumeType", params);
};

// 重点事迹
export const majorTrajectoryService = (params) => {
  return base.mainRequest("/api/v1/driver/majorTrajectory/detailList", params);
};

export const batchImportTrainingInformation = (params) => {
  return base.imageRequest("/api/driver/train/batchImportTrainingInformation", params);
};

export const importExaminate = (params) => {
  return base.imageRequest("/api/v1/driver/examination/importExaminate", params);
};

// 淘汰
export const eliminateDriver = (params) => {
  return base.mainRequest("/api/v1/resumeEliminate/submit", params);
};
// 简历导入
export const resumeImport = (params) => {
  return base.mainRequest("/api/v1/driver/resume/import", params);
};
// 广告渠道
export const queryAllChannel = (params) => {
  return base.mainRequest("/api/v1/driver/channel/queryAllChannel", params);
};
