const operationModeList = [
  { label: "A", value: 1 },
  { label: "Up", value: 2 }
];
export const operationModeConvert = v => {
  const f = operationModeList.find(it => it.value - v === 0);
  return f ? f.label : "";
};


const protocolStatusList = [
  { label: "待运营商签约", value: 1 },
  { label: "运营商已签约", value: 2 },
  { label: "已签约", value: 3 },
  { label: "已作废", value: 4 }

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
    // options: {
    //   // 只能选择小于当前月
    //   disabledDate: date => {
    //     const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
    //     return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
    //   }
    // }
  },
  {
    name: "drop-input",
    title: "城市：",
    dropList: [],
    bind_key: "cityUuid",
    filterable: true,
    value: "",
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuid",
    filterable: true,
    value: "",
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    title: "运营模式：",
    titleWidth: 70,
    value: "",
    bind_key: "operationMode",
    dropList: operationModeList
  },
  {
    name: "drop-input",
    title: "签约状态：",
    titleWidth: 60,
    value: "",
    bind_key: "protocolStatus",
    dropList: protocolStatusList
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
      key: "operationMode",
      minWidth: 140,
      render(h, params) {
        return h('span', {}, operationModeConvert(params.row.operationMode));
      }
    },
    {
      title: "签约状态",
      key: "protocolStatus",
      minWidth: 150,
      render(h, params) {
        return h("span",{}, protocolStatusConvert(params.row.protocolStatus));
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
      width: 220,
      key: "operation",
      render(h, params) {
        let data = params.row;
        // 待运营商签约 查看协议和作废
        // 待T3签约  签章 查看协议和作废
        // 已签约/已作废 查看协议
        let isT3 = data.protocolStatus - 2 === 0
        let isLeague = data.protocolStatus - 1 === 0
        return h("div", [
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
                name: 'hasAuth',
                value: 'settle-management-sign'
              }],
              on: {
                click() {
                  _this.sign(data)
                }
              }
            },
            "签章"
          ): null,
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
                name: 'hasAuth',
                value: 'settle-management-detail'
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
                name: 'hasAuth',
                value: 'settle-management-invalid'
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
