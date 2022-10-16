
import { listToMap } from "@/libs/util.js"
export const sendMap = {
  0: "乘客",
  1: "司机",
  2: "车机",
  3: "运营商"
}

export const leagueBoundary = [
  {label: "指定运营商账号", value: '23'},
  {label: "指定运营角色", value: '22'},
  {label: "批量", value: '24'}
]
export const driverBoundary = [
  {
    value: "0",
    label: "指定司机"
  },
  {
    value: "1",
    label: "指定运营商"
  },
  {
    value: "2",
    label: "批量"
  },
  {
    value: "3",
    label: "司机分群"
  },
  {
    value: "21",
    label: "指定工资类别"
  }
];

export const passengerBoundary = [
  {
    value: "0",
    label: "指定乘客"
  },
  {
    value: "1",
    label: "用户分群"
  },
  {
    value: "2",
    label: "批量"
  },
  // {
  //    value: "3",
  //   label: "公告/push未查看乘客"
  // }
]

export const driverMap = { // 用户选择方式
  2: "指定乘客",
  3: "指定司机",
  4: "指定运营商",
  5: "乘客批量",
  7: "司机批量",
  10: "用户群组",
  21: "工资类型",
  23: "指定运营商账号",
  22: "指定运营角色",
  24: "运营商批量"
}
export const taskStatusList = [
  {
    label: "处理中",
    value: 7
  },
  {
    label: "待审核",
    value: 0
  },
  {
    label: "待发送",
    value: 1
  },
  {
    label: "审核失败",
    value: 2
  },
  {
    label: "发送中",
    value: 3
  },
  {
    label: "已发送",
    value: 4
  },
  {
    label: "发送失败",
    value: 5
  },
  {
    label: "已撤销",
    value: 6
  },
  {
    label: "已失效",
    value: 8
  }
]

export const taskStatusMap = listToMap(taskStatusList)
export const batchStatusMap = {
  ...taskStatusMap,
  7: "数据处理中",
  0: "导入完成，待审核",
  1: "导入完成，待发送"
}

export const parColumns = [
  {
    type: "selection",
    width: 60,
    align: "center",
    fixed: "left",
  },
  {
    title: "序号",
    type: "index",
    minWidth: 70,
    fixed: "left",
    key: "index",
    fixDisabled: true
  },
  {
    title: "任务名称",
    key: "taskName",
    minWidth: 150,
    tooltip: true,
    fixed: "left",
    fixDisabled: true
  },
  {
    title: "发送城市",
    key: "cityNames",
    minWidth: 150,
    tooltip: true
  },
  {
    title: "发送对象",
    key: "sendName",
    minWidth: 90,
    tooltip: true,
    render: (h, params) => {
      return h("span", {
        domProps: {
          textContent: sendMap[params.row.sendName]
        }
      })
    }
  },
  {
    title: "发送内容",
    key: "content",
    minWidth: 150,
    tooltip: true
  },
  {
    title: "用户选择方式",
    key: "driver",
    minWidth: 120,
    tooltip: true,
    render: (h, params) => {
      let text = driverMap[params.row.driver]
      if (!driverMap.hasOwnProperty(params.row.driver)) {
        text = params.row.driver
      }
      return h("span", text)
    }
  },
  {
    title: "状态",
    key: "taskStatus",
    minWidth: 100,
    tooltip: true,
    render: (h, params) => {
      return h("span", taskStatusMap[params.row.taskStatus])
    }
  },
  {
    title: "对象数量",
    key: "targetNum",
    minWidth: 100,
    tooltip: true,
    render: (h, { row }) => {
      let res = row.taskStatus === 7 ? "-" : row.targetNum
      return h("span", res)
    }
  },
  {
    title: "发送时间",
    key: "sendTime",
    minWidth: 170,
    tooltip: true
  },
  {
    title: "创建人",
    key: "creatorName",
    minWidth: 120,
    tooltip: true
  },
  {
    title: "创建时间",
    key: "createTime",
    minWidth: 160,
    tooltip: true
  },
  {
    key: "action",
    title: "操作",
    fixed: "right",
    minWidth: 140,
    slot: "action"
  }
]

export const inputList = [
  {
    name: "text-input",
    bind_key: "taskName",
    placeholder: "请输入名称",
    value: "",
    title: "任务名称",
  },
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCodes"],
    placeholder: "请选择",
    value: [],
    cascaderList: [],
    title: "发送城市",
    filterable: true,
  },
  {
    name: "drop-input",
    bind_key: "sendName",
    placeholder: "请选择",
    value: "",
    dropList: [
      {
        value: 0,
        label: "乘客"
      },
      {
        value: 1,
        label: "司机"
      },
      {
        value: 3,
        label: "运营商"
      }
    ],
    title: "发送对象",
  },
  {
    name: "date-input",
    bind_key: ["startTime", "endTime"],
    placeholder: "请选择",
    value: "",
    title: "发送日期",
  },
  {
    name: "drop-input",
    bind_key: "taskStatus",
    placeholder: "请选择",
    value: "",
    dropList: taskStatusList,
    title: "状态",
    titleWidth: 45
  },
]