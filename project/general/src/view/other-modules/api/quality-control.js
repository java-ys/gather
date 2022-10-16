import HttpRequest from '@/libs/axios.js';
import config from '@/config/config';


/**
 * 封装请求返回
 * @param {*} p promise对象
 * @returns [err, data]
 */
export const toResult = (p) => {
  return p
    .then((v) => {
      if (v.data.success && v.data.code === 200) {
        return Promise.resolve([ null, v.data.data ]);
      } else {
        return Promise.reject(v.data);
      }
    })
    .catch((e) => Promise.resolve([ e, null ]));
};

class Axios extends HttpRequest {
  constructor(props) {
    super(props);
  }
  post(url, data) {
    return this.request({
      url,
      method: 'post',
      data
    });
  }
  get(url, data) {
    return this.request({
      url,
      method: 'get',
      data
    });
  }
}
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
const axios = new Axios(baseUrl + '/m2-admin');
//获取工单列表
export const getOrderDetailList = (data) => axios.post('admin/driver/compliance/workOrderList', data);
// 获取工单列表详情
export const getOrderDetail = (data) => axios.post('admin/driver/compliance/workOrderDetail',data);

// 获取工单汇总列表
export const getOrderCollectList = (data) => axios.post('admin/driver/compliance/workOrderStatistics', data);

// 获取申诉工单明细列表
export const getAppealOrderDetailList = (data) => axios.post('admin/driver/compliance/appealWorkOrderList', data);
// 获取申诉工单详情
export const getAppealOrderDetail = (data) => axios.post('admin/driver/compliance/appealWorkOrderDetail',data);

// 获取申诉工单汇总列表
export const getAppealOrderCollectList = (data) => axios.post('admin/driver/compliance/appealWorkOrderStatistics', data);

// 获取工单视频列表
export const getOrderVideoList = (data) => axios.post('admin/driver/compliance/approvalWorkOrderVideo', data);
//工单视频状态修改
export const changeOrderVideoStatus = (data) => axios.post('admin/driver/compliance/updateApprovalStatus', data);
// 工单视频查看视频列表
export const getVideoList = (data) => axios.post('admin/driver/compliance/getVideoList', data);

// 通过城市获取运营商
export const getAgentByCity = (data) => axios.post('admin/driver/compliance/getAgentByCity',data);
// 获取工单类型
export const getOrderTypeData = (data) => axios.post('admin/driver/compliance/getOrderClassForTree', data);
