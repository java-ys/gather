import { mapToList, checkHasBtn } from "@/libs/util"

export const statusData = {
  0: "未开始",
  1: "启用中",
  2: "已作废",
  3: "已结束",
}

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      // {
      //   title: "序号",
      //   key: "num",
      //   tooltip: true,
      //   minWidth: 150,
      //   fixed: "left",
      //   render: (h, params) => {
      //     return h(
      //       "div",
      //       that.pageSize * (that.current - 1) + params.index + 1
      //     )
      //   }
      // },
      {
        title: "地推单编号",
        key: "dtNo",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "地推名称",
        key: "dtName",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "地推周期",
        key: "startDate",
        minWidth: 200,
        tooltip: true,
        render: (h, params) => {
          const { row } = params
          return <div>{row.startDate} - {row.endDate}</div>
        }
      },
      {
        title: "供应商",
        key: "supplierName",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "城市",
        key: "cityName",
        tooltip: true,
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "状态",
        key: "dtStatus",
        tooltip: true,
        minWidth: 80,
        render: (h, params) => {
          let statusTitle = statusData[params.row.dtStatus] || "暂无"
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
        title: "创建人",
        key: "creator",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "最后编辑人",
        key: "updater",
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
                directives: [
                  {
                    name: "hasAuth",
                    value: "ground-push-order-detail"
                  }
                ],
                on: {
                  click: () => {
                    that.mode = 'detail'
                    that.editData(row.id)
                  }
                }
              },
              "详情"
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
                  display: row.configStatus === 0 || row.configStatus === 1 ? "inline-block" : "none"
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "ground-push-order-edit"
                  }
                ],
                on: {
                  click: () => {
                    that.mode = 'edit'
                    that.editData(row.id)
                  }
                }
              },
              "编辑"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "error",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: row.configStatus === 0 || row.configStatus === 1 ? "inline-block" : "none"
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "ground-push-order-stop"
                  }
                ],
                on: {
                  click: () => {
                    that.mode = 'edit'
                    that.stop(row.id)
                  }
                }
              },
              "作废"
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
                  // display: true ? "none" : "inline-block"
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "ground-push-data"
                  }
                ],
                on: {
                  click: () => {
                    that.viewData(row.dtNo)
                  }
                }
              },
              "查看数据"
            ),
          ])
        }
      }
    ]
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "supplierName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "供应商名称：", // 展示的字段名
    titleWidth: 80,
  },
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "城市：",
    filterable: true,
    changeOnSelect: false,
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    bind_key: "dtStatus",
    placeholder: "请选择",
    value: "",
    titleWidth: 80,
    dropList: Object.keys(statusData).map(key => ({ value: key, label: statusData[key] })),
    title: "地推单状态："
  },
  {
    name: "text-input",
    bind_key: "dtName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "地推单名称：", // 展示的字段名
    titleWidth: 80,
  },
  {
    name: "text-input",
    bind_key: "creator",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "创建人：", // 展示的字段名
    titleWidth: 80,
  },
  {
    name: "text-input",
    bind_key: "updater",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "最后编辑人：", // 展示的字段名
    titleWidth: 80,
  },
]
