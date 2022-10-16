
export const exportParams = {
  exportParams: {},
  exportUrl: "/api/assets/v1/vehicle/exportGeneralExcel",
  exportModalTitle: "批量收款信息导出",
  excelTitle: "批量收款",
  exportType: "zip",
  importFileData: {
    taxType: 5
  },
  importZipName: "photozip",
}

export const tableParams = {
  parColumns: [],
  tableData: [],
  current: 1,
  pageSize: 20,
  isLoading: true,
  total: 10,
}

export const parColumns = (that) => {
  return [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "城市",
      key: "cityName",
      ellipsis: true,
      minWidth: 90,
      tooltip: true,
    },
    {
      title: "车牌号",
      key: "plateNum",
      minWidth: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "备注",
      key: "remark",
      minWidth: 160,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "操作时间",
      key: "createTime",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        let text = row.createTime ? that.$moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") : ""
        return h("div", {}, text)
      }
    },
    {
      title: "操作人",
      key: "creatorName",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "操作",
      key: "actions",
      minWidth: 160,
      fixed: "right",
      render: (h, { row }) => {
        return h("div", [h("Button", {
          props: {
            type: "info",
            ghost: true,
            size: "small"
          },
          style: {
            display: "inline-block",
            margin: "3px"
          },
          on: {
            click: () => {
              that.deleteUnit(row)
            }
          }
        }, "删除")])
      }
    }
  ]
}


export const inputList =  [
  {
    name: "drop-input", // 下拉选择框
    bind_key: "cityUuid",
    placeholder: "请选择",
    value: "",
    title: "城市：",
    titleWidth: 75,
    inputWidth: 200,
    dropList: [],
    key: "",
    isHide: false,
    filterable: true
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "plateNum",
    placeholder: "请输入",
    title: "车牌号：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
]
