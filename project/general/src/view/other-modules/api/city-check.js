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
//---------------------------------------城市考核模板------------------------------------------
//-------------------------------------------------------------------------------------------

/*
审批
*/
export const cityCommitAgentService = pf("/api/city/assess/commitAgent");

// 复制
export const cityCopyService = pf("/api/city/assess/copy");

// 删除
export const cityDelService = pf("/api/city/assess/del");

// 详情
export const cityDetailService = pf("/api/city/assess/detail");

// 查询分页数据
export const cityPageService = pf("/api/city/assess/page");

// 查询城市运营商列表
export const cityQueryAgentListService = pf("/api/city/assess/queryAgentList");

// 根据城市(list) 运营模式(list) 查询运营商
export const cityNewQueryAgentListService = pf("/api/city/assess/queryAgentListNew");

// 保存
export const citySaveService = pf("/api/city/assess/save");

// 批量提交
export const citySubmitAndCommitService = pf("/api/city/assess/submitAndCommit");

// 更新
export const cityUpdateService = pf("/api/city/assess/update");

// 获取辅策略 方案
export const deputyCommissionService = pf("/api/assist/commission/queryList");

