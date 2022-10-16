import axios4Company from "_o/config/api4Company.request";

export const getOpenList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyOpenConfig/manager/cityList",
    data,
    method: "POST"
  });
};

// 定价管理-查询企业
export const getModelsLeveList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/companyList",
    data,
    method: "post"
  });
};

// 定价管理-新增企业
export const addCmpany = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/addCompany",
    data,
    method: "post"
  });
};

// 开通管理-新增城市
export const addCity = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyOpenConfig/manager/addCity",
    data,
    method: "post"
  });
};

// 开通管理 - 关闭城市
export const turnoffCity = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyOpenConfig/manager/updateCity",
    data,
    method: "post"
  });
};

// 开通管理 - 开启城市
export const turnOnCity = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyOpenConfig/manager/updateCity",
    data,
    method: "post"
  });
};

// 定价管理 - 关闭城市企业
export const turnoffCompany = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/updateCompanyStatus",
    data,
    method: "post"
  });
};

// 定价管理 - 开启城市企业
export const turnOnCompany = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/updateCompanyStatus",
    data,
    method: "post"
  });
};

// 定价管理 - 删除企业
export const deleteEnterprise = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/deleteCompany",
    data,
    method: "post"
  });
};

// 定价管理 - 查看历史版本
export const queryHistoryVersion = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/queryHistoryVersion",
    data,
    method: "post"
  });
};

// 定价管理 - 新增策略
export const addStrategy = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/addStrategy",
    data,
    method: "post"
  });
};

// 定价管理 - 编辑策略
export const editStrategy = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/editStrategy",
    data,
    method: "post"
  });
};

// 定价管理 - 策略详情
export const strategyDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/strategyDetail",
    data,
    method: "post"
  });
};
// 发票管理 - 发票列表
export const invoiceList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/finance/wallet/invoiceList",
    data,
    method: "post"
  });
};
// 发票管理 - 发票详情
export const invoiceDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/finance/wallet/invoiceDetail",
    data,
    method: "post"
  });
};
// 发票管理 - 送出操作
export const transportMethod = data => {
  return axios4Company.request({
    url: "/api/boss/inner/finance/wallet/invoiceSendout",
    data,
    method: "post"
  });
};
//获取企业详情
export const getCompanyDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/detail",
    data,
    method: "POST"
  });
};

//获取协议管理
export const getProtocolList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/protocolConfig/manager/protocolList",
    data,
    method: "POST"
  });
};

//新增协议
export const addProtocol = data => {
  return axios4Company.request({
    url: "/api/boss/inner/protocolConfig/manager/addProtocol",
    data,
    method: "POST"
  });
};
