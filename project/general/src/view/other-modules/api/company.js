import axios4Company from "_o/config/api4Company.request";

// 获取所有企业用车开通城市
export const getCompanyOpenAllCity = () => {
  return axios4Company.request({
    url: "/api/boss/common/getCompanyOpenAllCity",
    method: "post"
  })
}

// 所有开城城市
export const getAllOpenCity = () => {
  return axios4Company.request({
    url: "/api/boss/common/getCity",
    method: "post"
  });
};

// 获取取消原因列表
export const cancelReasonList = (data) => {
  return axios4Company.request({
    url: "/api/boss/inner/company/order/cancelReasonList",
    data,
    method: "POST"
  })
}


/*
企业信息
*/
// 获取企业列表
export const getCompanyList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/list",
    data,
    method: "POST"
  });
};

// 新增企业
export const addCompany = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/insert",
    data,
    method: "POST"
  });
};

// 编辑企业
export const editCompany = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/edit",
    data,
    method: "POST"
  });
};

// 获取企业详情
export const getCompanyDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/detailByUuid",
    data,
    method: "POST"
  });
};
// //获取企业详情
// export const getCompanyDetailByUuid = (data) => {
// 	return axios.request({
// 		url: 'admin/company/detailByUuid',
// 		data,
// 		method: 'POST'
// 	})
// }

// 开通或关闭企业
export const enableCompany = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/enable",
    data,
    method: "POST"
  });
};

/*
企业用车管理
*/

// 获取用车场景列表
export const getCarInfoScenes = data => {
  return axios4Company.request({
    url: "api/boss/inner/companyUseCarInfoScenes/listQuery",
    data,
    method: "POST"
  });
};

// 编辑用车场景
export const editCarInfoScenes = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyUseCarInfoScenes/edit",
    data,
    method: "POST"
  });
};

// 获取用车场景详情
export const CarInfoScenesDetail = data => {
  return axios4Company.request({
    url: "api/boss/inner/companyUseCarInfoScenes/detail",
    data,
    method: "POST"
  });
};

// 获取场景列表
export const carScenesList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyUseCarInfoScenes/sceneslist",
    data,
    method: "POST"
  });
};

// 新增用车场景
export const addCarScenes = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyUseCarInfoScenes/scenesAdd",
    data,
    method: "POST"
  });
};

// 删除用车场景
export const delCarScenes = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyUseCarInfoScenes/scenesRemove",
    data,
    method: "POST"
  });
};

/*
审核管理
*/

// 审核管理列表
export const companyAuditList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyReview/list",
    data,
    method: "POST"
  });
};

// 审核管理详情
export const companyAuditDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyReview/detail",
    data,
    method: "POST"
  });
};

// 审核更改状态
export const companyAuditVerify = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyReview/verify",
    data,
    method: "POST"
  });
};

/* 人员信息 */

// 人员列表
export const companyUserList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/staff/list",
    data,
    method: "POST"
  });
};

/* 财务结算 */

// 财务结算页面中的结算账单数据查询操作
export const getSettlementList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/settlement/list",
    data,
    method: "POST"
  });
};
// 财务结算确认收款页面的基础数据查询
export const receiptQuery = companyId => {
  return axios4Company.request({
    url: `/api/boss/inner/company/settlement/receipt//${companyId}`,
    method: "POST"
  });
};
// 财务结算确认收款页面的更新操作
export const receiptEdit = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/settlement/receipt/edit",
    data,
    method: "POST"
  });
};
// 全部账单
export const settlementBill = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/settlement/bill",
    data,
    method: "POST"
  });
};
// 账单详情
export const billInfo = data => {
  return axios4Company.request({
    url: "/api/boss/inner/company/settlement/bill/info",
    data,
    method: "POST"
  });
};

/*  企业用车包车开通管理  */
// 根据城市code查询套餐列表
export const queryPackageNumber = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/queryPackageNumber",
    data,
    method: "POST"
  });
};

// 初始化车型定价
export const initCarLevelPrice = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/initCarLevelPrice",
    data,
    method: "POST"
  });
};

// 查询套餐详情
export const queryPackageInfo = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/queryPackageInfo",
    data,
    method: "POST"
  });
};

// 查询具体日期定价详情
export const queryPackageCarDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/companyPriceConfig/manager/queryPackageCarDetail",
    data,
    method: "POST"
  });
};

// 企业营销-营销资源管理-优惠券列表
export const couponGrantList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/marketing/coupon/grant/records",
    data,
    method: "POST"
  });
};

// 企业营销-营销资源管理-优惠券详情
export const getCouponsTempDetail = data => {
  return axios4Company.request({
    url: "/api/boss/inner/marketing/template/info",
    data,
    method: "POST"
  });
};

// 获取企业认证审核列表
export const getAuthCheckList = data => {
  return axios4Company.request({
    url: "/api/boss/inner/enterpriseRegistered/list",
    method: "post",
    data
  });
};

// 企业认证审核
export const changeCompanyAuth = data => {
  return axios4Company.request({
    url: "/api/boss/inner/enterpriseRegistered/verify",
    method: "post",
    data
  });
};
