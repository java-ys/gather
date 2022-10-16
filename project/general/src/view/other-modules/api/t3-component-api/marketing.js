import axios4Company from "_o/config/api4Company.request";
/* 
企业用车-营销管理
*/
// 历史记录列表
export const getSelectPastRecords = data => {
  return axios4Company.request({
    url: "/api/boss/inner/marketing/selectPastRecords",
    data,
    method: "POST"
  });
};
// 新增图片
export const addAdvertising = data => {
  return axios4Company.request({
    url: "/api/boss/inner/marketing/addAdvertising",
    data,
    method: "POST"
  });
};

// 查看图片
export const viewPicture = data => {
  return axios4Company.request({
    url: "/api/boss/inner/marketing/selectNewPicture",
    data,
    method: "POST"
  });
};
