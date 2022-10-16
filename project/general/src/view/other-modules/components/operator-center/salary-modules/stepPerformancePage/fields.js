/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-07-03 16:29:26
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-29 10:23:44
 */

export const businessLineMap = {
  1: "普通运营",
  2: "包车",
  5: "老年用车",
  6: "企业用车",
  7: "尊享",
  8: "接机",
  9: "送机",
  13: "拼车",
};

export const businessLineOptions = Object.keys(businessLineMap).map(item => ({
  label: businessLineMap[item],
  value: Number(item),
}));

export const columns = [
  { label: "规则代码", slot: "ruleCode" },
  { label: "规则名称", prop: "ruleName", minWidth: 110 },
  { label: "城市", prop: "cityName", minWidth: 100 },
  // { label: "司机档案所属区县", prop: "countryName", minWidth: 130 },
  { label: "运营商", slot: "agentInfoList", minWidth: 100 },
  { label: "产品线", slot: "businessType" },
  { label: "业务线", slot: "businessLines" },
  { label: "司机工资类别", slot: "driverTag" },
  { label: "运营模式", slot: "operationType" },
  { label: "生效时间", slot: "validTime" },
  { label: "状态", slot: "ruleStatus" },
  { label: "审批通过时间", slot: "auditPassedTime" },
  { slot: "action" }
];

export const orderList = [
  { label: "网约车订单", value: 0, disabled: false },
  { label: "出租车订单", value: 1, disabled: true }
]

export const editData = {
  agentList: [],
  businessType: "",
  businessLines: [],
  cityCode: "",
  cityName: "",
  countryCode: [],
  countryName: [],
  commissionMode: "",
  driverTagList: [],
  ruleName: "",
  ruleType: "",
  rulesList: [],
  orderTypes: [],
  fixedRewardRulesList: [],
  statPeriod: 2,
  upperThreshold: "",
  validBeginTime: "",
  validEndTime: ""
};

export const rootData = {
  operationType: "",
  agentList: [],
  businessType: "",
  businessLines: [],
  cityCode: "",
  cityName: "",
  countryCode: [],
  countryName: [],
  appointAgent: 1,
  commissionMode: "",
  commissionRuleId: "",
  driverTagList: [],
  driverTag: "",
  ruleName: "",
  ruleType: "",
  rulePeriod: "",
  ruleStatus: "",
  ruleCode: "",
  ruleId: "",
  rulesList: [],
  orderTypes: [],
  fixedRewardRulesList: [],
  statPeriod: 2,
  predictRevenue: 1,
  upperThreshold: "",
  validBeginTime: "",
  validEndTime: ""
};

export const objAssignment = (srcObj, rootObj) => {
  // eslint-disable-next-line guard-for-in,no-unused-vars
  for (let i in srcObj) {
    // eslint-disable-next-line no-unused-vars
    for (let j in rootObj) {
      if (i === j) {
        rootObj[j] = srcObj[i];
      }
    }
  }
  return rootObj;
};
