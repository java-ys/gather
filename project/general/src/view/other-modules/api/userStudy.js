import axios from "_o/config/api4Crm.request.js";

// 分页查询意见反馈
export const feedbackList = data => {
  return axios.request({
    url: "/api/problem/feedback/queryPage",
    data,
    method: "post"
  });
};
// 查询意见反馈标签
export const feedbackTag = data => {
  return axios.request({
    url: "/api/problem/feedback/tag/list",
    data,
    method: "post"
  });
};
// 新增意见反馈标签
export const feedbackTagAdd = data => {
  return axios.request({
    url: "/api/problem/feedback/tag/save",
    data,
    method: "post"
  });
};
// 删除意见反馈标签
export const feedbackTagDelete = data => {
  return axios.request({
    url: "/api/problem/feedback/tag/delete",
    data,
    method: "post"
  });
};
