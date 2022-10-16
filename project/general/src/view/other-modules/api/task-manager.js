import axios from "_g/config/apiTaskManage.request";
import axiosCommon from "_g/config/api.request";
// 获取司机任务奖励-父列表
export const axiosParentReward = data => {
  return axios.request({
    url: "/api/task/manage/queryRewardList",
    method: "post",
    data: data
  });
};

// 获取司机任务奖励-子列表
export const axiosSonReward = data => {
  return axios.request({
    url: "/api/task/manage/queryRewardSubList",
    method: "post",
    data: data
  });
};

// 查询任务列表
export const getManageTaskList = data => {
  return axios.request({
    url: "/api/task/manage/getManageTaskList",
    method: "post",
    data: data
  });
}

// 复制任务
export const copyTask = data => {
  return axios.request({
    url: "/api/task/manage/copyTask",
    method: "post",
    data: data
  });
}

// 查询运营商
export const queryAgentList = data => {
  return axios.request({
    url: "/api/task/manage/queryAgentList",
    method: "post",
    data: data
  });
}


// 任务详情
export const queryTaskDetail = data => {
  return axios.request({
    url: "/api/task/manage/queryTaskDetail",
    method: "post",
    data: data
  });
}

// 新增任务
export const saveManageTask = data => {
  return axios.request({
    url: "/api/task/manage/saveManageTask",
    method: "post",
    data: data
  });
}

// 编辑任务
export const updateManageTask = data => {
  return axios.request({
    url: "/api/task/manage/updateManageTask",
    method: "post",
    data: data
  });
}

//根据任务uuid查询任务详情
export const updagetManageTaskByUuidteManageTask = data => {
  return axios.request({
    url: "/api/task/manage/getManageTaskByUuid",
    method: "post",
    data: data
  });
}

// 更改任务状态
export const updateManageTaskStatus = data => {
  return axios.request({
    url: "/api/task/manage/updateManageTaskStatus",
    method: "post",
    data: data
  });
}

// 查询城市
export const queryOpenCityList = data => {
  return axiosCommon.request({
    url: "/common/listCityAllData",
    method: "post",
    data: data
  });
}

// 查询司机人群包
export const queryICrowdList = data => {
  return axios.request({
    url: "/api/task/manage/queryICrowdList",
    method: "post",
    data: data
  });
}

// 查询司机类型
export const queryDriverTypeList = data => {
  return axios.request({
    url: "/api/task/manage/queryDriverTypeList",
    method: "post",
    data: data
  });
}

// 查询电子围栏列表
export const queryPageElectronicFenceList = data => {
  return axios.request({
    url: "/api/task/manage/queryPageElectronicFenceList",
    method: "post",
    data: data
  });
}

// 查询操作日志列表
export const queryPageCheckTaskLogList = data => {
  return axios.request({
    url: "/api/task/manage/queryPageCheckTaskLogList",
    method: "post",
    data: data
  });
}

// 审核任务
export const commitOaProcess = data => {
  return axios.request({
    url: "/api/task/manage/commitOaProcess",
    method: "post",
    data: data
  });
}

// 司机周流水分页查询
export const listByPage = data => {
  return axios.request({
    url: "/download/driverTask/listByPage",
    method: "post",
    data: data
  });
}
// 司机奖励明细
export const listFlow = data => {
  return axios.request({
    url: "/download/driverTask/listFlow",
    method: "post",
    data: data
  });
}

// 删除任务
export const removeManageTask = data => {
  return axios.request({
    url: "/api/task/manage/removeManageTask",
    method: "post",
    data: data
  });
}
// 查询司机工资类型
export const queryDriverSalaryTypeList = data => {
  return axios.request({
    url: "/api/task/manage/queryDriverSalaryTypeList",
    method: "post",
    data: data
  });
}
