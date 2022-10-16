/**
 * 消息中心
 */

import axios from "_g/config/api.request";
import crmRequest from "_o/config/api4Crm.request"
// 获取公告列表
export const getAnnounceList = data => {
  return crmRequest.request({
    url: "/system/notice/pageList",
    method: "post",
    data: data
  });
};

// 新增公告
export const addAnnounce = data => {
  return crmRequest.request({
    url: "/system/notice/insert",
    method: "post",
    data: data
  });
};
// 查询工资类别
export const salaryTypeList = data => {
  return crmRequest.request({
    url: "/system/notice/salaryTypeList",
    method: "post",
    data: data
  });
};

// 撤销公告
export const deleteAnnounce = data => {
  return crmRequest.request({
    url: "/system/notice/editStatus",
    method: "post",
    data: data
  });
};

// 置顶公告
export const topNotice = data => {
  return crmRequest.request({
    url: "/system/notice/topNotice",
    method: "post",
    data: data
  });
};

// 取消置顶公告
export const unTopNotice = data => {
  return crmRequest.request({
    url: "/system/notice/unTopNotice",
    method: "post",
    data: data
  });
};

// push分页查询
export const getPushlist = data => {
  return axios.request({
    url: "/admin/system/push/list",
    method: "post",
    data: data
  });
};

// 获取push详情
export const getPushDetail = data => {
  return axios.request({
    url: "/admin/system/push/get",
    method: "post",
    data: data
  });
};

// 新增push
export const addPush = data => {
  return axios.request({
    url: "/admin/system/push/add",
    method: "post",
    data: data
  });
};

// 放弃推送-单个
export const cancelPush = data => {
  return axios.request({
    url: "/admin/system/push/edit",
    method: "post",
    data: data
  });
};

// 放弃推送-批量
export const batchCancelPush = data => {
  return axios.request({
    url: "/admin/system/push/batchCancel",
    method: "post",
    data: data
  });
};

// push模糊搜索
export const remoteSearch = data => {
  return axios.request({
    url: "/admin/system/push/listPushTitle",
    method: "post",
    data: data
  });
};

// 新增IM消息模板
export const addIM = data => {
  return axios.request({
    url: "/admin/system/imTemplet/add",
    method: "post",
    data: data
  });
};

// 查询IM列表信息
export const getIMList = data => {
  return axios.request({
    url: "/admin/system/imTemplet/list",
    method: "post",
    data: data
  });
};

// 编辑IM消息模板
export const editIMItem = data => {
  return axios.request({
    url: "/admin/system/imTemplet/update",
    method: "post",
    data: data
  });
};

// 删除IM模板信息
export const deleteImItem = data => {
  return axios.request({
    url: "/admin/system/imTemplet/del",
    method: "post",
    data: data
  });
};

/*
 * 新建发送短信任务
 */
export const sendMessage = data => {
  return axios.request({
    url: "/admin/sms/saveAndSend",
    method: "post",
    data
  });
};

/*
 * 发送短信任务详情
 */
export const messageDetail = data => {
  return axios.request({
    url: "/admin/sms/smsDetail",
    method: "post",
    data
  });
};

/*
 * 发送短信任务列表
 */
export const shortMsgList = data => {
  return axios.request({
    url: "/admin/sms/listQuery",
    data,
    method: "POST"
  });
};
/*
 * 发送短信任务批量撤销
 */
export const shortMsgsBatchCancel = data => {
  return axios.request({
    url: "/admin/sms/smsBatchCancel",
    data,
    method: "POST"
  });
};
/*
 * 发送短信任务单个撤销
 */
export const shortMsgsCancel = data => {
  return axios.request({
    url: "/admin/sms/smsCancel",
    data,
    method: "POST"
  });
};
/*
 * push任务撤销
 */
export const pushBatchCancel = data => {
  return axios.request({
    url: "/admin/system/push/batchCancel",
    data,
    method: "POST"
  });
};

/*
 * 远程搜索用户群/司机群列表
 */
export const getGroupList = data => {
  return axios.request({
    url: "/admin/sms/groupList",
    data,
    method: "POST"
  });
};

/*
 * 消息管理 乘客提醒 分页查询策略列表
 */
export const queryPloyList = data => {
  return axios.request({
    url: "/admin/promptStrategy/queryPage",
    data,
    method: "POST"
  });
};

/*
 * 消息管理 乘客提醒 编辑策略
 */
export const queryPloyUpdate = data => {
  return axios.request({
    url: "/admin/promptStrategy/update",
    data,
    method: "POST"
  });
};

/*
 * 消息管理 乘客提醒 新增策略
 */
export const queryPloySave= data => {
  return axios.request({
    url: "/admin/promptStrategy/save",
    data,
    method: "POST"
  });
};

/*
 * 消息管理 乘客提醒 详情策略
 */
export const queryPloyDetail = data => {
  return axios.request({
    url: "/admin/promptStrategy/detail",
    data,
    method: "POST"
  });
};

/*
 * 消息管理 发送测试短信
 */
export const sendTestSms = data => {
  return axios.request({
    url: "/admin/sms/sendTestSms",
    data,
    method: "POST"
  });
};