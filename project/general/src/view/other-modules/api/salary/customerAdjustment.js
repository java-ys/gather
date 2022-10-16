import base from "./base"

// 客服调价订单-分页列表
export const pageQuery = (params) => {
  return base.salaryRequest("/api/salary/v1/adsDriSalAdjustDetailDt/pageQuery", params);
};

// 客服调价订单-编辑
export const updateOrder = (params) => {
  return base.salaryRequest("/api/salary/v1/adsDriSalAdjustDetailDt/update/driver/order", params);
};
