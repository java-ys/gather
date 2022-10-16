import { freeze } from "@/mixins/base"

// 运营模式
export const operateTypeEnum = freeze([
  { label: "A", value: "1" },
  { label: "UP", value: "2" },
  { label: "DCP(不含坚果）", value: "3" },
  { label: "巡网", value: "4" },
  // { label: "松果", value: "5" },
  { label: "坚果", value: "6" },
])

// 产品线
export const productLineEnum = freeze([
  { label: "出租车", value: "1" },
  { label: "专车", value: "2" },
  { label: "快享", value: "4" },
  { label: "惠享", value: "6" },
  { label: "自动驾驶", value: "7" }
])

// 是否主策略
export const tacticsEnum = freeze([
  { label: "主策略", value: 0 },
  { label: "辅策略", value: 1 },
])

// 分类
export const classifyEnum = freeze([
  { label: "规模项", value: 1 },
  { label: "效率项", value: 2 },
  { label: "体验项", value: 3 },
  { label: "安全项", value: 4 },
  { label: "专项", value: 5 },
  { label: "其他", value: 9 }
])

// 补发类目
export const reissueList = freeze([
  { label: "头部司机奖励", value: 1 },
  { label: "辅助策略奖励", value: 2 },
  { label: "其他奖励", value: 3 },
  { label: "其他补发", value: 4 },
]);
// 补扣类目
export const deductList = freeze([
  { label: "风控扣减", value: 1 },
  { label: "服务扣减", value: 2 },
  { label: "安全扣减", value: 3 },
  { label: "违约扣减", value: 4 },
  { label: "合规扣减", value: 5 },
  { label: "投诉扣减", value: 6 },
  { label: "其他扣减", value: 7 },
]);
