const statusList = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];

export const equator = [
  { label: "<", value: "<" },
  { label: ">", value: ">" },
  { label: "=", value: "=" }
];

export const equatorList = [
  { label: ">", value: ">" },
  { label: "<", value: "<" },
  { label: "=", value: "=" },
  { label: "≤", value: "<=" },
  { label: "≥", value: ">=" }
];

export const classifyList = [
  { label: "规模项", value: 1 },
  { label: "效率项", value: 2 },
  { label: "体验项", value: 3 },
  { label: "安全项", value: 4 },
  { label: "其他", value: 9 }
];

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "ruleName", // 返回数据的key名
    placeholder: "请输入",
    titleWidth: 100,
    value: "", // 用于数据绑定
    title: "分佣规则名称："
  },
  {
    name: "drop-input",
    title: "状态",
    titleWidth: 50,
    value: "",
    bind_key: "commissionStatus",
    dropList: statusList
  },
  {
    name: "month-input",
    bind_key: "checkTime",
    placeholder: "请选择月份",
    value: "",
    title: "考核时间：",
    editable: false
    // options: {
    //   // 只能选择小于当前月
    //   disabledDate: date => {
    //     const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
    //     return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
    //   }
    // }
  },
];

export const tableColumns = _this => {
  return [
    {
      title: '序号',
      width: 70,
      render(h, params) {
        return <span>{params.index + 1}</span>
      }
    },
    {
      title: "佣金标准名称",
      key: "ruleName",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "考核城市",
      key: "checkCityName",
      minWidth: 120
    },
    {
      title: "考核维度",
      key: "remark",
      minWidth: 120,
      render(h, params) {
        const { manageCommissionRule } = params.row
        const rule = JSON.parse(manageCommissionRule)
        return <span>{rule.radio === 0 ? '订单量' : rule.radio === 1 ? '订单流水' : ''}</span>
      }
    },
    {
      title: "生效时间",
      key: "startCheckTime",
      minWidth: 140,
      render(h, params) {
        const { startCheckTime, endCheckTime } = params.row
        return <span>{`${startCheckTime} - ${endCheckTime}`}</span>
      }
    },
    {
      title: "状态",
      key: "commissionStatus",
      minWidth: 90,
      render(h, params) {
        const { commissionStatus } = params.row
        return <span>{commissionStatus === 0 ? '禁用' : commissionStatus === 1 ? '启用' : ''}</span>
      }
    },
    {
      title: "操作时间",
      key: "updateTime",
      minWidth: 140
    },
    {
      title: "操作人",
      key: "updater",
      minWidth: 120
    },
    {
      title: "操作",
      fixed: "right",
      width: 260,
      key: "operation",
      minWidth: 150,
      render(h, params) {
        let data = params.row;
        return h("div", [
          h(
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
                value: 'commission-rules-get'
              }],
              on: {
                click() {
                  _this.showDetail(data);
                }
              }
            },
            "查看"
          ),
          h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [
                {
                  name: 'hasAuth',
                  value: 'commission-rules-status-update'
                }
              ],
              on: {
                click() {
                  _this.block(data);
                }
              }
            },
            data.commissionStatus - 1 === 0 ? "禁用" : "启用"
          ),
          h(
            "Button",
            {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: 'hasAuth',
                value: 'commission-rules-update'
              }],
              on: {
                click() {
                  _this.editRow(data);
                }
              }
            },
            "编辑"
          ),
          h(
            "Button",
            {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'commission-rules-delete'
              }],
              on: {
                click() {
                  _this.deleteRow(data);
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
  ];
};
