export const inputList = [
  {
    name: "text-input",
    bind_key: "driverNo",
    placeholder: "请输入",
    value: "",
    title: "司机Code",
    titleWidth: 100
  },
  {
    name: "text-input",
    bind_key: "driverName",
    placeholder: "请输入",
    value: "",
    title: "姓名",
    titleWidth: 100
  },
  {
    name: "text-input",
    bind_key: "mobile",
    placeholder: "请输入",
    value: "",
    title: "手机号",
    titleWidth: 100
  },
  {
    name: "text-input",
    bind_key: "agentName",
    placeholder: "请输入",
    value: "",
    title: "所属运营商",
    titleWidth: 100
  }
];

export const tableTitle = that => {
  return [
    {
      type: 'selection',
      width: 60,
      align: 'center',
      fixed: 'left',
    },   
    {
      title: "司机Code",
      key: "driverNo",
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "姓名",
      key: "driverName",
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "手机号",
      key: "mobile",
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "所属城市",
      key: "city",
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "所属运营商",
      key: "agentName",
      ellipsis: true,
      minWidth: 100
    },    
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (h, params) => {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              style: {
                "margin-right": "10px"
              },
              attrs: {
                ghost: "ghost"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "whitelist-management-removal"
                }
              ],
              on: {
                click: () => {
                  that.Removal([params.row.id]);
                }
              }
            },
            "移出白名单"
          )
        ]);
      }
    }    
  ]
}