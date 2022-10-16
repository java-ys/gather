import axios from "_g/config/api.request";

// 文档: http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=13440996

// 推荐点列表
export const recomPointList = (data) => {
  return axios.request({
    url: '/api/admin/recommendPoi/queryPage',
    data,
    method: 'post'
  })
}

/*

{
    "poiId": 20200020202,
    "address ": "九龙湖", 地址
    "lat": "32.33",纬度
    "lng": "120.33", 经度
    "cityCode": "320100", 城市编码
    "adcode": "320115",  区域编码
    "isUpdate": true, 更新状态，是否允许更新true是，false否
    "updater": "张三",操作人
    "noParking": false,是否限停 false不限 true限停
    "parkingTime": 1,限停时间 单位分钟
    "sourceType": 4,  来源 4 T3运营  5 T3计算
    "pointType": 1, 1上车点  2下车点
    "disable": false, 状态 true 禁用  false 启用
}
*/
// 推荐点编辑
export const recomPointUpdate = (data) => {
  return axios.request({
    url: '/api/admin/recommendPoi/update',
    data,
    method: 'post'
  })
}


/*
{
    "address ": "九龙湖", 地址
    "lat": "32.33",纬度
    "lng": "120.33", 经度
    "cityCode": "320100", 城市编码
    "adcode": "320115",  区域编码
    "isUpdate": true, 更新状态，是否允许更新true是，false否
    "updater": "张三",操作人
    "noParking": false,是否限停 false不限 true限停
    "parkingTime": 1,限停时间 单位分钟
    "sourceType": 4,  来源 4 T3运营  5 T3计算
    "pointType": 1, 1上车点  2下车点
    "disable": false, 状态 true 禁用  false 启用
}
*/
// 推荐点新增
export const recomPointAdd = (data) => {
  return axios.request({
    url: '/api/admin/recommendPoi/add',
    data,
    method: 'post'
  })
}