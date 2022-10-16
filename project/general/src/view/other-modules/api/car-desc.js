import axios from "_o/config/api4Satellite.request"

function next(res) {
  return [null, res.data]
}

function error(err) {
  return [err, null]
}

export const pageList = data => axios.request({
  url: "/admin/city/advertising/list",
  method: "post",
  data: data
})
// export const addService = data => axios.request({
//   url: "/admin/city/advertising/add",
//   method: "post",
//   data: data
// }).then(next).catch(error);

// 批量新增车型文案
export const addService = data => axios.request({
  url: "/admin/city/advertising/addList",
  method: "post",
  data: data
}).then(next).catch(error);
export const updateService= data => axios.request({
  url: "/admin/city/advertising/updateList",
  method: "post",
  data: data
}).then(next).catch(error);

export const deleteService = data => axios.request({
  url: "/admin/city/advertising/delete",
  method: "post",
  data: data
}).then(next).catch(error);

export const detailService = data => axios.request({
  url: "/admin/city/advertising/get",
  method: "post",
  data: data
}).then(next).catch(error);

// 查询城市的业务线
// cityCode
export const queryCacService = data => axios.request({
  url: "/admin/city/advertising/queryCacByCity",
  method: "post",
  data: data
}).then(next).catch(error);

