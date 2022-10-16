import axios from "_g/config/api.request"

/** 体验官列表 */
export const experienceList = (data) => {
  return axios.request({
    url: "/admin/passenger/recruit/list",
    data,
    method: "POST"
  })
}

/** 体验官审批 */
export const approval = (data) => {
  return axios.request({
    url: "/admin/passenger/recruit/approval",
    data,
    method: "post"
  })
}
/** 意见反馈所有类型 */
export const feedbackTypeList = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/type/list",
    data,
    method: "post"
  })
}
/** 新增意见反馈类型 */
export const addFeedbackType = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/type/save",
    data,
    method: "post"
  })
}
/** 更新意见反馈类型 */
export const updateFeedbackType = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/type/update",
    data,
    method: "post"
  })
}
/** 废弃意见反馈类型 */
export const delFeedbackType = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/type/disable",
    data,
    method: "post"
  })
}
/** 意见反馈列表 */
export const feedbackList = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/page",
    data,
    method: "post"
  })
}
/** 意见反馈详情 */
export const feedbackDetail = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/info",
    data,
    method: "post"
  })
}
/** 意见反馈评定 */
export const feedbackEvaluate = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/handle",
    data,
    method: "post"
  })
}
/** T币发送 */
export const feedbacksend = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/send",
    data,
    method: "post"
  })
}
/** 意见反馈已解决 */
export const feedbackResult = (data) => {
  return axios.request({
    url: "/admin/passenger/feedback/solve",
    data,
    method: "post"
  })
}