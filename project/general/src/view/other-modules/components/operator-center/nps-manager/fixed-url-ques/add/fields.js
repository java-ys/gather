
// 答题详细统计数据
const dynamicMap = {
  0: "否",
  1: "是"
}
export const totalColumns = {
  columnsTotal(_this) {
    return [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "用户群名称",
        key: "crowdName",
        align: "center",
      },
      {
        title: "用户群编号",
        key: "crowdCode",
        align: "center",
      },
      {
        title: "是否动态更新",
        width: 110,
        key: "isDynamic",
        align: "center",
        render: (h, params) => {
          return h("div", dynamicMap[params.row.isDynamic])
        }
      },
      {
        title: "用户群人数",
        key: "userNum",
        width: 110,
        align: "center",
      },
      {
        title: "创建人",
        key: "updateBy",
        width: 80,
        align: "center",
      },
      {
        title: "创建时间",
        key: "createTime",
        align: "center",
      },
    ];
  },
  showColumns(_this) {
    return [
      {
        title: "用户群名称",
        key: "crowdName",
        align: "center",
      },
      {
        title: "用户群编号",
        key: "crowdCode",
        align: "center",
      },
      {
        title: "是否动态更新",
        width: 110,
        key: "isDynamic",
        align: "center",
        render: (h, params) => {
          return h("div", dynamicMap[params.row.isDynamic])
        }
      },
      {
        title: "用户群人数",
        key: "userNum",
        width: 110,
        align: "center",
      },
      {
        title: "操作",
        width: 80,
        fixed: "right",
        render(h, params) {
          return h("div", [h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              on: {
                click() {
                  _this.deleteUSSelected(params.row);
                }
              }
            },
            "删除"
          )
          ]);
        }
      }
    ];
  },
  detailsColumns(_this) {
    return [
      {
        title: "用户群名称",
        key: "crowdName",
        align: "center",
      },
      {
        title: "用户群编号",
        key: "crowdCode",
        align: "center",
      },
      {
        title: "是否动态更新",
        width: 110,
        key: "isDynamic",
        align: "center",
        render: (h, params) => {
          return h("div", dynamicMap[params.row.isDynamic])
        }
      },
      {
        title: "用户群人数",
        key: "userNum",
        width: 110,
        align: "center",
      }
    ];
  }
}
