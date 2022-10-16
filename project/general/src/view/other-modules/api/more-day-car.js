import commonAxios from '_o/config/api4Common.request'
import axios from "_g/config/api.request";
import routeAxios from "_g/config/api4Route.request";

// 六边形临时折扣新增
export const hexagonAdd = (data) => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/temporaryDiscountStrategy/save',
    data,
    method: 'post'
  })
}
// 六边形临时折扣列表
export const hexagonList = (data) => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/temporaryDiscountStrategy/pageQuery',
    data,
    method: 'post'
  })
}
// 六边形临时折扣操作日志
export const hexagonLog = (data) => {
  return commonAxios.request({
    url: '/multi/day/vehicle/logList',
    data,
    method: 'post'
  })
}
// 六边形临时折扣详情
export const hexagonDetail = (data) => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/temporaryDiscountStrategy/detail',
    data,
    method: 'post'
  })
}
// 六边形临时折扣编辑
export const hexagonEdit = (data) => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/temporaryDiscountStrategy/edit',
    data,
    method: 'post'
  })
}
// 六边形临时折扣删除
export const hexagonDelete = (data) => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/temporaryDiscountStrategy/delete',
    data,
    method: 'post'
  })
}


// 查询某个城市所有六边形经纬度和六边id
export const queryMarketSysDynamic = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/queryHexagonInfoCityForm',
    data,
    method: 'post'
  })
}

// 根据六边形经纬度，获取六边形id
export const queryHexagonByLngLat = params => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/queryHexagonByLngLat',
    method: 'post',
    data: params
  })
}



// 基础折扣-列表
export const baseDiscountList = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/dynamicDiscountStrategy/pageQuery',
    method: 'post',
    data: params
  })
}

// 基础折扣-详情
export const baseDiscountDetail = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/dynamicDiscountStrategy/detail',
    method: 'post',
    data: params
  })
}
// 基础折扣-新增
export const baseDiscountAdd = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/dynamicDiscountStrategy/save',
    method: 'post',
    data: params
  })
}
// 基础折扣-删除
export const baseDiscountDelete = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/dynamicDiscountStrategy/delete',
    method: 'post',
    data: params
  })
}

// 基础定价-新增
export const basicPricingAdd = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/basicPricingStrategy/save',
    method: 'post',
    data: params
  })
}
// 基础定价-列表
export const basicPricingQueryPage = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/basicPricingStrategy/pageQuery',
    method: 'post',
    data: params
  })
}
// 基础定价-删除
export const basicPricingDelete = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/basicPricingStrategy/delete',
    method: 'post',
    data: params
  })
}// 基础定价-详情
export const basicPricingDetail = params => {
  return routeAxios.request({
    url: '/config/multiDayVehicle/basicPricingStrategy/detail',
    method: 'post',
    data: params
  })
}
