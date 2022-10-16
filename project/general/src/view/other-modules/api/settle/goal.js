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
// /api/operate/assess/score/exportAgentAssessScore   导出
//  导入
/*
运营商考核得分查询
*/
export const agentScoreService = pf("/api/operate/assess/score/queryAgentAssessScoreByPage");

// 创建运营商考核得分
export const createAgentService = pf("/api/operate/assess/score/createAgentAssessScore");

// 修改运营商考核得分
export const updateAgentService = pf("/api/operate/assess/score/updateAgentAssessScore");

// 删除运营商考核得分
export const deleteAgentService = pf("/api/operate/assess/score/deleteAgentAssessScore");
// 导入
export const importAgentService = pf("/api/operate/assess/score/importAgentAssessScore");


// 创建运营商考核目标
export const createAgentTargetService = pf("/api/operate/assess/target/createAgentAssessTarget");
// 修改运营商考核目标
export const updateAgentTargetService = pf("/api/operate/assess/target/updateAgentAssessTarget");
// 删除运营商考核目标
export const deleteAgentTargetService = pf("/api/operate/assess/target/deleteAgentAssessTarget");
// 运营商考核目标查询
export const agentTargetService = pf("/api/operate/assess/target/queryAgentAssessTargetByPage");
// 导入
export const importTargetService = pf("/api/operate/assess/target/importAgentAssessTarget");

