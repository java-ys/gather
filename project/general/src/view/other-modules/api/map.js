import axios from "_g/config/api.request";

// 订单热力图--根据业务线查询热力图
export const getHexagonData = params => {
    return axios.request({
      url: 'admin/thermodynamicChart/query',
      data: params,
      method: 'POST'
    });
  };

  // 订单热力图--根据业务线查询热力图
export const getEfenceForCity = params => {
    return axios.request({
      url: 'admin/sysElectronicFence/selectInfo',
      data: params,
      method: 'POST'
    });
  };
  // 订单热力图--城市列表
  export const getCityCodeList = params => {
    return axios.request({
      url: 'common/getAppointedCityInAuth',
      data: params,
      method: 'POST'
    });
  };
