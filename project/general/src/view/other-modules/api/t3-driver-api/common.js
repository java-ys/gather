import api4driver from "_o/config/api4driver.request";
import axios4Market from "_g/config/api4Market.request";
import request4Driver from "_g/config/api4Driver";

// 查询司机标签
export const getDriverLabel = data => {
  return api4driver.request({
    url: "/api/driver/dictionary/queryDriverLabel",
    data,
    method: "post"
  });
};

// 开通城市校验
export const queryOpenCityShift = data => {
  return api4driver.request({
    url: "/api/shift/rule/queryOpenCityShift",
    data,
    method: "post"
  });
};

// 获取所有城市信息-组织信息(没有省份级联)
export const getCitiesWithOrgan = data => {
	return axios4Market.request({
		url: '/common/queryCitiesWithAgent',
		method: 'post',
		data
	});
};


/**
 *
 * currPage (integer, optional): 当前页数 ,
 * pageSize (integer, optional): 每页显示数量 ,
 * driverName (string, optional): 司机姓名 ,
 * mobile (string, optional): 手机号 ,
 * queryType (integer, optional): 查询类型： 1.手机号 2.司机姓名
 * @param {*} data
 * 司机姓名/手机号模糊搜索
 */
export const driverNameMobileService = data => {
	return api4driver.request({
		url: '/api/approve/info/driverNameMobileFuzzySearch',
		method: 'post',
		data
	});
};


/**
 * currPage (integer, optional): 当前页数 ,
 * pageSize (integer, optional): 每页显示数量 ,
 * plateNum (string, optional): 车牌号 ,
 * queryType (integer, optional): 查询类型： 1.车架号 2.车牌号 ,
 * vin (string, optional): 车架号
 * @param {*} data
 * 车架号/车牌号模糊搜索
 */
export const vinPlateService = data => {
	return api4driver.request({
		url: '/api/approve/info/vinPlateNumFuzzySearch',
		method: 'post',
		data
	});
};

/**
 *
 * @param data { agentId: string }
 * @returns {*}
 */
export const queryDriverManagerUser = data => {
  return request4Driver.request({
    url: '/api/common/service/queryDriverManagerUser',
    method: 'post',
    data
  });
};
