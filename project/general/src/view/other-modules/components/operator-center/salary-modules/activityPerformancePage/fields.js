/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-23 10:52:38
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-29 10:16:34
 */
export const columns = [
  { label: "规则代码", slot: "ruleCode" },
  { label: "规则名称", prop: "ruleName", minWidth: 110 },
  { label: "城市", prop: "cityName", minWidth: 100 },
  { label: "运营商", slot: "agentInfoList", minWidth: 100 },
  { label: "业务线", slot: "businessType" },
  { label: "司机工资类别", slot: "driverTag" },
  { label: "司机类型", slot: "operationType" },
  { label: "生效时间", slot: "validTime" },
  { label: "状态", slot: "ruleStatus" },
  { slot: "action" }
];

export const editData = {
  businessType: "",
  cityCode: "",
  cityName: "",
  commissionMode: "",
  driverTag: "",
  ruleName: "",
  ruleType: "",
  rulesList: [],
  statPeriod: 2,
  upperThreshold: "",
  validBeginTime: "",
  validEndTime: ""
};

export const rootData = {
  baseRulesReqVo: {},
  incentiveLimitCfgVo: {},
  orderWaterList: [],
  rewardForDailyTurnoverList: [],
  performanceTargetList: [],
  specialPeriodRuleCommissionList: [],
  specialPeriodRuleFixedList: []
};

export const objAssignment = (srcObj, rootObj) => {
  for (let i in srcObj) {
    for (let j in rootObj) {
      if (i == j) {
        rootObj[j] = srcObj[i];
      }
    }
  }
  return rootObj;
};

// 判断是否为数组
export const isArray = val => {
  return Object.prototype.toString.call(val) === "[object Array]"
    ? true
    : false;
};

// 删除数组中id属性
export const deletePropId = arr => {
  arr.forEach(item => {
    if (Object.prototype.toString.call(item) !== "[object Object]") return void 0;
    return item.id = "";
  });
  return arr;
};
