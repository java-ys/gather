/*
 * @Author: NapierPLUS
 * @Date: 2021-07-14 16:45:10
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-07-15 19:17:35
 * @Description:
 */
/**
 * 工单管理-分类管理
 */
import api4partner from "_o/config/api4partner.request";

// 工单管理-工单来源配置-新增
export const addAxios = (params) => {
  return api4partner.request({
    url: "/manage/config/opt/add",
    method: "post",
    data: params,
  })
}

// 工单管理-工单来源配置-编辑
export const editAxios = (params) => {
  return api4partner.request({
    url: "/manage/config/opt/edit",
    method: "post",
    data: params,
  })
}

// 工单管理-工单来源配置-搜索
export const likeAxios = (params) => {
  return api4partner.request({
    url: "/manage/config/opt/query/like",
    method: "post",
    data: params,
  })
}

// 工单管理-工单来源配置-搜索
export const detailAxios = (params) => {
  return api4partner.request({
    url: "/manage/config/opt/query/detail",
    method: "post",
    data: params,
  })
}

// 工单管理-工单来源配置-搜索
export const deleteAxios = (params) => {
  return api4partner.request({
    url: "/manage/config/opt/delete",
    method: "post",
    data: params,
  })
}