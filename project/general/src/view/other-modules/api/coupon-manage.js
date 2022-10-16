// 司机推券
import axios4Mall from "_g/config/api4Mall.request";

function pf(url) {
  return params => {
    return axios4Mall.request({
      url,
      method: "post",
      data: params
    });
  };
}

// 公共服务-获取上传token接口
export const getUpLoadTokenService = pf("/api/mall/common/service/getUpLoadToken");

//-------------------------------------------------------------------------------------------
//---------------------------------------开通管理---------------------------------------------
//-------------------------------------------------------------------------------------------

// 开通管理-新建配置
/**
agentName (string, optional): 运营商 ,
agentUuid (string, optional): 运营商uuid ,
cityCode (string, optional): 城市code ,
cityName (string, optional): 城市 ,
pictureUrl (string, optional): 推券宣传图片uuid ,
qrcodeUrl (string, optional)
 */
export const addService = pf("/api/mall/driver/coupon/open/add");

// 开通管理-列表
/**
agentUuid (string, optional): 运营商uuid ,
cityCode (string, optional): 城市code ,
currPage (integer, optional): 当前页数 ,
id (integer, optional): id ,
pageSize (integer, optional): 每页显示数量 ,
status (integer, optional): 状态0:初始1:启用2:停用
 */
export const listService = pf("/api/mall/driver/coupon/open/list");

// 开通管理-启用
/**
agentUuid (string, optional): 运营商uuid ,
cityCode (string, optional): 城市code ,
currPage (integer, optional): 当前页数 ,
id (integer, optional): id ,
pageSize (integer, optional): 每页显示数量 ,
status (integer,
 */
export const openService = pf("/api/mall/driver/coupon/open/open");

// 开通管理-停用
/**
agentUuid (string, optional): 运营商uuid ,
cityCode (string, optional): 城市code ,
currPage (integer, optional): 当前页数 ,
id (integer, optional): id ,
pageSize (integer, optional): 每页显示数量 ,
status (integer, optional): 状态0:初始1:启用2:停用
 */
export const closeService = pf("/api/mall/driver/coupon/open/close");

// 开通管理-申请司机列表
/**
agentUuid (string, optional): 运营商uuid ,
currPage (integer, optional): 当前页数 ,
dirverIdentityCardId (string, optional): 司机身份证号 ,
dirverName (string, optional): 司机姓名 ,
ids (Array[integer], optional): id集合,导出时不为空时,此为唯一条件 ,
pageSize (integer, optional): 每页显示数量 ,
status (in
 */
export const applicationListService = pf(
  "/api/mall/driver/coupon/open/applicationList"
);

// 开通管理-申请司机列表导出
/**
agentUuid (string, optional): 运营商uuid ,
currPage (integer, optional): 当前页数 ,
dirverIdentityCardId (string, optional): 司机身份证号 ,
dirverName (string, optional): 司机姓名 ,
ids (Array[integer], optional): id集合,导出时不为空时,此为唯一条件 ,
pageSize (integer, optional): 每页显示数量 ,
status (integer, optional): 状态 1:生效2:停用
 */
export const applicationListExportService = pf(
  "/api/mall/driver/coupon/open/applicationListExport"
);

// 开通管理-操作记录
/**
agentUuid (string, optional): 运营商uuid ,
cityCode (string, optional): 城市code ,
currPage (integer, optional): 当前页数 ,
id (integer, optional): id ,
pageSize (integer, optional): 每页显示数量 ,
status (integer,
 */
export const operationRecordService = pf(
  "/api/mall/driver/coupon/open/operationRecord"
);

// 开通管理-编辑配置
/**
id (integer, optional): id ,
pictureUuid (string, optional): 推券宣传图片uuid ,
qrcodeUuid (string, optional)
 */
export const editService = pf("/api/mall/driver/coupon/open/edit");

// 开通管理-配置详情
//POST
/*
agentUuid (string, optional): 运营商uuid ,
cityCode (string, optional): 城市code ,
currPage (integer, optional): 当前页数 ,
id (integer, optional): id ,
pageSize (integer, optional): 每页显示数量 ,
status (integer, o
 */
export const detailService = pf("/api/mall/driver/coupon/open/detail");

//-------------------------------------------------------------------------------------------
//---------------------------------------推券酬金---------------------------------------------
//-------------------------------------------------------------------------------------------

// 列表
/*
currPage (integer, optional): 当前页 ,
driverId (string, optional): 司机ID ,
driverName (string, optional): 司机姓名 ,
endPayTime (string, optional): 购买结束时间 ,
orderCode (string, optional): 订单编号 ,
pageSize (integer, optional): 每页大小 ,
shareStatus (integer, optional): 分润状态 ,
startPayTime (string, optional): 购买开始时间
 */
export const rewardPageService = pf("/api/mall/web/pushCoupon/rewardPage");

// 导出
/*
currPage (integer, optional): 当前页 ,
driverId (string, optional): 司机ID ,
driverName (string, optional): 司机姓名 ,
endPayTime (string, optional): 购买结束时间 ,
orderCode (string, optional): 订单编号 ,
pageSize (integer, optional): 每页大小 ,
shareStatus (integer, optional): 分润状态 ,
startPayTime (string, optional): 购买开始时间
 */
export const rewardPageExportService = pf(
  "/api/mall/web/pushCoupon/rewardPage/export"
);

//-------------------------------------------------------------------------------------------
//---------------------------------------提现数据---------------------------------------------
//-------------------------------------------------------------------------------------------

// 列表
/**
driverId (string, optional): 司机ID ,
driverName (string, optional): 司机姓名 ,
withdrawEndTime (string, optional): 提现结束时间 ,
withdrawStartTime (string, optional): 提现开始时间
  */
export const withdrawDataPageService = pf(
  "/api/mall/web/pushCoupon/withdrawDataPage"
);

// 导出
/**
driverId (string, optional): 司机ID ,
driverName (string, optional): 司机姓名 ,
withdrawEndTime (string, optional): 提现结束时间 ,
withdrawStartTime (string, optional): 提现开始时间
  */
export const withdrawDataPageExportService = pf(
  "/api/mall/web/pushCoupon/withdrawDataPage/export"
);

//-------------------------------------------------------------------------------------------
//---------------------------------------酬金发放---------------------------------------------
//-------------------------------------------------------------------------------------------

// 列表
/**
 agentId (string, optional): 运营商ID ,
driverId (string, optional): 司机ID ,
driverName (string, optional): 司机姓名 ,
grantEndMonth (string, optional): 发放结束月份 ,
grantStartMonth (string, optional): 发放开始月份 ,
provinceId (string, optional): 省市ID
 */
export const grantPaymentPageService = pf(
  "/api/mall/web/pushCoupon/grantPaymentPage"
);
