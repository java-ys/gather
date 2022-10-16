
import { mapToList } from "@/libs/util.js";
import { getBusinessLine } from "_g/config/status-map";

export const originMap = {
  1: "客服进线",
  2: "弹屏报警",
  3: "线下上报"
}
export const originList = mapToList(originMap)
export const businessInfo = getBusinessLine([4,2,1])
const inputWidth=250
export const inputList = [
  {
    name: "text-input",
    bind_key: "occurNo",
    value: "",
    placeholder: "请输入",
    maxlength: 25,
    inputWidth,
    title: "案件编码"
  },
  {
    name: "text-input",
    bind_key: "name",
    value: "",
    placeholder: "请输入",
    maxlength: 20,
    title: "司机姓名",
    inputWidth,
  },
  {
    name: "text-input",
    bind_key: "driverNo",
    value: "",
    placeholder: "请输入",
    maxlength: 12,
    title: "司机ID",
    inputWidth,
  },
  {
    name: "text-input",
    bind_key: "mobile",
    value: "",
    placeholder: "请输入",
    maxlength: 11,
    title: "司机手机号",
    titleWidth:80,
    inputWidth,
  },
  {
    name: 'date-input',
    bind_key: ['entryStartTime' ,'entryEndTime'],
    placeholder: '请选择',
    value: [],
    title: '入职日期',
    inputWidth,
  },
  {
    name: "text-input",
    bind_key: "plateNo",
    value: "",
    placeholder: "请输入",
    maxlength: 10,
    title: "车牌号",
    inputWidth,
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "省 / 市", // 展示的字段名
    changeOnSelect: false,
    inputWidth,
  },
  {
    name: "drop-input", // 下拉
    bind_key: "businessType",
    value: "",
    dropList: businessInfo.list,
    title: "业务线",
    placeholder: "请选择",
    clearable: true,
    isHide: false,
    inputWidth,
  },
  {
    name: "text-input",
    bind_key: "agentName",
    value: "",
    placeholder: "请输入",
    maxlength: 40,
    title: "运营商",
    inputWidth,
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["level1", "level2", "level3", "level4", "level5"], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "安全分违规类型", // 展示的字段名
    changeOnSelect: true,
    titleWidth:110,
    inputWidth,
  },
  {
    name: 'date-input',
    bind_key: ['createStartTime' ,'createEndTime'],
    placeholder: '请选择',
    value: [],
    title: '创建日期',
  },
  {
    name: 'date-input',
    bind_key: ['occurStartTime' ,'occurEndTime'],
    placeholder: '请选择',
    value: [],
    title: '事发日期',
    inputWidth,
  },
]
export const parColumns = (that) => {
  return [
    {
			title: '选择',
			type: 'selection',
			width: 50
		},
    {
      title: '序号',
      type: 'index',
      width: 67,
      align: 'center'
    },
    {
      title: "案件编码",
      key: "occurNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "司机姓名",
      key: "name",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "司机ID",
      key: "driverNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 130
    },
    {
      title: "司机手机号",
      key: "mobile",
      tooltip: true,
      ellipsis: true,
      minWidth: 130
    },
    {
      title: "身份证号",
      key: "idCard",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "入职日期",
      key: "entryTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: "车牌号",
      key: "plateNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: "业务线",
      key: "businessType",
      tooltip: true,
      ellipsis: true,
      minWidth: 110,
      render: (h, params) => {
        return h("span", businessInfo.map[params.row.businessType]);
      }
    },
    {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "订单号",
      key: "orderNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "安全分违规类型",
      key: "violationType",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "事件来源",
      key: "source",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "事发日期",
      key: "occurDate",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "事发地点",
      key: "occurAddress",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "交通事故责任",
      key: "determine",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "创建日期",
      key: "createDate",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "操作人",
      key: "updater",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "操作时间",
      key: "updateTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 170,
      slot: "action",
    }
  ]
}