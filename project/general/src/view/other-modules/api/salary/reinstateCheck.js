import base from "./base"

// 司机复职-复职审核列表
export const getCheckList = (params) => {
  return base.mainRequest("/api/driver/reinstated/reviewList", params);
};

// 批量导出
export const batchExport = (params) => {
  params = base.filterNonsense(params, ["cityCode"])
  params = base.filterEmpty(params)
  return base.exportRequest("/api/driver/reinstated/batchExport", params);
};
// 批量审核通过
export const batchReview = (params) => {
  return base.mainRequest("/api/driver/reinstated/batchReview", params);
};

// 审核通过
export const approveReview = (params) => {
  return base.mainRequest("/api/driver/reinstated/pass", params);
};

// 审核不通过
export const rejectReview = (params) => {
  return base.mainRequest("/api/driver/reinstated/reject", params);
};

// 审核详情
export const getreviewDetail = (params) => {
  return base.mainRequest("/api/driver/reinstated/details", params);
};

// 日志
// export const getLog = (params) => {
//   return base.mainRequest('/api/driver/reinstated/log', params);
// };

