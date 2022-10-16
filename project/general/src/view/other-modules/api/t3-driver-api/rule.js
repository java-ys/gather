import api4driver from "_o/config/api4driver.request";

// 新增排班规则
export const ruleAdd = data => {
  return api4driver.request({
    url: "/api/shift/rule/add",
    data,
    method: "post"
  });
};

// 排班规则列表
export const rulequeryPageList = data => {
  return api4driver.request({
    url: "/api/shift/rule/queryPage",
    data,
    method: "post"
  });
};

// 编辑排班规则
export const ruleEdit = data => {
  return api4driver.request({
    url: "/api/shift/rule/edit",
    data,
    method: "post"
  });
};

// 排班规则详情
export const ruleDetail = data => {
  return api4driver.request({
    url: "/api/shift/rule/detail",
    data,
    method: "post"
  });
};

// 排班日志
export const queryLog = data => {
  return api4driver.request({
    url: "/api/shift/rule/queryLog",
    data,
    method: "post"
  });
};
