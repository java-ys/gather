import base from "./base"

// 司机招聘-司机意向跟进-详情分页
export const getDriverFollowList = (params) => {
  return base.mainRequest("/api/driver/follow/pageList", params);
};

// 司机招聘-司机意向跟进-跟进
export const driverFollowUp = (params) => {
  return base.mainRequest("/api/driver/follow/saveIntendFollow", params);
};

// 司机招聘-司机意向跟进-详情
export const getDetails = (params) => {
  return base.mainRequest("/api/driver/follow/followDetailList", params);
};

// 司机招聘-司机意向跟进-日志
export const getLog = (params) => {
  return base.mainRequest("/api/driver/follow/logList", params);
};
