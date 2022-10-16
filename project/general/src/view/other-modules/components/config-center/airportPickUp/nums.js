/*
 * @Author: Evil Cheng
 * @Date: 2021-11-09 13:46:20
 * @LastEditTime: 2021-11-22 10:38:05
 * @Description:
 */
export const ORDER_TYPES = [
  {
    label: "实时",
    value: 1
  },
  {
    label: "预约",
    value: 2
  }
] // 订单类型
export const ORDER_STATUS = [
  {
    label: "未生效",
    value: 0
  },
  {
    label: "生效中",
    value: 1
  },
  {
    label: "已停用",
    value: -2
  },
] // 订单状态
export const PRICING_ORDER_STATUS = [
  {
    label: "未生效",
    value: 0
  },
  {
    label: "生效中",
    value: 1
  },
  {
    label: "已失效",
    value: 2
  },
] // 定价策略订单状态
export const ADMINISTRATION_LIST = [
  {
    label: "市级",
    value: 1
  },
  {
    label: "区县级",
    value: 2
  }
] // 行政区类型

export const CALCULATE_NODE = [
  {
    label: "计算矩阵折扣前",
    value: 1
  },
  {
    label: "计算矩阵折扣后",
    value: 2
  }
] // 最低消费计算节点

export const REMOTE_SEGMENT = () => {
  const list = []
  for (let i = 0; i < 101; i++) {
    list.push({
      value: i,
      label: `${i}公里`
    })
  }
  return list
} // 远途分段

/**
 * @description: 过滤订单类型
 * @param {*}
 * @return {*}
 */
export const filterOrderType = (val) => {
  const item = ORDER_TYPES.find(v => v.value === val)
  return item ? item.label : "--"
}

/**
 * @description: 过滤订单状态
 * @param {*}
 * @return {*}
 */
export const filterOrderStatus = (val) => {
  const item = ORDER_STATUS.find(v => v.value === val)
  return item ? item.label : "--"
}

/**
 * @description: 过滤定价策略订单状态
 * @param {*}
 * @return {*}
 */
export const filterPricingOrderStatus = (val) => {
  const item = PRICING_ORDER_STATUS.find(v => v.value === val)
  return item ? item.label : "--"
}

