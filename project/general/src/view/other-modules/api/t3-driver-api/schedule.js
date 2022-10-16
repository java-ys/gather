import api4driver from "_o/config/api4driver.request";

// 排班列表
export const dutyList = data => {
  return api4driver.request({
    url: "/api/shift/calendar/queryDutyList",
    data,
    method: "post"
  });
};

// 单班排班详情
export const dutySingularDetail = data => {
  return api4driver.request({
    url: "/api/shift/calendar/queryDutySingularDetail",
    data,
    method: "post"
  });
};

// 双班排班详情
export const dutyDualDetail = data => {
  return api4driver.request({
    url: "/api/shift/calendar/queryDutyDualDetail",
    data,
    method: "post"
  });
};

// 查询单班、双班的排班列表（下拉框）
export const shiftRuleService = data => {
  return api4driver.request({
    url: "/api/shift/calendar/queryShiftRulePage",
    data,
    method: "post"
  });
};
