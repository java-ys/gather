import { freeze } from "@/mixins/base";

export const statusList = freeze([
  {label: '待生效', value: '0'},
  {label: '生效中', value: '1'},
  {label: '已失效', value: '-2'},
]);

export const searchConfig = [
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
  { key: "areaCode", type: "drop-input", title: "区县", value: "", meta: {} },
  {
    key: "expandBizLine",
    type: "drop-input",
    title: "业务线",
    value: "",
    meta: {},
  },
  {
    key: "bizType",
    type: "drop-input",
    title: "产品线",
    value: "",
    meta: {},
  },
  { key: "vehicleLevel", type: "drop-input", title: "车型", value: "", meta: {} },
  {
    key: "status",
    type: "drop-input",
    title: "状态",
    value: "",
    meta: { dropList: statusList },
  },
];

export const dayList = freeze([
  {label: '工作日', value: 1},
  {label: '休息日', value: 2},
])


export const orderTypeList = freeze([
  {label: '实时订单', value: 1},
  {label: '预约单', value: 2},
])
