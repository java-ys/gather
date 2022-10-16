/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:22
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-03 15:58:09
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
  label: "已启用",
}, {
  value: STATUS__DEACTIVATED,
  label: "已停用"
}, {
  value: STATUS__TOACTIVATED,
  label: "待启用",
}]

// 是否弹出升舱弹窗
export const isPopupList = [
  {label: "是", value: 1},
  {label: "否", value: 0},
]



/** 策略状态映射对象 */
export const STATUS_MAPPINGS = listToMapFnGenerator("value", "label")(STATUS_LIST)


export const inputList = [
  {
    name: "text-input",
    bind_key: "groupName",
    value: "",
    title: "车型组",
    titleWidth: 110,
  },
  {
    name: "text-input",
    bind_key: "aliasName",
    value: "",
    dropList: [],
    titleWidth: 110,
    title: "别名"
  },
  {
    name: "drop-input",
    bind_key: "configStatus",
    value: "",
    dropList: STATUS_LIST,
    titleWidth: 110,
    title: "状态"
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
    title: "编号",
    key: "id",
    tooltip: true,
    minWidth: 150
  },
  {
    title: "图标",
    key: "ruleName",
    tooltip: true,
    minWidth: 150,
    render: (h, params) => {
      return <img style="width:42px;height:42px" src={params.row.iconUrl}/>
    }
  },
  {
    title: "车型组",
    key: "groupName",
    tooltip: true,
    minWidth: 160
  },
  {
    title: "别名",
    key: "aliasName",
    tooltip: true,
    minWidth: 160
  },
  {
    title: "包含车型等级",
    key: "aliasName",
    tooltip: true,
    minWidth: 160,
    render: (h, { row }) => {
      let text = "";
      let groupVehicleList = JSON.parse(row.groupVehicleList) || [];
      text = [...groupVehicleList.map(it => {
        let list = it.levels.map(item => {
          return `${it.bizTypeName}-${item.vehicleName}`
        })
        return list
      }).flat()].join("、")
      return <span>{text}</span>
    }
  },
  {
    title: "状态",
    key: "configStatus",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return <span>{STATUS_MAPPINGS[params.row.configStatus]}</span>
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
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日",
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