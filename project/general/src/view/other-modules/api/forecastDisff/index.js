import axios from "_g/config/apiEmpty.request";

// 订单热力图--实时供需预测
export const getRealPrediction = params => {
    return axios.request({
      url: '/v1/getRealPrediction',
      params: params,
      method: 'get'
    });
  };

  // 订单热力图--历史供需匹配
export const getHistoryPrediction = params => {
    return axios.request({
      url: '/v1/getHistoryPrediction',
      params: params,
      method: 'get'
    });
  };
  // 订单热力图--供需分时分布
  export const getPredictionDistribute = params => {
    return axios.request({
      url: '/v1/getPredictionDistribute',
      params: params,
      method: 'get'
    });
  };
  
  // 订单热力图--城市列表
  export const getTypeList = params => {
    return axios.request({
      url: '/v1/getTypeList',
      params: params,
      method: 'get'
    });
  };

    // 订单热力图--导出
    export const downloadPrediction = params => {
      return axios.request({
        url: '/v1/downloadPrediction',
        params: params,
        method: 'get'
      });
    };