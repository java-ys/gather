import base from "./base";

// up 司机入职审核列表
export const upQueryPageService = params => {
  return base.mainRequest("/api/v1/driver/up/queryPage", params);
};

// 审核详情
export const upDetailService = params => {
  return base.mainRequest("/api/v1/driver/up/detail", params);
};

// 提交审核
export const upSubmitService = params => {
  return base.mainRequest("/api/v1/driver/up/submit", params);
};

// up 司机审核
export const upAuditService = params => {
  return base.mainRequest("/api/v1/driver/up/audit", params);
};

// 获取up司机确认入职 已审核人列表
export const upFindUsersService = params => {
  return base.mainRequest("/api/v1/driver/up/findUsers", params);
};
