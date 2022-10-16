/**
 * 会员中心
 */
import { axiosHttpRequest } from "@/libs/util";

// 通过乘客ID查询任务记录列表
export const getTaskRecordListByPassenger = data => {
  return axiosHttpRequest().request({
    url: "member-web-api/api/records/task/queryPageByPassenger",
    method: "post",
    data
  });
};
