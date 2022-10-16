/**
 * 我的工单-工作台/工单查询列表
 */
import api4partner from "_o/config/api4partner.request";
import api4manager from "_o/config/api4manager.request";
import api4product from "_o/config/api4product.request";
import config from "../../../../config/config";

const uploadUrl =
  process.env.NODE_ENV === "development"
    ? config.uploadUrl.dev
    : config.uploadUrl.pro;

const mediaUrl =
  process.env.NODE_ENV === "development"
    ? config.mediaUrl.dev
    : config.mediaUrl.pro;

// 上传视频 url
export const uploadVideoUrl = `${uploadUrl}/file/media/upload/private`

// 关联查询-司机姓名模糊查询
export const getDriverNames = params => {
  return api4partner.request({
    url: "/manage/extend/getDriverNames",
    method: "post",
    data: params
  });
};
// 关联查询-司机关联信息
export const getMore = params => {
  return api4partner.request({
    url: "/manage/extend/getMore",
    method: "get",
    params
  });
};
// 文件上传下载token获取
export const fileToken = params => {
  return api4partner.request({
    url: "/manage/oss/file/token",
    method: "get",
    params
  });
};
/** 查看图片 */
export const getImgUrl = data => {
  return api4manager.request({
    url: "/api/upload/downImgUrl",
    data,
    method: "post"
  });
};
/** 查看图片 */
export const getFileToken = data => {
  return api4manager.request({
    url: "/api/upload/token",
    data,
    method: "post"
  });
};
// 工单搜索接口
export const ordersSearch = data => {
  return api4partner.request({
    url: "/manage/orders/search",
    data,
    method: "post"
  });
};

// 批量获取文件访问url
export const fetchFilesUrl = (data, token) => {
  return api4manager.request({
    url: `${uploadUrl}/file/get/batchUrl`,
    data,
    method: "post",
    headers: {
      token
    }
  });
};

// 获取视频访问url（已解码）
// export const fetchVideoUrl = async (data, token) => {
//   let formData = new FormData();
//   formData.append("uuid", data);
//   return api4manager.request({
//     url: `${uploadUrl}/file/view/media`,
//     data: formData,
//     method: "post",
//     headers: {
//       token
//     }
//   });
// };

// 获取视频访问url（已解码）
export const fetchVideoUrl = async data => {
  return api4partner.request({
    url: `/manage/orders/getTransCodeUrl`,
    data,
    method: "post"
  });
};

// 运营商列表查询
export const getAgentList = data => {
  return api4partner.request({
    url: "/manage/extend/getAgentList",
    data,
    method: "get"
  });
};

// 城市列表查询-只查询开城城市
export const getOpenAreaAll = data => {
  return api4partner.request({
    url: "/manage/extend/getOpenAreaAll",
    data,
    method: "get"
  });
};

// 1029新联路产品线
export const getProductAll = data => {
  return api4product.request({
    url: "/api/assets/v1/vehicle/getBusinessGradeProduct",
    data,
    method: "get"
  });
};





// 校验订单
export const fetchVerifyOrder = data => {
  return api4partner.request({
    url: "/manage/extend/checkRoute",
    params: data,
    method: "get"
  });
};

// 待流转分组用户查询(
export const fetchNextFlowUsers = data => {
  return api4partner.request({
    url: "/api/group/nextFlow/users",
    data,
    method: "post"
  });
};

/** 查看图片 */
export const getImgUrlByUuid = data => {
  return api4manager.request({
    url: "/api/oss/url/get",
    data,
    method: "post"
  });
};

/** 查询工单分类 */
export const getWoTypeList = data => {
  return api4partner.request({
    url: "/api/class/list",
    data,
    method: "post"
  });
};

// 1203工单优化
export const getOrderSource = data => {
  return api4partner.request({
    url: "/api/common/wo/orderSource/list",
    data,
    method: "post"
  });
};
export const getBizState = data => {
  return api4partner.request({
    url: "/api/common/wo/bizState/list",
    data,
    method: "post"
  });
};