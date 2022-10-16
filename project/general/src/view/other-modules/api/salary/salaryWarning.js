import base from "./base"

// 薪资预警分页列表
export const salaryWarningRulesList = (params) => {
  return base.salaryRequest("/api/salaryWarning/v1/query/salaryWarningRulesList", params);
};

// 薪酬预警规则名称列表
export const rulesNameList = (params) => {
  return base.salaryRequest("/api/salary/v1/query/rulesNameList", params);
};

// 薪资预警-新增
export const addRules = (params) => {
  return base.salaryRequest("/api/salaryWarning/v1/add/salaryWarningRules", params);
};

// 薪资预警-编辑
export const updateRules = (params) => {
  return base.salaryRequest("/api/salaryWarning/v1/update/salaryWarningRules", params);
};

// 薪资预警-启用/停用
export const disableRules = (params) => {
  return base.salaryRequest("/api/salary/v1/disable/salaryRules", params);
};

// 薪资预警-详情
export const salaryWarningRulesDetail = (params) => {
  return base.salaryRequest("/api/salaryWarning/v1/query/salaryWarningRulesDetail", params);
};
