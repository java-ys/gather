import base from "./base";

export const componyList = params => {
  return base.mainRequest("/api/v1/driver/laborservicecompany/pageQuery", params);
};

// 短信接口
export const sendMsg = params => {
  return base.mainRequest("/api/v1/common/sendMsg", params);
};

// 获取城市列表
export const cityList = params => {
  return base.mainRequest("/api/v1/common/city/list", params);
};

// 获取所有城市列表（包含已开通与未开通城市）
export const cityListByAll = params => {
  return base.mainRequest("/api/v1/common/queryAllCitys", params);
};

// 获取运营商列表
export const agentList = params => {
  return base.mainRequest("/api/v1/common/queryAllCompany", params);
};

// 旧
export const getCities = params => {
  return base.mainRequest("/common/listCityData", params);
};

// 旧
export const getAgents = () => {
  return base.mainRequest("/api/v1/common/agentList");
};

// 根据运营商获取城市
export const cityListByAgent = params => {
  return base.mainRequest("/api/v1/common/queryCityByAgent", params);
};

// 根据城市查询运营商
export const queryAgentByCity = params => {
  return base.mainRequest("/api/v1/common/queryAgentByCity", params);
};

// 根据城市cityCode获取运营商
export const queryCompanyByCity = params => {
  return base.mainRequest("/api/v1/common/queryCompanyByCity", params);
};
let waterText = ""
// 获取水印
export const queryWaterMark = params => {
  if (waterText) {
    return Promise.resolve({
      data: {
        success: true,
        data: waterText
      }
    })
  }
  return base.mainRequest("/api/v1/common/queryWaterMark", params).then(res => {
    waterText = res.data.data
    return res
  });
};

// 数据权限-获取当前城市所有运营商
export const queryCitiesWithAgent = params => {
  return base.mainRequest("/api/v1/common/queryCitiesWithAgent", params);
};

// 数据权限-获取开通城市以及城市下运营商
export const queryCitiesWithJurisdiction = params => {
  return base.mainRequest("/api/v1/common/queryCitiesWithJurisdiction", params);
};

// 数据权限-获取简历来源渠道
export const getAllChannel = params => {
  return base.mainRequest("/api/v1/driver/channel/queryAllChannel", params);
};

// 数据权限-渠道来源为官网的情况
export const queryCitiesWithOrgan = params => {
  return base.mainRequest("/api/v1/common/queryCitiesWithOrgan", params);
};

// 获取带车加盟的运营商
export const queryWithCarAgentList = params => {
  return base.mainRequest("/api/v1/common/withCarAgentList", params);
};
// 获取带车加盟的资产公司
export const queryWithCarCompanyList = params => {
  return base.mainRequest("/api/v1/common/withCarAssetCompanyList", params);
};

// 数据权限-二维码管理-新增编辑
export const queryCitiesWithOrganAndAgent = params => {
  return base.mainRequest(
    "/api/v1/common/queryCitiesWithOrganAndAgent",
    params
  );
};

// 审核部门查询
export const queryOrganList = params => {
  return base.mainRequest("/api/v1/salaryRule/queryOrganList", params);
};

// 根据机构id列表查询人员信息列表
export const queryUserInfo = params => {
  return base.mainRequest("/api/v1/salaryRule/queryStaffByOrganIds", params);
};

// 提交审核
export const ruleSubmit = params => {
  return base.mainRequest("/api/v1/salaryRule/submit", params);
};

// 提交审核校验
export const submitVerify = params => {
  return base.salaryRequest("/api/Audit/v1/check/submit", params);
};

// 重构-提交审核
export const auditSubmit = params => {
  return base.salaryRequest("/api/Audit/v1/submit/audit", params);
};

// 审核
export const reviewSubmit = params => {
  return base.mainRequest("/api/v1/salaryRule/review", params);
};

// 重构-审核
export const passAudit = params => {
  return base.salaryRequest("/api/Audit/v1/pass/audit", params);
};

// 重构-驳回
export const refusedAudit = params => {
  return base.salaryRequest("/api/Audit/v1/refused/audit", params);
};

// 取消审核
export const cancelReview = params => {
  return base.mainRequest("/api/v1/salaryRule/cancel", params);
};
// 薪酬重构-取消审核
export const cancelAudit = params => {
  return base.salaryRequest("/api/Audit/v1/cancel/audit", params);
};

// 撤销审核
export const revocation = params => {
  return base.mainRequest("/api/v1/salaryRule/redo", params);
};

// 司机类型接口
export const getDicItemByDicCode = params => {
  return base.mainRequest("/api/v1/salaryRule/getDicItemByDicCode", params);
};
// 获取Token
export const getToken = params => {
  return base.mainRequest("/api/driver/upload/getToken", params);
};
// m2-admin的导出api
// export const callExportService = (params) => base.adminRequest("/admin/driverData/export/exportDataTask", params);
// m2-driver-resume-web的导出api
export const callExportService = (params) => base.mainRequest("/api/v1/driverData/export/exportDataTask", params);
// 获取省市
export const getProvinceCitysList = params => {
  return base.mainRequest("/api/driver/resumeRc/getProvinceCitysList", params);
};

// 获取区
export const getAreaInfoByCode = params => {
  return base.mainRequest("/api/driver/resumeRc/getAreaInfoByCode", params);
};

// 获取下载文件的token
export const getDownloadToken = params => {
  return base.mainRequest("/api/common/service/getDownloadToken", params);
};

// 日志
export const operationLogInfo = params => {
  return base.salaryRequest("/api/common/v1/query/operationLogInfo", params);
};

// 银行相关共通接口
export const checkBankCard = (params) => {
  return base.mainRequest("/api/driver/bankCommon/checkBankCard", params);
};

// 获取省市列表
export const getPClist = (params) => {
  return base.mainRequest("/api/v1/common/ProvinceAndCity/list", params);
};

// 获取所有银行名称
export const queryBankName = (params) => {
  return base.mainRequest("/api/driver/bankCommon/queryBankName", params);
};

export const offlineRewardsImport = params => {
  return base.salaryRequest("/api/salary/v1/offlineRewards/uploadData", params);
};

// 获取司机类型
export const queryAllDriverType = params => {
  return base.salaryRequest("/api/salary/v1/adsDriSalAdjustDetailDt/queryAllDriverType", params);
};

// 获取上传后返回数据
export const UploadCacheData = params => {
  return base.salaryRequest("/api/salary/v1/driverSalary/query/UploadCacheData", params);
};

// 失败下载
export const downloadErrorMessage = params => {
  return base.salaryExportRequest("/api/salary/v1/driverSalary/downloadErrorMessage", params);
};

// 司机周奖励-确认补发补扣导入完成
export const comfirmUpDriverImportAfterTaxUP = params => {
  return base.salaryRequest("/api/salary/v1/salaryFlow/comfirmUpDriverImportAfterTax", params);
};

// 司机周奖励-确认补发补扣导入完成(取消确认)
export const cancelUpDriverImportAfterTaxUP = params => {
  return base.salaryRequest("/api/salary/v1/salaryFlow/cancelUpDriverImportAfterTax", params);
};
// 日志
export const getLog = params => {
  return base.mainRequest("/api/driver/logCommon/queryLogV2", params);
};
