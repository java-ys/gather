export const categoryMap = [
  {
    label: "风控工单",
    value: "FK"
  },
  {
    label: "客诉工单",
    value: "KS"
  },
  {
    label: "大屏工单",
    value: "DP"
  },
  {
    label: "高德工单",
    value: "SF"
  },
  // 新增枚举
  {
    label: "核检工单",
    value: "HJ"
  }
]
// 司机类型
export const driverTypeMap = {
  "10": "自营司机",
  "20": "自营-主司机",
  "30": "自营-副司机",
  "40": "自营-顶班司机",
  "50": "UP司机",
  "60": "UP-主司机",
  "70": "UP-副司机",
  "80": "UP-顶班司机",
  "90": "UP-带车加盟"
}

export const paymentStatusOptions = [
  {
    label: "待扣款",
    value: "10"
  },
  {
    label: "待退款",
    value: "11"
  },
  {
    label: "扣款中",
    value: "20"
  },
  {
    label: "扣款完成",
    value: "30"
  },
  {
    label: "取消扣款",
    value: "40"
  },
]

// 司机状态
export const driverStatusOptions = [
  {
    label: "正常",
    value: "1"
  },
  {
    label: "短期封号",
    value: "2"
  },
  {
    label: "长期封号",
    value: "3"
  },
  {
    label: "未审核",
    value: "4"
  },
  {
    label: "待运营",
    value: "5"
  },
  {
    label: "离职",
    value: "6"
  },
  {
    label: "黑名单",
    value: "7"
  },
  {
    label: "强制下线",
    value: "8"
  },
  {
    label: "冻结 ",
    value: "9"
  },
  {
    label: "未知",
    value: "99"
  }
]

export const inputList = [
  {
    name: "drop-input",
    title: "城市",
    bind_key: "cityCode",
    dropList: [],
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "drop-input",
    title: "运营商",
    bind_key: "agentId",
    dropList: [],
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "text-input",
    title: "司机ID",
    bind_key: "driverNo",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    title: "司机姓名",
    bind_key: "driverName",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    title: "司机手机号",
    bind_key: "driverPhone",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "工单类型",
    bind_key: "woType", // 返回数据的key名
    placeholder: "请选择工单类型",
    dropList: categoryMap,
    titleWidth: 90,
    changeOnSelect: false,
    filterable: true
  },
  {
    name: "text-input",
    bind_key: "woCode",
    title: "工单编号",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "扣款状态",
    bind_key: "billStatus",
    dropList: paymentStatusOptions,
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "drop-input",
    title: "司机状态",
    bind_key: "driverStatus",
    dropList: driverStatusOptions,
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "date-time-input",
    title: "创建时间",
    bind_key: ["startTime", "endTime"],
    placeholder: "请选择创建时间",
    titleWidth: 90,
    inputWidth: 260,
    value: ""
  }
]

export const tableTitle = (that) => {
  return [
    {
      title: "司机ID",
      key: "driverNo",
      minWidth: 150
    },
    {
      title: "司机姓名",
      key: "driverName",
      minWidth: 100
    },
    {
      title: "手机号",
      key: "driverPhone",
      minWidth: 120
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 100
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 100
    },
    {
      title: "工单编号",
      key: "woCode",
      minWidth: 250
    },
    {
      title: "工单类型",
      key: "woType",
      minWidth: 100,
      render: (h, params) => {
        const { woType } = params.row
        let text = categoryMap.find(item => item.value === woType)
          ? categoryMap.find(item => item.value === woType).label
          : ""
        return h("span", text)
      }
    },
    {
      title: "违规扣款",
      key: "illegalAmount",
      minWidth: 150
    },
    {
      title: "流水扣款",
      key: "orderAmount",
      minWidth: 150
    },
    {
      title: "已扣款",
      key: "billAmount",
      minWidth: 150
    },
    {
      title: "剩余扣款金额",
      key: "remainAmount",
      minWidth: 150
    },
    {
      title: "扣款状态",
      key: "billStatus",
      minWidth: 100,
      render: (h, params) => {
        const { billStatus } = params.row
        let text = paymentStatusOptions.find(item => item.value === billStatus)
          ? paymentStatusOptions.find(item => item.value === billStatus).label
          : ""
        return h("span", text)
      }
    },
    {
      title: "司机状态",
      key: "driverStatus",
      minWidth: 100,
      render: (h, params) => {
        const { driverStatus } = params.row
        let text = driverStatusOptions.find(item => item.value === driverStatus)
          ? driverStatusOptions.find(item => item.value === driverStatus).label
          : ""
        return h("span", text)
      }
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 200
    },
    {
      title: "操作",
      key: "operate",
      minWidth: 100,
      fixed: "right",
      render: (h, params) => {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small"
              },
              style: {
                color: "#57a3f3"
              },
              on: {
                click: () => {
                  that.$refs.detail.openModal(params.row.driverId, params.row.billCode)
                }
              }
            },
            "查看明细"
          )
        ])
      }
    },
  ]
}
