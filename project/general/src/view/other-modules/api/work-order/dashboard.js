/**
 * 我的工单-工作台
 */
import api4partner from "_o/config/api4partner.request";

// 工单管理-分类管理-查询
export const orderYyList = params => {
  return api4partner.request({
    url: "/manage/order/yy/list",
    method: "post",
    data: params
  });
};

// 工单管理-分类管理-待审工单查询
export const orderYyListOfDb = params => {
  return api4partner.request({
    url: "/manage/order/yy/listOfDb",
    method: "post",
    data: params
  });
};

export const exportworkOrderData = async params => {
  return api4partner.request({
    url: "/manage/orders/export",
    method: "post",
    data: params,
    // headers: {
    //   "Content-Type": "application/json;charset=UTF-8"
    // },
    responseType: "blob"
  });
};


// 删除工单
export const delWorkOrder = data => {
  return api4partner.request({
    url: "/manage/order/yy/delete",
    data,
    method: "post"
  });
};

// 人工改派
export const pullReassign = data => {
  return api4partner.request({
    url: "/manage/order/yy/reassign",
    data,
    method: "post"
  });
};

// 工单-指派记录
export const fetchAssignLog = data => {
  return api4partner.request({
    url: "/manage/order/yy/hist/reassignList",
    data,
    method: "post"
  });
};
