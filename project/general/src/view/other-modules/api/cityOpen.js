/**
 * @description 顺风车开城模块
 */
import axios from "_g/config/api.request"; // 服务名admin

export class ErrorResult extends Error {
  constructor(data) {
    super();
    this.code = data.code;
    this.msg = data.msg;
  }
}

/**
 * @description axios请求封装
 * @param p
 * @returns {*}
 */
export const toResult = p => {
  return p
    .then(v => {
      if (v.data.success && v.data.code === 200) {
        return Promise.resolve([null, v.data.data]);
      } else {
        return Promise.reject(new ErrorResult(v.data));
      }
    })
    .catch(e => Promise.resolve([e, null]));
};

// 获取全国省、市级联列表
export const getWholeRegion = data => {
  return axios.request({
    url: "/common/citys",
    data,
    method: "post"
  });
};
// 顺风车开通城市列表
export const openCityQueryCityList = data => {
  return axios.request({
    url: "/admin/openCity/queryCityList",
    method: "post",
    data
  });
};

// 顺风车开通城市列表，不分页，用于下拉框选择
export const queryOpenedCityList = params => {
  return axios.request({
    url: "/admin/openCity/queryCityList",
    method: "post",
    data: {
      currPage: 1,
      pageSize: 1000,
      ...params
    }
  });
};
export const queryHitchCityList = params => {
  return axios.request({
    url: "/admin/openCity/queryOpenedCityList",
    method: "post",
    data: {
      currPage: 1,
      pageSize: 1000,
      ...params
    }
  });
};

// 获取问题反馈分页列表
export const queryFeedbackList = data => {
  return axios.request({
    url: "/admin/problemFeedback/queryProblemFeedbackList",
    method: "post",
    data
  });
};
// 顺风车开启城市
export const openCity = data => {
  return axios.request({
    url: "/admin/openCity/openCity",
    method: "post",
    data
  });
};
// 顺风车关闭城市
export const closeCity = data => {
  return axios.request({
    url: "/admin/openCity/closeCity",
    method: "post",
    data
  });
};
// 顺风车关闭城市
export const addCity = data => {
  return axios.request({
    url: "/admin/openCity/addCity",
    method: "post",
    data
  });
};
// 顺风车定价策略查询
export const pricePolicySelectList = data => {
  return axios.request({
    url: "/admin/pickride/pricePolicy/selectList",
    method: "post",
    data
  });
};
// 顺风车定价策略新增
export const addPricePolicy = data => {
  return axios.request({
    url: "/admin/pickride/pricePolicy/addPricePolicy",
    method: "post",
    data
  });
};
// 顺风车定价策略计算
export const pricePolicyCalculate = data => {
  return axios.request({
    url: "/admin/pickride/pricePolicy/calculate",
    method: "post",
    data
  });
};
// 顺风车定价策略删除
export const deletePricePolicy = data => {
  return axios.request({
    url: "/admin/pickride/pricePolicy/deletePricePolicy",
    method: "post",
    data
  });
};
// 顺风车定价策略详情
export const pricePolicySelectDetails = data => {
  return axios.request({
    url: "/admin/pickride/pricePolicy/selectDetails",
    method: "post",
    data
  });
};
// 顺风车定价策略编辑
export const updatePricePolicy = data => {
  return axios.request({
    url: "/admin/pickride/pricePolicy/updatePricePolicy",
    method: "post",
    data
  });
};
// 顺风车抽成策略查询
export const cutPolicySelectList = data => {
  return axios.request({
    url: "/admin/pickride/cutPolicy/selectList",
    method: "post",
    data
  });
};
// 顺风车抽成策略新增
export const addCutPolicy = data => {
  return axios.request({
    url: "/admin/pickride/cutPolicy/addCutPolicy",
    method: "post",
    data
  });
};
// 顺风车抽成策略详情
export const cutPolicySelectDetails = data => {
  return axios.request({
    url: "/admin/pickride/cutPolicy/selectDetails",
    method: "post",
    data
  });
};
// 顺风车抽成策略编辑
export const cutPolicyUpdateCutPolicy = data => {
  return axios.request({
    url: "/admin/pickride/cutPolicy/updateCutPolicy",
    method: "post",
    data
  });
};
// 顺风车抽成策略删除
export const cutPolicyDeleteCutPolicy = data => {
  return axios.request({
    url: "/admin/pickride/cutPolicy/deleteCutPolicy",
    method: "post",
    data
  });
};
