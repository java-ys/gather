/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:22
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-18 14:33:50
 * @Description:
 */
import { yyyyMMDDHHmmss } from "./utils";
import ButtonCell from "./components/ButtonsCell"
import { STATUS__ACTIVATED, STATUS__DEACTIVATED, STATUS__TOACTIVATED } from "./const"
const listToMapFnGenerator = (valueKey, textKey) => list => {
  const obj = {}
  list.forEach(item => {
    obj[item[valueKey]] = item[textKey]
  })

  return obj;
}
export const STATUS_LIST = [{
  value: STATUS__ACTIVATED,
  label: "生效中",
}, {
  value: STATUS__DEACTIVATED,
  label: "已失效"
}, {
  value: STATUS__TOACTIVATED,
  label: "待生效",
}]


/** 策略状态映射对象 */
export const STATUS_MAPPINGS = listToMapFnGenerator("value", "label")(STATUS_LIST)


export const inputList = [
  {
    name: "drop-input",
    bind_key: "cityCode",
    value: "",
    dropList: [],
    title: "城市",
    titleWidth: 110,
    filterable: true,
  },
];

export const tableCols = (props) => [
  {
    title: "序号",
    tooltip: true,
    width: 65,
    type: "index",
  },
  {
    title: "城市",
    key: "proCityName",
    tooltip: true,
    minWidth: 120
  },
  {
    title: "创建人",
    key: "creator",
    tooltip: true,
    minWidth: 160
  },
  {
    title: "创建时间",
    key: "createTime",
    tooltip: true,
    minWidth: 160,
    render: (h, params) => {
      return <span>{yyyyMMDDHHmmss(params.row.createTime)}</span>
    }
  },
  {
    title: "更新时间",
    key: "updateTime",
    tooltip: true,
    minWidth: 160,
    render: (h, params) => {
      return <span>{yyyyMMDDHHmmss(params.row.updateTime)}</span>
    }
  },
  {
    title: "操作",
    slot: "action",
    fixed: "right",
    tooltip: true,
    minWidth: 180,
    render: (h, params) => {
      return <ButtonCell row={params.row} />
    }
  }
]

// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    callback();
  }
}
// 详情时间校验
export const validatorTimeDetail = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("结束时间要大于开始时间"));
    } else {
      callback();
    }
  }
}