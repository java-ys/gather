import base from "./base";

// 简历导出
export const batchExport = params => {
  return base.exportRequest("/api/v1/driver/resume/batchExport", params);
};

// 二维码导出
export const batchExportQrCode = params => {
  return base.exportRequest("/api/driverResumeQrcode/exportQrcodeInfo", params);
};

// 简历背调导出
export const exportResumeRc = params => {
  params = base.filterEmpty(params);
  return base.exportRequest("/api/driver/resumeRc/exportResumeRc", params);
};

// 数据中心-简历查询导出
export const exportResumeRcCnt = params => {
  return base.exportRequest("/api/driver/resumeRc/exportResumeRcCnt", params);
};

// 意向司机跟进导出
export const exportDriverFollowUp = params => {
  params = base.filterNonsense(params, ["cityNo", "agentUuid", "followStatus"])
  params = base.filterEmpty(params)
  return base.exportRequest("/api/driver/follow/followExport", params);
};

// 司机信息导出
export const exportDriverInfo = params => {
  params = base.filterEmpty(params)
  return base.exportRequest("/api/v1/driver/info/exportDriverInfo", params);
};

// 月工资导出
export const getDriverMonthlyWagesExcel = params => {
  return base.exportRequest(
    "/api/v1/driver/performancerule/queryDriverMonthlyWagesExcel",
    params
  );
};

// 周奖励导出
export const getDriverWeeklyBonusExcel = params => {
  return base.exportRequest(
    "/api/v1/driver/performancerule/getDriverWeeklyBonusExcel",
    params
  );
};

// 面试信息导出 (面试管理-维护面试信息)
export const exportInterview = params => {
  params = base.filterNonsense(params, ["cityNo", "assignAgentUuid", "status", "isEvaluated", "evaluatedStatus", "resumeOperationType"])
  return base.exportRequest("/api/driver/interview/exportInterview", params);
};

// 测评修改记录导出 (面试管理-维护面试信息)
export const exportEvaluationLog = params => {
  params = base.filterNonsense(params, ["cityNo", "assignAgentUuid", "status", "isEvaluated", "evaluatedStatus", "resumeOperationType"])
  return base.exportRequest(
    "/api/driver/interview/exportEvaluationLog",
    params
  );
};

// 培训信息导出
export const exportDriverTrain = params => {
  return base.exportRequest("/api/driver/train/exportDriverTrain", params);
};

// 充电桩补贴导出
export const chargeSubsidyExpro = params => {
  return base.exportRequest(
    "/api/driver/salaryChargeSubsidy/getSalaryChargeSubsidyExpro",
    params
  );
};

// 二次筛选导出
export const secondaryScreeningExport = params => {
  return base.exportRequest(
    "/api/v1/driver/resume/secondaryScreeningExport",
    params
  );
};

// 能源补贴查询-批量导出
export const subsidyExport = params => {
  return base.exportRequest("/api/driver/chargeSubsidy/export", params);
};

// 履约金批量导出
export const bondManageExport = params => {
  params = base.filterNonsense(params, ["cityUuid", "assignAgentUuid", "refundStatus"])
  params = base.filterEmpty(params)
  return base.exportRequest("/api/driver/performanceBond/export", params);
};

// 司机奖励批量导出
export const rewardExport = params => {
  return base.exportRequest("/api/driver/recommend/export", params);
};

// 背调审核批量导出
export const verifyExport = params => {
  params = base.filterNonsense(params, ["cityUuid", "organization", "isQualified"])
  params = base.filterEmpty(params)
  return base.exportRequest("/api/driver/resumeRc/verifyExport", params);
};

// 周计算预警导出
export const downLoadWeekSalaryWarning = params => {
  return base.exportRequest(
    "/api/v1/driver/performancerule/downLoadWeekSalaryWarning",
    params
  );
};

// 月计算预警导出
export const downLoadMonthSalaryWarning = params => {
  return base.exportRequest(
    "/api/v1/driver/performancerule/downLoadMonthSalaryWarning",
    params
  );
};

// 客服调价订单导出
export const downLoadAdsDriSalAdjustDetailDt = params => {
  params = base.filterNonsense(params, ["cityCode"])
  params = base.filterEmpty(params)
  return base.salaryExportRequest(
    "/api/salary/v1/adsDriSalAdjustDetailDt/update/driver/export",
    params
  );
};

// 薪酬个税审核-周奖励审核/周个税审核导出
export const weekRewardExport = params => {
  return base.salaryExportRequest("/api/salary/v1/salaryFlow/export", params);
};

// 薪酬个税审核-月工资审核/月个税/社保审核导出
export const monthSalaryExport = params => {
  return base.salaryExportRequest("/api/salary/v1/SalaryBatchInfoInfo/salaryAndAwardExport", params);
};

// 异常订单导出
export const AdsDriSalExcep = params => {
  params = base.filterNonsense(params, ["cityCode", "agentUuid"])
  params = base.filterEmpty(params)
  return base.salaryExportRequest(
    "/api/salary/v1/AdsDriSalExcepDetail/export",
    params
  );
};
// 风控订单导出
export const riskExport = (params) => {
  return base.riskExportRequest("/api/salary/v1/riskControl/export", params);
};

// 主备司机导出
export const exportRecord = (params) => {
  params = base.filterNonsense(params, ["cityCode", "agentUuid"])
  return base.exportRequest("/api/deputy/driver/exportRecord", params);
}
