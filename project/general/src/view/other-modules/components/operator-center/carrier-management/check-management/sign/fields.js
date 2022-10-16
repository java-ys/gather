import { tacticsEnum, productLineEnum } from "@/config";
import { listToMap } from "@/libs/util.js";
const allType = [{ label: "不限", value: -1 }]

const operationModeList = [
  { label: "A", value: "A" },
  { label: "Up", value: "UP" },
  { label: "带车加盟", value: "99" },
  { label: "巡网出租车", value: "100" },
];
export const operationModeConvert = v => {
  const f = operationModeList.find(it => `${it.value}` === `${v}`);
  return f ? f.label : "";
};

const protocolStatusList = [
  { label: "待运营商签约", value: 1 },
  { label: "运营商已签约", value: 2 },
  { label: "已签约", value: 3 },
  { label: "已作废", value: 4 },
  { label: "待审核协议", value: 5 }
]

export const protocolStatusConvert = (v) => {
  const f = protocolStatusList.find(it => it.value - v === 0);
  return f ? f.label : "";
}

export const inputList = [
  {
    name: "month-input",
    bind_key: "protocolDate",
    placeholder: "请选择月份",
    value: "",
    title: "月份：",
    editable: false
  },
  // {
  //   name: "cascader-input",
  //   bind_key: ["provinceCode", "cityUuid"],
  //   placeholder: "请选择城市",
  //   value: [],
  //   cascaderList: [],
  //   title: "城市：",
  //   filterable: true,
  //   changeOnSelect: false,
  //   titleWidth: 60,
  //   inputWidth: 165
  // },
  {
    name: "drop-input",
    title: "城市：",
    dropList: [],
    bind_key: "cityCode",
    value: "",
    filterable: true,
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuid",
    filterable: true,
    value: "",
  },
  {
    name: "drop-input",
    title: "运营模式：",
    filterable: true,
    value: "",
    multiple: true,
    bind_key: "operateTypeList",
    dropList: operationModeList
  },
  {
    name: "drop-input",
    title: "产品线：",
    titleWidth: 70,
    filterable: true,
    value: "",
    bind_key: "businessType",
    dropList: productLineEnum
  },
  {
    name: "drop-input",
    title: "签约状态：",
    filterable: true,
    value: "",
    bind_key: "protocolStatus",
    dropList: protocolStatusList
  },
  {
    name: "drop-input",
    title: "策略类型：",
    filterable: true,
    value: "",
    bind_key: "strategyType",
    dropList: tacticsEnum
  },
  {
    name: "drop-input",
    title: "产品线：",
    filterable: true,
    multiple: true,
    value: "",
    bind_key: "businessTypeList",
    dropList: productLineEnum
  }
];

export const tableColumns = _this => {
  return [
    // {
    //   title: '序号',
    //   key: 'index',
    //   width: 70,
    //   render(h, params) {
    //     return h('span', {}, (_this.tableConfig.current - 1) * _this.tableConfig.pageSize + params.index + 1);
    //   }
    // },
    // {
    //   type: "selection",
    //   align: "center",
    //   width: 50
    // },
    {
      type: "selection",
      align: "center",
      width: 80
    },
    {
      title: "月份",
      key: "protocolDate",
      minWidth: 120
    },
    {
      title: "协议编号",
      key: "protocolNo",
      minWidth: 220
    },
    {
      title: "协议名称",
      key: "protocolName",
      minWidth: 120
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 120
    },
    {
      title: "运营模式",
      key: "operateTypeDesc",
      minWidth: 140,
      // render(h, params) {
      //   return h('span', {}, operationModeConvert(params.row.operateType));
      // }
    },
    {
      title: "策略类型",
      key: "strategyType",
      minWidth: 150,
      render(h, { row }) {
        const tacMap = listToMap(tacticsEnum)
        return h("span", {}, tacMap[row.strategyType])
      },
    },
    {
      title: "产品线",
      key: "businessType",
      minWidth: 150,
      render(h, { row }) {
        const plmap = listToMap([...productLineEnum, ...allType])
        const pl = row.businessType.split(",").map(m => plmap[m])
        return h("span", {}, pl.join(","))
      },
    },
    {
      title: "签约状态",
      key: "protocolStatus",
      minWidth: 150,
      render(h, params) {
        return h("span", {}, protocolStatusConvert(params.row.protocolStatus));
      }
    },
    {
      title: "运营商签约时间",
      key: "agentSignTime",
      minWidth: 180
    },
    {
      title: "T3签约时间",
      key: "t3SignTime",
      minWidth: 180
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 180
    },
    {
      title: "操作人",
      key: "updater",
      minWidth: 120
    },
    {
      title: "操作时间",
      key: "updateTime",
      minWidth: 180
    },
    {
      title: "操作",
      fixed: "right",
      width: 300,
      key: "operation",
      render(h, params) {
        let data = params.row;
        // 待运营商签约 查看协议和作废
        // 待T3签约  签章 查看协议和作废
        // 已签约/已作废 查看协议
        let isReview = data.protocolStatus - 5 === 0
        let isT3 = data.protocolStatus - 2 === 0
        let isLeague = data.protocolStatus - 1 === 0
        return h("div", [
          isReview ? h(
            "Button",
            {
              props: {
                type: "info",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "check-management-approve"
              }],
              on: {
                click() {
                  _this.review(data);
                }
              }
            },
            "审核协议"
          ) : null,
          isT3 ? h(
            "Button",
            {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "check-management-sign"
              }],
              on: {
                click() {
                  _this.sign(data)
                }
              }
            },
            "签章"
          ) : null,
          h(
            "Button",
            {
              props: {
                type: "info",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "check-management-detail"
              }],
              on: {
                click() {
                  _this.detail(data);
                }
              }
            },
            "查看协议"
          ),
          isT3 || isLeague ? h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "check-management-invalid"
              }],
              on: {
                click() {
                  _this.invalid(data);
                }
              }
            },
            "作废"
          ) : null,
        ]);
      },
      minWidth: 150
    }
  ];
};
