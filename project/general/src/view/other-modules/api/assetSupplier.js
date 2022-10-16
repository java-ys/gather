/**
 * 供应商信息管理
 */

import axios from "_g/config/apiAssetSupplier.request";
// 列表查询接口
export const queryPage = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/queryPage",
    method: "post",
    data: data
  });
};

// 供应商名称  编码模糊搜索
export const getSupplierName = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/listNameOrCode",
    method: "post",
    data: data
  });
};

// 联系人或联系电话模糊搜索
export const getNameOrTel = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/listNameOrTel",
    method: "post",
    data: data
  });
};

// 联系人或联系电话模糊搜索
export const cityList = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/getCityList",
    method: "post",
    data: data
  });
};

// 获取开户行
export const getBankList = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/getBankList",
    method: "post",
    data: data
  });
};

//编辑、详情接口
export const getDetail = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/getSrmDetailDtoByUuid",
    method: "post",
    data
  });
};

// 供应商启用停用接口
export const enableAndStop = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/updateEnableFlag",
    method: "post",
    data: data
  });
};

// 供应商删除接口
export const deleteSupplier = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/updateDelete",
    method: "post",
    data: data
  });
};

// 新增和编辑保存
export const addAndEditSave = data => {
  return axios.request({
    url: "/api/assets/v1/supplier/saveSupplier",
    method: "post",
    data: data
  });
};
// 查询（三户）资产公司（用于下拉）
export const queryListFromCua = data => {
  return axios.request({
    url: "/api/assets/v1/company/queryListFromCua",
    method: "post",
    data: data
  });
}
// 查询资产公司列表
export const assetCompanyQueryList = data => {
  return axios.request({
    url: "/api/assets/v1/company/queryList",
    method: "post",
    data: data
  });
}
// 保存（新增和更新）账户
export const accountSave = data => {
  return axios.request({
    url: "/api/assets/v1/account/save",
    method: "post",
    data: data
  });
}
// 查询企业的账户信息
export const getAccountDetail = data => {
  return axios.request({
    url: "/api/assets/v1/account/query",
    method: "post",
    data: data
  });
}
