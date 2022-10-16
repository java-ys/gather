import base from "./base"

// 车辆使用使用协议版本-分页查询
export const pageQuery = (params) => {
  return base.mainRequest("/api/v1/driver/contractVersion/pageQuery", params);
};

// 车辆使用使用协议版本-新增
export const add = (params) => {
  return base.mainRequest("/api/v1/driver/contractVersion/add", params);
};

// 车辆使用使用协议版本-编辑
export const edit = (params) => {
  return base.mainRequest("/api/v1/driver/contractVersion/edit", params);
};

// 车辆使用使用协议版本-更新
export const editSigning = (params) => {
  return base.mainRequest("/api/v1/driver/contractVersion/editSigning", params);
};

// 车辆使用使用协议版本-详情
export const queryDetail = (params) => {
  return base.mainRequest("/api/v1/driver/contractVersion/queryDetail", params);
};

