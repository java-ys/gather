/**
 * 城市保底策略管理
 */
import base from "_o/api/salary/base";
import {
  RULE_TYPE__SALARY_SAFEGUARD,
} from "_o/components/operator-center/salary-modules/CitySafeguard/biz/consts";

/** 同"薪酬规则列表" */
export const fetchCitySafeguardList = params => base.salaryRequest(
  "/api/salary/v1/query/salaryRulesList",
  { ...params, ruleType: RULE_TYPE__SALARY_SAFEGUARD },
);

/** 添加保底策略规则 */
export const addCitySafeguard = params => base.salaryRequest(
  "/api/guaranteed/rule/add",
  params,
);

/** 修改保底策略规则 */
export const updateCitySafeguard = params => base.salaryRequest(
  "/api/guaranteed/rule/update",
  params,
);

/** 查询保底策略规则 */
export const queryCitySafeguard = params => base.salaryRequest(
  "/api/guaranteed/rule/queryDetail",
  params,
);

/** 删除保底策略规则 */
export const deleteCitySafeguard = params => base.salaryRequest(
  "/api/salary/v1/delete/salaryRule",
  params,
);

/** 停用保底策略规则 */
export const deactivateSalaryRules = params => base.salaryRequest(
  "/api/salary/v1/disable/salaryRules",
  params,
);

/** 保底策略规则提交审核 */
export const callSubmitAudit = params => base.salaryRequest(
  "/api/Audit/v1/submit/audit",
  params,
);
