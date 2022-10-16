import api4partner from "_o/config/api4partner.request";

// 查询违规工单明细
export const fetchWorkOrderIllegal = data => {
  return api4partner.request({
    url: "/manage/orders/searchYy",
    data,
    method: "post"
  });
};

// 导出违规工单数据
export const exportWorkOrderIllegalData = async params => {
  return api4partner.request({
    url: "/manage/orders/exportYy",
    method: "post",
    data: params,
    responseType: "blob"
  });
};
