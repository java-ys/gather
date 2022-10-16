import base from "./base";

// 个税比例-列表
export const listService = params => {
  return base.salaryRequest("/api/salary/v1/taxRatioCfg/queryPage", params);
};

// 个税比例-新增
export const addService = params => {
  return base.salaryRequest("/api/salary/v1/taxRatioCfg/add", params);
};

// 个税比例-编辑
export const editService = params => {
  return base.salaryRequest("/api/salary/v1/taxRatioCfg/edit", params);
};

// 个税比例-启用停用
export const operateService = params => {
  return base.salaryRequest("/api/salary/v1/taxRatioCfg/operate", params);
};

// 个税比例-导出
export const exportService = params => {
  return base.salaryExportRequest("/api/salary/v1/taxRatioCfg/export", params);
};
