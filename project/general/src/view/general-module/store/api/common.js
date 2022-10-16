import axios from "_g/config/api.request";
import api4partner from "_o/config/api4partner.request";

/** 获取司机姓名 */
export const getDriverName = data => {
  return axios.request({
    url: "/admin/driver/names",
    data,
    method: "post"
  });
};

/** 获取车型 */
export const getCarModel = data => {
  return axios.request({
    url: "/admin/driver/models",
    data,
    method: "post"
  });
};

/** 获取车牌号 */
export const getCarNoList = data => {
  return axios.request({
    url: "/admin/driver/plateNums",
    data,
    method: "post"
  });
};

/** 用户表头设置 */
export const setTableTitle = data => {
  return axios.request({
    url: "/sys/usr/table/settings",
    data,
    method: "post"
  });
};

/** 获取用户设置的表头 */
export const getTableTitle = data => {
  return axios.request({
    url: "/sys/usr/table/settingListData",
    data,
    method: "post"
  });
};

// 获取全国省、市级联列表
export const getWholeRegion = data => {
  return axios.request({
    url: "/common/citys",
    data,
    method: "post"
  });
};

// 获取开通城市，同级的市列表
export const getCitys = (data = {}) => {
  return axios.request({
    url: "/common/listCityData",
    data,
    method: "post"
  });
};

// 获取已开通省、市级联列表
export const getProvinceCityList = (data = {}) => {
  return axios.request({
    url: "/common/listProvinceCityData",
    data: data,
    method: "post"
  });
};
// 获取配置管理-开通城市管理中配置过的（包含已开通和未开通）城市（省市级联）
export const getProvinceCityAllList = (data = {}) => {
  return axios.request({
    url: "/common/listProvinceCityAllData",
    data: data,
    method: "post"
  });
};
// 获取配置管理-开通城市管理中配置过的（包含已开通和未开通）城市（城市列表，没有级联）
export const axiosSetCityList = data => {
  return axios.request({
    url: "/common/listCityAllData",
    data,
    method: "post"
  });
};

// 获取带省、市、运营商级联列表
export const getCityOperatorTree = () => {
  return axios.request({
    url: "/carDriver/operatorList",
    method: "get"
  });
};

// 获取所有城市信息-已配置城市(没有省份级联)
export const getConfigCityList = data => {
  return axios.request({
    url: "/common/listCityAllData",
    method: "post",
    data
  });
};

// 获取同级运营商列表
export const getAgentList = data => {
  return axios.request({
    url: "/admin/driver/agents",
    data,
    method: "post"
  });
};
/** 远程模糊搜索公用api
 * @param url
 * @param data 传参
 */
export const vagueCommonHandle = (url, data) => {
  return axios.request({
    url,
    data,
    method: "post"
  });
};

// 用户群和优惠券模板操作记录
export const axiosOperationRecords = data => {
  return axios.request({
    url: "/common/operationRecords",
    data,
    method: "post"
  });
};

// 后台计算数据接口
export const calculate = data => {
  return axios.request({
    url: "/common/calculation",
    method: "post",
    data
  });
};
// ------------------------根据登录用户，获取该用户权限下拥有权限访问的城市列表和省市运营商级联列表------------------
export const axiosAccessCityAgent = data => {
  return axios.request({
    url: "/common/userAuth/getDataAccess",
    data,
    method: "post"
  });
};
// ------------------------根据登录用户，获取该用户权限下拥有权限访问的省市级联列表------------------
export const axiosAccessProvinceCity = data => {
  return axios.request({
    url: "/common/userAuth/getAuthProvinceCity",
    data,
    method: "post"
  });
};

// 下载文件
export const downloadFile = params => {
  return axios.request({
    url: "/common/downloadZip",
    method: "post",
    data: params
  });
};

// 查询司机类型
export const queryDriverType =  data => {
  return api4partner.request({
    url: "/api/common/driver/queryDriverType",
    data,
    method: "post"
  })
}

