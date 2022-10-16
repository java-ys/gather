import { listToMap } from "../utils";

export const RULE_TYPE__SALARY_SAFEGUARD = 5;

export const LOCAL_DATA__VALUE_ITEM_ALL = -1;
export const LOCAL_DATA__LABEL_ITEM_ALL = "全部";

export const PEAK_FLAG_YES = 0;
export const PEAK_FLAG_NO = 1;

export const BUSINESS_TYPE_LIST = [
  { value: 1, label: "出租车" },
  { value: 2, label: "专享" },
  { value: 4, label: "快享" },
  { value: 6, label: "惠享" },
];

export const BUSINESS_TYPE_MAPPINGS = listToMap(BUSINESS_TYPE_LIST);

export const BUSINESS_TYPE_LIST_ALL = [
  { value: LOCAL_DATA__VALUE_ITEM_ALL, label: LOCAL_DATA__LABEL_ITEM_ALL },
  ...BUSINESS_TYPE_LIST,
];

export const RULE_STATE_LIST = [
  { value: 0, label: "初始" },
  { value: 1, label: "审核中" },
  { value: 2, label: "启用" },
  { value: 3, label: "审核驳回" },
  { value: 9, label: "过期" },
];

export const RULE_STATE_MAPPINGS = listToMap(RULE_STATE_LIST);

export const OPERATION_TYPE_LIST = [
  { value: 1, label: "自营司机" },
  { value: 2, label: "UP司机" },
];

export const OPERATION_TYPE_LIST_ALL = [
  { value: LOCAL_DATA__VALUE_ITEM_ALL, label: LOCAL_DATA__LABEL_ITEM_ALL },
  ...OPERATION_TYPE_LIST,
];

export const OPERATION_TYPE_MAPPINGS = listToMap(OPERATION_TYPE_LIST);

export const PERMISSION__CITY_SAFEGUARD__CREATE_RULE = "citySafeguard-createRule";
