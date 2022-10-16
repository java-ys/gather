import axios from "_g/config/api.request";
import axios4Marketing from "_g/config/api4Market.request.js";

// 发票列表（查询）
export const getInvoiceList = data => {
  return axios.request({
    url: "/admin/finance/invoice/list",
    data,
    method: "post"
  });
};

// 发票详情
export const getInvoiceDetail = data => {
  return axios.request({
    url: "/admin/finance/invoice/get",
    data,
    method: "post"
  });
};

// 快递单号录入
export const inputPostInfo = data => {
  return axios.request({
    url: "/admin/finance/invoice/saveExpressNo",
    data,
    method: "post"
  });
};

// 获取充值档位列表
export const getRechargeLevelList = data => {
  return axios.request({
    url: "/admin/Strategy/recharge/query",
    data,
    method: "post"
  });
};

// 编辑充值档位
export const editRechargeLeve = data => {
  return axios.request({
    url: "/admin/Strategy/recharge/edit",
    data,
    method: "post"
  });
};

// 添加充值档位
export const addRechargeLeve = data => {
  return axios.request({
    url: "/admin/Strategy/recharge/add",
    data,
    method: "post"
  });
};

// 获取支付方式列表
export const getPaywayList = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/query",
    data,
    method: "post"
  });
};

// 上移支付方式
export const downPayway = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/shiftDown",
    data,
    method: "post"
  });
};

// 下移支付方式
export const upPayway = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/shiftUp",
    data,
    method: "post"
  });
};

// 关闭支付方式
export const changePaywayStatus = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/close",
    data,
    method: "post"
  });
};
// 编辑支付方式
export const editPaywayData = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/edit",
    data,
    method: "post"
  });
};

// 财务日对账 -- 对账列表
export const channelList = () => {
  return axios.request({
    url: "/admin/finance/bill/channelList",
    method: "post"
  });
};

// 对账历史清单
export const historyList = data => {
  return axios.request({
    url: "/admin/finance/bill/historyList",
    data,
    method: "post"
  });
};

// 创建新账单日
export const addBillDay = data => {
  return axios.request({
    url: "/admin/finance/bill/addBillDay",
    data,
    method: "post"
  });
};

// 历史对账清单备忘
export const addMemo = data => {
  return axios.request({
    url: "/admin/finance/bill/addMemo",
    data,
    method: "post"
  });
};

// 历史对账清单处理
export const deal = data => {
  return axios.request({
    url: "/admin/finance/bill/deal",
    data,
    method: "post"
  });
};

// 差异信息
export const diffInfo = data => {
  return axios.request({
    url: "/admin/finance/bill/diffInfo",
    data,
    method: "post"
  });
};

// 历史结果差异数据
export const platformDiffInfo = data => {
  return axios.request({
    url: "/admin/finance/bill/platformDiffInfo",
    data,
    method: "post"
  });
};

// 开启支付方式
export const deletePayway = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/open",
    data,
    method: "post"
  });
};

// 新建支付方式
export const addPayway = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/add",
    data,
    method: "post"
  });
};

// 支付方式操作记录
export const getPayWayRecord = data => {
  return axios4Marketing.request({
    url: "/admin/Strategy/payway/operationRecords",
    method: "post",
    data
  });
};
