import { mapToList } from "@/libs/util.js";
import { getBusinessLine } from "_g/config/status-map";
import { validEmptyArray } from "@/libs/validate"

// 涉及产品线枚举值-快享/专/出租车/包车-业务线
export const BusinessArr = [4, 2, 6, 1];
export const businessInfo = getBusinessLine(BusinessArr);

export const limitTypeMap = {
  1: "尾号类型"
}
export const fuelMap = {
  "1": "汽油",
  "3": "纯电动",
  "11": "油电混合"
}
export const fuelList = mapToList(fuelMap, "string")

export const inputList = [
  {
    name: "drop-input",
    bind_key: "cityCode",
    value: "",
    dropList: [],
    title: "城市：",
    placeholder: "请选择",
    titleWidth: 40,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "businessType",
    value: "",
    dropList: [],
    title: "产品线："
  },
];
export const parColumns = that => {
  return [
    {
      title: "序号",
      type: "index",
      width: 70
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "产品线",
      key: "businessType",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, { row }) => {
        const { businessType } = row
        const { productKeyValue } = that.businessGradeName
        return h("div", productKeyValue[businessType])
      }
    },
    {
      title: "限行类型",
      key: "restrictionType",
      minWidth: 100,
      render: (h, { row }) => {
        let name = "";
        if (row && row.trafficRestrictionDto) {
          if (row.trafficRestrictionDto.restrictionType === 1) {
            name = "尾号类型";
          } else if (row.trafficRestrictionDto.restrictionType === 2) {
            name = "头号类型";
          }
        }
        return h("div", name);
      }
    },
    {
      title: "电子围栏",
      key: "fenceName",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 170,
    },
    {
      title: "操作人",
      key: "updater",
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 200,
      slot: "action"
    }
  ];
};

export const ruleValidate = {
  cityCode: [
    { required: true, message: "请选择城市", trigger: "change" },
  ],
  weekList: [
    { required: true, type: "array", min: 1, message: "请选择星期值", trigger: "change" },
    { trigger: "change", msg: "请选择星期值", validator: validEmptyArray }
  ],
  daysList: [
    { required: true, type: "array", min: 1, message: "请选择每月日期", trigger: "change" },
    { trigger: "change", msg: "请选择每月日期", validator: validEmptyArray }
  ],
  restrictionType: [
    { required: true, message: "请选择限行类型" },
  ],
  limitTailNums: [
    { required: true, type: "array", min: 1, message: "请选择限制尾号", trigger: "change" },
  ],
  businessTypeList: [
    { required: true, type: "array", min: 1, message: "请选择产品线", trigger: "blur" },
  ],
  tailNumType: [
    { required: true, type: "number", message: "请选择尾号类型", trigger: "blur" }
  ],
  fuelTypes: [
    { required: true, type: "array", min: 1, message: "请选择燃料类型", trigger: "blur" }
  ],
  fenceUuid: [
    { required: true, message: "请选择电子围栏", trigger: "blur" }
  ],
  timeItem: [
    { required: true, type: "array", min: 2, message: "请选择限定时段", trigger: "change" },
    { trigger: "change", msg: "请选择限定时段", validator: validEmptyArray }
  ]
}
