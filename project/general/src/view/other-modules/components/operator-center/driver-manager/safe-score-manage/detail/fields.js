
import { mapToList } from "@/libs/util.js";
import { woTitleList } from "./woTitleList.js";

export const scoreTypeMap = {
  1: "扣减",
  2: "加回"
}
export const scoreTypeList = mapToList(scoreTypeMap)
export const statusMap = {
  0: "已过期",
  1: "生效中"
}
export const statusList = mapToList(statusMap)
export const eventLevelMap = {
  "S": "S",
  "A1": "A1",
  "A2": "A2",
  "A3": "A3",
  "A4": "A4",
  "A5": "A5",
  "B1": "B1",
  "B2": "B2",
  "B3": "B3",
  "B4": "B4",
  "B5": "B5",
  "C1": "C1",
  "C2": "C2",
  "C3": "C3",
  "C4": "C4",
  "C5": "C5"
}
export const eventLevelList = mapToList(eventLevelMap,'string')
const inputWidth=250
export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["level1", "level2", "level3", "level4", "level5"], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "安全分违规类型", // 展示的字段名
    changeOnSelect: true,
    titleWidth:100,
    inputWidth
  },
  {
    name: "drop-input", // 下拉
    bind_key: "gradeTye",
    value: "",
    dropList: scoreTypeList,
    title: "计分类型",
    placeholder: "请选择",
    isHide: false,
    inputWidth
  },
  {
    name: "drop-input", // 下拉
    bind_key: "status",
    value: "",
    dropList: statusList,
    title: "状态",
    placeholder: "请选择",
    isHide: false,
    titleWidth: 40,
    inputWidth
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ['title1','title2','title3'], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: woTitleList, // 级联列表
    title: "工单标题", // 展示的字段名
    changeOnSelect: false,
    inputWidth
  },
  {
    name: "text-input",
    bind_key: "woId",
    value: "",
    placeholder: "请输入",
    maxlength: 16,
    title: "工单ID",
    inputWidth
  },
  {
    name: "text-input",
    bind_key: "alarmId",
    value: "",
    placeholder: "请输入",
    maxlength: 30,
    title: "报警ID",
    inputWidth
  },
  {
    name: 'date-time-input',
    bind_key: ['alarmStartTime' ,'alarmEndTime'],
    placeholder: '请选择',
    value: [],
    title: '报警时间: ',
    inputWidth
  },
  {
    name: "text-input",
    bind_key: "orderNo",
    value: "",
    placeholder: "请输入",
    maxlength: 20,
    title: "订单号",
    inputWidth
  },
  {
    name: "drop-input", // 下拉
    bind_key: "occurLevel",
    value: "",
    dropList: eventLevelList,
    title: "事件分级",
    placeholder: "请选择",
    clearable: true,
    isHide: false,
    inputWidth
  },
  {
    name: "text-input",
    bind_key: "occurNo",
    value: "",
    placeholder: "请输入",
    maxlength: 25,
    title: "案件编码",
    inputWidth
  },
  {
    name: 'date-time-input',
    bind_key: ['pecStartTime' ,'pecEndTime'],
    placeholder: '请选择',
    value: [],
    title: '违章时间: ',
    inputWidth: 260
  },
  {
    name: 'date-time-input',
    bind_key: ['opStartTime' ,'opEndTime'],
    placeholder: '请选择',
    value: [],
    title: '处理时间: ',
    inputWidth: 260
  }
]
export const parColumns = (that) => {
  return [
    {
      title: '序号',
      type: 'index',
      width: 67,
      align: 'center'
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "安全分违规类型",
      key: "violationType",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "分值",
      key: "value",
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "计分类型",
      key: "gradeTye",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
				return h('span', scoreTypeMap[params.row.gradeTye]);
			}
    },
    {
      title: "状态",
      key: "status",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
				return h('span', statusMap[params.row.status]);
			}
    },
    {
      title: "工单标题",
      key: "woTitle",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "工单ID",
      key: "woId",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "报警ID",
      key: "alarmId",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "报警时间",
      key: "alarmTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "订单号",
      key: "orderNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 185
    },
    {
      title: "事件分级",
      key: "occurLevel",
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: "案件编码",
      key: "occurNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "事发日期",
      key: "occurDate",
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: "事发地点",
      key: "occurAddress",
      tooltip: true,
      ellipsis: true,
      minWidth: 180
    },
    {
      title: "交通事故责任",
      key: "determine",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "违章扣分",
      key: "pecScore",
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "违章时间",
      key: "pecTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "处理人",
      key: "operator",
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "处理时间",
      key: "opTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 80,
      slot: "action",
    }
  ]
}