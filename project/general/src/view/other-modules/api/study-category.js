import request4Driver from "_g/config/api4Driver";

/*
  学习分类开始
**/

// 学习分类-列表
export const getStudyCategoryList = (params) => {
  return request4Driver.request({
    url: "/api/study/cata/query",
    method: "post",
    data: params
  })
}

// 学习分类-新增
export const studyCategoryAdd = (params) => {
  return request4Driver.request({
    url: "/api/study/cata/add",
    method: "post",
    data: params
  })
}

// 学习分类-编辑
export const studyCategoryEdit = (params) => {
  return request4Driver.request({
    url: "/api/study/cata/update",
    method: "post",
    data: params
  })
}

// 学习分类-上架
export const isOn = (params) => {
  return request4Driver.request({
    url: "/api/study/cata/seton",
    method: "post",
    data: params
  })
}

// 学习分类-下架
export const isInit = (params) => {
  return request4Driver.request({
    url: "/api/study/cata/setoff",
    method: "post",
    data: params
  })
}

/*
  学习分类结束
**/

/*
  白名单管理开始
**/

// 列表
export const getDriverWhiteList = (params) => {
  return request4Driver.request({
    url: "/api/study/whitelist/query",
    method: "post",
    data: params
  })
}

// 移除
export const batchRemoval = (params) => {
  return request4Driver.request({
    url: "/api/study/whitelist/del",
    method: "post",
    data: params
  })
}

// 新建
export const driverWhiteAdd = (params) => {
  return request4Driver.request({
    url: "/api/study/whitelist/add",
    method: "post",
    data: params
  })
}

/*
  白名单管理结束
**/