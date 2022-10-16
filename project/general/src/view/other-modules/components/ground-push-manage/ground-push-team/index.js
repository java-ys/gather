import { mapToList, checkHasBtn } from "@/libs/util"

export const statusData = {
  1: "正常",
  2: "未生效",
  3: "失效",
  4: "停用"
}

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: "手机号码",
        key: "num",
        tooltip: true,
        minWidth: 150,
        fixed: "left",
        render: (h, params) => {
          return h(
            "div",
            that.pageSize * (that.current - 1) + params.index + 1
          )
        }
      },
      {
        title: "姓名",
        key: "userName",
        tooltip: true,
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "状态",
        key: "status",
        tooltip: true,
        minWidth: 80,
        render: (h, params) => {
          let statusTitle = statusData[params.row.configStatus] || "暂无"
          return h("div", statusTitle)
        }
      },
      {
        title: "创建时间",
        key: "createTime",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 300,
        render: (h, params) => {
          const { row } = params
          return h("div", [
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                style: {
                  // display: !checkHasBtn("elecfence_control-edit") ? "none" : "inline-block"
                },
                // directives: [
                //   {
                //     name: "hasAuth",
                //     value: "elecfence_control-edit"
                //   }
                // ],
                on: {
                  click: () => {

                  }
                }
              },
              "置为失效"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "info",
                  ghost: true,
                  size: "small"
                },
                style: {
                  // display: !checkHasBtn("elecfence_control-detail") ? "none" : "inline-block"
                },
                // directives: [
                //   {
                //     name: "hasAuth",
                //     value: "elecfence_control-detail"
                //   }
                // ],
                on: {
                  click: () => {

                  }
                }
              },
              "查看数据"
            ),
            // h(
            //     "Button",
            //     {
            //       class: {
            //         tableBtn: true,
            //       },
            //       props: {
            //         type: "success",
            //         ghost: true,
            //         size: "small"
            //       },
            //       style: {
            //         // display: !checkHasBtn("elecfence_control-active") ? "none" : "inline-block"
            //       },
            //       // directives: [{
            //       //   name: 'hasAuth',
            //       //   value: 'elecfence_control-active'
            //       // }],
            //       on: {
            //         click: () => {
            //
            //         }
            //       }
            //     },
            //     "导出地推码"
            //   )
          ])
        }
      }
    ]
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "userName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "手机号：", // 展示的字段名
    // titleWidth: 40
  },
  {
    name: "text-input",
    bind_key: "mobile",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "姓名：", // 展示的字段名
    // titleWidth: 40
  },
  {
    name: "drop-input",
    bind_key: "configStatus",
    placeholder: "请选择产品线",
    value: "",
    dropList: [
      {
        value: 0,
        label: '待生效'
      },
      {
        value: 1,
        label: '已生效'
      },
      {
        value: 2,
        label: '已失效'
      },
    ],
    title: "状态："
  },
]
