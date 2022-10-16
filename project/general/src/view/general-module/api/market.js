import axios from "_g/config/api.request";
import axios4Market from "_g/config/api4Market.request";

// 活动管理开始

// 新增注册活动
export const axiosRegistrationActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/registrationActivity",
    data: params,
    method: "POST"
  });
};
// 新增推荐乘客
export const axiosRecommendActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/recommendActivity",
    data: params,
    method: "POST"
  });
};
// 新增充值活动
export const axiosRechargeActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/rechargeActivity",
    data: params,
    method: "POST"
  });
};
// 新增定向发券
export const axiosDirectActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/directActivity",
    data: params,
    method: "POST"
  });
};

// 新增企业发券
export const axiosEnterpriseCoupon = params => {
  // 新建企业活动
  return axios4Market.request({
    url: "/sys/activity/enterprise/coupon",
    data: params,
    method: "POST"
  });
};

// 新增渠道红包
export const axiosChannelRedEnvelope = params => {
  return axios4Market.request({
    url: "/sys/activity/channelRedEnvelope",
    data: params,
    method: "POST"
  });
};
// 新增行程分享
export const axiosPayRedEnvelope = params => {
  return axios4Market.request({
    url: "/sys/activity/payRedEnvelope",
    data: params,
    method: "POST"
  });
};
// 新增口令红包
export const axiosPasswordRedEnvelope = params => {
  return axios4Market.request({
    url: "/sys/activity/passwordRedEnvelope",
    data: params,
    method: "POST"
  });
};
// 新增客服发券
export const axiosCustomerServiceTicket = params => {
  return axios4Market.request({
    url: "/sys/activity/customerServiceTicket",
    data: params,
    method: "POST"
  });
};
// 新增冒泡发券
export const axiosBubblingServiceTicket = params => {
  return axios4Market.request({
    url: "/sys/activity/bubblingServiceTicket",
    data: params,
    method: "POST"
  });
};
// 新增助力活动
export const axiosHelpActityAdd = params => {
  return axios4Market.request({
    url: "/sys/activity/helpActityAdd",
    data: params,
    method: "POST"
  });
};
// 新增免费领券活动
export const axiosFreeShardActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/freeShardActivity",
    data: params,
    method: "POST"
  });
};
// 新增会员生日活动
export const axiosMemberBirthActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/memberBirthActivity",
    data: params,
    method: "POST"
  });
};
// 新增会员购券活动
export const axiosBuyCouponActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/memberBuyCouponActivity",
    data: params,
    method: "POST"
  });
};
// 新增会员异地礼包活动
export const axiosOutsiteGiftActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/memberOutsiteGiftActivity",
    data: params,
    method: "POST"
  });
};
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
export const axiosActivityEdit = params => {
  return axios4Market.request({
    url: "/sys/activity/edit",
    data: params,
    method: "POST"
  });
};
// 查看活动详情
export const axiosDetail = params => {
  return axios4Market.request({
    url: "/sys/activity/queryActivityDetail",
    data: params,
    method: "POST"
  });
};
// 活动列表
export const axiosPageList = params => {
  return axios4Market.request({
    url: "/sys/activity/pageList",
    data: params,
    method: "POST"
  });
};
// 终止活动
export const axiosTerminationActivity = params => {
  return axios4Market.request({
    url: "/sys/activity/terminationActivity",
    data: params,
    method: "POST"
  });
};

// 优惠券模板列表
export const axiosTemplateList = params => {
  return axios.request({
    url: "/admin/template/list",
    data: params,
    method: "POST"
  });
};
// 用户群管理列表
export const axiosUserGroupList = params => {
  return axios.request({
    url: "/admin/userGroup/list",
    data: params,
    method: "POST"
  });
};

// 活动管理结束

// 企业列表
export const getCompanyList = params => {
  return axios4Market.request({
    url: "/enterprise/company/list",
    data: params,
    method: "POST"
  });
};
