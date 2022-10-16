import api4Crm from "_o/config/api4Crm.request.js";

/**
 * 司机语音重构------------------start
 */
// 查询快专城市列表（省市级联）
export const queryDriverProvinceCityList = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryProvinceCityList",
    data,
    method: "post"
  })
}
// 查询快专城市列表（省市级联）-有权限
export const queryTimedDriverProvinceCityList = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryTimedProvinceCityList",
    data,
    method: "post"
  })
}
// 根据业务线查询城市，如果是多个业务线，城市取交集
export const queryCityListByBusinessType = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryCityListByBusinessType",
    data,
    method: "post"
  })
}
// 定时语音-根据业务线查询城市，如果是多个业务线，城市取交集（有权限）
export const queryTimedCityListByBusinessType = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryTimedCityListByBusinessType",
    data,
    method: "post"
  })
}
// 根据城市code查询运营商列表
export const queryAgentListByCityCode = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryAgentListByCityCode",
    data,
    method: "post"
  })
}

// 定时配置-列表
export const queryPageTimedVoiceList = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryPageTimedVoiceList",
    data,
    method: "post"
  })
}
// 定时配置-新增
export const addTimedVoice = (data) => {
  return api4Crm.request({
    url: "/driver/voice/addTimedVoice",
    data,
    method: "post"
  })
}
// 定时配置-编辑
export const editTimedVoice = (data) => {
  return api4Crm.request({
    url: "/driver/voice/editTimedVoice",
    data,
    method: "post"
  })
}
// 定时配置-详情
export const queryTimedVoiceDetailByUuid = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryTimedVoiceDetailByUuid",
    data,
    method: "post"
  })
}
// 定时配置-状态
export const setTimedVoiceStatus = (data) => {
  return api4Crm.request({
    url: "/driver/voice/setTimedVoiceStatus",
    data,
    method: "post"
  })
}
// 定时配置-策略名称模糊搜索
export const queryPageTimedVoiceNameList = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryTimedVoiceNameList",
    data,
    method: "post"
  })
}
// 策略配置-策略名称模糊搜索
export const queryPageStrategyVoiceNameList = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryStrategyVoiceNameList",
    data,
    method: "post"
  })
}
// 策略配置-列表
export const queryPageStrategyVoiceList = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryPageStrategyVoiceList",
    data,
    method: "post"
  })
}
// 策略配置-新增
export const addStrategyVoice = (data) => {
  return api4Crm.request({
    url: "/driver/voice/addStrategyVoice",
    data,
    method: "post"
  })
}
// 策略配置-编辑
export const editStrategyVoice = (data) => {
  return api4Crm.request({
    url: "/driver/voice/editStrategyVoice",
    data,
    method: "post"
  })
}
// 策略配置-详情
export const queryStrategyVoiceDetailByUuid = (data) => {
  return api4Crm.request({
    url: "/driver/voice/queryStrategyVoiceDetailByUuid",
    data,
    method: "post"
  })
}
/**
 * 司机语音重构------------------end
 */