import base from "./base"

// 司机奖励发放/取消
export const batchRewardOrCancel = (params) => {
  return base.mainRequest("/api/driver/recommend/batchRewardOrCancel", params);
};

// 司机奖励发放列表查询
export const recommendRecord = (params) => {
  return base.mainRequest("/api/driver/recommend/recommendRecord", params);
};

// 司机奖励发查看详情
export const recommendDetails = (params) => {
  return base.mainRequest("/api/driver/recommend/recommendDetails", params);
};

// 司机奖励发放查看操作日志
export const operateLog = (params) => {
  return base.mainRequest("/api/driver/recommend/operateLog", params);
};

export const recommendImport = (params) => {
  return base.mainRequest("/api/driver/recommend/import", params);
};
