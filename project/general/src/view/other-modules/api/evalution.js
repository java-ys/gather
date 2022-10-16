import { axiosHttpRequest } from "@/libs/util";
const gatePath = "/orion-plugin-web-api";
const axios = axiosHttpRequest(gatePath);

export const queryAppVersionList = data => {
  return axios.request({
    url: "/api/plugin/evaluation/queryAppVersionList",
    data,
    method: "post"
  });
};

/**
 * 添加或修改配置信息
 */
export const addOrUpdateEvaluation = data => {
  return axios.request({
    url: "/api/plugin/evaluation/addOrUpdateEvaluation",
    data,
    method: "post"
  });
};

/**
 * 查看配置信息
 */
export const queryEvaluationConfig = data => {
  return axios.request({
    url: "/api/plugin/evaluation/queryEvaluationConfig",
    data,
    method: "post"
  });
};

/**
 * 查询客户评价信息（带分页）
 */
export const queryEvaluationByPage = data => {
  return axios.request({
    url: "/api/plugin/evaluation/queryEvaluationByPage",
    data,
    method: "post"
  });
};

/**
 * 查询用户群
 */
export const queryEvaluationGroupList = data => {
  return axios.request({
    url: "/api/plugin/evaluation/queryUserGroupList",
    data,
    method: "post"
  });
};
