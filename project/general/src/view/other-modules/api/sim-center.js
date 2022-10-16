import axios from "_g/config/api.request"

// 运营商维度Sim卡实名认证配置
export const getOperatorSimList = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/queryAgentSacList",
    method: "post",
    data: params
  })
}

// 新增运营商维度Sim卡实名认证配置
export const addOperatorSim = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/saveAgentSac",
    method: "post",
    data: params
  })
}
// 编辑运营商维度Sim卡实名认证配置
export const editOperatorSim = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/updateAgentSacByUuid",
    method: "post",
    data: params
  })
}

// 删除运营商维度Sim卡实名认证配置
export const deleteOperatorSim = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/deleteAgentSacByUuid",
    method: "post",
    data: params
  })
}

// 运营商维度Sim卡实名认证配置
export const getVehicleSimList = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/queryCarSacList",
    method: "post",
    data: params
  })
}
// 新增车辆维度Sim卡实名认证配置
export const addVehicleSim = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/saveCarSac",
    method: "post",
    data: params
  })
}

// 删除车辆维度Sim卡实名认证配置
export const deleteVehicleSim = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/deleteCarSacByUuid",
    method: "post",
    data: params
  })
}
// 车辆维度车辆信息
export const getvehiclesList = (params) => {
  return axios.request({
    url: "admin/sim/auth/config/queryCarListByPlateNumKeyWord",
    method: "post",
    data: params
  })
}
