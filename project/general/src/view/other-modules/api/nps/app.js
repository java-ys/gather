/**
 * nps问卷
 */
import axios from "_o/config/api4Nps.request";

// 新增问卷
export const addQuestionnaire = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/add",
    method: "post",
    data: data
  });
};

// 编辑问卷
export const editQuestionnaire = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/modify",
    method: "post",
    data: data
  });
};

// 问卷详情
export const questionnaireDetails = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/detail",
    method: "post",
    data: data
  });
};

// 查询问卷
export const getQuestionnaires = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/queryPage",
    method: "post",
    data: data
  });
};

// 查询问卷Log
export const getQuestionnaireLog = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/logQueryPage",
    method: "post",
    data: data
  });
};

// 发送设置-分页列表查询
export const getSends = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/queryPage",
    method: "post",
    data: data
  });
};

// 发送设置-新增
export const addSend = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/add",
    method: "post",
    data: data
  });
};

// 发送设置-编辑
export const modifySend = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/modify",
    method: "post",
    data: data
  });
};

// 发送设置-停用
export const stopUse = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/disable",
    method: "post",
    data: data
  });
};

// 端内固定地址问卷-停用
export const stopUseUrl = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/stop",
    method: "post",
    data: data
  });
};

// 发送设置-沉默逻辑查询
export const silentQuery = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/silentQuery",
    method: "post",
    data: data
  });
};

// 发送设置-沉默逻辑编辑
export const silentEdit = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/silentEdit",
    method: "post",
    data: data
  });
};

// 发送设置-问卷列表查询-不分页
export const queryNPSNoPage = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/queryList",
    method: "post",
    data: data
  });
};

// 发送设置-发送人员导入模板下载
export const downloadTemplate = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/downloadTemplate",
    method: "post",
    data: data
  });
};

// 发送设置-发送人员导入失败数据下载
export const downloadFailedData = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/downloadFailedData",
    method: "post",
    data: data
  });
};

// 发送设置-详情
export const queryDetailData = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/detail",
    method: "post",
    data: data
  });
};

// 发送设置-问卷分析首页
export const analyseHome = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/analyseHome",
    method: "post",
    data: data
  });
};

// 发送设置-查询填空题答题详细
export const blankAnswerSummary = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/blankAnswerSummary",
    method: "post",
    data: data
  });
};

// 发送设置-查询答题详细
export const answerSummary = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/answerSummary",
    method: "post",
    data: data
  });
};

// 发送设置-删除答案
export const deleteAnswer = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/deleteAnswer",
    method: "post",
    data: data
  });
};

// 发送设置-查看答案
export const answerDetail = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/answerDetail",
    method: "post",
    data: data
  });
};

// 发送设置-导出答题详细
export const exportAnswerDetail = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/exportAnswerDetail",
    method: "post",
    data: data
  });
};

// 发送设置-发送人员数据导入成功失败条数汇总
export const uploadUserCount = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/uploadUserCount",
    method: "post",
    data: data
  });
};

// 查询报表数据
export const getReportData = data => {
  return axios.request({
    url: "/api/common/v1/questionnaire/npsDaily",
    method: "post",
    data: data
  });
};
// 查询报表数据
export const uploadUserData = (data, header, onUploadProgress) => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/uploadUserData",
    method: "post",
    data: data,
    headers: header,
    onUploadProgress
  });
};

// 查询报表数据
export const queryUploadUserData = (data) => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/queryUploadUserData",
    method: "post",
    data: data
  });
};


// 查询报表数据
export const queryPassengerGroupCrowd = (data) => {
  return axios.request({
    url: "/api/common/v1/questionnaire/pushConfig/queryPassengerGroupCrowd",
    method: "post",
    data: data
  });
};

export const queryFilesURL = data => axios.request({ url: "/common/nps/batch/get", method: "post", data })