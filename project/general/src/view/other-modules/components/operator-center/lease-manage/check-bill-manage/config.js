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
    value: "0"
  },
  {
    label: "待审批",
    value: "1"
  },
  {
    label: "待代扣",
    value: "2"
  },
  {
    label: "审批驳回",
    value: "3"
  },
  {
    label: "代扣中",
    value: "4"
  },
  {
    label: "代扣结束",
    value: "5"
  },
  {
    label: "作废",
    value: "6"
  }
]

export const exportParams = {
  exportParams: {},
  exportUrl: "/api/assets/v1/vehicle/exportGeneralExcel",
  exportModalTitle: "批收款信息导出",
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
      title: "对款单编号",
      key: "statementsNo",
      ellipsis: true,
      minWidth: 160,
      tooltip: true,
    },
    {
      title: "关联订单",
      key: "orderNo",
      minWidth: 160,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "关联申报单",
      key: "declareNo",
      minWidth: 160,
      ellipsis: true,
      tooltip: true,
    },

    {
      title: "城市",
      key: "cityName",
      minWidth: 90,
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
      title: "司机ID",
      key: "driverNo",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "姓名",
      key: "driverName",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "身份证号",
      key: "driverIdCard",
      minWidth: 180,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "手机号",
      key: "driverPhone",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "车牌号",
      key: "plateNum",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "车架号",
      key: "vin",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "车型",
      key: "carBrand",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "起租日期",
      key: "deliveryDate",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const text = that.$moment(row.deliveryDate).format("YYYY-MM-DD")
        return h("span", {}, text)
      }
    },
    {
      title: "期数",
      key: "period",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "账期",
      key: "accountPeriod",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "代扣金额",
      key: "rent",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "月扣款总额",
      key: "totalReceived",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "代扣余量",
      key: "totalNotReceived",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "第一次扣款需求",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length) {
          text = rentRunningList[0].notReceived
        }
        return h("span", {}, text)
      }
    },
    {
      title: "代扣日期",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length) {
            rentRunningList[0].transDate ? text = that.$moment(rentRunningList[0].transDate).format("YYYY-MM-DD") : text = ""
        }
        return h("span", {}, text)
      }
    },
    {
      title: "实际扣款",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length) {
          text = rentRunningList[0].received
        }
        return h("span", {}, text)
      }
    },
    // {
    //   title: "余量",
    //   minWidth: 120,
    //   ellipsis: true,
    //   tooltip: true,
    //   render: (h, { row }) => {
    //     const { rentRunningList } = row
    //     let text = ""
    //     if (rentRunningList && rentRunningList.length) {
    //       text = rentRunningList[0].notReceived
    //     }
    //     return h("span", {}, text)
    //   }
    // },
    {
      title: "第二次扣款需求",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 2) {
          text = rentRunningList[1].notReceived
        }
        return h("span", {}, text)
      }
    },
    {
      title: "代扣日期",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 2) {
            rentRunningList[1].transDate ? text = that.$moment(rentRunningList[1].transDate).format("YYYY-MM-DD") : text = ""
        }
        return h("span", {}, text)
      }
    },
    {
      title: "实际扣款",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 2) {
          text = rentRunningList[1].received
        }
        return h("span", {}, text)
      }
    },
    // {
    //   title: "余量",
    //   key: "notReceived",
    //   minWidth: 120,
    //   ellipsis: true,
    //   tooltip: true,
    //   render: (h, { row }) => {
    //     const { rentRunningList } = row
    //     let text = ""
    //     if (rentRunningList && rentRunningList.length >= 2) {
    //       text = rentRunningList[1].notReceived
    //     }
    //     return h("span", {}, text)
    //   }
    // },
    {
      title: "第三次扣款需求",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 3) {
          text = rentRunningList[2].notReceived
        }
        return h("span", {}, text)
      }
    },
    {
      title: "代扣日期",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 2) {
            rentRunningList[2].transDate ? text = that.$moment(rentRunningList[2].transDate).format("YYYY-MM-DD") : text = ""
        }
        return h("span", {}, text)
      }
    },
    {
      title: "实际扣款",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 2) {
          text = rentRunningList[2].received
        }
        return h("span", {}, text)
      }
    },
    // {
    //   title: "余量",
    //   key: "notReceived",
    //   minWidth: 120,
    //   ellipsis: true,
    //   tooltip: true,
    //   render: (h, { row }) => {
    //     const { rentRunningList } = row
    //     let text = ""
    //     if (rentRunningList && rentRunningList.length >= 2) {
    //       text = rentRunningList[2].notReceived
    //     }
    //     return h("span", {}, text)
    //   }
    // },
    {
      title: "第四次扣款需求",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 4) {
          text = rentRunningList[3].notReceived
        }
        return h("span", {}, text)
      }
    },
    {
      title: "代扣日期",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 4) {
            rentRunningList[3].transDate ? text = that.$moment(rentRunningList[3].transDate).format("YYYY-MM-DD") : text = ""
        }
        return h("span", {}, text)
      }
    },
    {
      title: "实际扣款",
      minWidth: 120,
      ellipsis: true,
      tooltip: true,
      render: (h, { row }) => {
        const { rentRunningList } = row
        let text = ""
        if (rentRunningList && rentRunningList.length >= 4) {
          text = rentRunningList[3].received
        }
        return h("span", {}, text)
      }
    },
    // {
    //   title: "余量",
    //   key: "notReceived",
    //   minWidth: 120,
    //   ellipsis: true,
    //   tooltip: true,
    //   render: (h, { row }) => {
    //     const { rentRunningList } = row
    //     let text = ""
    //     if (rentRunningList && rentRunningList.length >= 4) {
    //       text = rentRunningList[3].notReceived
    //     }
    //     return h("span", {}, text)
    //   }
    // },
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
    bind_key: "statementsNo",
    placeholder: "请输入",
    title: "账单编号：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "orderNo",
    placeholder: "请输入",
    title: "关联订单：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "declareNo",
    placeholder: "请输入",
    title: "关联申报单：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "month-input", // 文本输入框名
    bind_key: "accountPeriod", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "账期：", // 展示的字段名
    titleWidth: 75, // 展示的字段名的宽度
    inputWidth: 200,
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "driverName",
    placeholder: "请输入",
    title: "司机姓名：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "driverPhone",
    placeholder: "请输入",
    title: "手机号：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "text-input", // 文本输入框
    bind_key: "vin",
    placeholder: "请输入",
    title: "车架号：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
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
  {
    name: "extendInput", // 文本输入框
    bind_key: "plateNum",
    placeholder: "请输入",
    title: "车牌号：",
    titleWidth: 120,
    inputWidth: 300,
    isHide: false,
  },
]
