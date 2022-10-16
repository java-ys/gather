/*
 * @Author: Evil Cheng
 * @Date: 2021-10-19 09:41:41
 * @LastEditTime: 2021-12-10 10:36:02
 * @Description:
 */
import {  carTypeMapAll, getCarLevelList } from "_g/config/status-map"

// 产品线
export const businessTypeMap = {
  2: "专享",
  4: "快享"
}
export const businessTypeList = Object.keys(businessTypeMap).map(key => ({
  label: businessTypeMap[key],
  value: key
}))
// 车型等级
export const carLevelMap = carTypeMapAll
// 业务线、车型分组
export const carGroupMap = {
  2: getCarLevelList(2),
  4: getCarLevelList(4)
}
// 订单类型
export const orderTypeMap = {
  1: "实时",
  2: "预约"
}
export const orderTypeList = Object.keys(orderTypeMap).map(key => ({
  label: orderTypeMap[key],
  value: key
}))
// 状态
export const statusMap = {
  0: "待生效",
  1: "启用",
  "-2": "停用"
}

export const inputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityCode", // 返回数据的key名
    placeholder: "请选择城市",
    value: "", // 绑定返回数据
    dropList: [],
    title: "城市", // 展示的字段名
    filterable: true,
    clearable: true,
    titleWidth: 80
  },
  {
    key: "expandBizLine",
    name: "drop-input",
    bind_key: "expandBizLine",
    value: "",
    dropList: [],
    title: "业务线"
  },
  {
    key: "productLine",
    name: "cascader-input",
    bind_key: ["businessType", "carLevel"],
    value: [],
    cascaderList: [],
    title: "产品线"
  },
  {
    name: "drop-input",
    bind_key: "typeTime",
    value: "",
    dropList: orderTypeList,
    title: "订单类型",
    placeholder: "请选择",
    titleWidth: 80,
    filterable: true
  },
  {
    name: "text-input",
    bind_key: "ruleName",
    value: "",
    title: "策略名称",
    placeholder: "请输入",
    titleWidth: 80,
  },
  {
    name: "drop-input",
    bind_key: "status",
    value: undefined,
    dropList: Object.keys(statusMap).map(key => ({
      label: statusMap[key],
      value: key
    })),
    title: "状态",
    placeholder: "请选择",
    titleWidth: 80,
    filterable: true
  },
]
