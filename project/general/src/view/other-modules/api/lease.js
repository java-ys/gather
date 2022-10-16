import leaseService from "_o/config/api4Assets.request"
// import leaseManageService from "_o/config/api4AssetsManage.request"
import { getToken } from "@/libs/util";
/** 获取租赁方案列表 */
export const queryLeaseSchemaList = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/query",
    data,
    method: "POST"
  })
}

/** 查询租赁方案详情 */
export const querySchemaDetail = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/queryDetail",
    data,
    method: "POST"
  })
}

/** 查询资产公司 */
export const queryAuthCo = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/queryAuthCo",
    data,
    method: "POST"
  })
}

/** 查询租赁方案编号 */
export const queryNo = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/queryNo",
    data,
    method: "POST"
  })
}

/** 上架租赁方案 */
export const saleSchema = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/sale",
    data,
    method: "POST"
  })
}

/** 下架租赁方案 */
export const stopSaleSchema = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/stopSale",
    data,
    method: "POST"
  })
}

/** 模糊查询租赁方案名称 */
export const querySchemaName = (data) => {
  return leaseService.request({
    url: "/api/assets/v1/rentSchema/queryName",
    data,
    method: "POST"
  })
}

/** 查询合同列表 */
export const queryContractPage = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/queryPage",
    data,
    method: "POST"
  });
};

/** 查询合同名称 */
export const queryContractNames = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/queryContractNames",
    data,
    method: "POST"
  });
};

/** 查询合同适用cp公司信息 */
export const queryRentCompany = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/queryRentCompany",
    data,
    method: "POST"
  });
};

/** 查询合同适用cp公司信息 */
export const queryApplyRentCompany = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/queryApplyRentCompany",
    data,
    method: "POST"
  });
};

/** 合同停用启用开关 */
export const updateContractStatus = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/updateContractStatus",
    data,
    method: "POST"
  });
};

/** 编辑合同数据 */
export const updateContract = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/updateContract",
    data,
    method: "POST"
  });
};

/** 查询合同模板名称 */
export const queryTemplateName = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/queryTemplateName",
    data,
    method: "POST"
  });
};

/** 创建合同数据 */
export const saveContract = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/saveContract",
    data,
    method: "POST"
  });
};

/** 查询合同详情 */
export const queryContractDetail = data => {
  return leaseService.request({
    url: "/api/assets/v1/contract/queryContractDetail",
    data,
    method: "POST"
  });
};

/** 租赁申报代扣校验 */
export const checkRentOrderInfo = data => {
  return leaseService.request({
    url: "/api/assets/v1/rentOrderInfoCheck/checkRentOrderInfo",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": getToken(),
    },
    method: "POST",
    processData: false, // 告诉axios不要去处理发送的数据(重要参数)
  });
};

/** 租赁申报代扣校验结果查询 */
export const queryCheckResult = data => {
  return leaseService.request({
    url: "/api/assets/v1/rentOrderInfoCheck/queryCheckResult",
    data,
    method: "POST"
  });
};

/** 对账单查询 */
export const rentStatementsQuery = data => {
  return leaseService.request({
    url: "/api/assets/v1/rentStatementsManager/queryPage",
    data,
    method: "POST"
  });
};

/** 代扣申报单查询 */
export const declarationQuery = data => {
  return leaseService.request({
    url: "/api/assets/v1/deductionDeclarationAudit/queryPage",
    data,
    method: "POST"
  });
};

/** 代扣申报单详情 */
export const declarationDetail = data => {
  return leaseService.request({
    url: "/api/assets/v1/deductionDeclarationAudit/queryDeclarationAuditPage",
    data,
    method: "POST"
  });
};

/** 代扣申报单详情查看明细 */
export const queryDeductionRunning = data => {
  return leaseService.request({
    url: "/api/assets/v1/deductionDeclarationAudit/queryDeductionRunning",
    data,
    method: "POST"
  });
};

/** 代扣申报单详情查询列表 */
export const queryDeclareDetailList = data => {
  return leaseService.request({
    url: "/api/assets/v1/deductionDeclarationAudit/queryDeclareDetailList",
    data,
    method: "POST"
  });
};

/** ---------------------------------- 黑名单 ---------------------------------------------- */
/** 查询黑名单 */
export const queryBlacklist = data => {
  return leaseService.request({
    url: "/api/assets/v1/vehicleBlacklist/queryBlacklist",
    data,
    method: "POST"
  });
};

/** 新增黑名单 */
export const addBlacklist = data => {
  return leaseService.request({
    url: "/api/assets/v1/vehicleBlacklist/addBlacklist",
    data,
    method: "POST"
  });
};

/** 删除黑名单 */
export const deleteByPlateNum = data => {
  return leaseService.request({
    url: "/api/assets/v1/vehicleBlacklist/deleteByPlateNum",
    data,
    method: "POST"
  });
};

/** 校验黑名单信息 */
export const checkBlackListInfo = data => {
  return leaseService.request({
    url: "/api/assets/v1/vehicleBlacklist/checkInfo",
    data,
    method: "POST"
  });
};

/** 查询黑名单校验结果 */
export const queryBlacklistCheckResult = data => {
  return leaseService.request({
    url: "/api/assets/v1/vehicleBlacklist/queryCheckResult",
    data,
    method: "POST"
  });
};

/** 批量添加黑名单 */
export const batchAddBlackList = data => {
  return leaseService.request({
    url: "/api/assets/v1/vehicleBlacklist/batchAdd",
    data,
    method: "POST"
  });
};