const statusList = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];

export const equator = [
  { label: "<", value: "<" },
  { label: ">", value: ">" },
  { label: "=", value: "=" }
];

export const classifyList = [
  { label: "规模项", value: 1 },
  { label: "效率项", value: 2 },
  { label: "体验项", value: 3 },
  { label: "安全项", value: 4 },
  { label: "专项", value: 5 },
  { label: "扣减项", value: 6 },
  { label: "其他", value: 9 }
];

export const typeList = [
  { label: "自定义指标", value: 0 },
  // { label: "大数据指标", value: 1 }
];

export const trueOrFalse = [
  { label: "是", value: 0 },
  { label: "否", value: 1 }
]

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "name", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "指标名称："
  },
  {
    name: "drop-input",
    title: "状态",
    titleWidth: 50,
    value: "",
    bind_key: "status",
    dropList: statusList
  },
  {
    name: "drop-input",
    title: "所属分类",
    value: "",
    bind_key: "classify",
    dropList: classifyList
  },
  {
    name: "drop-input",
    title: "类型",
    titleWidth: 50,
    value: "",
    bind_key: "type",
    dropList: [
      {label: '自定义指标', value: 0},
      {label: '系统指标', value: 1},
    ]
  },
  {
    name: "drop-input",
    title: "是否主策略",
    titleWidth: 80,
    value: "",
    bind_key: "strategyType",
    dropList: trueOrFalse
  },
];

export const tableColumns = _this => {
  return [
    {
      title: "所属分类",
      key: "classifyEx",
      tooltip: true,
      minWidth: 120
      // render(h, params) {
      //   let { classify} = params.row
      //   let f = classifyList.find(it => it.value - classify === 0)
      //   return h('span', {}, f ? f.label: "");
      // }
    },
    {
      title: "名称",
      key: "name",
      minWidth: 120
    },
    {
      title: "说明",
      key: "remark",
      minWidth: 160
    },
    {
      title: "类型",
      key: "typeEx",
      minWidth: 120
    },
    {
      title: "是否父指标",
      key: "parentFlagEx",
      minWidth: 100
    },
    {
      title: "是否主策略",
      key: "strategyTypeEx",
      minWidth: 100
    },
    {
      title: "状态",
      key: "statusEx",
      minWidth: 90
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
                value: 'check-management-target-open'
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
                  value: 'check-management-target-on'
                }
              ],
              on: {
                click() {
                  _this.block(data);
                }
              }
            },
            data.status - 1 === 0 ? "禁用" : "启用"
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
                value: 'check-management-target-edit'
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
                value: 'check-management-target-delete'
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

