import base from "./base"

// 风控订单分页列表
export const pageQuery = (params) => {
  return base.salaryRequest("/api/salary/v1/riskControl/pageQuery", params);
};

// 风控订单审核
export const audit = (params) => {
  return base.salaryRequest("/api/salary/v1/riskControl/audit", params);
};
