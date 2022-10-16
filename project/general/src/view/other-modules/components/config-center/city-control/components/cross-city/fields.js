import { carTypeMapAll, getCarLevelList } from "_g/config/status-map";
export const consumerTypeList = [
  {
    label: "乘客",
    value: 1,
  },
  {
    label: "司机",
    value: 2,
  },
];
// 筛选区
export const carLevelMap = {
  2: getCarLevelList(2),
  4: getCarLevelList(4),
};

export const capacityMap = new Array(101).fill(0).map((m, i) => i);
// 列表数据
export const parColumns = (that) => {
  return [
    {
      type: "index",
      title: "序号",
      width: "80",
    },
    // 先注释，暂不上
    // {
    //   title: "行政区域",
    //   minWidth: 100,
    //   key: "areaName",
    // },
    // {
    //   title: "行政区类型",
    //   minWidth: 100,
    //   key: "areaType",
    //   render: (h, { row }) => {
    //     let text = row.areaType === 2 ?"区县级":"市级"
    //     return h("div", text);
    //   },
    // },
    {
      title: "出发城市",
      minWidth: 160,
      key: "cityName",
      render: (h, params) => {
        return h("div", params.row.provinceName + " / " + params.row.cityName);
      },
    },
    {
      title: "目的城市",
      minWidth: 160,
      key: "destCityName",
      render: (h, params) => {
        return h("div", params.row.destProvinceName + " / " + params.row.destCityName);
      },
    },
    {
      title: "策略对象",
      minWidth: 100,
      key: "consumerType",
      render: (h, params) => {
        return h("div", ["", "乘客", "司机"][params.row.consumerType]);
      },
    },
    {
      title: "业务线",
      minWidth: 100,
      key: "expandBizLine",
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        const { businessKeyValue } = that.businessGradeName
        return h(
          "div",
          businessKeyValue[expandBizLine]
        );
      },
    },
    {
      title: "产品线",
      minWidth: 100,
      key: "bizType",
      render: (h, params) => {
        const { row: { bizType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("div", productKeyValue[bizType] || "")
      },
    },
    {
      title: "车型等级",
      minWidth: 100,
      key: "carLevel",
      render: (h, params) => {
        const { row: { bizType, carLevel }} = params
        const { productCarKeyValue } = that.businessGradeName
        return h("div", productCarKeyValue[`${bizType}#${carLevel}`])
      },
    },
    {
      title: "操作人",
      minWidth: 100,
      key: "updater",
    },
    {
      title: "操作时间",
      minWidth: 200,
      key: "updateTime",
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      minWidth: 200,
      slot: "action",
    },
  ] };

export const ruleValidate = {
  destCityArray: [
    {
      required: true,
      type: "array",
      message: "请选择目的城市",
    },
  ],
  consumerType: [
    {
      required: true,
      type: "number",
      message: "请选择策略对象",
    },
  ],
  // expandBizLine: [
  //   {
  //     required: true,
  //     message: "请选择业务线",
  //   },
  // ],
  bizType: [
    {
      required: true,
      message: "请选择产品线",
    },
  ],
  carLevel: [
    {
      required: true,
      message: "请选择车型等级",
    },
  ],
  // 先注释，暂不上
  // areaType: [
  //   {
  //     required: true,
  //     message: "请选择行政区类型",
  //   },
  // ],
  // areaCode: [
  //   {
  //     required: true,
  //     message: "请选择行政区域",
  //   },
  // ],
};

export const crossCityFareRuleValidate = {
  startCapacity: [
    {
      required: true,
      message: "请添加分段起始",
    },
  ],
  endCapacity: [
    {
      required: true,
      message: "请添加分段结束",
    },
  ],
  unitPrice: [
    {
      required: true,
      message: "请添加费用",
    },
  ],
}

