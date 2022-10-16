import axios from "_g/config/api.request";
import apiAutoWConfig from "_g/config/apiAutoWConfig.request";
import commonAxios from "_o/config/api4Common.request";
import api4Driver from "_g/config/api4Driver";
import routeAxios from "_g/config/api4Route.request";

// 获取站点列表--地图 --没有分页
export const getSiteList = data => {
  return axios.request({
    url: "/system/serviceSiteList",
    data,
    method: "post"
  });
};
// 更新站点
export const saveServiceSite = data => {
  return axios.request({
    url: "/system/saveServiceSite",
    data,
    method: "post"
  });
};
// 删除站点
export const deleteServiceSite = data => {
  return axios.request({
    url: "/system/deleteServiceSite",
    data,
    method: "post"
  });
};

// 计费规则列表
export const getModelsLeveList = data => {
  return axios.request({
    url: "/config/carModelsLevel/listData",
    data,
    method: "post"
  });
};

// 计费规则查询
export const getModelRules = data => {
  return axios.request({
    url: "/config/carModelsLevel/detail",
    data,
    method: "post"
  });
};

// 计费规则更新
export const updateCarModel = data => {
  return axios.request({
    url: "/config/carModelsLevel/update",
    data,
    method: "post"
  });
};

// 添加开通城市
export const addCity = data => {
  return axios.request({
    url: "/config/carModelsLevel/addCity",
    data,
    method: "post"
  });
};

// 关闭城市
export const turnoffCity = data => {
  return axios.request({
    url: "/config/carModelsLevel/closeCity",
    data,
    method: "post"
  });
};
// 开启城市
export const turnOnCity = data => {
  return axios.request({
    url: "/config/carModelsLevel/openCity",
    data,
    method: "post"
  });
};

// 检查城市是否可以开启
export const checkedCityStatus = data => {
  return axios.request({
    url: "/config/carModelsLevel/openCityCondition",
    data,
    method: "post"
  });
};

// 获取当前城市的坏账策略
export const getBdStrategy = data => {
  return axios.request({
    url: "/config/carModelsLevel/queryCreditModel",
    data,
    method: "post"
  });
};

// 编辑城市坏账策略
export const editbdModel = data => {
  return axios.request({
    url: "/config/carModelsLevel/saveCreditModel",
    data,
    method: "post"
  });
};

// 品牌列表
export const getBrandList = data => {
  return axios.request({
    url: "/config/model/queryBrandPageList",
    data,
    method: "post"
  });
};

// 新增品牌
export const saveBrand = data => {
  return axios.request({
    url: "/config/model/saveBrandModel",
    data,
    method: "post"
  });
};

// 删除品牌
export const deleteBrand = data => {
  return axios.request({
    url: "/config/model/deleteBrandModel",
    data,
    method: "post"
  });
};
// 停用品牌
export const ableControlBrand = data => {
  return axios.request({
    url: "config/model/enableOrDisableBrandModel",
    data,
    method: "post"
  });
};

// 获取车型列表
export const getModelList = data => {
  return axios.request({
    url: "/config/model/queryCarModelPageList",
    data,
    method: "post"
  });
};

// 获取品牌
export const getOwnedBrand = data => {
  return axios.request({
    url: "/config/model/brandList",
    data,
    method: "post"
  });
};

// 新增车型
export const saveCarModel = data => {
  return axios.request({
    url: "/config/model/saveOrUpdateCarModel",
    data,
    method: "post"
  });
};
// 删除车型
export const deleteCarModel = data => {
  return axios.request({
    url: "/config/model/deleteCarModel",
    data,
    method: "post"
  });
};
// 查询司机端菜单配置列表
export const driverMenuList = data => {
  return axios.request({
    url: "/config/menu/list",
    data,
    method: "post"
  });
};
// 添加司机端菜单配置列表
export const driverMenuAdd = data => {
  return axios.request({
    url: "/config/menu/add",
    data,
    method: "post"
  });
};
// 编辑司机端菜单配置列表
export const driverMenuUpdate = data => {
  return axios.request({
    url: "/config/menu/edit",
    data,
    method: "post"
  });
};
// 删除司机端菜单配置列表
export const driverMenuDelete = data => {
  return axios.request({
    url: "/config/menu/delete",
    data,
    method: "post"
  });
};
// 查询司机端应用配置列表
export const driverMenuAppList = data => {
  return axios.request({
    url: "/config/menu/app/search",
    data,
    method: "post"
  });
};
// 通过多城市查询运营商
export const queryMultiCityAgentPageList = data => {
  return axios.request({
    url: "/admin/sysAgent/queryMultiCityAgentPageList",
    data,
    method: "post"
  });
};
// 添加司机端应用配置列表
export const driverMenuAppAdd = data => {
  return axios.request({
    url: "/config/menu/app/add",
    data,
    method: "post"
  });
};
// 编辑司机端应用配置列表
export const driverMenuAppUpdate = data => {
  return axios.request({
    url: "/config/menu/app/edit",
    data,
    method: "post"
  });
};
// 删除司机端应用配置列表
export const driverMenuAppDelete = data => {
  return axios.request({
    url: "/config/menu/app/delete",
    data,
    method: "post"
  });
};

// ******系统策略管理 ******//
// 考勤策略-详情
export const attendanceStrategyDetail = data => {
  return axios.request({
    url: "/admin/attendanceStrategy/get",
    data,
    method: "post"
  });
};
// 考勤策略-删除
export const attendanceStrategyDelete = data => {
  return axios.request({
    url: `/admin/attendanceStrategy/delete${data}`,
    data,
    method: "get"
  });
};
// 考勤策略--分页查询
export const attendanceStrategyPage = data => {
  return axios.request({
    url: "/admin/attendanceStrategy/queryPage",
    data,
    method: "post"
  });
};
// 考勤策略--新增
export const attendanceStrategySave = data => {
  return axios.request({
    url: "/admin/attendanceStrategy/save",
    data,
    method: "post"
  });
};
// 考勤策略-修改
export const attendanceStrategyUpdate = data => {
  return axios.request({
    url: "/admin/attendanceStrategy/update",
    data,
    method: "post"
  });
};
// 订单策略删除
export const orderStrategyDelete = data => {
  return axios.request({
    url: "/admin/strategy/delete",
    data,
    method: "post"
  });
};
// 订单策略编辑
export const orderUpdateStrategy = data => {
  return axios.request({
    url: "/admin/strategy/updateStrategy",
    data,
    method: "post"
  });
};
// 订单策略添加
export const orderStrategyAdd = data => {
  return axios.request({
    url: "/admin/strategy/add",
    data,
    method: "post"
  });
};
// 订单策略--分页查询
export const orderselectAll = data => {
  return axios.request({
    url: "admin/strategy/selectAll",
    data,
    method: "post"
  });
};
// 开通城市
export const getChoiceCity = data => {
  return axios.request({
    url: "/admin/city/getOpenCity",
    method: "get"
  });
};
// 运营商查询
export const getAgentList = data => {
  return axios.request({
    url: `/admin/city/getAgent`,
    data,
    method: "post"
  });
};
// 日历功能
// 日期更新
export const calenderUpdate = data => {
  return axios.request({
    url: "/admin/calender/update",
    data,
    method: "post"
  });
};
// 日期查询
export const calenderSelectByParam = data => {
  return axios.request({
    url: `/admin/calender/selectByParam`,
    data,
    method: "post"
  });
};
// 插入日历
export const calenderInsertCalendar = data => {
  return axios.request({
    url: `/admin/calender/insertCalendar${data}`,
    method: "get"
  });
};
// 偏离报警策略--列表
export const alarmList = data => {
  return axios.request({
    url: "/admin/alarmStrategy/list",
    data,
    method: "post"
  });
};
// 偏离报警策略--详情
export const alarmListDdetail = data => {
  return axios.request({
    url: "/admin/alarmStrategy/getDetail",
    data,
    method: "post"
  });
};
// 偏离报警策略--保存/修改
export const alarmSave = data => {
  return axios.request({
    url: "/admin/alarmStrategy/save",
    data,
    method: "post"
  });
};
// 偏离报警策略--保存/修改
export const alarmUpate = data => {
  return axios.request({
    url: "/admin/alarmStrategy/update",
    data,
    method: "post"
  });
};
// ******运营地图 ******//
// 保存乘客脸部特征
export const saveFaceFeature = data => {
  return axios.request({
    url: "/admin/passenger/saveFaceFeature",
    data,
    method: "post"
  });
};
// 全国车辆总数
export const findCarAddress = data => {
  return axios.request({
    url: "/admin/carMonitor/findCarAddress",
    data,
    method: "post"
  });
};
// 查询地图服务要求的数据信息
export const queryCarListByRemote = data => {
  return axios.request({
    url: "/admin/driverRemote/getCarDistribution",
    data,
    method: "post"
  });
};
// 城市总数统计
export const getCountCityCar = data => {
  return axios.request({
    url: "/admin/carMonitor/countCityCar",
    data,
    method: "post"
  });
};
// 统计地图服务要求的数据信息
export const getcountCars = data => {
  return axios.request({
    url: "/admin/driverRemote/countCars",
    data,
    method: "post"
  });
};
// 根据vin获取车辆实时信息
export const findOneByVin = data => {
  return axios.request({
    url: "/admin/carManager/realTimeStatus",
    data,
    method: "post"
  });
};
// 根据vin获取车辆的基础信息
export const getCarByVin = data => {
  return axios.request({
    url: "/admin/carManager/detailInfo",
    data,
    method: "post"
  });
};
// 获取司机详情信息
export const getDriverDetail = data => {
  return axios.request({
    url: "/admin/driver/detail",
    data,
    method: "post"
  });
};
// 远程控制--获取
export const getRmoteControlGet = data => {
  return axios.request({
    url: "/admin/driverRemote/getCarControl",
    data,
    method: "post"
  });
};
// 远程控制--修改
export const getRmoteEdit = data => {
  return axios.request({
    url: "/admin/driverRemote/editCarControl",
    data,
    method: "post"
  });
};
// 查询当日订单
export const getDriverOrderPage = data => {
  return axios.request({
    url: "admin/carManager/orderList",
    data,
    method: "post"
  });
};
// 查询批量选中的车辆分页信息
export const getCarPageByVins = data => {
  return axios.request({
    url: "/admin/driverRemote/getCarPageByVins",
    data,
    method: "post"
  });
};
// 根据车辆uuid获得今日订单分页信息
export const getOrderPageToday = data => {
  return axios.request({
    url: "/admin/driverRemote/getOrderPageToday",
    data,
    method: "post"
  });
};
// 保存车辆或司机信息
export const saveDriverOrCarMsg = (data, query) => {
  return axios.request({
    url: `/admin/sms/batch/send${query}`,
    data,
    method: "post"
  });
};
// 保存车辆或司机信息
export const savePushToCars = data => {
  return axios.request({
    url: "/admin/system/push/pushToCars",
    data,
    method: "post"
  });
};
// 场地管理 站点列表--（有分页）
export const serviceSitePageList = data => {
  return axios.request({
    url: "/system/serviceSitePageList",
    data,
    method: "post"
  });
};
// 获取地图 电子围栏--电子围栏-添加了权限限制
export const getElefenServiceSelect = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/selectInfo",
    data,
    method: "post"
  });
};
// 获取地图 电子围栏-未添加权限
export const getElefenServiceSelectAll = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/selectInfoAll",
    data,
    method: "post"
  });
};
// 根据城市获取运营商
export const getAgentByCity = data => {
  return axios.request({
    url: "/admin/driverRemote/getAgentByCity",
    data,
    method: "post"
  });
};
// 根据运营商获取司管
export const getOpmanerByOrgan = data => {
  return axios.request({
    url: "/admin/driver/managerDriver",
    data,
    method: "post"
  });
};
// 获取当日订单
export const getOrderListByVin = data => {
  return axios.request({
    url: "/admin/carManager/orderList",
    data,
    method: "post"
  });
};
// 发送短信
export const sendSms = data => {
  return axios.request({
    url: "/admin/sms/sendSms",
    data,
    method: "post"
  });
};
// ******平台信息管理 ******//
// 获取省市列表
export const getCityList = data => {
  return axios.request({
    url: "/common/citys",
    data,
    method: "post"
  });
};
// 运营规模信息查询
export const getScaleInfo = data => {
  return axios.request({
    url: "/operationScale/queryDriverCarNum",
    data,
    method: "post"
  });
};
// 平台基本信息查询
export const getBasicInfo = data => {
  return axios.request({
    url: "/platformInfo/query",
    data,
    method: "post"
  });
};
// 平台基本信息修改
export const editBasicInfo = data => {
  return axios.request({
    url: "/platformInfo/addPlatformInfo",
    data,
    method: "post"
  });
};
// 支付信息查询
export const getPayInfo = data => {
  return axios.request({
    url: "/platformPay/query",
    data,
    method: "post"
  });
};
// 支付信息修改
export const editPayInfo = data => {
  return axios.request({
    url: "/platformPay/addPlatformPay",
    data,
    method: "post"
  });
};
// 服务机构信息查询
export const getServiceInfo = data => {
  return axios.request({
    url: "/platformService/query",
    data,
    method: "post"
  });
};
// 服务机构信息修改
export const editServiceInfo = data => {
  return axios.request({
    url: "/platformService/addPlatformService",
    data,
    method: "post"
  });
};
// 经营许可信息查询
export const getLicenseInfo = data => {
  return axios.request({
    url: "/platformPermit/query",
    data,
    method: "post"
  });
};
// 经营许可信息修改
export const editLicenseInfo = data => {
  return axios.request({
    url: "/platformPermit/addPlatformPermit",
    data,
    method: "post"
  });
};
// 电子围栏管理
// 电子围栏保存
export const savePen = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/saveOrUpdate",
    data,
    method: "post"
  });
};
// 电子围栏查询
export const selectPen = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/select",
    data,
    method: "post"
  });
};

// 电子围栏详情
export const getPenDetail = data => {
  return axios.request({
    url: `/admin/sysElectronicFence/getDetail`,
    data,
    method: "post"
  });
};

// 城市电子围栏查询
export const citySelectPen = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/selectPage",
    data,
    method: "post"
  });
};
// 城市围栏可视化查询
export const selectPenView = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/selectCondition",
    data,
    method: "post"
  });
};

// 城市围栏场景树查询
export const getAllScene = data => {
  return axios.request({
    url: "/admin/sysElectronicFence/sceneTree",
    params: data,
    method: "get"
  });
};

// 接单设备列表(查询)
export const getOrderEquipmentList = data => {
  return axios.request({
    url: "/admin/orderEquipment/list",
    data,
    method: "post"
  });
};

// 获取接单设备操作记录
export const getOperationRecord = data => {
  return axios.request({
    url: "/admin/orderEquipment/operationRecord",
    data,
    method: "post"
  });
};

// 根据车辆vin或者运营商查询接单设备信息
export const getVinInfo = data => {
  return axios.request({
    url: "/admin/orderEquipment/getByVinOrOperator",
    data,
    method: "post"
  });
};

// 保存接单设备设置
export const saveNewEquipConfig = data => {
  return axios.request({
    url: "/admin/orderEquipment/save",
    data,
    method: "post"
  });
};

// 接单设备详情
export const getEquitConfigDetail = data => {
  return axios.request({
    url: "/admin/orderEquipment/get",
    data,
    method: "post"
  });
};

// 编辑折扣矩阵
export const saveDiscount = data => {
  return axios.request({
    url: "/config/carModelsLevel/updateDiscountConfig",
    data,
    method: "post"
  });
};

// 获取折扣矩阵信息
export const getDiscountInfo = data => {
  return axios.request({
    url: "/config/carModelsLevel/getDiscountConfig",
    data,
    method: "post"
  });
};

// 车辆供应商分页列表接口
export const getProviderList = data => {
  return axios.request({
    url: "/admin/carProvider/list",
    data,
    method: "post"
  });
};

// 新增车辆供应商
export const addProvider = data => {
  return axios.request({
    url: "/admin/carProvider/save",
    data,
    method: "post"
  });
};

// 编辑车辆供应商
export const editProvider = data => {
  return axios.request({
    url: "/admin/carProvider/edit",
    data,
    method: "post"
  });
};

// 获取人脸识别列表
export const getFaceList = data => {
  return axios.request({
    url: "/config/carFaceRecognition/list",
    data,
    method: "post"
  });
};

// 更改人脸识别状态
export const updateFaceStatus = data => {
  return axios.request({
    url: "/config/carFaceRecognition/update",
    data,
    method: "post"
  });
};

// 切换接单设备
export const switchDevice = data => {
  return axios.request({
    url: "/admin/orderEquipment/switchDevice",
    data,
    method: "post"
  });
};

// 营销策略
// 取消策略列表
export const axiosCancelStrategyList = data => {
  return routeAxios.request({
    url: "/config/passengerCancelStrategy/pageQuery",
    data,
    method: "post"
  });
};
// 强制下线
export const axiosForcedOffline = data => {
  return axios.request({
    url: "/admin/driver/forcedOffline",
    data,
    method: "post"
  });
};
// 取消策略新增
export const axiosCancelStrategySave = data => {
  return routeAxios.request({
    url: "/config/passengerCancelStrategy/save",
    data,
    method: "post"
  });
};
// 取消策略编辑
export const axiosCancelStrategyUpdate = data => {
  return routeAxios.request({
    url: "/config/passengerCancelStrategy/save",
    data,
    method: "post"
  });
};
// 取消策略详情
export const axiosCancelStrategyInfo = data => {
  return routeAxios.request({
    url: "/config/passengerCancelStrategy/detail",
    data,
    method: "post"
  });
};
// 乘客取消策略删除
export const axiosCancelStrategyDelete = data => {
  return routeAxios.request({
    url: "/config/passengerCancelStrategy/delete",
    data,
    method: "post"
  });
};
// 乘客取消策略-查询渠道列表
export const axiosRouteSourceTypes = data => {
  return axios.request({
    url: "/common/getRouteSourceTypes",
    data,
    method: "post"
  });
};
export const axiosAlarmStrategyList = data => {
  return axios.request({
    url: "/admin/alarmStrategy/list",
    data,
    method: "post"
  });
};
// 司机取消策略
// export const axiosDriverCancelStrategyList = data => {
//   return axios.request({
//     url: "/admin/cancelStrategy/driver/queryPage",
//     data,
//     method: "post"
//   });
// };
// export const axiosDriverCancelStrategyAdd = data => {
//   return axios.request({
//     url: "/admin/cancelStrategy/driver/save",
//     data,
//     method: "post"
//   });
// };
// export const axiosDriverCancelStrategyUpdate = data => {
//   return axios.request({
//     url: "/admin/cancelStrategy/driver/update",
//     data,
//     method: "post"
//   });
// };
// export const axiosDriverCancelStrategyDetail = data => {
//   return axios.request({
//     url: "/admin/cancelStrategy/driver/detail",
//     data,
//     method: "post"
//   });
// };
// 司机取消策略删除
// export const axiosDriverCancelStrategyDelete = data => {
//   return axios.request({
//     url: "/admin/cancelStrategy/driver/delete",
//     data,
//     method: "post"
//   });
// };

// 偏离报警策略新增
export const axiosAlarmStrategySave = data => {
  return axios.request({
    url: "/admin/alarmStrategy/save",
    data,
    method: "post"
  });
};
// 偏离报警策略编辑
export const axiosAlarmStrategyUpdate = data => {
  return axios.request({
    url: "/admin/alarmStrategy/update",
    data,
    method: "post"
  });
};
// 偏离报警策略详情
export const axiosAlarmStrategyInfo = data => {
  return axios.request({
    url: "/admin/alarmStrategy/info",
    data,
    method: "post"
  });
};
// 偏离报警策略删除
export const axiosAlarmStrategyDelete = data => {
  return axios.request({
    url: "/admin/alarmStrategy/delete",
    data,
    method: "post"
  });
};
// 时间段及高峰策略列表
export const axiosTimeStrategyList = data => {
  return axios.request({
    url: "/admin/timeStrategy/list",
    data,
    method: "post"
  });
};
// 产品线及订单来源优先级策略-列表
export const axiosPriorityStrategyList = data => {
  return routeAxios.request({
    url: "/admin/tripartitePlatform/pageList",
    data,
    method: "post"
  });
};

// 产品线及订单来源优先级策略-删除
export const axiosPriorityStrategyDelete = data => {
  return routeAxios.request({
    url: "/admin/tripartitePlatform/delStrategy",
    data,
    method: "post"
  });
};
// 产品线及订单来源优先级策略-编辑
export const axiosPriorityStrategyUpdate = data => {
  return routeAxios.request({
    url: "/admin/tripartitePlatform/updateStrategy",
    data,
    method: "post"
  });
};
// 产品线及订单来源优先级策略-新建策略
export const axiosPriorityStrategySave = data => {
  return routeAxios.request({
    url: "/admin/tripartitePlatform/addStrategy",
    data,
    method: "post"
  });
};

// 热区定向派单优先级策略-列表
export const axiosHotAreaStrategyList = data => {
  return routeAxios.request({
    url: "/admin/hotAreaPriorityStrategy/list",
    data,
    method: "post"
  });
};

// 热区定向派单优先级策略-删除
export const axiosHotAreaStrategyDelete = data => {
  return routeAxios.request({
    url: "/admin/hotAreaPriorityStrategy/delete",
    data,
    method: "post"
  });
};
// 热区定向派单优先级策略-编辑
export const axiosHotAreaStrategyUpdate = data => {
  return routeAxios.request({
    url: "/admin/hotAreaPriorityStrategy/update",
    data,
    method: "post"
  });
};
// 热区定向派单优先级策略-新建策略
export const axiosHotAreaStrategySave = data => {
  return routeAxios.request({
    url: "/admin/hotAreaPriorityStrategy/save",
    data,
    method: "post"
  });
};
// 热区定向派单优先级策略-详情
export const axiosHotAreaStrategyInfo = data => {
  return routeAxios.request({
    url: "/admin/hotAreaPriorityStrategy/info",
    data,
    method: "post"
  });
};

// 订单价值优先级派单策略-列表
export const axiosOrderPriorityStrategyList = data => {
  return routeAxios.request({
    url: "/admin/orderPricePriorityStrategy/list",
    data,
    method: "post"
  });
};

// 订单价值优先级派单策略-删除
export const axiosOrderPriorityStrategyDelete = data => {
  return routeAxios.request({
    url: "/admin/orderPricePriorityStrategy/delete",
    data,
    method: "post"
  });
};
// 订单价值优先级派单策略-编辑
export const axiosOrderPriorityStrategyUpdate = data => {
  return routeAxios.request({
    url: "/admin/orderPricePriorityStrategy/update",
    data,
    method: "post"
  });
};
// 订单价值优先级派单策略-新建策略
export const axiosOrderPriorityStrategySave = data => {
  return routeAxios.request({
    url: "/admin/orderPricePriorityStrategy/save",
    data,
    method: "post"
  });
};
// 订单价值优先级派单策略-详情
export const axiosOrderPriorityStrategyInfo = data => {
  return routeAxios.request({
    url: "/admin/orderPricePriorityStrategy/info",
    data,
    method: "post"
  });
};

// 时间段及高峰策略新增
export const axiosTimeStrategySave = data => {
  return axios.request({
    url: "/admin/timeStrategy/save",
    data,
    method: "post"
  });
};
// 时间段及高峰策略编辑
export const axiosTimeStrategyUpdate = data => {
  return axios.request({
    url: "/admin/timeStrategy/update",
    data,
    method: "post"
  });
};
// 时间段及高峰策略详情
export const axiosTimeStrategyInfo = data => {
  return axios.request({
    url: "/admin/timeStrategy/info",
    data,
    method: "post"
  });
};
// 时间段及高峰策略删除
export const axiosTimeStrategyDelete = data => {
  return axios.request({
    url: "/admin/timeStrategy/delete",
    data,
    method: "post"
  });
};

// 预约单改派策略-列表
export const axiosBookingStrategyList = data => {
  return routeAxios.request({
    url: "/reassign/strategy/config/pageList",
    data,
    method: "post"
  });
};
// 预约单改派策略-新增修改
export const axiosBookingStrategyEdit = data => {
  return routeAxios.request({
    url: "/reassign/strategy/config/saveOrUpdate",
    data,
    method: "post"
  });
};
// 预约单改派策略-上下架
export const axiosBookingStrategyShift = data => {
  return routeAxios.request({
    url: "/reassign/strategy/config/updateStatus",
    data,
    method: "post"
  });
};
// 预约单改派策略-详情接口
export const axiosBookingStrategyDetail = data => {
  return routeAxios.request({
    url: "/reassign/strategy/config/details",
    data,
    method: "post"
  });
};

// 审批管理
// 审批管理列表
export const axiosTaskApprovalList = data => {
  return axios.request({
    url: "/admin/taskApproval/queryPage",
    data,
    method: "post"
  });
};
// 审批通过
export const axiosTaskApprovalSwitch = data => {
  return axios.request({
    url: "/admin/taskApproval/approvalUpdate",
    data,
    method: "post"
  });
};
// 批量审批
export const axiosTaskApprovalBatchSwitch = data => {
  return axios.request({
    url: "/admin/taskApproval/batchUpdateStatus",
    data,
    method: "post"
  });
};
// 审批详情
export const axiosTaskApprovalDetail = data => {
  return axios.request({
    url: "/admin/taskApproval/detail",
    data,
    method: "post"
  });
};
// 允许上线
export const axiosAllowOnline = data => {
  return axios.request({
    url: "/admin/driver/allowOnline",
    data,
    method: "post"
  });
};

// 车辆gps
export const axiosCarGPSData = data => {
  return axios.request({
    url: "/car/historyTrajectory/historyTrajectory",
    data,
    method: "post"
  });
};

// 获取休息日列表
export const getRestDaysList = params => {
  return axios.request({
    url: "/config/workDay/searchWorkDays",
    method: "post",
    data: params
  });
};

// 获取节假日列表
export const getHolidayList = params => {
  return axios.request({
    url: "/config/holiday/searchHolidayList",
    method: "post",
    data: params
  });
};

// 设置休息日
export const setRestDay = params => {
  return axios.request({
    url: "/config/workDay/setWorkDay",
    method: "post",
    data: params
  });
};

// 获取操作记录列表
export const getHandleRecordList = params => {
  return axios.request({
    url: "/config/workDay/searchOperationLogList",
    method: "post",
    data: params
  });
};

// 电子围栏状态变更
export const updateFenceStatus = params => {
  return axios.request({
    url: "/admin/sysElectronicFence/updateStatus",
    method: "post",
    data: params
  });
};

// 产品线管理-列表
export const getProductLineList = data => {
  return axios.request({
    url: "/admin/productLine/list",
    method: "post",
    data: data
  });
};
// 产品线管理-新增
export const addProductLine = data => {
  return axios.request({
    url: "/admin/productLine/add",
    method: "post",
    data: data
  });
};
// 产品线管理-编辑
export const editProductLine = data => {
  return axios.request({
    url: "/admin/productLine/edit",
    method: "post",
    data: data
  });
};
// 产品线管理-启用/停用
export const updateProductLineStatus = data => {
  return axios.request({
    url: "/admin/productLine/update",
    method: "post",
    data: data
  });
};
// 包车业务策略-新增
export const addPackageOperation = data => {
  return axios.request({
    url: "/admin/charterStrategy/add",
    method: "post",
    data: data
  });
};

// 包车业务策略-编辑
export const updatePackageOperation = data => {
  return axios.request({
    url: "/admin/charterStrategy/update",
    method: "post",
    data: data
  });
};

// 包车业务策略-查询
export const queryPackageOperation = data => {
  return axios.request({
    url: "/admin/charterStrategy/info",
    method: "post",
    data: data
  });
};
// --------------------派单距离策略------------------------
// 派单距离策略新增
export const axiosInsertDispatchInfo = params => {
  return routeAxios.request({
    url: "/system/dispatchDistance/insertDispatchInfo",
    method: "post",
    data: params
  });
};
// 派单距离策略编辑
export const axiosUpdateDispatchInfo = params => {
  return routeAxios.request({
    url: "/system/dispatchDistance/updateDispatchInfo",
    method: "post",
    data: params
  });
};
// 派单距离策略删除
export const axiosDeleteDispatchInfo = params => {
  return routeAxios.request({
    url: "/system/dispatchDistance/deleteDispatchInfo",
    method: "post",
    data: params
  });
};
// 派单距离策略列表
export const axiosQueryDispatchInfoPage = params => {
  return routeAxios.request({
    url: "/system/dispatchDistance/queryDispatchInfoPage",
    method: "post",
    data: params
  });
};
// 获取已开通的业务线
export const axiosGetOpenBusinessType = params => {
  return axios.request({
    url: "/config/opencity/bizTypeList",
    method: "post",
    data: params
  });
};
// 查询城市 业务线 对应的没有派单策略的派单类型的电子围栏
export const axiosGetDispatchFenceList = params => {
  return routeAxios.request({
    url: "/system/dispatchDistance/getDispatchFenceList",
    method: "post",
    data: params
  });
};

// --------------------派单距离策略------------------------

// --------------------包车套餐管理------------------------
// 获取已配置的包车城市
export const getCharterCities = params => {
  return axios.request({
    url: "/config/carModelsLevel/listCharterCities",
    method: "post",
    data: params
  });
};
// 获取包车开通城市列表
export const getPackageModelsLeveList = params => {
  return axios.request({
    url: "/config/carModelsLevel/listPackageCity",
    method: "post",
    data: params
  });
};
// 新增包车开通城市
export const packageOpenCityAdd = params => {
  return axios.request({
    url: "/config/carModelsLevel/addPackageCity",
    method: "post",
    data: params
  });
};
// 包车开通城市开启关闭
export const packageOpenCityStatus = params => {
  return axios.request({
    url: "/config/carModelsLevel/updatePackageCityStatus",
    method: "post",
    data: params
  });
};
// --------------------包车套餐管理------------------------

// --------------------菜单管理------------------------

// 乘客端查询
export const getProductStrategyList = params => {
  return commonAxios.request({
    url: "/api/common/business/queryBusinessList",
    method: "post",
    data: params
  });
};
// 乘客端编辑
export const editProductStrategyExpose = params => {
  return commonAxios.request({
    url: "/api/common/business/editBusiness",
    method: "post",
    data: params
  });
};
// 乘客端详情
export const editProductStrategyDetail = params => {
  return commonAxios.request({
    url: "/api/common/business/queryBusinessDetail",
    method: "post",
    data: params
  })
}
// 设置业务线状态
export const updateProductStrategyStatus = params => {
  return commonAxios.request({
    url: "/api/common/business/setBusinessStatus",
    method: "post",
    data: params
  });
};
// 新增业务线
export const addProductStrategyExpose = params => {
  return commonAxios.request({
    url: "/api/common/business/addBusiness",
    method: "post",
    data: params
  });
};
// 批量上传白名单
export const batchImportApi = params => {
  return commonAxios.request({
    url: "/api/common/business/batchUploadWhiteExcel",
    method: "post",
    data: params
  });
};

// 移除业务线白名单
export const removeUserApi = params => {
  return commonAxios.request({
    url: "/api/common/business/removeBusinessWhite",
    method: "post",
    data: params
  });
};
// 查询业务线白名单列表
export const getProductWhitelist = params => {
  return commonAxios.request({
    url: "/api/common/business/queryBusinessWhitePageList",
    method: "post",
    data: params
  });
};
// 新增业务线白名单
export const addWhitelistPhone = params => {
  return commonAxios.request({
    url: "/api/common/business/addBusinessWhite",
    method: "post",
    data: params
  });
};
// 查询下拉框业务线
export const getHasStrategyProduct = params => {
  return commonAxios.request({
    url: "/api/common/business/queryAvailableProductLine",
    method: "post",
    data: params
  });
};
// 公用的图片上传接口
// TODO /common/uploadImg改造
// export const uploadImg = params => {
//   return commonAxios.request({
//     url: "/common/uploadImg",
//     method: "post",
//     data: params
//   });
// };
// 查询业务线详情
export const queryBusinessDetail = params => {
  return commonAxios.request({
    url: "/api/common/business/queryBusinessDetail",
    method: "post",
    data: params
  });
};

// 编辑司机强制休息
export const axiosRestUpdate = params => {
  return axios.request({
    url: "/admin/sysConfig/forceRest/update",
    method: "post",
    data: params
  })
}
// 新增司机强制休息
export const axiosRestAdd = params => {
  return axios.request({
    url: "/admin/sysConfig/forceRest/add",
    method: "post",
    data: params
  })
}
// 获取强制休息详情
export const getRest = params => {
  return axios.request({
    url: "/admin/sysConfig/forceRest/detail",
    method: "post",
    data: params
  })
}

// 获取强制休息策略列表
export const getRestListData = params => {
  return axios.request({
    url: "/admin/sysConfig/forceRest/pageList",
    method: "post",
    data: params
  })
}

// 司机派单
export const axiosDriverScheduleUpdate = data => {
  return axios.request({
    url: "/admin/shift/dispatch/setShiftDispatchStatus",
    data,
    method: "post"
  })
}
// 司机派单策略
export const axiosDriverSchedule = data => {
  return axios.request({
    url: "/admin/shift/dispatch/queryShiftDispatch",
    data,
    method: "post"
  })
}

// 乘客im限制
// 添加im
export const savePassengerImLimit = data => {
  return commonAxios.request({
    url: "/config/passengerImLimit/save",
    data,
    method: "post"
  })
}
// 编辑im
export const updatePassengerImLimit = data => {
  return commonAxios.request({
    url: "/config/passengerImLimit/update",
    data,
    method: "post"
  })
}
// im详情
export const passengerImLimitDetail = data => {
  return commonAxios.request({
    url: "/config/passengerImLimit/detail",
    data,
    method: "post"
  })
}


// 侧边栏菜单-列表
export const axiosLeftMenuList = data => {
  return commonAxios.request({
    url: "/config/sideBar/pageList",
    data,
    method: "post"
  })
}

// 侧边栏菜单-开关
export const axiosLeftMenuShift = data => {
  return commonAxios.request({
    url: "/config/sideBar/updateStatus",
    data,
    method: "post"
  })
}

// 侧边栏菜单-新增
export const axiosLeftMenuAdd = data => {
  return commonAxios.request({
    url: "/config/sideBar/save",
    data,
    method: "post"
  })
}
// 侧边栏菜单-编辑
export const axiosLeftMenuEdit = data => {
  return commonAxios.request({
    url: "/config/sideBar/update",
    data,
    method: "post"
  })
}
// 用户群优先级派单
// 列表
// 乘客端查询
export const userPreferenceList = params => {
  return routeAxios.request({
    url: "/config/userGroupStrategy/pageQuery",
    method: "post",
    data: params
  });
};
// 用户群绝对优先级派单
// 列表
// 乘客端查询
export const absolutelyUserGroupStrategy = params => {
  return routeAxios.request({
    url: "config/absolutelyUserGroupStrategy/pageQuery",
    method: "post",
    data: params
  });
};
// 更新状态
export const userPreferenceUpdateStatus = params => {
  return routeAxios.request({
    url: "/config/userGroupStrategy/updateStatus",
    method: "post",
    data: params
  });
};
// 群组绝对优先级更新状态
export const userAbsPreferenceUpdateStatus = params => {
  return routeAxios.request({
    url: "/config/absolutelyUserGroupStrategy/updateStatus",
    method: "post",
    data: params
  });
};
//
// 大数据群查询
export const queryGroupLists = params => {
  return commonAxios.request({
    url: "/config/groupOrder/queryGroupList",
    method: "post",
    data: params
  });
};
// 新增
export const userPreferenceListAdd = params => {
  return routeAxios.request({
    url: "/config/userGroupStrategy/save",
    method: "post",
    data: params
  });
};

// 用户群绝对优先级新增
export const userAbsPreferenceListAdd = params => {
  return routeAxios.request({
    url: "/config/absolutelyUserGroupStrategy/save",
    method: "post",
    data: params
  });
};
// uuid用户群查询
export const uuidGroupSearch = params => {
  return routeAxios.request({
    url: "/config/userGroupStrategy/groupPageQuery",
    method: "post",
    data: params
  });
};
// 用户群修改
export const updateGroup = params => {
  return routeAxios.request({
    url: "/config/userGroupStrategy/updateGroup",
    method: "post",
    data: params
  });
};

// 用户群绝对优先修改
export const updateGroupAbs = params => {
  return routeAxios.request({
    url: "/config/absolutelyUserGroupStrategy/updateGroup",
    method: "post",
    data: params
  });
};
// 详情
export const groupDetail = params => {
  return commonAxios.request({
    url: "/config/groupOrder/detail",
    method: "post",
    data: params
  });
};

// --------------------客户自动化策略------------------------
// 保存自动化策略
export const addAutoWOrderConfig = params => {
  return apiAutoWConfig.request({
    url: "/autoWOrderConfig/v1/commitConfig",
    method: "post",
    data: params
  });
};
// 编辑自动化策略
export const editAutoWOrderConfig = params => {
  return apiAutoWConfig.request({
    url: "/autoWOrderConfig/v1/editConfig",
    method: "post",
    data: params
  });
};
// 获取所有自动化策略
export const getAutoWOrderConfigList = params => {
  return apiAutoWConfig.request({
    url: "/autoWOrderConfig/v1/list/config",
    method: "post",
    data: params
  });
};
// 根据产品线，业务类型查询自动化策略详情
export const getAutoWOrderConfigDetails = params => {
  return apiAutoWConfig.request({
    url: "/autoWOrderConfig/v1/query/config",
    method: "post",
    data: params
  });
};


// 订单价值管理
export const highLowAdd = params => {
  return routeAxios.request({
    url: "/config/orderValueStrategy/save",
    method: "post",
    data: params
  });
};
export const highLowUpdate = params => {
  return routeAxios.request({
    url: "/config/orderValueStrategy/update",
    method: "post",
    data: params
  });
};
export const highLowDetail = params => {
  return routeAxios.request({
    url: "/config/orderValueStrategy/detail",
    method: "post",
    data: params
  });
};
export const highLowDelete = params => {
  return routeAxios.request({
    url: "/config/orderValueStrategy/delete",
    method: "post",
    data: params
  });
};
export const highLowList = params => {
  return routeAxios.request({
    url: "/config/orderValueStrategy/pageQuery",
    method: "post",
    data: params
  });
};

// --------------------司机订单流水设置------------------------

export const getDriverOrderList = params => {
  return axios.request({
    url: "/admin/driver/orderFlow/queryOrderFlowPage",
    method: "post",
    data: params
  });
};

// 司机工资类别接口
export const getDicItemByDicCode = params => {
  return api4Driver.request({
    url: "/api/v1/salaryRule/getDicItemByDicCode",
    method: "post",
    data: params
  });
};

// 启用
export const orderUpdateStatus = params => {
  return axios.request({
    url: "/admin/driver/orderFlow/updateStatus",
    method: "post",
    data: params
  });
};

// 删除
export const driverOrderDel = params => {
  return axios.request({
    url: "/admin/driver/orderFlow/del",
    method: "post",
    data: params
  });
};

// 新增
export const driverOrderAdd = params => {
  return axios.request({
    url: "/admin/driver/orderFlow/save",
    method: "post",
    data: params
  });
};

// 编辑
export const driverOrderEdit = params => {
  return axios.request({
    url: "/admin/driver/orderFlow/update",
    method: "post",
    data: params
  });
};
// ---------------派单策略-限号限行-start---------------------
// 限号限行-新增
export const axiosTrafficAdd = params => {
  return axios.request({
    url: "/admin/trafficRestStrategy/save",
    method: "post",
    data: params
  });
};
// 限号限行-编辑
export const axiosTrafficEdit = params => {
  return axios.request({
    url: "/admin/trafficRestStrategy/update",
    method: "post",
    data: params
  });
};
// 限号限行-详情
export const axiosTrafficDetail = params => {
  return axios.request({
    url: "/admin/trafficRestStrategy/getInfo",
    method: "post",
    data: params
  });
};
// 限号限行-删除
export const axiosTrafficDelete = params => {
  return axios.request({
    url: "/admin/trafficRestStrategy/delete",
    method: "post",
    data: params
  });
};
// 限号限行-列表
export const axiosTrafficList = params => {
  return axios.request({
    url: "/admin/trafficRestStrategy/queryPage",
    method: "post",
    data: params
  });
};
// ---------------派单策略-限号限行-end---------------------

// 司机附加费start
// 分页列表接口
export const surchargePageQuery = data => {
  return routeAxios.request({
    url: "/config/surcharge/pageQuery",
    data,
    method: "post"
  });
};

// 新增接口
export const surchargeSave = data => {
  return routeAxios.request({
    url: "/config/surcharge/save",
    data,
    method: "post"
  });
};

// 编辑接口
export const surchargeUpdate = data => {
  return routeAxios.request({
    url: "/config/surcharge/update",
    data,
    method: "post"
  });
};

// 详情接口
export const surchargeDetai = data => {
  return routeAxios.request({
    url: "/config/surcharge/detail",
    data,
    method: "post"
  });
};
  // 删除接口
export const deleteItem = data => {
  return routeAxios.request({
    url: "/config/surcharge/delete",
    data,
    method: "post"
  });
};
  // 司机附加费eng

// ---------------派单策略优化-start---------------------

// 产品线及订单来源优先级策略-查询策略
export const getallOrderDispatchQuery = data => {
  return routeAxios.request({
    url: "/admin/allOrderDispatchController/pageStrategy",
    data,
    method: "post"
  });
};
  // 产品线及订单来源优先级策略-新建策略
export const addStrategySave = data => {
  return routeAxios.request({
    url: "/admin/allOrderDispatchController/addStrategy",
    data,
    method: "post"
  });
};
  // 产品线及订单来源优先级策略-策略删除
export const delStrategy = data => {
  return routeAxios.request({
    url: "/admin/allOrderDispatchController/delStrategy",
    data,
    method: "post"
  });
};
  // 产品线及订单来源优先级策略-策略详情
export const getInfoStrategy = data => {
  return routeAxios.request({
    url: "/admin/allOrderDispatchController/infoStrategy",
    data,
    method: "post"
  });
};

// 产品线及订单来源优先级策略-编辑策略
export const updataStrategy = data => {
  return routeAxios.request({
    url: "/admin/allOrderDispatchController/updataStrategy",
    data,
    method: "post"
  });
};

// ---------------派单策略优化-end---------------------

// ---------------开城配置-start---------------

// 开城列表
export const getOpencityListData = data => {
  return axios.request({
    url: "/config/opencity/listData",
    method: "post",
    data: data
  });
};
// 开城---城市列表
export const getCitys = data => {
  return axios.request({
    url: "/common/citys",
    method: "post",
    data: data
  });
};

// 开城---区县列表
export const getAreaInfoByCityCode = data => {
  return axios.request({
    url: "/common/getAreaInfoByCode",
    method: "post",
    data: data,
    params: data
  });
};

// 司机附加费eng

// 开城---区县列表
export const addOpenCity = data => {
  return axios.request({
    url: "/config/opencity/addCity",
    method: "post",
    data: data
  });
};


// 开城---开启/关闭
export const switchCityStatus = data => {
  return axios.request({
    url: "/config/opencity/city/status",
    method: "post",
    data: data
  });
};
// ----------------开成配置--end-----------

// ----------------司机定价策略隔离--start-----------

// 司机定价开城列表
export const getDriverFareListData = data => {
  return routeAxios.request({
    url: "/config/driverFareConfig/pageQuery",
    method: "post",
    data: data
  });
};

// 添加司机定价策略开城城市
export const addDriverFare = data => {
  return routeAxios.request({
    url: "/config/driverFareConfig/save",
    method: "post",
    data: data
  });
};

// 司机定价策略 启动/关闭
export const driverFareEnable = data => {
  return routeAxios.request({
    url: "/config/driverFareConfig/changeStatus",
    method: "post",
    data: data
  });
};

// 获取司机/乘客定价策略列表  onsumerType 1是乘客，2是司机
export const getCityPriceStrategyList = data => {
  return routeAxios.request({
    url: "/config/cityPriceStrategy/pageQuery",
    method: "post",
    data: data
  });
};

// ----------------司机定价策略隔离--end-----------

// ---------------业务线与车型等级关系管理 菜单管理-start---------------

// 更新业务线与车型等级关系
export const updateExpandBizLine = data => {
  return axios.request({
    url: "/config/opencity/updateExpandBizLine",
    method: "post",
    data: data
  });
};

// 获取开城记录
export const queryListByExpandBizLine = data => {
  return axios.request({
    url: "/config/opencity/queryListByExpandBizLine",
    method: "post",
    data: data
  });
};

function createRequest(api, url) {
  return data => api.request({url, data, method: "post"});
}

function createRequestWith(api) {
  return url => createRequest(api, url);
}

const strategyRequest = createRequestWith(routeAxios);

// 获取司机流水策略规则列表
export const queryDriverWaterflowStrategyRuleList = strategyRequest("/api/v1/channel/switch/queryPage")

// 获取工资类别
export const querySalaryDriverTypes = strategyRequest("/api/driver/config/findAllDriverTypes")

// 获取渠道类别
export const queryChannelList = strategyRequest("/admin/transferRuleController/getSources")

// 启停用策略规则
export const updateStrategyStatus = strategyRequest("/api/v1/channel/switch/changestatus")

// 策略详情
export const queryStrategyDetail = strategyRequest("/api/v1/channel/switch/queryByUuid")

// 策略下拉框列表
export const queryStrategyList = strategyRequest("/config/channelPriceStrategy/pageQuery")

// 新增策略
export const postStrategy = strategyRequest("/api/v1/channel/switch/save")

// 编辑策略
export const patchStrategy = strategyRequest("/api/v1/channel/switch/edit")


// 司机取消策略新接口
// 分页查询
export const axiosDriverCancelStrategyList = strategyRequest("/config/driverCancelStrategy/pageQuery")

// 查询司机取消策略配置详情
export const axiosDriverCancelStrategyDetail = strategyRequest("/config/driverCancelStrategy/detail")

// 删除取消策略
export const axiosDriverCancelStrategyDelete = strategyRequest("/config/driverCancelStrategy/delete")

// 删除取消策略
export const axiosDriverCancelStrategyAdd = strategyRequest("/config/driverCancelStrategy/save")

// 修改派车单距离策略状态
export const axiosdispatchDistanceUpdateSatatus = strategyRequest("/system/dispatchDistance/updateSatatus")