import base from "_o/api/salary/base";

// 获取已开通城市
export const cityListService = params => base.mainRequest("/api/v1/driver/distributionRule/cityList", params);

// 已开通运营商
export const agentListService = params => base.mainRequest(
  "/api/v1/driver/distributionRule/agentListByCityUuid",
  params,
);

// 列表
export const listService = params => base.salaryRequest("/api/wallet/v1/driverWallet/pageQuery", params);

/** 更新账户状态 */
export const updateAccountStatus = params => base.salaryRequest(
  "/api/wallet/v1/driverWallet/updateDriverAccountStatus",
  params,
);

// 冻结
export const frozenService = params => base.salaryRequest("/api/wallet/v1/driverWallet/freezeAcctBalance", params);

// 解冻
export const thawService = params => base.salaryRequest("/api/wallet/v1/driverWallet/freezeAcctBalance", params);

// 提现
export const withdrawalService = params => base.salaryRequest("/api/wallet/v1/driverWallet/withdrawBalance", params);

// 入账记录
export const entryRecordService = params => base.salaryRequest(
  "/api/wallet/v1/driverWallet/incomeRecordPageQuery",
  params,
);

// 提现记录
export const withdrawalRecordService = params => base.salaryRequest(
  "/api/wallet/v1/driverWallet/withdrawRecordPageQuery",
  params,
);

// 日志
export const logsService = params => base.salaryRequest("/api/common/v1/query/operationLogInfo", params);

// 导出
export const exportService = params => base.salaryExportRequest(
  "/api/wallet/v1/driverWallet/driverAcctInfoExport",
  params,
);

// 修改银行账户
export const updateBindCardInfo = params => base.salaryRequest(
  "/api/wallet/v1/driverWallet/updateBindCardInfo",
  params,
);

// 查询银行账户信息
export const getBankCardInfo = params => base.salaryRequest("/api/wallet/v1/driverWallet/getBankCardInfo", params);

// 入账记录/提现记录
export const accountBookFlows = params => base.salaryRequest(
  "/api/wallet/v1/driverWallet/accountBookFlows",
  params,
);
