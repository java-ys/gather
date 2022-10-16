import axios from "_gc/api.request";

// 消毒记录列表
export const disinfectPageList = (data) => {
  return axios.request({
    url: "/admin/driver/disinfect/pageList",
    data,
    method: "POST"
  })
}
