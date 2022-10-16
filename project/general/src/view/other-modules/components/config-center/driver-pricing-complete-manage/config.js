import { freeze } from "@/mixins/base";

export const statusList = freeze([
  {label: '初始', value: '0'},
  {label: '生效中', value: '1'},
  // {label: '审批中', value: '2'},
  // {label: '审批通过', value: '3'},
  // {label: '审批驳回', value: '4'},
  {label: '已过期', value: '-2'},
  {label: '已停用', value: '-3'},
]);

export const searchConfig = [
  {
    key: "ruleCode",
    type: "text-input",
    title: "策略编码",
    value: "",
    meta: {
      maxlength: 50
    },
  },
  {
    key: "ruleName",
    type: "text-input",
    title: "策略名称",
    value: "",
    meta: {
      maxlength: 50
    },
  },
  { key: "cityCode", type: "drop-input", title: "城市", value: "", meta: {} },
  // { key: "areaCode", type: "drop-input", title: "区县", value: "", meta: {} },
  {
    key: "expandBizLine",
    type: "drop-input",
    title: "业务线",
    value: "",
    meta: {},
  },
  // {
  //   key: "bizType",
  //   type: "drop-input",
  //   title: "产品线",
  //   value: "",
  //   meta: {},
  // },
  // { key: "vehicleLevel", type: "drop-input", title: "车型", value: "", meta: {} },
  {
    key: "status",
    type: "drop-input",
    title: "策略状态",
    value: "",
    meta: { dropList: statusList },
  },
  // {
  //   key: "status",
  //   type: "drop-input",
  //   title: "司机类型",
  //   value: "",
  //   meta: { dropList: statusList },
  // },
  {
    type: 'date-input', 
    key: ['updateStartTime', 'updateEndTime'],
    value: '',
    title: '策略起止日期：',
    meta: {
      placeholder:'请选择'
    },
  },
];

export const dayList = freeze([
  {label: '工作日', value: 1},
  {label: '休息日', value: 2},
])


export const orderTypeList = freeze([
  {label: '实时', value: 1},
  {label: '预约', value: 2},
])

