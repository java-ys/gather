import base from "./base"

// 异常订单管理列表查询
export const getAbnormalOrderList = (params) => {
  return base.salaryRequest("/api/salary/v1/AdsDriSalExcepDetail/pageQuery", params);
};

// 异常订单管理-正常发放/暂停发放
export const normalGrant = (params) => {
  return base.salaryRequest("/api/salary/v1/AdsDriSalExcepDetail/operating", params);
};
