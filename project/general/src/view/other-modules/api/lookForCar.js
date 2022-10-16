import axios from "_g/config/route-gateway"

function next(res) {
  return [null, res.data]
}

function error(err) {
  return [err, null]
}

export const pageList = data => axios.request({
  url: "/config/findCarAfterAcceptStrategy/pageQuery",
  method: "post",
  data: data
})

// 新增接起后找车策略
export const addService = data => axios.request({
  url: "/config/findCarAfterAcceptStrategy/add",
  method: "post",
  data: data
}).then(next).catch(error);

// 停用
export const updateService= data => axios.request({
  url: "/config/findCarAfterAcceptStrategy/disable",
  method: "post",
  data: data
});

export const deleteService = data => axios.request({
  url: "/config/findCarAfterAcceptStrategy/delete",
  method: "post",
  data: data
});

export const detailService = data => axios.request({
  url: "/config/findCarAfterAcceptStrategy/detail",
  method: "post",
  data: data
}).then(next).catch(error);

// 获取业务线下最小的接单后乘客免费取消时间  expandBizLine cityCode
export const minFeeService = data => axios.request({
  url: "/config/findCarAfterAcceptStrategy/getMinFreeCancelMinute",
  method: "post",
  data: data
}).then(next).catch(error);


