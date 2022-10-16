
import { mapToList } from "@/libs/util.js";
import { getBusinessLine } from "_g/config/status-map";

export const scoreMap = {
  1: "0-25",
  2: "25-50",
  3: "50-75",
  4: "75-100",
  5: "小于等于0"
}
export const scoreList = mapToList(scoreMap)
export const businessInfo = getBusinessLine([4,2,1])
export const inputList = [
  {
    name: "text-input",
    bind_key: "name",
    value: "",
    placeholder: "请输入",
    maxlength: 20,
    title: "司机姓名"
  },
  {
    name: "text-input",
    bind_key: "driverNo",
    value: "",
    placeholder: "请输入",
    maxlength: 12,
    title: "司机ID"
  },
  {
    name: "drop-input", // 下拉
    bind_key: "score",
    value: "",
    dropList: scoreList,
    title: "安全分",
    placeholder: "请选择",
    clearable: true,
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "plateNo",
    value: "",
    placeholder: "请输入",
    maxlength: 10,
    title: "车牌号"
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "省 / 市：", // 展示的字段名
    changeOnSelect: false
  },
  {
    name: "drop-input", // 下拉
    bind_key: "businessType",
    value: "",
    dropList: businessInfo.list,
    title: "业务线",
    placeholder: "请选择",
    clearable: true,
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "agentName",
    value: "",
    placeholder: "请输入",
    maxlength: 40,
    title: "运营商"
  },
]
export const parColumns = [
  {
    title: '序号',
    type: 'index',
    width: 67,
    align: 'center'
  },
  {
    title: "司机姓名",
    key: "name",
    tooltip: true,
    ellipsis: true,
    minWidth: 110
  },
  {
    title: "司机ID",
    key: "driverNo",
    tooltip: true,
    ellipsis: true,
    minWidth: 120
  },
  {
    title: "身份证号",
    key: "idCard",
    tooltip: true,
    ellipsis: true,
    minWidth: 170
  },
  {
    title: "安全分",
    key: "score",
    tooltip: true,
    ellipsis: true,
    minWidth: 90,
    sortable: true
  },
  {
    title: "车牌号",
    key: "plateNo",
    tooltip: true,
    ellipsis: true,
    minWidth: 100
  },
  {
    title: "城市",
    key: "cityName",
    tooltip: true,
    ellipsis: true,
    minWidth: 100
  },
  {
    title: "业务线",
    key: "businessType",
    tooltip: true,
    ellipsis: true,
    minWidth: 100,
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
    title: "操作",
    key: "action",
    tooltip: true,
    fixed: "right",
    width: 170,
    slot: "action",
  }
]