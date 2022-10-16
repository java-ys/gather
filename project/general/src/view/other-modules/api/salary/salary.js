import base from "./base"

// 重构-薪资规则分页列表
export const salaryRulePage = (params) => {
  return base.salaryRequest("/api/salary/v1/query/salaryRulesList", params);
};

// 重构-新增薪资规则
export const addSalaryRule = (params) => {
  return base.salaryRequest("/api/salary/v1/add/salaryRules", params);
};

// 重构-编辑薪资规则
export const editSalaryRule = (params) => {
  return base.salaryRequest("/api/salary/v1/update/salaryRules", params);
};

// 重构-薪资规则详情
export const salaryRuleDetail = (params) => {
  return base.salaryRequest("/api/salary/v1/query/salaryRulesDetail", params);
};

// 重构-薪资规则停用
export const disableSalaryRules = (params) => {
  return base.salaryRequest("/api/salary/v1/disable/salaryRules", params);
};

// 新增活动绩效规则
export const addActivitySalaryRule = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/addActivitySalaryRule", params);
};

// 编辑活动绩效规则
export const editActivitySalaryRule = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/editActivitySalaryRule", params);
};

// 薪资规则启用停用
export const changeRuleStatus = (params) => {
  return base.mainRequest("/api/v1/salaryRule/edit", params);
};

// 活动绩效规则启用停用
export const updateActivityStatus = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/updateStatus", params);
};

// 奖励规则详情
export const getObjectById = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/getObjectById", params);
};

// 月工资查询老
export const getDriverMonthlyWages = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/getDriverMonthlyWages", params);
};

// 月工资查询新
export const getNewDriverMonthlyWages = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/queryDriverMonthlyWages", params);
};

// 月工资提交审核
export const monthbatchRuleSubmit = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchSubmitForMonth", params);
};

// 月工资审核
export const monthBatchReviewSubmit = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchReviewForMonth", params);
};

// 月工资取消审核
export const monthCancelReview = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchCancelForMonth", params);
};

// 月工资撤销审核
export const monthbatchRedo = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchRedoForMonth", params);
};


// 月工资手机APP 展现
export const monthSetAppShow = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/setAppShowForMonth", params);
};

// 月奖励列表统计
export const monthTotal = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/totalForMonth", params);
};


// 周奖励查询
export const getDriverWeeklyBonus = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/getDriverWeeklyBonus", params);
};

// 周奖励提交审核
export const batchRuleSubmit = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchSubmit", params);
};

// 周奖励审核
export const batchReviewSubmit = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchReview", params);
};

// 周奖励取消审核
export const cancelReview = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchCancel", params);
};

// 周奖励撤销审核
export const batchRedo = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/batchRedo", params);
};



// 周奖励列表统计
export const weekTotal = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/total", params);
};



// 周奖励手工奖励/扣款查询
export const queryDeductMoney = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/queryDeductMoney", params);
};

// 周奖励手工奖励/扣款新增
export const deductMoney = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/deductMoney", params);
};


// 周奖励手APP 展现
export const setAppShow = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/setAppShow", params);
};



// 活动绩效规则提交审核
export const commitReview = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/commitReview", params);
};

// 活动绩效规则取消审核
export const unAuditStatus = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/unAuditStatus", params);
};

// 活动绩效规则审核操作
export const updateAuditStatus = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/updateAuditStatus", params);
};

// 运营商电子围栏列表
export const queryElectronicFenceInfo = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/queryElectronicFenceInfo", params);
};

// 充电桩补贴规则分页列表
export const chargeSubsidyPage = (params) => {
  return base.mainRequest("/api/driver/salaryChargeSubsidy/queryPage", params);
};

// 充电桩补贴规则新增/修改/启用/禁用
export const chargeSubsidySaveOrUpdate = (params) => {
  return base.mainRequest("/api/driver/salaryChargeSubsidy/saveOrUpdate", params);
};

// 充电桩补贴规则详情
export const chargeSubsidyDetail = (params) => {
  return base.mainRequest("/api/driver/salaryChargeSubsidy/detail", params);
};

// 充电桩补贴页-获取车型
export const getCarType = (params) => {
  return base.mainRequest("/api/driver/salaryChargeSubsidy/getCarType", params);
};

// 能源账户补贴-获取车型
export const getCarTypePage = (params) => {
  return base.mainRequest("/api/driver/salaryChargeSubsidy/carTypePage", params);
};

// 能源补贴查询-分页列表
export const getSubsidyList = (params) => {
  return base.mainRequest("/api/driver/chargeSubsidy/pageList", params);
};

// 基本工资规则-根据月份获取时长数据
export const getHoursByMonths = (params) => {
  return base.mainRequest("/api/v1/salaryRule/dayMonthDuration", params);
};

// 基本工资规则-根据月份获取时长数据
export const getDriverExamineList = (params) => {
  return base.mainRequest("/api/v1/salaryRule/dayMonthDuration", params);
};

// 基本工资规则-根据月份获取时长数据
export const queryAttendanceRules = (params) => {
  return base.salaryRequest("/api/attendance/v1/queryAttendanceRules", params);
};

// 查询周薪酬计算预警
export const getWeekSalaryWarning = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/getWeekSalaryWarning", params);
};

// 查询月薪酬计算预警
export const getMonthSalaryWarning = (params) => {
  return base.mainRequest("/api/v1/driver/performancerule/getMonthSalaryWarning", params);
};

// 基本工资试算
export const getLastMonthAverageSalary = (params) => {
  return base.mainRequest("/api/v1/salaryRule/getLastMonthAverageSalary", params);
};

// 流水排名试算
export const getContinualRankingList = (params) => {
  return base.mainRequest("/api/v1/salaryRule/getContinualRankingList", params);
};

// 阶梯绩效最大值试算
export const getMaxLadderAchievements = (params) => {
  return base.mainRequest("/api/v1/salaryRule/getMaxLadderAchievements", params);
};

// 阶梯绩效试算
export const getLadderAchievements = (params) => {
  return base.mainRequest("/api/v1/salaryRule/getLadderAchievements", params);
};

export const salaryUploadData = (params) => {
  return base.salaryRequest("/api/salary/v1/driverSalary/uploadExcel", params);
};

export const excelUploadData = (params) => {
  return base.salaryRequest("/api/salary/v1/excel/uploadData", params);
};

// 周收入查询批次号
export const queryFlow = (params) => {
  return base.salaryRequest("/api/salary/v1/driverSalary/queryFlow", params);
};

// 校验结算是否完成
export const isVehicleRentInCalculating = (params) => {
  return base.salaryRequest("/api/salary/v1/weekAward/isVehicleRentInCalculating", params);
};

// A模式周收入合计统计
export const queryWeekStatisticalAward = (params) => {
  return base.salaryRequest("/api/salary/v1/weekAward/queryWeekStatisticalAward", params);
};

// 月工资收入合计统计
export const queryMonthStatisticalSalary = (params) => {
  return base.salaryRequest("/api/salary/v1/monthSalary/queryMonthStatisticalSalary", params);
};
