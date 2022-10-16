import base from "./base"

// 司机复职-复职审核列表
export const getRuleList = (params) => {
  return base.mainRequest("/api/v1/driver/driverResumeRule/list", params);
};

// 新增复职规则
export const addRule = (params) => {
  return base.mainRequest("/api/v1/driver/driverResumeRule/add", params);
};
// 编辑复职规则
export const editRule = (params) => {
  return base.mainRequest("/api/v1/driver/driverResumeRule/edit", params);
};

// 复职规则详情
export const getRuleDetail = (params) => {
  return base.mainRequest("/api/v1/driver/driverResumeRule/detail", params);
};


// 线索回流列表
export const getConfigList = (params) => {
  return base.mainRequest("/api/v1/driver/config/queryPage", params);
};

// 新增线索回流信息
export const getConfigAdd = (params) => {
  return base.mainRequest("/api/v1/driver/config/add", params);
};


// 编辑线索回流信息
export const getConfigEdit = (params) => {
  return base.mainRequest("/api/v1/driver/config/edit", params);
};

// 线索回流信息详情
export const getConfigInfo = (params) => {
  return base.mainRequest("/api/v1/driver/config/getObjectById", params);
};

// 线索回流信息日志
export const getConfigLogs = (params) => {
  return base.mainRequest("/api/v1/driver/config/queryLog", params);
};
