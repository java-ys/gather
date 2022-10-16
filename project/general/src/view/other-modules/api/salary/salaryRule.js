/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-28 15:21:08
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-23 10:48:43
 */

import base from "./base";

// 上传审批附件
export const uploadFile = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/uploadAttachment", params);
};

// 删除附件
export const deleteFile = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/deleteFile", params);
};

// 获取附件列表
export const getFileList = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/getFileList", params);
};

// 获取下载文件URL
export const getFileUrl = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/getFileUrl", params);
};

// 删除文件
export const cancelUpload = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/cancelUpload", params);
};

// 薪酬规则列表
export const salaryRulesList = params => {
  return base.salaryRequest("/api/salary/v1/query/salaryRulesList", params);
};

// 基本流水抽成规则详情
export const stepPerformanceDetail = params => {
  return base.salaryRequest(
    "/api/ladder/performance/v1/query/salaryRulesDetail",
    params
  );
};

// 基本流水抽成规则新增
export const addStepPerformance = params => {
  return base.salaryRequest(
    "/api/ladder/performance/v1/add/salaryRules",
    params
  );
};

// 基本流水抽成规则编辑
export const updateStepPerformance = params => {
  return base.salaryRequest(
    "/api/ladder/performance/v1/update/salaryRules",
    params
  );
};

// 基本流水抽成规则删除
export const deleteStepPerformance = params => {
  return base.salaryRequest(
    "/api/salary/v1/delete/salaryRule",
    params
  );
};

// 奖励规则详情
export const activityPerformanceDetail = params => {
  return base.salaryRequest(
    "/api/activity/performance/v1/query/salaryRulesDetail",
    params
  );
};

// 活动绩效规则新增
export const addActivityPerformance = params => {
  return base.salaryRequest(
    "/api/activity/performance/v1/add/activity/performanceRules",
    params
  );
};

// 活动绩效规则编辑
export const updateActivityPerformance = params => {
  return base.salaryRequest(
    "/api/activity/performance/v1/update/activity/performanceRules",
    params
  );
};

// 周奖励查询
export const queryWeekAwardList = params => {
  return base.salaryRequest("/api/salary/v1/weekAward/pageQuery", params);
};

// 周奖励导出
export const exportWeekAwardList = params => {
  return base.salaryExportRequest("/api/salary/v1/weekAward/export", params);
};

// 周奖励编辑
export const editWeekAward = params => {
  return base.salaryRequest("/api/salary/v1/weekAward/update", params);
};

// 月奖励编辑
export const editMonthAward = params => {
  return base.salaryRequest("/api/salary/v1/monthSalary/update", params);
};

// 月工资查询
export const queryMonthSalaryList = params => {
  return base.salaryRequest("/api/salary/v1/monthSalary/pageQuery", params);
};

// 月工资导出
export const exportMonthSalaryList = params => {
  return base.salaryExportRequest("/api/salary/v1/monthSalary/export", params);
};

// 下一轮计薪
export const nextCalculateSalary = params => {
  return base.salaryRequest(
    "/api/salary/v1/monthSalary/nextCalculateSalary",
    params
  );
};

// 日工资查询
export const queryDailySalaryList = params => {
  return base.salaryRequest(
    "/api/salary/v1/AdsDriSalDetailDs/queryPage",
    params
  );
};

// 日工资导出
export const exportDailySalaryList = params => {
  return base.salaryExportRequest(
    "/api/salary/v1/AdsDriSalDetailDs/export",
    params
  );
};

// 线下奖励/周奖励
export const queryWeekOfflineRewards = params => {
  return base.salaryRequest(
    "/api/salary/v1/OfflineRewards/queryPageWeek",
    params
  );
};

// 线下奖励/周奖励导出
export const exportWeekOfflineRewards = params => {
  return base.salaryExportRequest(
    "/api/salary/v1/OfflineRewards/exportWeek",
    params
  );
};

// 线下奖励/月奖励
export const queryMonthOfflineRewards = params => {
  return base.salaryRequest(
    "/api/salary/v1/OfflineRewards/queryPageMonth",
    params
  );
};

// 线下奖励/月奖励导出
export const exportMonthOfflineRewards = params => {
  return base.salaryExportRequest(
    "/api/salary/v1/OfflineRewards/exportMonth",
    params
  );
};

// 薪资奖励/列表查询
export const queryOfflineRewards = params => {
  return base.salaryRequest(
    "/api/salary/v1/SalaryBatchInfoInfo/salaryAndAwardQueryPage",
    params
  );
};

// 薪资奖励/删除
export const deleteOfflineRewards = params => {
  return base.salaryRequest(
    "/api/salary/v1/SalaryBatchInfoInfo/delete/salaryInfo",
    params
  );
};

// 薪资奖励/列表导出
export const exportOfflineRewards = params => {
  return base.salaryExportRequest(
    "/api/salary/v1/SalaryBatchInfoInfo/salaryAndAwardExport",
    params
  );
};

// 个税导入-获取上传数据
export const queryUploadData = params => {
  return base.salaryRequest(
    "/api/salary/v1/IncomeTax/query/uploadCacheData",
    params
  );
};

// 个税导入-导出上传失败数据
export const queryFailedUploadData = params => {
  return base.salaryExportRequest("/api/salary/v1/IncomeTax/export", params);
};

// 个税导入-上传数据
export const handleUpload = params => {
  return base.salaryRequest("/api/salary/v1/IncomeTax/importData", params);
};

// 线下奖励/扣款-获取上传数据
export const queryOfflineUploadData = params => {
  return base.salaryRequest(
    "/api/salary/v1/offlineRewards/query/UploadCacheData",
    params
  );
};

// 线下奖励/扣款-导出上传失败数据
export const queryOfflineFailedUploadData = params => {
  return base.salaryExportRequest(
    "/api/salary/v1/offlineRewards/downloadErrorMessage",
    params
  );
};

// 线下奖励/扣款-删除
export const delNotExists = params => {
  return base.salaryRequest(
    "/api/salary/v1/driverSalary/cacheData/delNotExists",
    params
  );
};

// 线下奖励/扣款-确认导入不存在的司机
export const confirmNotExists = params => {
  return base.salaryRequest(
    "/api/salary/v1/driverSalary/import/confirmNotExists",
    params
  );
};

// 车辆租金导入-获取上传缓存数据
export const UploadCacheData = params => {
  return base.salaryRequest(
    "/api/salary/v1/excel/query/UploadCacheData",
    params
  );
};

// 车辆租金导入-导入数据
export const importData = params => {
  return base.salaryRequest("/api/salary/v1/excel/importData", params);
};

// 车辆租金导入-下载错误信息
export const downloadErrorMessage = params => {
  return base.salaryExportRequest("/api/salary/v1/excel/downloadErrorMessage", params);
};

// 车辆租金导入-上传数据
export const uploadData = params => {
  return base.salaryRequest("/api/salary/v1/excel/uploadData", params);
};

// 线下奖励/扣款-上传数据
export const handleOfflineUpload = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/importData", params);
};

// 线下奖励/扣款-周/月详情
export const queryOfflineRewardsDetail = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/queryPage", params);
};

// 获取周/月按钮权限
export const querySalaryBtnStatus = params => {
  return base.salaryRequest("/api/salary/v1/SalaryBatchInfoInfo/query/salaryInfo", params);
};

// 手工补发/补扣新增或编辑
export const addOrEditSalaryModify = params => {
  return base.salaryRequest("/api/salary/v1/repair/addOrEdit", params);
};

// 手工补发/补扣删除
export const deleteSalaryModify = params => {
  return base.salaryRequest("/api/salary/v1/repair/delete", params);
};

// 手工补发/补扣详情
export const salaryModifyDetail = params => {
  return base.salaryRequest("/api/salary/v1/repair/detail", params);
};

// 月工资显示app
export const appDisplayMonth = params => {
  return base.salaryRequest("/api/salary/v1/monthSalary/appDisplay", params);
};

// 周奖励显示app
export const appDisplayWeek = params => {
  return base.salaryRequest("/api/salary/v1/weekAward/appDisplay", params);
};

// 确认导入数据
export const handleUploadConfirm = params => {
  return base.salaryRequest("/api/salary/v1/driverSalary/import/confirm", params);
};