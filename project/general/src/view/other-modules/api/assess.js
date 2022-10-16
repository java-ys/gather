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

//-------------------------------------------------------------------------------------------
//---------------------------------------运营商考核------------------------------------------
//-------------------------------------------------------------------------------------------

/*
审批
*/
export const flowApproveService = pf("/api/agent/assess/flow/approve");

// 作废
export const flowCancelService = pf("/api/agent/assess/flow/cancel");

// 详情
export const flowDetailService = pf("/api/agent/assess/flow/detail");

// 待办列表
export const flowListService = pf("/api/agent/assess/flow/flowList");

// 暂存
export const flowHoldService = pf("/api/agent/assess/flow/hold");

// 查询分页数据
export const flowPageService = pf("/api/agent/assess/flow/page");

// 提交
export const flowSubmitService = pf("/api/agent/assess/flow/submit");

// 批量提交
export const flowSubmitBatchService = pf("/api/agent/assess/flow/submitBatch");

// 生成协议
export const createContractService = pf("/api/agent/assess/flow/createContract");
