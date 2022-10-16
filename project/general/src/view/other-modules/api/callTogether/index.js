/**
 * @author roy
 * @date 2020-06-18 15:59:21
 * @description: 同时呼叫api
*/
import axios from "_g/config/api4Route.request";

// 查询优先派单策略
export const priorityPage = data => {
  return axios.request({
    url: "/config/thirdDispatch/priorityStrategy/pageQuery",
    method: "post",
    data: data
  });
};
// 优先派单策略保存
export const prioritySave = data => {
  return axios.request({
    url: "/config/thirdDispatch/priorityStrategy/save",
    method: "post",
    data: data
  });
};
// 优先派单策略编辑
export const priorityEdit = data => {
  return axios.request({
    url: "/config/thirdDispatch/priorityStrategy/edit",
    method: "post",
    data: data
  });
};
// 同时呼叫派单策略时间保存
export const priorityTimeSave = data => {
  return axios.request({
    url: "/config/sameTimeDispatch/priorityStrategy/save",
    method: "post",
    data: data
  });
};
// 同时呼叫派单策略时间详情
export const priorityTimeDetail = data => {
  return axios.request({
    url: "/config/sameTimeDispatch/priorityStrategy/detail",
    method: "post",
    data: data
  });
};
// 同时呼叫派单策略时间编辑
export const priorityTimeEdit = data => {
  return axios.request({
    url: "/config/sameTimeDispatch/priorityStrategy/edit",
    method: "post",
    data: data
  });
};

