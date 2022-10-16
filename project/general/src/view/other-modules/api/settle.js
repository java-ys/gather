// 结算管理
import axios from "_g/config/api.request";

function pf(url) {
  return params => {
    return axios.request({
      url,
      method: "post",
      data: params
    });
  };
}

// -------------------------------------------------------------------------------------------
// ---------------------------------------结算账单管理------------------------------------------
// -------------------------------------------------------------------------------------------

/*
账单列表查询

*/
export const billingService = pf("/api/operate/billing/queryBillingByPage");

// 详情
export const billingDetailService = pf("/api/operate/billing/queryBillingDetail");

// 批量提交
export const batchSubmitService = pf("/api/operate/billing/work/flow/batchSubmit");

// 导出
export const exportTemplateService = pf("/api/operate/billing/exportTemplate");

// 导入
export const batchImportService = pf("/api/operate/billing/batchImport");
// 补发补扣批量导入
export const deductBatchImportService = pf("/api/operate/billing/importReissueDeductionAmount");
// 提交
export const flowSubmitService = pf("/api/operate/billing/work/flow/submit");

// 废弃
export const flowSuspendService = pf("/api/operate/billing/work/flow/suspend");

// 已付款
export const flowPayedService = pf("/api/operate/settlement/work/flow/paid");

// 暂存
export const flowTemporaryStorageService = pf("/api/operate/billing/work/flow/temporaryStorage");
// 补发补扣
export const reissueDeductService = pf("/api/operate/billing/addReissueDeductionAmount");

// 结算帐单待办分页列表查询
export const queryTodoBillingByPageService = pf("/api/operate/billing/work/flow/queryTodoBillingByPage");

// 结算帐单已办分页列表查询
export const queryDoneBillingByPageService = pf("/api/operate/billing/work/flow/queryDoneBillingByPage");
// 申诉审核
export const flowHandleService = pf("/api/operate/billing/work/flow/handle");
// 结算审核
export const settleHandleService = pf("/api/operate/settlement/work/flow/handle");


export const batchCreateBillingProtocolService = pf("/api/operate/billing/work/flow/batchCreateBillingProtocol");

// 批量重生
export const generateBillingBatch = pf("/api/operate/billing/generateBillingBatch");


// -------------------------------------------------------------------------------------------
// ---------------------------------------dcp 结算账单管理------------------------------------------
// -------------------------------------------------------------------------------------------
// dcp账单列表
export const dcpBillService = pf("/admin/dcp/bill/getAgentBillPage");
// 司机明细
export const dcpGetDriverBillPageService = pf("/admin/dcp/bill/getDriverBillPage");
// 待处理账单列表
export const dcpGetTodoDcpBillPageService = pf("/api/dcp/bill/work/flow/getTodoDcpBillPage");
// 已完结账单列表
export const dcpGetDoneDcpBillPageService = pf("/api/dcp/bill/work/flow/getDoneDcpBillPage");
// 添加补发补扣
export const dcpAddReissueDeductionService = pf("/admin/dcp/bill/addReissueDeduction");
// 账单申诉提交
export const dcpBillSubmitService = pf("/api/dcp/bill/work/flow/batchSubmit");
// 补发补扣导入
export const dcpBatchImportService = pf("/admin/dcp/bill/batchImport");
// 日志
export const dcpBillDetailService = pf("/admin/dcp/bill/getBillingDetail");

export const dcpBillHandleService = pf("/api/dcp/bill/work/flow/handle");

