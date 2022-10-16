import base from "./base";

// 薪酬审核管理-queryType:1周收入应发审核 2:周收入实发审核 3:月工资应发审核 4:月工资实发审核
export const getWeekRewardReviewList = (params) => {
  return base.salaryRequest("/api/salary/v1/salaryFlow/pageQuery", params);
};

// 薪酬个税审核-月工资审核/月个税/社保审核分页
export const getMonthSalaryReviewList = (params) => {
  return base.salaryRequest("/api/salary/v1/SalaryBatchInfoInfo/salaryAndAwardQueryPage", params);
};

// 审核
export const audit = (params) => {
  return base.salaryRequest("/api/salary/v1/salaryFlow/audit", params);
};
