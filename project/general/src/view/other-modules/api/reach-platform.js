import axios from "../config/api4Crm.request";

/* eslint-disable no-confusing-arrow */
const createRequest = url => data => axios.request({ url, data, method: "post" }).then(({ data: res }) => res.success ? res.data : Promise.reject(res));

// 模版列表
export const queryTemplateList = createRequest("/mc/v1/template/queryPage")

// 模版详情
export const queryTemplate = createRequest("/mc/v1/template/queryDetail");

// 新增模版
export const postTemplate = createRequest("/mc/v1/template/create");

// 修改模版
export const putTemplate = createRequest("/mc/v1/template/update");

// 更新模版状态
export const patchTemplate = createRequest("/mc/v1/template/editTemplateStatus");

// 离线任务列表
export const queryTaskList = createRequest("/mc/v1/task/queryPage");

// 业务场景列表
export const queryScenesList = createRequest("/mc/v1/template/querySecne")

// 应用列表
export const queryAppList = createRequest("/api/msg/app/queryMsgAppPage")

// 修改应用状态
export const patchApp = createRequest("/api/msg/app/changeMsgAppStatus")

// 疲劳度规则列表
export const queryFatigueRuleList = createRequest("/api/msg/fatigue/queryMsgFatiguePage");

// 疲劳度修改
export const putFatigueRule = createRequest("/api/msg/fatigue/editMsgFatigue");

// 新增疲劳度
export const postFatigueRule = createRequest("/api/msg/fatigue/saveMsgFatigue");

// 疲劳度详情
export const queryFatigueRule = createRequest("/api/msg/fatigue/fatigueDetail");

// 明细列表
export const queryDetailList = createRequest("/api/message/detail/query");

// 保存应用
export const postApp = createRequest("/api/msg/app/saveMsgApp");

export const queryLinkList = createRequest("/mc/v1/link/queryPage");