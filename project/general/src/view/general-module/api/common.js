import axios from "_g/config/api.request";
import axios4Company from "_g/config/api4Company.request";
import axios4Market from "_g/config/api4Market.request";
import axios4Vague from "_g/config/api4Vague.js"
import axios4Common from "_o/config/api4Common.request";
import routeAxios from "_g/config/api4Route.request";
import {
  axiosHttpRequest
} from "@/libs/util";
import api4Vague from "../config/api4Vague";

// 下载文件
export const downloadFile = params => {
  return axios.request({
    url: "/common/downloadZip",
    method: "post",
    data: params
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

// 获取产品线接口
export const getBizList = (data = {}) => {
  return axios.request({
    url: "/admin/business/list",
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
/**
 * 根据业务线查询开通城市
 * @param {Array} businessLineList 产品线枚举值列表，必填，默认[1,2,4,5,8]
 * TAXI(1, "出租车"),
 * SPECIAL_CAR(2, "专享"),
 * EXPRESS_TRAIN(4, "快享"),
 * PICK_RIDE(5,"顺风车"),
 * CHARTERED_CAR(8, "包车")
 */
export const getAppointedCityList = data => {
  if (!data.businessLineList || data.businessLineList.length === 0) {
    data.businessLineList = [1, 2, 4, 5, 8]
  }
  return axios.request({
    url: "/common/getAppointedCityNotAuth",
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

// 获取所有城市信息-组织信息(没有省份级联)
export const getCitiesWithOrgan = data => {
  return axios4Market.request({
    url: "/common/queryCitiesWithAgent",
    method: "post",
    data
  });
};
/** 远程模糊搜索公用api
 * @param url
 * @param data 传参
 */
export const vagueCommonHandle = (url, data) => {
  return api4Vague.request({
    url,
    data,
    method: "post"
  })
}

// 获取同级运营商列表
export const getAgentList = data => {
  return axios.request({
    url: "/admin/driver/agents",
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

/** 用户表头设置 */
export const setTableTitle = data => {
  return axios.request({
    url: "/sys/usr/table/settings",
    data,
    method: "post"
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

// 数据字段
export const getDataDict = () => {
  return axiosHttpRequest().request({
    url: "member-web-api/api/memberCenter/common/queryMemberDictList",
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

/** 企业用车远程模糊搜索公用api
 * @param url
 * @param data 传参
 */
export const vagueCommonHandle4Company = (url, data) => {
  return axios4Company.request({
    url,
    data,
    method: "post"
  });
};

// 活动管理-操作记录
export const axios4MarketOperationRecords = data => {
  return axiosHttpRequest().request({
    url: "/marketing-web-api/common/operationRecords",
    data,
    method: "post"
  });
};


/**
 * 数据权限相关接口-------------------start
 */

//
/**
 * 获取权限内对应业务线的已配置/已开启-----省市级联列表(m2-admin，不包含企业用车)
 * data入参,下面两个为必填字段
 * @param {Number} areaType 1-已配置城市（包括城市列表中的启用和停用城市） 2-已开通城市（城市列表中的启用城市）
 * @param {Array} businessLineList 产品线枚举值列表，必填[1,2,4]比传
 *        TAXI(1, "出租车"),
 *        SPECIAL_CAR(2, "专享"),
 *        CROSS_CITY(3, "跨城"),
 *        EXPRESS_TRAIN(4, "快享"),
 *        PICK_RIDE(5,"顺风车"),
 *        CHARTERED_CAR(8, "包车")
 * @param {Array} authDimension  权限维度（1-城市，2-城市+机构）,必填
 */
export const getAppointedProvinceCityInAuth = data => {
  if (!data.businessLineList || data.businessLineList.length === 0) {
    data.businessLineList = [1, 2, 4, 6, 7] // 211129--默认add惠享和自动驾驶
  }
  // 和产品确认（陈熙芬），因机构涉及到城市查询会有问题，暂时以岗位配置的城市为维度限制
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/getAppointedProvinceCityInAuth",
    data,
    method: "post"
  });
};
//
/**
 * 获取权限内对应业务线的已配置/已开启----城市列表(m2-admin，不包含企业用车)
 * data入参,下面两个为必填字段
 * @param {Number} areaType 1-已配置城市（包括城市列表中的启用和停用城市） 2-已开通城市（城市列表中的启用城市）
 * @param {Array} businessLineList 产品线枚举值集合，
 * @param {Array} authDimension  权限维度（1-城市，2-城市+机构）,必填
 */
export const getAppointedCityInAuth = data => {
  // 和产品确认（陈熙芬），因机构涉及到城市查询会有问题，暂时以岗位配置的城市为维度限制
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/getAppointedCityInAuth",
    data,
    method: "post"
  });
};
/**
 * 获取权限内对应业务线的已配置/已开启----城市列表（common-web-api，包含企业用车 ）
 * data入参,下面两个为必填字段
 * @param {Number} areaType 1-已配置城市（包括城市列表中的启用和停用城市） 2-已开通城市（城市列表中的启用城市）
 * @param {Array} businessLineList 产品线枚举值集合，
 *        TAXI(1, "出租车"),
 *        SPECIAL_CAR(2, "专享"),
 *        CROSS_CITY(3, "跨城"),
 *        EXPRESS_TRAIN(4, "快享"),
 *        PICK_RIDE(5,"顺风车"),
 *        CHARTERED_CAR(8, "包车"),
 *        FIRM_TRAIN(11, "企业用车");
 * @param {Array} authDimension  权限维度（1-城市，2-城市+机构）,必填
 */
// 此接口已废弃，
export const getCommonAppointedCityInAuth = data => {
  // 和产品确认（陈熙芬），因机构涉及到城市查询会有问题，暂时以岗位配置的城市为维度限制
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/getAppointedCityInAuth",
    data,
    method: "post"
  });
};

// 根据城市获取权限内对应-运营商列表
// cityCode-String-根据城市查询
export const getAgentByCityAuth = data => {
  // 和产品确认（陈熙芬），因机构涉及到城市查询会有问题，暂时以岗位配置的城市为维度限制
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/getAuthAgentByCity",
    data,
    method: "post"
  })
}

// 获取全国城市+有权限的城市市，取交集
export const getNationalCityInAuth = data => {
  if (!data.authDimension) data.authDimension = 1
  return axios4Common.request({
    url: "/common/getNationalCityAuth",
    data,
    method: "post"
  });
};
// 获取全国城市+有权限的省市级联，取交集
// authDimension 权限维度（1-城市，2-城市+机构）,必填
export const getNationalAreaInAuth = data => {
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/v1/auth/city/list",
    data,
    method: "post"
  });
};
// 获取全国城市+有权限的省市级联，取交集
// authDimension 城市+机构
export const getAgentListInAuth = data => {
  return axios.request({
    url: "/common/v1/auth/agent/list",
    data,
    method: "post"
  });
};


/**
 * 数据权限相关接口----------------------end
 */


/** 已开通城市枚举列表接口 */
export const getOnLineCity = (data) => {
  return axios.request({
    url: "/healthCar/mask/getOnLineCity",
    data,
    method: "POST"
  })
}
/** 运营商枚举列表接口 */
export const getAgentByCity = (data) => {
  return axios.request({
    url: "/healthCar/mask/getAgentByCity",
    data,
    method: "POST"
  })
}
/** 司管枚举列表接口 */
export const getDriverByAgent = (data) => {
  return axios.request({
    url: "/healthCar/mask/getDriverByAgent",
    data,
    method: "POST"
  })
}


// 自定义列
// 保存
/**
 *
 * @param {Number} type
 * 1:短信管理
 * 2:push管理
 */
export const saveDefiendColumn = (data) => {
  return axios.request({
    url: "/api/data/center/definedColumns/save",
    data,
    method: "POST"
  })
}
// 查询
export const getDefiendColumn = (data) => {
  return axios.request({
    url: "/api/data/center/definedColumns/read",
    data,
    method: "POST"
  })
}

// 获取车型等级
export const getGradeList = params => {
  return axios.request({
    url: "/common/getGradeList",
    method: "post",
    data: params
  });
};

// 获取车型等级
export const getBusinessGradeProduct = params => {
  return axios.request({
    url: "/api/assets/v1/vehicle/getBusinessGradeProduct",
    method: "post",
    data: params
  });
};


/**
 * @description: 接送机--获取渠道
 * @param {*}
 * @return {*}
 */
export const queryChannel = data => {
  return routeAxios.request({
    url: "/admin/transferRuleController/getSources",
    data,
    method: "post"
  });
};
