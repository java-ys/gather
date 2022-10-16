import base from "./base"

// 体检报告信息分页列表
export const pageList = (params) => {
  return base.mainRequest("/api/v1/driver/examination/pageList", params);
};

// 批量通过/不通过
export const batchPass = (params) => {
  return base.mainRequest("/api/v1/driver/examination/batchPass", params);
};

// 单个通过/不通过
export const examinateOper = (params) => {
  return base.mainRequest("/api/v1/driver/examination/examinateOper", params);
};

// 体检报告详情
export const examinateDetail = (params) => {
  return base.mainRequest("/api/v1/driver/examination/examinateDetail", params);
};

// 体检报告详情(新)
export const getExaminateDetail = (params) => {
  return base.mainRequest("/api/v1/driver/examination/driverExamineDetail", params);
};
