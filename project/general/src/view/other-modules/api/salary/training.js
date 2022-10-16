import base from "./base"

// 培训
export const expoetTrainingInformation = (params) => {
  return base.exportRequest("/api/driver/train/expoetTrainingInformation", params);
};

// 培训分页列表
export const pageList = (params) => {
  return base.mainRequest("/api/driver/train/pageList", params);
};

// 新增培训信息
export const addDriverTrain = (params) => {
  return base.mainRequest("/api/driver/train/addDriverTrain", params);
};

// 编辑培训信息
export const editDriverTrain = (params) => {
  return base.mainRequest("/api/driver/train/editDriverTrain", params);
};

// 培训信息详情
export const queryDriverTrainDetail = (params) => {
  return base.mainRequest("/api/driver/train/queryDriverTrainDetail", params);
};

// 新增或修改课程
export const addOrUpdateCourse = (params) => {
  return base.mainRequest("/api/driver/train/addOrUpdateCourse", params);
};

// 培训课程分页列表
export const coursePage = (params) => {
  return base.mainRequest("api/driver/train/coursePageList", params);
};

// 培训通过确认接口
export const inductionTrainingPass = (params) => {
  return base.mainRequest("api/driver/train/inductionTrainingPass", params);
};

// 培训信息详情
export const getTrainDetail = (params) => {
  return base.mainRequest("/api/driver/train/trainDetail", params);
};


// 根据组织用户名工号查询用户列表
export const getUpUser = (params) => {
  return base.mainRequest("/api/v1/driver/up/queryUser", params);
};

// up 类型司机确认入职审核申请
export const trainEntryAuditCommitService = (params) => {
  return base.mainRequest("/api/driver/train/entryAuditCommit", params);
};

// up 类型司机批量确认入职审核申请
export const trainBatchEntryAuditCommitService = (params) => {
  return base.mainRequest("/api/driver/train/batchEntryAuditCommit", params);
};

// 查询历史审核人
export const trainQueryHistoryAuditOperatorService = (params) => {
  return base.mainRequest("/api/driver/train/queryHistoryAuditOperator", params);
};

// 查询审核人
export const trainQueryAuditOperatorService = (params) => {
  return base.mainRequest("/api/driver/train/queryAuditOperator", params);
};
