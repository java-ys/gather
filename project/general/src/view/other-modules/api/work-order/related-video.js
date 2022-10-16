/**
 * 相关视频
 */
import api4partner from "_o/config/api4partner.request";

// 工单管理-相关视频-查询
export const fetchVideos = async params => {
  return api4partner.request({
    url: "/manage/order/yy/hist/viewVideos",
    method: "post",
    data: params
  });
};

// 工单管理-相关视频-抽取
export const postExtractVideos = async params => {
  return api4partner.request({
    url: "/manage/order/yy/hist/reqVideos",
    method: "post",
    data: params
  });
};
