import base from "./base";

// 获取所有司机类型
export const getAllDriverType = (params = {}) => {
  return base.mainRequest("/api/common/service/getAllDriverUnionType", params);
};
