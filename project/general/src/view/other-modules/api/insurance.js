/*
 *@description: 保单信息接口文件
 *@author: DK
 *@date: 2019-07-27 09:52:29
 */

import axios from "_g/config/api.request";

/*
 *@description: 保单信息列表接口
 *@author: DK
 *@date: 2019-07-27 09:53:51
 */
export const getInsuranceList = params => {
  return axios.request({
    url: "/admin/order/queryInsuranceList",
    method: "post",
    data: params
  });
};

// 根据保单编号获取文件
export const queryInsuranceFile = params => {
  return axios.request({
    url: "/admin/order/queryInsuranceFile",
    method: "post",
    data: params
  });
};
