/**
 * 配置管理-开通城市 接口
 */

import axios from "_g/config/api.request";
import routeAxios from "_g/config/api4Route.request";

/**
 * 定价策略列表
 */
export const getPriceStrategyList = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/pageQuery",
    method: "post",
    data
  });
};

/**
 * 新增定价策略
 */
export const addPriceStrategy = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/save",
    method: "post",
    data
  });
};

/**
 * 新增乘客和司机定价策略
 */
 export const addPriceStrategyList = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/saveList",
    method: "post",
    data
  });
};

/**
 * 查询套餐列表
 */
export const queryPackageList = data => {
  return axios.request({
    url: "/config/carModelsLevel/packageListQuery",
    method: "post",
    data
  });
};

/**
 * 查询套餐详情
 */
export const packageRuleDetailQuery = data => {
  return axios.request({
    url: "/config/carModelsLevel/packageRuleDetailQuery",
    method: "post",
    data
  });
};
/**
 * 获取包车-套餐默认价格
 */
export const axiosDefaultPrice = data => {
  return axios.request({
    url: "/config/carModelsLevel/initCarLevelPrice",
    method: "post",
    data
  });
};
/**
 * 获取包车-套餐详情
 */
export const axiosPackageDetail = data => {
  return axios.request({
    url: "/config/carModelsLevel/packageDetailQuery",
    method: "post",
    data
  });
};
/**
 * 新增包车-套餐
 */
export const axiosPackageSave = data => {
  return axios.request({
    url: "/config/carModelsLevel/packageSave",
    method: "post",
    data
  });
};

/**
 * 查询司机定价占比列表
 */
export const queryPackageDriverList = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/packageDriverQuery",
    method: "post",
    data
  });
};
/**
 * 获取包车-司机定价占比详情
 */
export const axiosPackageDriverDetail = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/packageDriverDetail",
    method: "post",
    data
  });
};
/**
 * 删除司机定价占比策略
 */
export const deletePackageDriverStrategy = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/updatePackageDriver",
    method: "post",
    data
  });
};

/**
 * 停用司机定价占比策略
 */
export const stopPackageDriverStrategy = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/stopPackageDriver",
    method: "post",
    data
  });
};

/**
 * 新增包车-司机定价占比
 */
export const axiosPackageDriverSave = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/packageDriverSave",
    method: "post",
    data
  });
};


/**
 * 定价策略详情
 */
export const priceStrategyDetail = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/detail",
    method: "post",
    data
  });
};

/**
 * 删除定价策略
 */
export const deletePriceStrategy = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/update",
    method: "post",
    data
  });
};

/**
 * 停用定价策略
 */
export const stopPriceStrategy = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/stop",
    method: "post",
    data
  });
};

/**
 * 废弃定价策略
 */
export const discardPriceStrategy = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/discard",
    method: "post",
    data
  });
};

/**
 * 坏账策略列表
 */
export const getBadDebtList = data => {
  return routeAxios.request({
    url: "/config/carModelsLevel/badDebtQuery",
    method: "post",
    data
  });
};

/**
 * 异地车辆策略列表
 */
export const getDistanceVehicleList = data => {
  return routeAxios.request({
    url: "/admin/offSiteVehicleStrategy/list",
    method: "post",
    data
  });
};

/**
 * 新增坏账策略
 */
export const addBadDebt = data => {
  return routeAxios.request({
    url: "/config/carModelsLevel/badDebtSave",
    method: "post",
    data
  });
};

/**
 * 新增异地车辆策略
 */
export const addVehicleStrategy = data => {
  return routeAxios.request({
    url: "/admin/offSiteVehicleStrategy/save",
    method: "post",
    data
  });
};

/**
 * 查询围栏不带权限接口
 */
export const selectNewPen = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/selectInfoAll",
    method: "post",
    data
  });
};

/**
 * 编辑异地车辆策略
 */
export const editVehicleStrategy = data => {
  return routeAxios.request({
    url: "/admin/offSiteVehicleStrategy/update",
    method: "post",
    data
  });
};

/**
 * 坏账策略详情
 */
export const badDebtDetail = data => {
  return routeAxios.request({
    url: "/config/carModelsLevel/badDebtDetail",
    method: "post",
    data
  });
};

/**
 * 删除坏账策略
 */
export const deleteBadDebt = data => {
  return routeAxios.request({
    url: "/config/carModelsLevel/updateBadDebt",
    method: "post",
    data
  });
};

/**
 * 折扣矩阵列表
 */
export const getDiscountList = data => {
  return axios.request({
    url: "/config/carModelsLevel/discountConfigQuery",
    method: "post",
    data
  });
};

/**
 * 新增折扣矩阵
 */
export const addDiscount = data => {
  return axios.request({
    url: "/config/carModelsLevel/discountConfigSave",
    method: "post",
    data
  });
};

/**
 * 折扣矩阵详情
 */
export const discountDetail = data => {
  return axios.request({
    url: "/config/carModelsLevel/discountConfigDetail",
    method: "post",
    data
  });
};

/**
 * 删除折扣矩阵
 */
export const deleteDiscount = data => {
  return axios.request({
    url: "/config/carModelsLevel/discountConfigUpdate",
    method: "post",
    data
  });
};

/**
 * 实名认证策略-列表
 */
export const axiosRealNameList = data => {
  return routeAxios.request({
    url: "/config/realNameAuth/pageList",
    method: "post",
    data
  });
};
/**
 * 实名认证策略-新增
 */
export const axiosRealNameSave = data => {
  return routeAxios.request({
    url: "/config/realNameAuth/save",
    method: "post",
    data
  });
};
/**
 * 实名认证策略-编辑
 */
export const axiosRealNameUpdate = data => {
  return routeAxios.request({
    url: "/config/realNameAuth/update",
    method: "post",
    data
  });
};
/**
 * 实名认证策略-停用
 */
export const axiosRealNameUpdateStatus = data => {
  return routeAxios.request({
    url: "/config/realNameAuth/updateStatus",
    method: "post",
    data
  });
};

// 获取所有司机类型
export const getAllDriverType = () => routeAxios.request({
  url: "/api/driver/config/findAllDriverTypes",
  method: "post",
  data: {}
})

// 获取当前市所有行政区
export const getAreaInfoByCode = (data) => routeAxios.request({
  url: "/city/getAreaInfoByCode",
  method: "post",
  data
})

/**
 * 跨城费策略-查询列表
 */
export const crossCityPageQuery = data => {
  return routeAxios.request({
    url: "/config/crossCityPricesStrategy/pageQuery",
    method: "post",
    data
  });
};

/**
 * 跨城费策略-新增
 */
export const crossCitySave = data => {
  return routeAxios.request({
    url: "/config/crossCityPricesStrategy/save",
    method: "post",
    data
  });
};

/**
 * 跨城费策略-详情
 */
export const crossCityDetail = data => {
  return routeAxios.request({
    url: "/config/crossCityPricesStrategy/detail",
    method: "post",
    data
  });
};

/**
 * 跨城费策略-编辑
 */
export const crossCityUpdate = data => {
  return routeAxios.request({
    url: "/config/crossCityPricesStrategy/update",
    method: "post",
    data
  });
};

/**
 * 跨城费策略-启用
 */
export const crossCityEnable = data => {
  return routeAxios.request({
    url: "/config/crossCityPricesStrategy/enable",
    method: "post",
    data
  });
};

/**
 * 跨城费策略-停用
 */
export const crossCityDisable = data => {
  return routeAxios.request({
    url: "/config/crossCityPricesStrategy/disable",
    method: "post",
    data
  });
};

