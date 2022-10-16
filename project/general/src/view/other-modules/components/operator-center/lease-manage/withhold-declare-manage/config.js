export const searchParams = {
  searchRule: {
    driverPhone: [{ pattern: /^[0-9]{0,11}$/, message: "最多允许输入11位数字", trigger: "change" }]
  },
  params: {
    pageSize: 20
  },
  // billNoList: [],

  //   未提交、待审批、待代扣、审批驳回、代扣中、代扣结束、作废
  orderNoList: [],
  overdueTimeList: [
    {
      label: "10天以内",
      value: "1"
    },
    {
      label: "30天以内",
      value: "2"
    },
    {
      label: "60天以内",
      value: "3"
    },
    {
      label: "60天以上",
      value: "4"
    },
  ],
  vinList: [],
  plateNumList: [],
  isShowMore: false
}

export const rentStateList =  [
    {
      label: "未提交",
      value: 0
    },
    {
      label: "待代扣",
      value: 2
    },
    {
      label: "代扣中",
      value: 4
    },
    {
      label: "代扣结束",
      value: 5
    },
    {
      label: "作废",
      value: 6
    }
  ]
  
  export const rentStateMap = {
    0: "未提交",
    2: "待代扣",
    4: "代扣中",
    5: "代扣结束",
    6: "作废"
  }

export const exportParams = {
  exportParams: {},
  exportUrl: "/api/assets/v1/vehicle/exportGeneralExcel",
  exportModalTitle: "批量追缴信息导出",
  excelTitle: "批量追缴",
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
      title: "申报单编号",
      key: "declareNo",
      ellipsis: true,
      minWidth: 120,
      tooltip: true,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "资产公司",
      key: "authName",
      minWidth: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "标题",
      key: "declareTitle",
      minWidth: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
        title: "代扣月份",
        key: "withholdDate",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "需代扣金额",
        key: "withholdAmount",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
        render: (h, { row }) => {
          const text =  Number(row.withholdAmount) >= 0 ? row.withholdAmount.toFixed(2) : ""
          return h("span", {}, text)
  
        }
      },
    {
      title: "状态",
      key: "declareState",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const text =  Number(row.declareState) >= 0 ? rentStateMap[Number(row.declareState)] : ""
        return h("span", {}, text)

      }
    },
    {
      title: "提报人",
      key: "creatorName",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "提报人手机号",
      key: "creatorPhone",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "提报时间",
      key: "createTime",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "操作",
      key: "actions",
      minWidth: 190,
      fixed: "right",
      render: (h, {row}) => {
        return h("div", row.declareState !== 6? [h("Button", {
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
                that.getDetail(row)
              }
            }
          }, "查看"),]:[])
      }
    }
  ]
}

export const actionsBtns = (h, { row }, that) => {
  let btnsArr = []
  switch (row.declareState.toString()) {
    case "0":
      btnsArr = [actionListMap(h, row, that).view, actionListMap(h, row, that).edit, actionListMap(h, row, that).submit, actionListMap(h, row, that).delete]
      break;
    case "1":
      btnsArr = [actionListMap(h, row, that).view, actionListMap(h, row, that).cancel]
      break;
    case "2":
    case "4":
    case "5":
    case "6":
      btnsArr = [actionListMap(h, row, that).view]
      break;
    case "3":
      btnsArr = [actionListMap(h, row, that).view, actionListMap(h, row, that).cancel]
      break;
    default:
      break;
  }
  return btnsArr
}
export const actionListMap = (h, row, that) => {
  return {
    view: h("Button", {
      props: {
        type: "info",
        ghost: true,
        size: "small"
      },
      //   directives: [{
      //     name: "hasAuth",
      //     value: "withhold-declare-manage-view"
      //   }],
      style: {
        display: "inline-block",
        margin: "3px"
      },
      on: {
        click: () => {
          that.getDetail(row)
        }
      }
    }, "查看"),
    edit: h("Button", {
      props: {
        type: "info",
        ghost: true,
        size: "small"
      },
      //   directives: [{
      //     name: "hasAuth",
      //     value: "withhold-declare-manage-edit"
      //   }],
      style: {
        display: "inline-block",
        margin: "3px"
      },
      on: {
        click: () => {
          that.getDetail(row)
        }
      }
    }, "编辑"),
    submit: h("Button", {
      props: {
        type: "info",
        ghost: true,
        size: "small"
      },
      //   directives: [{
      //     name: "hasAuth",
      //     value: "withhold-declare-manage-edit"
      //   }],
      style: {
        display: "inline-block",
        margin: "3px"
      },
      on: {
        click: () => {
          let id = row.billId
          that.getDetail(id)
        }
      }
    }, "提交"),
    cancel: h("Button", {
      props: {
        type: "info",
        ghost: true,
        size: "small"
      },
      //   directives: [{
      //     name: "hasAuth",
      //     value: "withhold-declare-manage-edit"
      //   }],
      style: {
        display: "inline-block",
        margin: "3px"
      },
      on: {
        click: () => {
          let id = row.billId
          that.getDetail(id)
        }
      }
    }, "撤回"),
    delete: h("Button", {
      props: {
        type: "info",
        ghost: true,
        size: "small"
      },
      //   directives: [{
      //     name: "hasAuth",
      //     value: "withhold-declare-manage-edit"
      //   }],
      style: {
        display: "inline-block",
        margin: "3px"
      },
      on: {
        click: () => {
          let id = row.billId
          that.getDetail(id)
        }
      }
    }, "作废"),
  }
}
export const inputList =  [
  {
    name: "drop-input", // 下拉选择框
    bind_key: "cityCode",
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
    name: "drop-input", // 下拉选择框
    bind_key: "authCo",
    placeholder: "请选择",
    value: "",
    title: "资产公司：",
    titleWidth: 75,
    inputWidth: 200,
    dropList: [],
    key: "",
    isHide: false,
    filterable: true
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "declareNo",
    placeholder: "请输入",
    title: "申报单编号：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "month-input", // 文本输入框名
    bind_key: "withholdDate", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "代扣月份：", // 展示的字段名
    titleWidth: 75, // 展示的字段名的宽度
    inputWidth: 200,
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "drop-input", // 下拉选择框
    bind_key: "declareState",
    placeholder: "请选择",
    value: "",
    title: "状态：",
    titleWidth: 75,
    inputWidth: 200,
    dropList: rentStateList,
    key: "",
    isHide: false,
    filterable: true
  },
]
