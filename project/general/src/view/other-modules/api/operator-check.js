import axios from "_g/config/api.request";
import safeaxios from "_g/config/safe-api.request";

// 查询核检任务分页列表
export const queryPageCheckTaskList = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryPageCheckTaskList",
    // url: "api/agent/safeOfficer/list",
    data: params,
    method: "POST"
  });
};

// 1022
export const queryPageCheckTaskList1 = params => {
  return axios.request({
    // url: "/admin/sysAgent/checkTaskManager/queryPageCheckTaskList",
    // url: "api/agent/safeOfficer/list",
    url: "api/operate/safeOfficer/list",
    data: params,
    method: "POST"
  });
};
export const queryCheckTaskDetail1 = params => {
  return axios.request({
    url: "api/operate/safeOfficer/update",
    data: params,
    method: "POST"
  });
};
// 1022查看安全员图片
export const downFileUrl = (data) => {
  return axios.request({
    url: "/api/oss/url/get",
    data,
    method: "post"
  })
}



// 新增检核任务
export const addCheckTask = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/addCheckTask",
    data: params,
    method: "POST"
  });
};
// 设置核检任务状态
export const setCheckTaskStatus = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/setCheckTaskStatus",
    data: params,
    method: "POST"
  });
};
// 查询核检任务详情
export const queryCheckTaskDetail = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryCheckTaskDetail",
    data: params,
    method: "POST"
  });
};
// 编辑核检任务
export const editCheckTask = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/editCheckTask",
    data: params,
    method: "POST"
  });
};
// 查询核检任务操作日志分页列表
export const checkTaskLog = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryPageCheckTaskLogList",
    data: params,
    method: "POST"
  });
};
// 查询司机核检任务分页列表
export const driverCheckTaskList = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryPageDriverCheckTaskList",
    data: params,
    method: "POST"
  });
};
// 复核司机核检任务
export const reCheckTaskList = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryReCheckDetail",
    data: params,
    method: "POST"
  });
};
// 复核司机核检任务是否通过
export const passCheckTaskList = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/reCheck",
    data: params,
    method: "POST"
  });
};
// 查询司机检核任务详情
export const driverCheckTaskDetail = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryDriverCheckTaskDetail",
    data: params,
    method: "POST"
  });
};
// 查询司机搜索列表
export const driverList = params => {
  return axios.request({
    url: "/admin/sysAgent/checkTaskManager/queryDriverCheckTaskConditionList",
    data: params,
    method: "POST"
  });
};

// 人员弹框列表
export const queryAllSafer = params => {
  return axios.request({
    url: "/api/operate/safeOfficer/auth/list",
    data: params,
    method: "POST"
  });
};

// 人员弹框列表
export const addSafer = params => {
  return axios.request({
    url: "/api/operate/safeOfficer/add",
    data: params,
    method: "POST"
  });
};

// 获取城市列表
export const getComponiesList = params => {
  return axios.request({
    url: "/api/operate/safeOfficer/organ/list",
    data: params,
    method: "POST"
  });
};

