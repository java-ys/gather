
import axios4Common from "_o/config/api4Common.request";
import axios4Market from "_o/config/api4Market.request"
/**
 * app广告位管理---start
 */
// 广告列表
export const axiosAppAdgList = params => {
  return axios4Common.request({
    url: "/appAdg/pageList",
    method: "post",
    data: params
  });
};
// 广告新增
export const axiosAppAdgAdd = params => {
  return axios4Common.request({
    url: "/appAdg/add",
    method: "post",
    data: params
  });
};
// 广告编辑
export const axiosAppAdgUpdate = params => {
  return axios4Common.request({
    url: "/appAdg/update",
    method: "post",
    data: params
  });
};
// 广告详情
export const axiosAppAdgDetail = params => {
  return axios4Common.request({
    url: "/appAdg/detail",
    method: "post",
    data: params
  });
};
// 广告关闭
export const axiosAppAdgClose = params => {
  return axios4Common.request({
    url: "/appAdg/close",
    method: "post",
    data: params
  });
};
// 广告-优先级相同校验
export const axiosAppAdgPriorityCheck = params => {
  return axios4Common.request({
    url: "/appAdg/priorityCheck",
    method: "post",
    data: params
  });
};
// 广告城市
export const axiosAppAdgCityList = params => {
  return axios4Common.request({
    url: "/appAdg/cityList",
    method: "post",
    data: params
  });
};


// 用户群管理列表
export const axiosNewUserGroupList = (params) => {
  return axios4Market.request({
    url: "/admin/userGroup/newUserGroupList",
    data: params,
    method: "post"
  })
};

export const newUserGroupList = params => {
  return axios4Common.request({
    url: "/common/newUserGroupList",
    method: "post",
    data: params
  });
};

/**
 * app广告位管理---end
 */