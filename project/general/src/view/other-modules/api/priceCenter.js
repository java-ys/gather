import axios from "_g/config/api.request";
// import commonAxios from '_o/config/api4Common.request';
import routeAxios from "_g/config/api4Route.request";
import driverAxios from "_g/config/api4Driver";
import financeAxios from "_g/config/apiFinance";

const postFn = (url, api) => data => api.request({
  url,
  method: "post",
  data
})

const getFn = (url, api) => query => api.request({
  url,
  method: "get",
  data: query
})

// 六边形临时折扣新增
export const hexagonAdd = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/save',
    data,
    method: 'post'
  })
}
// 六边形临时折扣列表
export const hexagonList = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/list',
    data,
    method: 'post'
  })
}
// 六边形临时折扣操作日志
export const hexagonLog = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/logList',
    data,
    method: 'post'
  })
}
// 六边形临时折扣详情
export const hexagonDetail = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/info',
    data,
    method: 'post'
  })
}
// 六边形临时折扣编辑
export const hexagonEdit = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/update',
    data,
    method: 'post'
  })
}
// 六边形临时折扣删除
export const hexagonDelete = (data) => {
  return routeAxios.request({
    url: '/admin/hexagonTempDiscountStrategy/delete',
    data,
    method: 'post'
  })
}


// 浮动折扣系数新增
export const floatAdd = (data) => {
  return routeAxios.request({
    url: '/admin/slidingScaleRateStrategy/save',
    data,
    method: 'post'
  })
}
// 浮动折扣系数列表
export const floatList = (data) => {
  return routeAxios.request({
    url: '/admin/slidingScaleRateStrategy/list',
    data,
    method: 'post'
  })
}
// 浮动折扣系数操作日志
export const floatLog = (data) => {
  return routeAxios.request({
    url: '/admin/slidingScaleRateStrategy/logList',
    data,
    method: 'post'
  })
}
// 浮动折扣系数详情
export const floatDetail = (data) => {
  return routeAxios.request({
    url: '/admin/slidingScaleRateStrategy/info',
    data,
    method: 'post'
  })
}
// 浮动折扣系数编辑
export const floatEdit = (data) => {
  return routeAxios.request({
    url: '/admin/slidingScaleRateStrategy/update',
    data,
    method: 'post'
  })
}
// 浮动折扣系数删除
export const floatDelete = (data) => {
  return routeAxios.request({
    url: '/admin/slidingScaleRateStrategy/delete',
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
    url: '/config/price/basicDiscountStrategy/pageQuery',
    method: 'post',
    data: params
  })
}

// 基础折扣-详情
export const baseDiscountDetail = params => {
  return routeAxios.request({
    url: '/config/price/basicDiscountStrategy/detail',
    method: 'post',
    data: params
  })
}
// 基础折扣-新增
export const baseDiscountAdd = params => {
  return routeAxios.request({
    url: '/config/price/basicDiscountStrategy/save',
    method: 'post',
    data: params
  })
}
// 基础折扣-删除
export const baseDiscountDelete = params => {
  return routeAxios.request({
    url: '/config/price/basicDiscountStrategy/delete',
    method: 'post',
    data: params
  })
}

// ----------------计费策略管理-start----------------------
// 查询列表
export const axiosChannelPriceList = params => {
  return routeAxios.request({
    url: '/config/channelPriceStrategy/pageQuery',
    method: 'post',
    data: params
  })
}
// 新建
export const axiosChannelPriceSave = params => {
  return routeAxios.request({
    url: '/config/channelPriceStrategy/save',
    method: 'post',
    data: params
  })
}
// 编辑
export const axiosChannelPriceUpdat = params => {
  return routeAxios.request({
    url: '/config/channelPriceStrategy/update',
    method: 'post',
    data: params
  })
}
// 详情
export const axiosChannelPriceDetail = params => {
  return routeAxios.request({
    url: '/config/channelPriceStrategy/detail',
    method: 'post',
    data: params
  })
}
// 停用启用
export const axiosChannelPriceShift = params => {
  return routeAxios.request({
    url: '/config/channelPriceStrategy/changeStatus',
    method: 'post',
    data: params
  })
}
// ----------------计费策略管理-end------------------------

// ----------------基础信息管理-start----------------------
// 基础信息-列表
export const baseInfoListService = params => {
  return financeAxios.request({
    url: '/admin/finance/v1/baseFareConfig/query',
    method: 'post',
    data: params
  })
}

// 基础信息-新建
export const baseInfoAddService = params => {
  return financeAxios.request({
    url: '/admin/finance/v1/baseFareConfig/add',
    method: 'post',
    data: params
  })
}

// 基础信息-停用
export const baseInfoOperateService = params => {
  return financeAxios.request({
    url: '/admin/finance/v1/baseFareConfig/edit',
    method: 'post',
    data: params
  })
}

// 基础信息-校验策略是否重复
export const baseInfoCheckService = params => {
  return financeAxios.request({
    url: '/admin/finance/v1/baseFareConfig/check',
    method: 'post',
    data: params
  })
}

// 司机类型接口
export const getDicItemByDicCode = params => {
  return driverAxios.request({
    url: '/api/v1/salaryRule/getDicItemByDicCode',
    method: 'post',
    data: params
  });
};

/** 查询动态溢价列表 */
export const  queryPremiumStrategy = postFn("/config/price/premiumStrategy/pageQuery", routeAxios)

/** 新增动态溢价 */
export const addPremiumStrategy = postFn("/config/price/premiumStrategy/save", routeAxios)

/** 动态溢价详情 */
export const viewPremiumStrategy = postFn("/config/price/premiumStrategy/detail", routeAxios)

/** 动态溢价删除 */
export const deletePremiumStrategy = postFn("/config/price/premiumStrategy/delete", routeAxios)
