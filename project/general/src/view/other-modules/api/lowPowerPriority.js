import axios from "_g/config/api.request";
// 查询优先派单策略
export const lowPowerPriorityPage = data => {
  return axios.request({
    url: "system/queryChargingPageList",
    method: "post",
    data: data
  });
};
  // 保存优先派单策略
export const lowPowerPrioritySave = data => {
  return axios.request({
    url: "system/addChargingStrategy",
    method: "post",
    data: data
  });
};

// 编辑优先派单策略
export const lowPowerPriorityEdit = data => {
  return axios.request({
    url: "system/updateChargingStrategy",
    method: "post",
    data: data
  });
};

// 启用优先派单策略
export const turnOnLowPowerPriority = data => {
  return axios.request({
    url: "system/enableStrategy",
    method: "post",
    data: data
  });
};

// 关闭优先派单策略
export const turnOffLowPowerPriority = data => {
  return axios.request({
    url: "system/disableStrategy",
    method: "post",
    data: data
  });
};
