/*
 * @Author: NapierPLUS
 * @Date: 2021-07-16 10:23:51
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-07-16 18:03:04
 * @Description:
 */
/**
 * 工单管理-详情
 */
import api4partner from "_o/config/api4partner.request";
import HttpRequest from "@/libs/axios"
import config from "@/config/config"
import { fileToken } from "./common"
import { queryAllJudgeType } from "_o/api/work-order/work-order-config";
const uploadAxios = new HttpRequest(process.env.NODE_ENV === "development" ? config.uploadUrl.dev : config.uploadUrl.pro);
const uploadConfig = uploadAxios.getInsideConfig();
delete uploadConfig.headers.grayVersion;

(function updateToken() {
  fileToken({ doType: 2 }).then(res => {
    uploadConfig.headers.Authorization = uploadConfig.headers.token = res.data.data;
  })
  setTimeout(updateToken, 60 * 60 * 1000);
})();

export const queryFilesMeta = data => uploadAxios.request({ headers: uploadConfig.headers, data, url: "/file/query/metaInfo", method: "post" });
export const queryFileURLById = id => uploadAxios.request({ headers: uploadConfig.headers, url: "/file/url/" + id, method: "get" });

// 工单[历史]概览-更多
export const orderHistMore = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/hist/more",
    method: "post",
    data: params,
  })
}
// 工单[历史]概览
export const orderHist = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/hist",
    method: "post",
    data: params,
  })
}
// 初审判责
export const orderJudgeF = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeF",
    method: "post",
    data: params,
  })
}
// 终审判责
export const orderJudgeZ = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeZ",
    method: "post",
    data: params,
  })
}
// 申诉初审
export const orderJudgeSsF = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeSsF",
    method: "post",
    data: params,
  })
}
// 申诉终审
export const orderJudgeSsZ = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeSsZ",
    method: "post",
    data: params,
  })
}

// 工单管理- 详情
export const fetchOrderDetail = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/detail",
    method: "post",
    data: params,
  })
}
// 流转工单详情
export const queryOrder = (params) => {
  return api4partner.request({
    url: "/api/order/circular/wo/detail",
    method: "post",
    data: params,
  })
}
// 工单管理- 违规类型
export const fetchViolationTpyes = queryAllJudgeType

// 二次申诉
export const orderJudgeAgain = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeSsAgain",
    method: "post",
    data: params,
  })
}

// 工单管理- 详情 -[大屏]工单详情明细接口
export const fetchOrderDetailSubList = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/hist/dpSubList",
    method: "post",
    data: params,
  })
}

// 工单管理- 详情 -获取音频列表
export const fetchAudioList = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/queryAudioPage",
    method: "post",
    data: params,
  })
}

// 工单管理- 详情 -获取司乘音频列表
export const fetchSiChengAudioList = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/querySpeakAudioPage",
    method: "post",
    data: params,
  })
}

// 获取订单的历史工单
export const fetchHistBySameOrder = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/histBySameOrder",
    method: "post",
    data: params,
  })
}

/* eslint-disable */
export const queryFileInfo = data => api4partner.request({url: "/manage/oss/file/detail", data, method: 'post'});

// 风控订单列表
export const fetchRiskOrderList = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/fkOrderList",
    method: "post",
    data: params,
  })
}

// 城市组审核
export const cityJudgeService = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeCity",
    method: "post",
    data: params,
  })
}

// 总部组审核
export const t3JudgeService = (params) => {
  return api4partner.request({
    url: "/manage/order/yy/judgeHead",
    method: "post",
    data: params,
  })
}

export const postWorkOrderJudgeForGD = data => api4partner.request({url: "/manage/order/yy/judgeF4Gd", method: "post", data})
