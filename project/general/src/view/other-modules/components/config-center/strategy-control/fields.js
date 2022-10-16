import {
  axiosCancelStrategyDelete,
  axiosDriverCancelStrategyDelete, axiosHotAreaStrategyDelete, axiosOrderPriorityStrategyDelete,
  axiosPriorityStrategyDelete,
  axiosTimeStrategyDelete
} from "_o/api/configData";
import { freeze } from "@/mixins/base";

export const PAGE_DATA = {
  type1: {
    deleteFunc: axiosCancelStrategyDelete,
    tableName: "cancelTable",
    title: "新建乘客取消策略",
    editTitle: "编辑乘客取消策略"
  },
  type2: {
    deleteFunc: axiosDriverCancelStrategyDelete,
    tableName: "deviateTable",
    title: "新建司机取消策略",
    editTitle: "编辑司机取消策略"
  },
  type3: {
    deleteFunc: axiosTimeStrategyDelete,
    tableName: "timeTable",
    title: "新建时间段及高峰策略",
    editTitle: "编辑时间段及高峰策略"
  },
  type4: {
    deleteFunc: axiosPriorityStrategyDelete,
    tableName: "tacticTable",
    title: "新建产品线及订单来源优先级策略",
    editTitle: "新建产品线及订单来源优先级策略"
  },
  type5: {
    deleteFunc: axiosHotAreaStrategyDelete,
    tableName: "hotAreaTable",
    title: "热区定向派单优先级策略",
    editTitle: "热区定向派单优先级策略"
  },
  type6: {
    deleteFunc: axiosOrderPriorityStrategyDelete,
    tableName: "orderPriorityTable",
    title: "订单价值优先级派单策略",
    editTitle: "订单价值优先级派单策略"
  },
  type7: {
    deleteFunc: axiosOrderPriorityStrategyDelete,
    tableName: "orderPriorityTable",
    title: "订单价值优先级派单策略",
    editTitle: "订单价值优先级派单策略"
  }
};

export const defaultRuleList = [
  {
    continuedCancelMinute: 10,
    continuedCancelNum: 4,
    continuedCancelNoMinute: 0.5
  },
  {
    continuedCancelMinute: 10,
    continuedCancelNum: 5,
    continuedCancelNoMinute: 2
  },
  {
    continuedCancelMinute: 10,
    continuedCancelNum: 6,
    continuedCancelNoMinute: 10
  },
]

export const minuteList = freeze([
  {label: 0.5, value: 0.5}
].concat(new Array(30).fill(0).map((it, index) => ({
  label: index + 1,
  value: index + 1
}))))

export const reasonList = freeze([
  {label: '司机到达上车点', value: 1},
  {label: '司机未到达上车点', value: 2},
])
