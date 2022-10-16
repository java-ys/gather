import axios4Company from "_o/config/api4Company.request";

// 查询所有企业信息
export const getCompanys = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/queryCompanyByName",
    data: { enteroriseName: "" },
    method: "post"
  });
};
// 查询所有企业信息
export const getCityList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyOpenConfig/manager/listOpenedCitys",
    data,
    method: "post"
  });
};
export const getExpress = data => {
  return axios4Company.request({
    url: "/api/boss/inner/finance/wallet/getExpress",
    data,
    method: "post"
  });
};
