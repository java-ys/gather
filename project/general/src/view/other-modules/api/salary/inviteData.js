import base from "./base";

// 邀约数据列表
export const inviteDataList = params => {
  return base.mainRequest("/api/invitation/follow/data/list", params);
};

// 邀约数据列表导出
export const inviteDataExport = params => {
  return base.exportRequest("/api/invitation/follow/data/export", params);
}
