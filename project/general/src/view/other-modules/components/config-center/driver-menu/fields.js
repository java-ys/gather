export const listColumns = {
  columns(_this) {
    return [{
    //   title: " ",
    //   width: 80,
    //
    //   // render(h, params) {
    //   //   return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
    //   // }
    // }, {
      title: "菜单名称",
      key: "menuName",
      tooltip: true,
      width: 200
    }, {
      title: "展示顺序",
      key: "displayOrder",
      tooltip: true
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      render: (h, params) => {
        const paramData = params.row
        return h("div", [
          h(
            "Button", {
              class: {
                tableBtn: true
              },
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "driver-menu-edit"
              }],
              on: {
                click: () => {
                  _this.goEdit(paramData)
                }
              }
            },
            "编辑"
          ),
          h(
            "Button", {
              class: {
                tableBtn: true
              },
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "driver-menu-delete"
              }],
              on: {
                click: () => {
                  _this.deleteMenu(paramData)
                }
              }
            },
            "删除"
          )
        ])
      }
    }
    ]
  }
}
