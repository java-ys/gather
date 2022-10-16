import axios from "_g/config/api.request";
import axios4Company from "_o/config/api4Company.request";
/* 
企业钱包
*/
//获取企业钱包
export const getCompanyList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/wallet/list",
    data,
    method: "POST"
  });
};
//获取电子发票账单信息
export const getBillImg = data => {
  return axios.request({
    url: data.url,
    method: "POST"
  });
};
