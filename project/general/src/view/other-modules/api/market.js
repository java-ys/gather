import axios from '_g/config/api.request'
import axios4Market from '_o/config/api4Market.request'

// 活动管理开始

// 新增注册活动
export const axiosRegistrationActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/registrationActivity',
    data: params,
    method: 'POST'
  })
}
//新增推荐乘客
export const axiosRecommendActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/recommendActivity',
    data: params,
    method: 'POST'
  })
}
// 新增充值活动
export const axiosRechargeActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/rechargeActivity',
    data: params,
    method: 'POST'
  })
}
// 新增定向发券
export const axiosDirectActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/directActivity',
    data: params,
    method: 'POST'
  })
}

// 新增企业发券
export const axiosEnterpriseCoupon = (params) => {//新建企业活动
  return axios4Market.request({
    url: '/sys/activity/enterprise/coupon',
    data: params,
    method: 'POST'
  })
}
// 新增企业充值活动
export const axiosEnterpriseRecharge = (params) => {//新建企业活动
  return axios4Market.request({
    url: '/sys/activity/enterprise/recharge',
    data: params,
    method: 'POST'
  })
}
// 新增渠道红包
export const axiosChannelRedEnvelope = (params) => {
  return axios4Market.request({
    url: '/sys/activity/channelRedEnvelope',
    data: params,
    method: 'POST'
  })
}
// 新增行程分享
export const axiosPayRedEnvelope = (params) => {
  return axios4Market.request({
    url: '/sys/activity/payRedEnvelope',
    data: params,
    method: 'POST'
  })
}
// 新增口令红包
export const axiosPasswordRedEnvelope = (params) => {
  return axios4Market.request({
    url: '/sys/activity/passwordRedEnvelope',
    data: params,
    method: 'POST'
  })
}
// 新增客服发券
export const axiosCustomerServiceTicket = (params) => {
  return axios4Market.request({
    url: '/sys/activity/customerServiceTicket',
    data: params,
    method: 'POST'
  })
}
// 新增冒泡发券
export const axiosBubblingServiceTicket = (params) => {
  return axios4Market.request({
    url: '/sys/activity/bubblingServiceTicket',
    data: params,
    method: 'POST'
  })
}
// 新增助力活动
export const axiosHelpActityAdd = (params) => {
  return axios4Market.request({
    url: '/sys/activity/helpActityAdd',
    data: params,
    method: 'POST'
  })
}
// 新增免费领券活动
export const axiosFreeShardActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/freeShardActivity',
    data: params,
    method: 'POST'
  })
}
//新增会员生日活动
export const axiosMemberBirthActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/memberBirthActivity',
    data: params,
    method: 'POST'
  })
}
//新增会员购券活动
export const axiosBuyCouponActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/memberBuyCouponActivity',
    data: params,
    method: 'POST'
  })
}
//新增会员异地礼包活动
export const axiosOutsiteGiftActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/memberOutsiteGiftActivity',
    data: params,
    method: 'POST'
  })
}
// 新增推荐司机活动
export const axiosRecommendDriver = params => {
  return axios4Market.request({
    url: "/sys/activity/recommendDriver",
    data: params,
    method: "POST"
  });
};
// 新增接单奖励
export const axiosDriverReceive = params => {
  return axios4Market.request({
    url: "/sys/activity/driverReceive",
    data: params,
    method: "POST"
  });
};
// 修改活动
export const axiosActivityEdit = (params) => {
  return axios4Market.request({
    url: '/sys/activity/edit',
    data: params,
    method: 'POST'
  })
}
// 查看活动详情
export const axiosDetail = (params) => {
  return axios4Market.request({
    url: '/sys/activity/queryActivityDetail',
    data: params,
    method: 'POST'
  })
}
// 发送邮件
export const axiosSendEmail = (params) => {
  return axios4Market.request({
    url: '/sys/activity/sendCommandToMailBox',
    data: params,
    method: 'POST'
  })
}
//添加用户群分组
export const axiosNewUserGroupSevceList = (params) => {
  return axios4Market.request({
    url: '/admin/userGroup/addUserSubgroup',
    data: params,
    method: 'POST'
  })
}
// 活动列表
export const axiosPageList = (params) => {
  return axios4Market.request({
    url: '/sys/activity/pageList',
    data: params,
    method: 'POST'
  })
}
// 终止活动
export const axiosTerminationActivity = (params) => {
  return axios4Market.request({
    url: '/sys/activity/terminationActivity',
    data: params,
    method: 'POST'
  })
}

// 优惠券模板列表
export const axiosTemplateList = (params) => {
  return axios.request({
    url: '/admin/template/list',
    data: params,
    method: 'POST'
  })
}
// 用户群管理列表
export const axiosUserGroupList = (params) => {
  return axios.request({
    url: '/admin/userGroup/list',
    data: params,
    method: 'POST'
  })
}
// 用户群管理列表
export const axiosNewUserGroupList = (params) => {
  return axios4Market.request({
    url: '/admin/userGroup/newUserGroupList',
    data: params,
    method: 'POST'
  })
}

// 定向和冒泡用户群分组场景列表
export const axiosNewUserGroupScenceList = (params) => {
  return axios4Market.request({
    url: '/admin/userGroup/queryUserSubgroupPage',
    data: params,
    method: 'POST'
  })
}
// 活动管理结束

// 企业列表
export const getCompanyList = (params) => {
  return axios4Market.request({
    url: '/enterprise/company/list',
    data: params,
    method: 'POST'
  })
}

// 新增乘推司发券
export const axiosaddMultiplicationDivision = (params) => {
  return axios4Market.request({
    url: '/sys/activity/passengerPushDriver',
    data: params,
    method: 'POST'
  })
}


// 乘推司优惠券模板
export const activityPageList = (params) => {
  return axios4Market.request({
    url: '/sys/activity/queryPassengerRecommendActivityPage',
    data: params,
    method: 'POST'
  })
}

// 活动模板管理查询
export const getModelList = (params) =>{
  return axios4Market.request({
    url:'/api/marketing/template/queryPage',
    data:params,
    method:'POST'
  })
}

//查询建模模板详情
export const getNewModelDetial = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryDetail',
    data:params,
    method:'POST'
  })
}

//新建活动模板
export const addModel = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/addActTemplateSetting ',
    data:params,
    method:'POST'
  })
}

//停止使用模板
export const stopModel = (params)=>{
  return axios4Market.request({
    url:"/api/marketing/template/startAndStopActTemplateSetting",
    data:params,
    method:'POST'
  })
}

//删除模板
export const deleteModel = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/deleteActTemplateSetting',
    data:params,
    method:'POST'
  })
}
//修改模板
export const changeModel = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/updateActTemplateSetting',
    data:params,
    method:'POST'
  })
}
//获取唯一性活动维度
export const uniqueList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryUniqueList  ',
    data:params,
    method:'POST'
  })
}
//获取产品线checkbox
export const businessCheckBoxList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryBusinessList',
    data:params,
    method:'POST'
  })
}
//获取车辆类型
export const  carTypeList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryCarList',
    data:params,
    method:'POST'
  })
}
//获取事件类型选项
export const sceneTypeList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/querySceneList',
    data:params,
    method:'POST'
  })
}
//获取触发事件选项
export const rewardEventTypeList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryRewardEventList',
    data:params,
    method:'POST'
  })
}
//获取奖励选项
export const rewardTypeList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryRewardList',
    data:params,
    method:'POST'
  })
}
//获取推送主体选项
export const actPushConfigList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryPushList',
    data:params,
    method:'POST'
  })
}
export const queryOptionType  = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryOptionType'+params,
    data:'',
    method:'POST'
  })
}
//新建活动模板
export const addActTemplateSetting  = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/addActTemplateSetting',
    data:params,
    method:'POST'
  })
}
//获取活动模板详情接口  /api/marketing/activity/queryDetail
export const getActivityDetail = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryDetail',
    data:params,
    method:'POST'
  })
}
//获取快照详情
export const getActSnapshotDetail = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/querySnapshotDetail',
    data:params,
    method:'POST'
  })
}
//查询new活动列表
export const getNewActivityList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/queryPage',
    data:params,
    method:'POST'
  })
}

//获取新增后的活动类型
export const getActivityTypeList = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/template/queryUniqList',
    data:params,
    method:'POST'
  })
}
//新增活动
export const addAct = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/addAct',
    data:params,
    method:'POST'
  })
}
//修改活动
export const updateAct = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/updateAct',
    data:params,
    method:'POST'
  })
}
//根据uuid获取保存的活动内容
export const getActDetailFromUUid = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/queryDetail',
    data:params,
    method:'POST'
  })
}
//终止活动
export const  stopNewActivity = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/stopAct',
    data:params,
    method:'POST'
  })
}
//根据快照获取保存的活动信息
export const getActDetailFormApproval = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/queryAuditDetail',
    data:params,
    method:'POST'
  })
}
//请求统计数据
export const getStatisticsData = (params)=>{
  return axios4Market.request({
    url:'/api/marketing/act/queryActStatDetail',
    data:params,
    method:'POST'
  })
}
