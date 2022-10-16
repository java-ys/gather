/**
 * 营运管理中心-运营商管理 接口
 */

import axios from "_g/config/api.request"
import axios4Market from "_o/config/api4Market.request"
import axios4NewCommon from "_g/config/api4Common.js"
import api4Resource from "_g/config/api4Resource.request"
import apiDriverResumeWeb from "_o/config/api-driver-resume-web.request"

/**
 * 运营商列表
 */
export const getCarrierList = (data) => {
  return axios.request({
    url: "/admin/sysAgent/queryAgentPageList",
    method: "post",
    data: data
  })
}

/**
 * 新增运营商
 */
export const addCarrier = (data) => {
  return axios.request({
    url: "/admin/sysAgent/save",
    method: "post",
    data: data
  })
}

/**
 * 查询发票主体
 */
export const searchEntity = (data) => {
  return axios.request({
    url: "admin/sysAgent/queryInvoiceSubject",
    method: "post",
    data: data
  })
}

/**
 * 获取组织机构列表
 */
export const getAllOrgan = (data) => {
  return axios.request({
    url: "/admin/sysAgent/getAllOrgan",
    method: "post",
    data: data
  })
}

/**
 * 根据运营商id获取运营商信息
 */
export const getCarrierInfo = (data) => {
  return axios.request({
    url: "/admin/sysAgent/getAgentById",
    method: "post",
    data: data
  })
}

/**
 * 编辑运营商
 */
export const editCarrier = (data) => {
  return axios.request({
    url: "/admin/sysAgent/update",
    method: "post",
    data: data
  })
}

/**
 * 删除运营商
 */
export const deleteCarrier = (data) => {
  return axios.request({
    url: "/admin/sysAgent/delete",
    method: "post",
    data: data
  })
}

/**
 * 司管列表
 */
export const driverMList = (data) => {
  return axios.request({
    url: "/manager/driver/manager/list",
    method: "post",
    data: data
  })
}

/**
 * 编辑司管状态
 */
export const updateDriverM = (data) => {
  return axios.request({
    url: "/manager/driver/manager/updateSelective",
    method: "post",
    data: data
  })
}

/**
 * 司机列表
 */
export const driverList = (data) => {
  return axios.request({
    url: "/manager/driver/manager/driver/list",
    method: "post",
    data: data
  })
}

/**
 * 根据条件获取司机列表
 */
export const getDriverListByDriverM = (data) => {
  return axios.request({
    url: "/manager/driver/manager/listOrtherAgenDriverForPage",
    method: "post",
    data: data
  })
}

/**
 * 分配司机
 */
export const tranferDriver = (data) => {
  return axios.request({
    url: "/manager/driver/manager/insertManagerDriverRelation",
    method: "post",
    data: data
  })
}

/**
 * 考核规则
 */
export const rulesInfo = (data) => {
  return axios.request({
    url: "/admin/sysAgent/assessment/rules",
    method: "post",
    data: data
  })
}

/**
 * 编辑考核规则
 */
export const updateRules = (data) => {
  return axios.request({
    url: "/admin/sysAgent/assessment/rules/update",
    method: "post",
    data: data
  })
}

/**
 * 抽成管理列表
 */
export const getDrpList = (data) => {
  return axios.request({
    url: "/admin/regional/agentCommision/list",
    method: "post",
    data: data
  })
}

/**
 * 新增抽成
 */
export const addDrp = (data) => {
  return axios.request({
    url: "/admin/regional/agentCommision/save",
    method: "post",
    data: data
  })
}

/**
 * 删除抽成
 */
export const deleteDrp = (data) => {
  return axios.request({
    url: "/admin/regional/agentCommision/remove",
    method: "post",
    data: data
  })
}

/**
 * 抽成详情
 */
export const drpDetail = (data) => {
  return axios.request({
    url: "/admin/regional/agentCommision/info",
    method: "post",
    data: data
  })
}

/**
 * 编辑抽成
 */
export const updateDrp = (data) => {
  return axios.request({
    url: "/admin/regional/agentCommision/update",
    method: "post",
    data: data
  })
}

/**
 * 补贴管理列表
 */
export const getSubsidyList = (data) => {
  return axios.request({
    url: "/admin/regional/agentSubsidy/list",
    method: "post",
    data: data
  })
}

/**
 * 新增补贴
 */
export const addSubsidy = (data) => {
  return axios.request({
    url: "/admin/regional/agentSubsidy/save",
    method: "post",
    data: data
  })
}

/**
 * 删除补贴
 */
export const deleteSubsidy = (data) => {
  return axios.request({
    url: "/admin/regional/agentSubsidy/remove",
    method: "post",
    data: data
  })
}

/**
 * 补贴详情
 */
export const subsidyDetail = (data) => {
  return axios.request({
    url: "/admin/regional/agentSubsidy/info",
    method: "post",
    data: data
  })
}

/**
 * 编辑补贴
 */
export const updateSubsidy = (data) => {
  return axios.request({
    url: "/admin/regional/agentSubsidy/update",
    method: "post",
    data: data
  })
}

/**
 * 补贴管理-不可选年月查询
 */
export const getExistSMonths = (data) => {
  return axios.request({
    url: "/admin/regional/agentSubsidy/getExistMonths",
    method: "post",
    data: data
  })
}

/**
 * 抽成管理-不可选年月查询
 */
export const getExistDrpMonths = (data) => {
  return axios.request({
    url: "/admin/regional/agentCommision/getExistMonths",
    method: "post",
    data: data
  })
}

/**
 * 考核结果查看
 */
export const checkResult = (data) => {
  return axios.request({
    url: "/admin/sysAgent/assessment/result",
    method: "post",
    data: data
  })
}

/**
 * 运营商实时数据
 */
export const carrierRealtimeData = (data) => {
  return axios.request({
    url: "/admin/sysAgent/getRealtimeDataByAgent",
    method: "post",
    data: data
  })
}

/**
 * 运营商统计数据
 */
export const carrierLineData = (data) => {
  return axios.request({
    url: "/admin/sysAgent/getStatisticalDataByAgent",
    method: "post",
    data: data
  })
}

/**
 * 获取车管列表
 */
export const getCarManagerList = (data) => {
  return axios.request({
    url: "/admin/carManager/queryVehicleManagementListByPage",
    method: "post",
    data: data
  })
}

/**
 * 更改车管状态
 */
export const updateCarManagerStatus = (params) => {
  return axios.request({
    url: "/admin/carManager/updateVehicleManagementStatus",
    method: "get",
    params
  })
}

/**
 * 编辑车管
 */
export const updateCarManager = (data) => {
  return axios.request({
    url: "/admin/carManager/updateVehicleManagement",
    method: "post",
    data: data
  })
}
/**
 * 支付常见问题开始
 */
// 支付常见问题-列表
export const axiosPaymentQuestionList = (data) => {
  return axios.request({
    url: "/admin/paymentquestion/list",
    method: "post",
    data: data
  })
}
// 支付常见问题-新增
export const axiosPaymentQuestionInsert = (data) => {
  return axios.request({
    url: "/admin/paymentquestion/insert",
    method: "post",
    data: data
  })
}
// 支付常见问题-编辑
export const axiosPaymentQuestionEdit = (data) => {
  return axios.request({
    url: "/admin/paymentquestion/edit",
    method: "post",
    data: data
  })
}
// 支付常见问题-删除
export const axiosPaymentQuestionDelete = (data) => {
  return axios.request({
    url: "/admin/paymentquestion/delete",
    method: "post",
    data: data
  })
}
// 支付常见问题-上移
export const axiosPaymentQuestionUp = (data) => {
  return axios.request({
    url: "/admin/paymentquestion/shiftUp",
    method: "post",
    data: data
  })
}
// 支付常见问题-下移
export const axiosPaymentQuestionDown = (data) => {
  return axios.request({
    url: "/admin/paymentquestion/shiftDown",
    method: "post",
    data: data
  })
}
/**
 * 支付常见问题结束
 */
/**
 * 车辆告警开始
 */
export const axiosCarAlarmList = (data) => {
  return axios.request({
    url: "/admin/carAlarm/list",
    method: "post",
    data: data
  })
}
export const axiosCarAlarmRemove = (data) => {
  return axios.request({
    url: "/admin/carAlarm/remove",
    method: "post",
    data: data
  })
}
/**
 * 车辆告警结束
 */
/**
 * 评价标签开始
 */
// 标签列表
export const axiosListLabel = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/listLabel",
    method: "post",
    data: data
  })
}
// 新建标签
export const axiosAddLabel = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/addLabel",
    method: "post",
    data: data
  })
}
// 编辑标签
export const axiosUpdateLabel = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/updateLabel",
    method: "post",
    data: data
  })
}
// 获取标签类型列表
export const axiosListLabelType = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/listLabelType",
    method: "post",
    data: data
  })
}
// 标签设置-查询
export const axiosListLabelSet = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/listLabelSet",
    method: "post",
    data: data
  })
}
// 所有标签-查询
export const axiosListUnselectedLabel = (data) => {
  return axios.request({
    url: "admin/evaluation/label/listUnselectedLabel",
    method: "post",
    data: data
  })
}
// 标签设置-查询
export const axiosLabelManage = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/labelManage",
    method: "post",
    data: data
  })
}
// 标签设置-查询评价对象
export const axiosEvaluateTargetDetail = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/queryEvaluationTarget",
    method: "post",
    data: data
  })
}
// 标签设置-编辑评价对象
export const axiosEvaluateTargetUpdate = (data) => {
  return axios.request({
    url: "/admin/evaluation/label/updateEvaluationTarget",
    method: "post",
    data: data
  })
}

/**
 * 评价标签结束
 */
/**
 * 短问卷开始
 */
// 新建短问卷
export const axiosAddSurveyQuestion = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/addSurveyQuestion",
    method: "post",
    data: data
  })
}
// 查询分类(评价标签)
export const axiosListSurveyTag = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/listSurveyTag",
    method: "post",
    data: data
  })
}
// 查询短问卷详情
export const axiosQuerySurveyInfo = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/querySurveyInfo",
    method: "post",
    data: data
  })
}
// 问卷详情
export const queryQuestionDetail = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/listAnswerStatistics",
    method: "post",
    data: data
  })
}
// 分页查询短问卷列表
export const axiosSurveyQuestionPage = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/listSurveyQuestionPage",
    method: "post",
    data: data
  })
}
// 更新短问卷状态(启用/停用/删除)
export const axiosUpdateSurveyQuestion = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/updateSurveyQuestion",
    method: "post",
    data: data
  })
}
// 短问卷-查询操作记录
export const axiosShortTicketHistory = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/queryOperationalRecords",
    method: "post",
    data: data
  })
}
// 短问卷-查询所有标签
export const axiosShortTicketAllLabel = (data) => {
  return axios4NewCommon.request({
    url: "/api/short/questionnaire/listLabel",
    method: "post",
    data: data
  })
}

/**
 * 短问卷结束
 */


/**
 * 推荐司机管理开始
 */
// 列表
export const axiosRecomdList = (data) => {
  return axios.request({
    url: "/driver/recommend/queryList",
    method: "post",
    data: data
  })
}
// 新增编辑
export const axiosRecomdAddOrUpdate = (data) => {
  return axios.request({
    url: "/driver/recommend/addOrUpdate",
    method: "post",
    data: data
  })
}
// 停用启用
export const axiosRecomdStatus = (data) => {
  return axios.request({
    url: "/driver/recommend/updateStatus",
    method: "post",
    data: data
  })
}
/**
 * 推荐司机管理结束
 */

/**
  * 乘客推荐司机开始
  */
// 获取已开通城市
export const getCityList = (params) => {
  return axios.request({
    url: "/common/listProvinceCityAllData",
    method: "post",
    data: params
  })
}
// 奖励列表
export const getRewardList = (params) => {
  return axios.request({
    url: "/api/inviteRule/queryPageList",
    method: "post",
    data: params
  })
}
// 新增奖励
export const addListData = (params) => {
  return axios.request({
    url: "/api/inviteRule/save",
    method: "POST",
    data: params
  })
}
// 终止操作
export const deadOperation = (params) => {
  return axios.request({
    url: "/api/inviteRule/disable",
    method: "post",
    data: params
  })
}
// 启用操作
export const startOperation = (params) => {
  return axios.request({
    url: "/api/inviteRule/enable",
    method: "post",
    data: params
  })
}
// 操作记录
export const getRecord = (params) => {
  return axios.request({
    url: "/api/inviteRule/queryRewardOperateLog",
    method: "post",
    data: params
  })
}
/**
 * 乘客推荐司机结束
 */

/**
 * 乘客推荐司机详情开始
 */
// 获取基本信息
export const getDetailBasicInfo = (params) => {
  return axios.request({
    url: "/api/inviteRule/detail",
    method: "post",
    data: params
  })
}
// 获取列表数据
export const getListData = (params) => {
  return axios.request({
    url: "/api/inviteRecord/page",
    method: "post",
    data: params
  })
}
// 导出列表数据
export const exportListData = (params) => {
  return axios.request({
    url: "/api/inviteRecord/export",
    method: "post",
    data: params
  })
}
// 批量奖励
export const batchReward = (params) => {
  return axios.request({
    url: "/api/inviteRecord/batchReward",
    method: "post",
    data: params
  })
}
// 奖励
export const rewardData = (params) => {
  return axios.request({
    url: "/api/inviteRecord/reward",
    method: "post",
    data: params
  })
}
// 取消奖励
export const cancalRewardData = (params) => {
  return axios.request({
    url: "/api/inviteRecord/cancelReward",
    method: "post",
    data: params
  })
}
// 获取操作记录
export const getDetailRecord = (params) => {
  return axios.request({
    url: "/api/inviteRecord/operateLog",
    method: "post",
    data: params,
  })
}
// 查询所有开户银行
export const axiosGetBankList = (params) => {
  return axios.request({
    url: "/api/inviteRecord/getBankList",
    method: "post",
    data: params,
  })
}
/**
 * 乘客推荐司机详情结束
 */


/**
 * 健康码记录开始
 */
// 列表
export const axiosHealthRecordList = (params) => {
  return axios.request({
    url: "/admin/healthRecord/list",
    method: "post",
    data: params,
  })
}
/**
 * 健康码记录结束
 */
/**
 * 健康卡开始
 */
// 列表
export const axiosHealthCardList = (params) => {
  return axios.request({
    url: "/admin/healthCard/list",
    method: "post",
    data: params,
  })
}
// 详情
export const axiosHealthCardQueryHistory = (params) => {
  return axios.request({
    url: "/admin/healthCard/submitHistory",
    method: "post",
    data: params,
  })
}
// 司机健康卡–列表–司机/车牌号/手机模糊查询
export const axiosHealthCardFuzzyQuery = (params) => {
  return axios.request({
    url: "/admin/healthCard/fuzzyQuery",
    method: "post",
    data: params,
  })
}
/**
 * 乘推司/司推司开始
 */
// 资源管理-公共文件服务 token
export const getUploadToken = () => {
  return api4Resource.request({
    url: '/api/resource/recruit/common/service/getUpLoadToken',
    method: 'post',
  })
}

// 列表
export const getRecommendList = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/query",
    method: "post",
    data: params,
  })
}
// 新增
export const recommendAdd = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/add",
    method: "post",
    data: params,
  })
}
// 编辑
export const recommendEdit = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/edit",
    method: "post",
    data: params,
  })
}
// 活动规则
export const getRuleDescription = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/getRuleDescription",
    method: "post",
    data: params,
  })
}
// 启用
export const recommendOpen = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/open",
    method: "post",
    data: params,
  })
}
// 终止
export const recommendClose = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/close",
    method: "post",
    data: params,
  })
}
// 详情
export const recommendDetail = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/detail",
    method: "post",
    data: params,
  })
}
// 操作记录
export const recommendLog = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/log/query",
    method: "post",
    data: params,
  })
}

 /**
 * 乘推司/司推司结束
 */


/**
 * 健康卡结束
 */

/**
 * 司机意见反馈----start
 *
 */
/**
 * 常见问题管理
 */
// 获取目录列表
export const axiosCatalogList = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/queryQuestionCatalogList",
    method: "post",
    data: params,
  })
}
// 新增目录
export const axiosCatalogAdd = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/addQuestionCatalog",
    method: "post",
    data: params,
  })
}
// 编辑目录名称
export const axiosCatalogEdit = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/editQuestionCatalog",
    method: "post",
    data: params,
  })
}
// 目录上移下移
export const axiosCatalogMove = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/moveQuestionCatalog",
    method: "post",
    data: params,
  })
}
// 目录停用启用
export const axiosCatalogShift = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/setQuestionCatalogStatus",
    method: "post",
    data: params,
  })
}
// 目录详情
export const axiosCatalogDetail = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/queryQuestionCatalogById",
    method: "post",
    data: params,
  })
}
// 问题列表
export const axiosFaqInfoList = (params) => {
  return axios.request({
    url: "/admin/common/faqinfo/queryPageCatalogFaqList",
    method: "post",
    data: params,
  })
}
// 常见问题新建
export const axiosFaqInfoAdd = (params) => {
  return axios.request({
    url: "/admin/common/faqinfo/addFaqInfo",
    method: "post",
    data: params,
  })
}
// 常见问题编辑
export const axiosFaqInfoEdit = (params) => {
  return axios.request({
    url: "/admin/common/faqinfo/editFaqInfo",
    method: "post",
    data: params,
  })
}
// 常见问题上移下移
export const axiosFaqInfoMove = (params) => {
  return axios.request({
    url: "/admin/common/faqinfo/moveFaq",
    method: "post",
    data: params,
  })
}
// 常见问题停用启用
export const axiosFaqInfoShift = (params) => {
  return axios.request({
    url: "/admin/common/faqinfo/setFaqInfoStatus",
    method: "post",
    data: params,
  })
}
// 常见问题详情
export const axiosFaqInfoDetail = (params) => {
  return axios.request({
    url: "/admin/common/faqinfo/queryFaqInfoById",
    method: "post",
    data: params,
  })
}

/**
 * 司机反馈问题管理
 */
// 司机反馈问题列表
export const axiosDriverQuestionList = (params) => {
  return axios.request({
    url: "/admin/feedback/driver/queryPageFeedbackDriverQuestionList",
    method: "post",
    data: params,
  })
}
// 司机反馈问题详情
export const axiosDriverQuestionDetail = (params) => {
  return axios.request({
    url: "/admin/feedback/driver/queryFeedbackDriverDetailById",
    method: "post",
    data: params,
  })
}
// 司机反馈问题新增回复
export const axiosDriverQuestionAddFeedback = (params) => {
  return axios.request({
    url: "/admin/feedback/driver/addFeedbackDriverQuestionReply",
    method: "post",
    data: params,
  })
}
// 司机反馈问题-二级问题目录列表
export const axiosDriverQuestionCatalogList = (params) => {
  return axios.request({
    url: "/admin/common/questioncatalog/queryFeedbackDriverCatalogList",
    method: "post",
    data: params,
  })
}

/**
 * 司机反馈建议管理
 */
// 司机反馈建议列表
export const axiosDriverProposalList = (params) => {
  return axios.request({
    url: "/admin/feedback/driver/queryPageFeedbackDriverProposalList",
    method: "post",
    data: params,
  })
}
// 司机反馈建议列表
export const axiosDriverProposalAddFeedback = (params) => {
  return axios.request({
    url: "/admin/feedback/driver/addFeedbackDriverProposalReply",
    method: "post",
    data: params,
  })
}

/**
 * 司机意见反馈----end
 *
 */

export const axiosReference = (params) => {
  return axios.request({
    url: "/api/inviteRule/initStatsInfoNoReference",
    method: "post",
    data: params,
  })
}

/**
 * 运营商招募司机---------开始
 */

// 分页查询奖励规则
export const axiosRewardList = (params) => {
  return axios.request({
    url: "/api/operatorReward/queryListByPage",
    method: "post",
    data: params,
  })
}
// 运营商奖励规则--新增
export const axiosAgentRuleAdd = (params) => {
  return axios.request({
    url: "/api/operatorReward/save",
    method: "post",
    data: params,
  })
}
// 运营商奖励规则--终止
export const axiosAgentRuleStop = (params) => {
  return axios.request({
    url: "/api/operatorReward/stopRule",
    method: "post",
    data: params,
  })
}
// 运营商奖励规则--详情
export const axiosAgentRuleDetail = (params) => {
  return axios.request({
    url: "/api/operatorReward/queryRuleDetail",
    method: "post",
    data: params,
  })
}
// 运营商奖励规则--操作记录
export const axiosAgentRuleHistory = (params) => {
  return axios.request({
    url: "/api/operatorReward/queryRewardRuleOperateLog",
    method: "post",
    data: params,
  })
}
// 运营商奖励信息--列表
export const axiosAgentRewardList = (params) => {
  return axios.request({
    url: "/api/operatorReward/queryRewardPaymentList",
    method: "post",
    data: params,
  })
}
// 运营商奖励信息--操作记录
export const axiosAgentRewardHistory = (params) => {
  return axios.request({
    url: "/api/operatorReward/queryOperatorRewardLogList",
    method: "post",
    data: params,
  })
}
// 运营商奖励信息--运营商名称模糊查询
export const axiosAgentNameList = (params) => {
  return axios.request({
    url: "/api/operatorReward/getOperateNameList",
    method: "post",
    data: params,
  })
}
// 运营商奖励信息--取消奖励
export const axiosAgentRewardCancel = (params) => {
  return axios.request({
    url: "/api/operatorReward/cancelReward",
    method: "post",
    data: params,
  })
}
// 运营商奖励信息--批量奖励
export const axiosAgentReward = (params) => {
  return axios.request({
    url: "/api/operatorReward/rewardPayment",
    method: "post",
    data: params,
  })
}
// 运营商奖励信息--详情列表
export const axiosAgentRewardDetailList = (params) => {
  return axios.request({
    url: "/api/operatorReward/queryRewardPaymentDetailList",
    method: "post",
    data: params,
  })
}
/**
 * 运营商招募司机----------结束
 */

 /*
*司机报备管理----开始
*/

/**
 * 报备类型
 */
// 列表
export const reportTypeList = (params) => {
  return axios.request({
    url: "/admin/driver/report/queryPageReportTypeList",
    method: "post",
    data: params,
  })
}
// 新建
export const addReportType = (params) => {
  return axios.request({
    url: "/admin/driver/report/addReportType",
    method: "post",
    data: params,
  })
}
// 编辑
export const editReportType = (params) => {
  return axios.request({
    url: "/admin/driver/report/editReportType",
    method: "post",
    data: params,
  })
}
// 详情
export const reportTypeDetail = (params) => {
  return axios.request({
    url: "/admin/driver/report/queryReportTypeDetail",
    method: "post",
    data: params,
  })
}
// 停用启用
export const setEnableStatus = (params) => {
  return axios.request({
    url: "/admin/driver/report/setEnableStatus",
    method: "post",
    data: params,
  })
}

// 上移下移
export const moveReportType = (params) => {
  return axios.request({
    url: "/admin/driver/report/moveReportType",
    method: "post",
    data: params,
  })
}

/**
 * 报备记录
 */
//根据城市获取运营商
export const getAlltAgentByCity = (params) => {
  return axios.request({
    url: "/admin/driverRemote/getAlltAgentByCity",
    method: "post",
    data: params,
  })
}

//查询报备类型所有值
export const queryReportTypeNameList = (params) => {
  return axios.request({
    url: "/admin/driver/report/queryReportTypeNameList",
    method: "post",
    data: params,
  })
}

//查询报备记录列表
export const queryPageDriverReportList = (params) => {
  return axios.request({
    url: "/admin/driver/report/queryPageDriverReportList",
    method: "post",
    data: params,
  })
}

//查询报备详情
export const queryDriverReportDetail = (params) => {
  return axios.request({
    url: "/admin/driver/report/queryDriverReportDetail",
    method: "post",
    data: params,
  })
}

// 司机奖励发放列表查询
export const recommendRecord = (data) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/driver/reward/queryList",
    method: "post",
    data
  })
}

// 数据权限-获取当前城市所有运营商
export const queryAgent = (data) => {
  return api4Resource.request({
    url: "/api/resource/recruit/common/service/queryAgentInfoByCityCode",
    method: "post",
    data
  })
}


// 获取水印
export const queryWaterMark = (data) => {
  return api4Resource.request({
    url: "/api/v1/common/queryWaterMark",
    method: "post",
    data
  })
}

//司机奖励发放/取消 -- 废弃
export const batchRewardOrCancel = (data) => {
  return api4Resource.request({
    url: "/api/driver/recommend/batchRewardOrCancel",
    method: "post",
    data
  })
};

//司机奖励发放
export const batchDriverReward = (data) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/driver/reward/reward",
    method: "post",
    data
  })
};

//司机奖励取消
export const cancelDriverReward = (data) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/driver/reward/cancelReward",
    method: "post",
    data
  })
};


//司机奖励发查看详情
export const recommendDetails = (data) => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/driver/reward/queryDetail",
    method: "post",
    data
  })
};

//司机奖励发放查看操作日志
export const operateLog = (data) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/driver/reward/operateLog",
    method: "post",
    data
  })
};

// api/resource/recruit/recommend/driver/reward/reward
// 司机奖励导出
export const rewardExport = (data) => {
  return api4Resource.request({
    url: "/api/driver/recommend/export",
    method: "post",
    data
  })
};

// 添加奖励规则
export const saveRule = (params) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/save",
    method: "post",
    data: params,
  })
}


// 查询推荐奖励规则列表
export const queryRuleList = (params) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/queryList",
    method: "post",
    data: params,
  })
}


// 查询推荐奖励规则详情
export const queryRuleDetail = (params) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/detail",
    method: "post",
    data: params,
  })
}

// 查询推荐奖励规则操作日志
export const queryRewardOperateLog = (params) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/queryRewardOperateLog",
    method: "post",
    data: params,
  })
}


// 推荐奖励规则启用
export const openRule = (params) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/open",
    method: "post",
    data: params,
  })
}

// 推荐奖励规则禁用
export const closeRule = (params) => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/close",
    method: "post",
    data: params,
  })
}

// 推荐奖励规则状态修改
export const modifyStatus = data => {
  return api4Resource.request({
    url: "api/resource/recruit/recommend/rule/operate",
    method: "post",
    data
  })
}

// 乘推司奖励信息列表
export const getPassengerAwards = data => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/passenger/reward/queryList",
    method: "post",
    data
  })
}

// 乘推司发放奖励
export const passengerReward = data => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/passenger/reward/reward",
    method: "post",
    data
  })
}

// 乘推司取消奖励
export const passengerCancelReward = data => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/passenger/reward/cancelReward",
    method: "post",
    data
  })
}

// 乘推司奖励操作日志
export const passengerRewardLog = data => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/passenger/reward/operateLog",
    method: "post",
    data
  })
}


// 乘推司奖励统计
export const queryTotalInfo = data => {
  return api4Resource.request({
    url: "/api/resource/recruit/recommend/passenger/reward/queryTotalInfo",
    method: "post",
    data
  })
}


/**
 * 司机招募落地页
 */

  // 列表
export const getRecruitList = (params) => {
    return api4Resource.request({
      url: "/api/resource/recruit/conf/cityConfList",
      method: "post",
      data: params,
    })
  }
// 新增
export const recruitAdd = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/conf/addCityConf",
    method: "post",
    data: params,
  })
}
// 编辑
export const recruitEdit = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/conf/editCityConf",
    method: "post",
    data: params,
  })
}
// 启用
export const recruitSetOn = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/conf/seton",
    method: "post",
    data: params,
  })
}
// 终止
export const recruitSetOff = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/conf/setoff",
    method: "post",
    data: params,
  })
}
// 详情
export const recruitDetail = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/conf/cityConfDetail",
    method: "post",
    data: params,
  })
}
// 操作记录
export const recruitLog = (params) => {
  return api4Resource.request({
    url: "/api/resource/recruit/log/query",
    method: "post",
    data: params,
  })
}


// 运营商启用停用
export const updateEnableState = (params) => {
    return axios.request({
      url: "/admin/sysAgent/updateEnableState",
      method: "post",
      data: params,
    })
  }