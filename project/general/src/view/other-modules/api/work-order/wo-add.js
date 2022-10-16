import api4partner from "_o/config/api4partner.request";

// 工单管理- 新增
 export const orderCreate = (params) => {
    return api4partner.request({
      url: "/manage/order/yy/create",
      method: "post",
      data: params,
    })
  }

