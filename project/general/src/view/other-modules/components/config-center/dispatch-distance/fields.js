import { carTypeMapAll,  getCarLevelList } from "_g/config/status-map";

const businessTypeList = [
  {
    label: "快享",
    value: 4
  },
  {
    label: "专享",
    value: 2
  },
  {
    label: "出租车",
    value: 1
  },
]
const businessTypeMap = {
  1: "出租车",
  4: "快享",
  2: "专享"
}
// 全部车型等级options
const carLevelList = {
  1: getCarLevelList(1),
  2: getCarLevelList(2),
  4: getCarLevelList(4),
}

const scopeTypeList = [
  {
    label: "基础类",
    value: 1
  },
  {
    label: "范围类",
    value: 2
  }
]
const scopeTypeMap = {
  1: "基础类",
  2: "范围类"
}

export const statusList = [
  {
    label: "已启用",
    value: 0
  },
  {
    label: "已停用",
    value: 1
  }
]

const statusMap = {
  0: "已启用",
  1: "已停用"
}
const inputList = [
  {
    name: "cascader-input", // 级联
    bind_key: ["provinceCode", "cityCode"],
    value: [],
    cascaderList: [],
    filterable: true,
    title: "城市"
  },
  {
    name: "drop-input", // 下拉
    bind_key: "areaCode",
    value: "",
    dropList: [],
    title: "区县",
    clearable: true
  },
  {
    name: "cascader-input", // 级联
    bind_key: ["businessType", "carLevel"],
    value: [],
    cascaderList: [],
    filterable: true,
    title: "产品线/车型等级",
    titleWidth: 120
  },
  {
    name: "drop-input", // 下拉
    bind_key: "scopeType",
    value: "",
    dropList: scopeTypeList,
    title: "范围类型",
    clearable: true
  }
]
export const returnFields = (that) => {
  return {
    index: {
      title: "序号",
      type: "index",
      width: 60,
      align: "center"
    },
    provinceAndCityName: {
      title: "城市",
      key: "provinceAndCityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    areaName: {
      title: "区县",
      key: "areaName",
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    expandBizLine: {
      title: "业务线",
      key: "expandBizLine",
      tooltip: true,
      ellipsis: true,
      width: 100,
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        const { businessKeyValue } = that.businessGradeName;
        return h("div", businessKeyValue[expandBizLine] || "")
      }
    },
    businessType: {
      title: "产品线",
      key: "businessType",
      tooltip: true,
      ellipsis: true,
      width: 100,
      render: (h, params) => {
        const { row: { businessType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("div", productKeyValue[businessType] || "")
      }
    },
    carLevel: {
      title: "车型等级",
      key: "carLevel",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
      render: (h, params) => {
        const { row: { businessType, carLevel }} = params
        const { productCarKeyValue } = that.businessGradeName
        const names = carLevel.map(v => productCarKeyValue[`${businessType}#${v}`])
        return h("span", names.join(","))
      }
    },
    scopeType: {
      title: "范围类型",
      key: "scopeType",
      tooltip: true,
      ellipsis: true,
      width: 100,
      render: (h, params) => {
        return h("div", scopeTypeMap[params.row.scopeType]);
      }
    },
    fenceName: {
      title: "电子围栏",
      key: "fenceName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    scopeType: {
      title: "状态",
      key: "status",
      tooltip: true,
      ellipsis: true,
      width: 100,
      render: (h, params) => {
        return h("div", statusMap[params.row.status]);
      }
    },
    updateTime: {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      ellipsis: true,
      width: 170
    },
    updater: {
      title: "操作人",
      key: "updater",
      tooltip: true,
      ellipsis: true,
      width: 100
    },
    action: {
      title: "操作",
      key: "action",
      minWidth: 250,
      fixed: "right",
      slot: "action",
    }
  }
}

const formatData = {
  codeList: [],
  provinceCode: "",
  cityCode: "",
  areaCodeList: [],
  businessType: null,
  expandBizLine: null,
  carLevel: [],
  scopeType: null,
  fenceUuid: "",
  timeRangeDtoList: [
    {
      time: "",
      scope: null,
      enableRideTime: false,
      rideTime: null
    }
  ]
}
const ruleValidate = {
  codeList: [
    { required: true, type: "array", message: "请选择城市" }
  ],
  // areaCodeList: [
  //   { required: true, type: "array", message: "请选择区县", trigger: "blur" }
  // ],
  expandBizLine: [
    { required: true, message: "请选择业务线" }
  ],
  businessType: [
    { required: true, message: "请选择产品线" }
  ],
  scopeType: [
    { required: true, message: "请选择范围类型" }
  ],
  fenceUuid: [
    { required: true, message: "请选择电子围栏" }
  ]
}
export const dataObj = {
  businessTypeMap,
  carTypeMapAll,
  scopeTypeList,
  scopeTypeMap,
  inputList,
  ruleValidate,
  total: 0,
  current: 1,
  pageSize: 10,
  parColumns: [],
  isLoading: false,
  formatData,
  carLevelList: [],
}
