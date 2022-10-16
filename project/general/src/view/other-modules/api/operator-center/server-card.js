import axios from "_g/config/api.request"
// _o/api/operator-center/server-card
// 深夜服务卡新增
export const axiosRecordSave = (data) => {
  return axios.request({
    url: "/api/application/record/add",
    method: "post",
    data: data
  })
}
// 深夜服务卡编辑
export const axiosRecordUpdat = (data) => {
  return axios.request({
    url: "/api/application/record/edit",
    method: "post",
    data: data
  })
}
// 深夜服务卡详情
export const axiosRecordDetail = (data) => {
  return axios.request({
    url: "/api/application/record/info",
    method: "post",
    data: data
  })
}
// 深夜服务卡分页
export const axiosRecordPageList= (data) => {
  return axios.request({
    url: "/api/application/record/page",
    method: "post",
    data: data
  })
}

// 深夜服务卡启用
export const axiosRecordStatus= (data) => {
  return axios.request({
    url: "/api/application/record/update/status",
    method: "post",
    data: data
  })
}
// 深夜服务卡-司机白名单-列表
export const axiosRecordWhiteList= (data) => {
  return axios.request({
    url: "/api/servicecard/white/list",
    method: "post",
    data: data
  })
}
// 深夜服务卡-司机白名单-添加司机
export const axiosRecordWhiteAdd= (data) => {
  return axios.request({
    url: "/api/servicecard/white/add",
    method: "post",
    data: data
  })
}
// 深夜服务卡-司机白名单-批量移除
export const axiosRecordWhiteRemove= (data) => {
  return axios.request({
    url: "/api/servicecard/white/remove",
    method: "post",
    data: data
  })
}

// 深夜服务卡-宣传文案-列表
export const axiosRecordTextList= (data) => {
  return axios.request({
    url: "/api/servicecard/publicity/list",
    method: "post",
    data: data
  })
}
// 深夜服务卡-宣传文案-编辑
export const axiosRecordTextEdit= (data) => {
  return axios.request({
    url: "/api/servicecard/publicity/edit",
    method: "post",
    data: data
  })
}
// 深夜服务卡-司机申请记录-列表
export const axiosRecordApplicatuinList= (data) => {
  return axios.request({
    url: "/api/application/record/list",
    method: "post",
    data: data
  })
}
// 深夜服务卡-司机申请记录-历史列表
export const axiosRecordApplicatuinHistoryList= (data) => {
  return axios.request({
    url: "/api/application/record/history/list",
    method: "post",
    data: data
  })
}
