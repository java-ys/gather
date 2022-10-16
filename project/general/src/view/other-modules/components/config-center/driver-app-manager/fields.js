export const statusData = {
  0: "开启",
  1: "关闭",
  2: "仅白名单"
}

export const businessTypeData = {
  4: "快享",
  2: "专享",
  6: "企业用车",
  1: "出租车"
}
export const driverTypeList = [
  // { value: 10, name: "自营司机" },
  // { value: 20, name: "自营-主司机" },
  // { value: 30, name: "自营-副司机" },
  // { value: 40, name: "自营-顶班司机" },
  // { value: 50, name: "UP司机" },
  // { value: 60, name: "UP-主司机" },
  // { value: 70, name: "UP-副司机" },
  // { value: 80, name: "UP-顶班司机" }
  { name: "自营司机", value: 1 },
  { name: "UP司机", value: 2 },
  { name: "P司机", value: 3 }
];
export const driverRoleList = [
  // { value: 10, name: "自营司机" },
  // { value: 20, name: "自营-主司机" },
  // { value: 30, name: "自营-副司机" },
  // { value: 40, name: "自营-顶班司机" },
  // { value: 50, name: "UP司机" },
  // { value: 60, name: "UP-主司机" },
  // { value: 70, name: "UP-副司机" },
  // { value: 80, name: "UP-顶班司机" }
  { name: "普通司机", value: 0 },
  { name: "主司机", value: 1 },
  { name: "副司机", value: 2 },
  { name: "顶班司机", value: 3 }
];
export const listColumns = {
  columns(_this) {
    return [{
      //   title: " ",
      //   width: 80,
      //   render(h, params) {
      //     return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      //   }
      // }, {
      title: "应用名称",
      key: "appName",
      tooltip: true,
      width: 200
    }, {
      title: "菜单名称",
      key: "menuName",
      tooltip: true,
      width: 200
    }, {
      title: "城市",
      key: "cityList",
      tooltip: true,
      width: 200,
      render: (h, params) => {
        if (!params.row.cityList || !params.row.cityList.length) {
          return "";
        }
        return h(
          "div",
          params.row.cityList.map(item => item.cityName).join(",")
        )
      }
    },
    {
      title: "运营商",
      key: "agentName",
      width: 210,
      tooltip: true,
      render: (h, params) => {
        if (!params.row.agentList || !params.row.agentList.length) {
          return "";
        }
        return h(
          "div",
          params.row.agentList.map(item => item.agentName).join(",")
        )
      }
    },
    {
      title: "司机类型",
      key: "driverTypeName",
      width: 210,
      tooltip: true,
      render: (h, params) => {
        if (!params.row.driverTypeList || !params.row.driverTypeList.length) {
          return "";
        }
        return h(
          "div",
          params.row.driverTypeList.map(item => (driverTypeList.find(s => String(s.value) === String(item)) || {}).name).join(",")
        )
      }
    },
    {
      title: "展示顺序",
      key: "displayOrder",
      width: 100
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 210,
      render: (h, params) => {
        const paramData = params.row;
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
                value: "driver-app-manager-edit"
              }],
              on: {
                click: () => {
                  _this.goToEdit(paramData)
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
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "driver-app-manager-delete"
              }],
              on: {
                click: () => {
                  _this.deleteAppMenu(paramData)
                }
              }
            },
            "删除"
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
                value: "driver-app-manager-view"
              }],
              on: {
                click: () => {
                  _this.goToEdit(paramData, true)
                }
              }
            },
            "详情"
          )
        ])
      }
    }
    ]
  }
}

