import axios from "_o/config/api4Operation.request"
import axiosCom from "_g/config/api.request";
// import axiosDc from "_g/config/apiDc.request"

// 司机分群派单优先级策略
export const queryStrategyList = (data) => {
  return axios.request({
    url: "/admin/driverGroupDispatch/queryStrategyList",
    data,
    method: "post"
  })
}

// 删除 司机分群派单优先级策略
export const deleteStrategy = (data) => {
  return axios.request({
    url: "/admin/driverGroupDispatch/deleteStrategy",
    data,
    method: "post"
  })
}

// 司机分群派单优先级策略详情
export const queryStrategyDetailById = (data) => {
  return axios.request({
    url: "/admin/driverGroupDispatch/queryStrategyDetailById",
    data,
    method: "post"
  })
}

// 新增 司机分群派单优先级策略
export const createStrategy = (params) => {
  return axios.request({
    url: "/admin/driverGroupDispatch/createStrategy",
    method: "post",
    data: params
  })
}

// 编辑 司机分群派单优先级策略
export const editStrategy = (params) => {
  return axios.request({
    url: "/admin/driverGroupDispatch/editStrategy",
    method: "post",
    data: params
  })
}

// 查询司机分组列表
export const queryCrowdList = (params) => {
  return axios.request({
    url: "/admin/driverGroupDispatch/queryCrowdList",
    method: "post",
    data: params
  })
}

/** 车辆打标列表 */
export const vehicleMarkingList = (data) => {
  return axios.request({
    url: "/admin/vehicle/list",
    data,
    method: "POST"
  });
}

/** 车辆打标取消 */
export const vehicleMarkingCancel = (data) => {
  return axios.request({
    url: "/admin/vehicle/cancel",
    data,
    method: "POST"
  });
}


// 司机绝对优先级派单优先级策略 -- 新增
export const createAbsStrategy = (data) => {
  return axios.request({
    url: "/admin/vehicleStrategy/create",
    data,
    method: "post"
  })
}

// 司机绝对优先级派单优先级策略 -- 分页查询
export const queryAbsStrategyList = (data) => {
  return axios.request({
    url: "/admin/vehicleStrategy/queryStrategyPage",
    data,
    method: "post"
  })
}
// 司机绝对优先级派单优先级策略 -- 删除
export const deleteAbsStrategyList = (data) => {
  return axios.request({
    url: "/admin/vehicleStrategy/delete",
    data,
    method: "post"
  })
}

// 司机绝对优先级派单优先级策略 -- 详情
export const getAbsDetail = (data) => {
  return axios.request({
    url: "/admin/vehicleStrategy/getDetail",
    data,
    method: "post"
  })
}
// 司机绝对优先级派单优先级策略 -- 编辑
export const editAbsDetail = (data) => {
  return axios.request({
    url: "/admin/vehicleStrategy/edit",
    data,
    method: "post"
  })
}

// 业务线优先级策略 -- 新增
export const bizAdd = (data) => {
  return axiosCom.request({
    url: "/admin/bizPriorityStrategy/save",
    data,
    method: "post"
  })
}

// 业务线优先级策略 -- 编辑
export const bizEdit = (data) => {
  return axiosCom.request({
    url: "/admin/bizPriorityStrategy/update",
    data,
    method: "post"
  })
}

// 业务线优先级策略 -- 停用启用
export const bizChangeStatus = (data) => {
  return axiosCom.request({
    url: "/admin/bizPriorityStrategy/setStatus",
    data,
    method: "post"
  })
}

// 业务线优先级策略 -- table列表
export const bizList = (data) => {
  return axiosCom.request({
    url: "/admin/bizPriorityStrategy/queryPage",
    data,
    method: "post"
  })
}

// 业务线优先级策略 -- 详情
export const bizDetail = (data) => {
  return axiosCom.request({
    url: "/admin/bizPriorityStrategy/queryInfo",
    data,
    method: "post"
  })
}

// 业务线优先级策略 -- 根据城市和县区获取业务线
export const getbizByCityArea = (data) => {
  return axiosCom.request({
    url: "/admin/bizPriorityStrategy/queryBiz",
    data,
    method: "post"
  })
}