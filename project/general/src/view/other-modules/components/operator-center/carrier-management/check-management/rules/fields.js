const statusList = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "title", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "模板名称："
  },
  {
    name: "drop-input",
    title: "状态",
    titleWidth: 50,
    value: "",
    bind_key: "status",
    dropList: statusList
  }
];

export const tableColumns = _this => {
  return [
    {
      title: "运营模式",
      key: "operationModeEx",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "模板名称",
      key: "title",
      minWidth: 120
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
      render(h, { row }) {
        let buttonText = row.status - 1 === 0 ? "禁用" : "启用";
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
                value: 'check-management-rules-open'
              }],
              on: {
                click() {
                  _this.open(row)
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
                  value: 'check-management-rules-on'
                }
              ],
              on: {
                click() {
                  _this.block(row);
                }
              }
            },
            buttonText
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
                value: 'check-management-rules-edit'
              }],
              on: {
                click() {
                  _this.editRow(row);
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
                value: 'check-management-rules-delete'
              }],
              on: {
                click() {
                  _this.delete(row);
                }
              }
            },
            "删除"
          )
        ]);
      },
      minWidth: 150
    }
  ];
};
