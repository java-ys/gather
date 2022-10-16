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
// ---------------------------------------协议管理------------------------------------------
// -------------------------------------------------------------------------------------------

/*
协议分页列表查询(http)
*/
export const queryProtocolByPageService = pf("/api/operate/protocol/queryProtocolByPage");

// 协议详情查询
export const queryProtocolDetailService = pf("/api/operate/protocol/queryProtocolDetail");

// 签章
export const signatureProtocolService = pf("/api/operate/protocol/signatureProtocol");

// 作废
export const suspendProtocolService = pf("/api/operate/protocol/suspendProtocol");

// 审核通过
export const reviewPassService = pf("/api/operate/protocol/reviewPass");

// 审核驳回
export const reviewRejectService = pf("/api/operate/protocol/reviewReject");