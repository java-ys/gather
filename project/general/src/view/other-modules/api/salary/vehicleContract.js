import base from "./base"

// 车辆使用电子协议分页查询
export const pageQuery = (params) => {
  return base.mainRequest("/api/v1/driver/onlineContract/pageQuery", params);
};

// 车辆使用电子协议查看电子合同
export const view = (params) => {
  return base.mainRequest("/api/v1/driver/onlineContract/view", params);
};

// 车辆使用电子协议下载/批量下载电子合同
export const getDownloadUrl = (params) => {
  return base.mainRequest("/api/v1/driver/onlineContract/getDownloadUrl", params);
};

// 车辆使用电子协议电子签约列表导出
export const exportOnlineContract = (params) => {
  params = base.filterNonsense(params, ["cityCode", "agentUuid", "resumeStatus"])
  return base.exportRequest("/api/v1/driver/onlineContract/export", params);
};

// 车辆使用电子协议单个下载
export const singleDownload = (params) => {
  return base.exportRequest("/api/v1/driver/onlineContract/singleDownload", params);
};

export const onlineContractImport = (params) => {
  return base.imageRequest("/api/v1/driver/onlineContract/batchImport", params);
};

// 撤销协议
export const cancelContractService = (params) => {
  return base.mainRequest("/api/v1/driver/onlineContract/cancelContract", params);
};
