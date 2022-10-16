import base from "./base"

// 缴纳履约金列表查询
export const pageList = (params) => {
  return base.mainRequest("/api/driver/performanceBond/pageList", params);
};

// 新增履约金
export const addDeposit = (params) => {
  return base.mainRequest("/api/driver/performanceBond/addDeposit", params);
};

// 是否启用缴纳履约金
export const changeRuleStatus = (params) => {
  return base.mainRequest("/api/driver/performanceBond/changeStatus", params);
};

// 删除当前保证金记录
export const deleteDeposit = (params) => {
  return base.mainRequest("/api/driver/performanceBond/deleteDeposit", params);
};

// 根据简历uuid查询当前记录的日志
export const getAmountByResumeUuid = (params) => {
  return base.mainRequest("/api/driver/performanceBond/getAmountByResumeUuid", params);
};

// 维护履约金列表查询
export const maintainPage = (params) => {
  params = base.filterNonsense(params, ["cityUuid", "assignAgentUuid", "refundStatus"])
  return base.mainRequest("/api/driver/performanceBond/maintainPage", params);
};

// 授权/取消维护履约金
export const batchAuthorizationOrOpposite = (params) => {
  return base.mainRequest("/api/driver/performanceBond/batchAuthorizationOrOpposite", params);
};
// 查询履约金日志
export const getLogList = (params) => {
  return base.mainRequest("/api/v1/driver/resume/log/list", params);
};
// 获取手机号码
export const queryUserPhone = (params) => {
  return base.mainRequest("/api/driver/system/queryUserPhone", params);
};
// 维护履约金详情
export const getDetail = (params) => {
  return base.mainRequest("/api/driver/performanceBond/queryDepositPaymentRecords", params);
};
// 入职终止
export const setEntryStop = (params) => {
  return base.mainRequest("/api/driver/performanceBond/entryTermination", params);
};

// 再次退保证金
export const refundAgain = (params) => {
  return base.mainRequest("/api/driver/performanceBond/refundAgain", params);
};

// 申请退保证金
export const applicationRefund = (params) => {
  return base.mainRequest("/api/driver/performanceBond/applicationRefund", params);
};

// 退保证金相关银行卡信息
export const bankCardInfo = (params) => {
  return base.mainRequest("/api/driver/performanceBond/bankCardInfo", params);
};

export const performanceBondImport = (params) => {
  return base.mainRequest("/api/driver/performanceBond/batchImport", params);
};
