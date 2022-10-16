/* eslint-disable no-confusing-arrow */
import axios from "_o/config/api4partner.request";
const createRequest = url => data => axios.request({ method: 'post', url, data }).then(({ data: res }) => res.success ? res.data : Promise.reject(res));

export const queryOrderList = createRequest('/api/ban/config/page');
export const queryOrder = createRequest('/api/ban/config/detail');
export const submitOrder = createRequest('/api/ban/config/submit');
export const deleteOrder = createRequest('/api/ban/config/delete');
export const enableOrder = createRequest('/api/ban/config/enable');
export const disableOrder = createRequest('/api/ban/config/disable');
export const queryCityList = createRequest('/api/ban/config/queryCityList');
