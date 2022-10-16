import base from "./base"
// 咨询管理列表
export const getPageQuery = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/pageQuery", params);
};

// 新增
export const addAdvisoryAdd = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/add", params);
};

// 新增
export const addAdvisoryEdit = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/edit", params);
};

// 查询
export const queryAdvisory = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/queryById", params);
};

// 停用
export const stopAdvisory = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/deActive", params);
};

// 启用
export const startAdvisory = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/active", params);
};

// 日志
export const getLog = (params) => {
  return base.mainRequest("/api/v1/driver/agentConsultInfo/queryLog", params);
};

// 批量导出
export const exportExcel = (params) => {
  return base.exportRequest("/api/v1/driver/agentConsultInfo/export", params);
};
