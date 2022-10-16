/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:22
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-01-19 15:56:44
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
},{
  value: STATUS__TOACTIVATED,
  label: "待生效",
}]

export const AREATYPE_LIST = [{
  value: 1,
  label: "市级",
}, {
  value: 2,
  label: "区县级"
}]

export const ORDERTYPE_LIST = [{
  value: 1,
  label: "实时订单",
}, {
  value: 2,
  label: "预约订单"
}]

/** 策略状态映射对象 */
export const STATUS_MAPPINGS = listToMapFnGenerator("value", "label")(STATUS_LIST)

/** 策略状态映射对象 */
export const ORDERTYPE_MAPPINGS = listToMapFnGenerator("value", "label")(ORDERTYPE_LIST)

export const AREATYPE_MAPPINGS = {
  1:"市级",
  2:"区县级"
}

export const inputList = [
  {
    name: "drop-input",
    bind_key: "cityCodes",
    value: "",
    dropList: [],
    title: "城市",
    titleWidth: 110,
    filterable: true,
    multiple:true
  },
  {
    name: "drop-input",
    bind_key: "expandBizLine",
    value: "",
    dropList: [],
    titleWidth: 110,
    title: "业务线"
  },
  {
    name: "drop-input",
    bind_key: "businessType",
    value: "",
    dropList: [],
    title: "产品线",
    titleWidth: 110,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "status",
    value: "",
    dropList: [{
      label:"全部",
      value:"-1"
    },...STATUS_LIST],
    titleWidth: 110,
    title: "生效状态"
  },
  {
    name: "drop-input",
    bind_key: "areaType",
    value: "",
    dropList: AREATYPE_LIST,
    titleWidth: 110,
    title: "行政区类型"
  },
  {
    name: "drop-input",
    bind_key: "typeTime",
    value: "",
    dropList: [{
      label:"全部",
      value:"-1"
    },...ORDERTYPE_LIST],
    titleWidth: 110,
    title: "订单类型"
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
    title: "策略名称",
    key: "ruleName",
    tooltip: true,
    minWidth: 150
  },
  {
    title: "业务线",
    key: "expandBizLine",
    tooltip: true,
    minWidth: 130,
    render: (h, params) => {
      const { row: { expandBizLine }} = params
      const { businessGradeList } = props
      return h("span", businessGradeList.find(it => it.value === expandBizLine).label || "暂无")
    }
  },
  {
    title: "产品线",
    key: "businessType",
    tooltip: true,
    minWidth: 130,
    render: (h, params) => {
      const { row: { businessType }} = params
      const { bizTypeList } = props
      return h("span", bizTypeList.find(it => it.value === businessType).label || "暂无")
    }
  },
  {
    title: "车型等级",
    key: "carLevel",
    tooltip: true,
    minWidth: 130,
    render: (h, params) => {
      const { row: { carLevel }} = params
      const { carLevelList } = props
      return h("span", carLevelList.find(it => it.vehicleLevel === carLevel).vehicleName || "暂无")
    }
  },
  {
    title: "行政区类型",
    key: "areaType",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return <span>{AREATYPE_MAPPINGS[params.row.areaType]}</span>
    }
  },
  {
    title: "行政区域",
    key: "areaName",
    tooltip: true,
    minWidth: 100
  },
  {
    title: "城市",
    key: "cityName",
    tooltip: true,
    minWidth: 130
  },
  {
    title: "订单类型",
    key: "typeTime",
    tooltip: true,
    minWidth: 120,
    render: (h, params) => {
      return <span>{ORDERTYPE_MAPPINGS[params.row.typeTime]}</span>
    }
  },
  {
    title: "生效状态",
    key: "status",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return <span>{STATUS_MAPPINGS[params.row.status]}</span>
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
    title: "操作人",
    key: "updater",
    tooltip: true,
    minWidth: 150,
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


// 星期值
export const getWeekName = (i) => {
  let map = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
  }
  return map[i];
}

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