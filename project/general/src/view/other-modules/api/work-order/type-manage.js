/**
 * 工单管理-分类管理
 */
import api4partner from "_o/config/api4partner.request";

 // 工单管理-分类管理-查询
export const seachAxios = (params) => {
    return api4partner.request({
      url: "/admin/healthCard/fuzzyQuery",
      method: "post",
      data: params,
    })
  }