import {
  orderMainStatusMap,
  // typeTimeMap,
  // typeModuleMap,
  carTypeMap
} from "_g/config/status-map"

// 针对司机计费兼容
export const DriverPrefix = "driverItem-";

export const VirtualOrder = (i) => {
  let map = {
    0: "无",
    1: "无",
    2: "虚拟派单"
  }
  return map[i];
}

// 订单状态-一级
export const statusMap = {
  0: "约车中",
  1: "预约中",
  2: "行程中",
  3: "已完成",
  9: "行程取消"
}
// 取消类型
export const cancelTypeMap = {
  0: "乘客无责取消",
  1: "乘客政策免费取消",
  2: "乘客使用免费次数取消",
  3: "乘客付费取消",
  4: "超时自动取消",
  5: "5客服关闭订单"
}
// 取消方
export const cancelCreatorMap = {
  1: "乘客APP",
  2: "司机APP",
  3: "呼叫中心"
}

/* 下拉选项 */
export const optsData = {
  // 车型等级
  carTypeOpts: [
    { value: 1, label: "经济型" },
    { value: 2, label: "舒适型" },
    { value: 3, label: "行政型" },
    { value: 4, label: "商务型" },
    { value: 9, label: "豪华型" }
  ],
  // 订单状态-父级
  orderStatusOpts: [
    { value: 0, label: "约车中" },
    { value: 1, label: "预约中" },
    { value: 2, label: "行程中" },
    { value: 3, label: "已完成" },
    { value: 9, label: "行程取消" }
  ],
  // 订单状态-子级-行程中
  orderChildStatusOpts1: [
    { value: 2, label: "接乘中" },
    { value: 4, label: "载乘中" },
    { value: 3, label: "已抵达接乘地" },
    { value: 5, label: "已抵达目的地" }
  ],
  // 订单状态-子级-已完成
  orderChildStatusOpts2: [
    { value: 6, label: "待支付" },
    { value: 7, label: "待评价" },
    { value: 8, label: "行程结束" }
  ],
  // 取消类型
  cancelTypeOpts: [
    { value: 0, label: "乘客无责取消" },
    { value: 1, label: "乘客政策免费取消" },
    { value: 2, label: "乘客使用免费次数取消" },
    { value: 3, label: "乘客付费取消" },
    { value: 4, label: "超时自动取消" },
    { value: 5, label: "客服关闭订单" }
  ],
  // 取消方
  cancelCreatorTypeOpts: [
    { value: 1, label: "乘客APP" },
    { value: 2, label: "司机APP" },
    { value: 3, label: "呼叫中心" }
  ]
}

/* 订单列表 */
export const fields = {
  cityName: {
    title: "城市",
    dataIndex: "cityName",
    fixed: "left",
    width: 100
  },
  createTime: {
    title: "下单时间",
    dataIndex: "createTime",
    width: 180
  },
  routeNo: {
    title: "订单编号",
    dataIndex: "routeNo",
    width: 180
  },
  passengerId: {
    title: "乘客ID",
    dataIndex: "passengerId",
    width: 150
  },
  actualDriverId: {
    title: "司机ID",
    dataIndex: "actualDriverId",
    width: 150
  },
  plateNum: {
    title: "车牌号",
    dataIndex: "plateNum",
    width: 100
  },
  vehicleLevel: {
    title: "车型等级",
    dataIndex: "vehicleLevel",
    width: 100,
    customRender(text) {
      return carTypeMap[text]
    }
  },
  orderStatus: {
    title: "订单状态",
    dataIndex: "orderStatus",
    width: 100,
    customRender(text) {
      return statusMap[text]
    }
  },
  orderSubStatus: {
    title: "订单子状态",
    dataIndex: "orderSubStatus",
    width: 100,
    customRender(text) {
      return [0, 1, 9].includes(text) ? "-" : orderMainStatusMap[text]
    }
  },
  estimate: {
    title: "乘客文本评价",
    dataIndex: "estimate",
    width: 110,
    customRender(text) {
      return text === null ? "-" : text === 0 ? "无" : "有"
    }
  },
  driverStar: {
    title: "乘客对司机评价星级",
    dataIndex: "driverStar",
    width: 145,
    customRender(text) {
      return text ? `${text}星` : "-"
    }
  },
  cancelType: {
    title: "取消类型",
    dataIndex: "cancelType",
    width: 100,
    customRender(text) {
      return cancelTypeMap[text] || "-"
    }
  },
  originPointDto: {
    title: "上车点",
    dataIndex: "originPointDto",
    width: 150,
    customRender(value) {
      return value ? value.address : "-"
    }
  },
  destPointDto: {
    title: "下车点",
    dataIndex: "destPointDto",
    width: 150,
    customRender(value) {
      return value ? value.address : "-"
    }
  },
  totalFare: {
    title: "订单金额",
    dataIndex: "totalFare",
    width: 100
  },
  action: {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 100,
    scopedSlots: { customRender: "action" }
  }
}

/* 途径点修改记录 */
export const wayRecords = [
  {
    title: "设置顺序",
    key: "index",
    width: 120,
    render: (h, pamras) => {
      let text = ""
      if (!pamras.index) {
        text = "首次设置"
      } else {
        text = "第" + pamras.index + "次修改"
      }
      return h("span", text)
    }
  },
  {
    title: "途经点1",
    key: "passing0",
    minWidth: 120,
    tooltip: true
  },
  {
    title: "途经点2",
    key: "passing1",
    tooltip: true,
    minWidth: 120
  },
  {
    title: "途经点3",
    key: "passing2",
    tooltip: true,
    minWidth: 120
  },
  {
    title: "目的地",
    key: "destPoint",
    tooltip: true,
    minWidth: 120
  },
  {
    title: "修改时间",
    key: "updateTime",
    minWidth: 120,
    tooltip: true
  }
]

export const pageData = {
  isLoading: false,
  isShowAudit: false,
  showSizeChanger: true,
  pageData: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共${total}条`,
    total: 0,
    current: 1,
    pageSize: 10,
    pageSizeOptions: ["10", "20", "30", "40"]
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: Object.keys(fields),
  tableData: [],
  searchData: {}
}

/* 订单详情-左侧 */
export const orderLeftData = [
  {
    title: "下单",
    key: "placeOrder",
    value: [
      { name: "冒泡时间", key: "bubbleTime", span: "8", value: "" },
      {
        name: "冒泡预估金额",
        key: "bubbleEstimateAmount",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      // {
      //   name: "冒泡动态折扣",
      //   key: "bubbleDynamicDiscount",
      //   span: "8",
      //   value: "",
      //   acount: true
      // },
      {
        name: "冒泡预估时长",
        key: "bubbleEstimateDuration",
        span: "8",
        value: ""
      },
      // {
      //   name: "冒泡预估里程",
      //   key: "bubbleEstimateMileage",
      //   span: "16",
      //   value: "",
      //   unit: "公里",
      //   type: "number"
      // },
      { name: "下单时间", key: "routePlanCreateTime", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "order_msg_position",
        span: "8",
        value: "",
        link: "position"
      },
      {
        name: "预估金额",
        key: "planFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      // { name: "动态折扣", key: "rate", span: "8", value: "", acount: true },
      // {
      //   name: "预估里程",
      //   key: "planTrip",
      //   span: "8",
      //   value: "",
      //   unit: "公里",
      //   type: "number"
      // },
      { name: "预估时长", key: "planDuration", span: "8", value: "" },
      {
        name: "套餐管理版本",
        key: "wrapVersion",
        span: "8",
        value: "暂无",
        ruleVersion: true
      }
    ]
  },
  {
    title: "派单",
    key: "distributOrder",
    value: [
      { name: "派单时间", key: "receive_msg_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "receive_msg_position",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "接单",
    key: "receiveOrder",
    value: [
      { name: "接单时间", key: "reply_msg_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "reply_msg_position",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "开始服务",
    key: "beginService",
    value: [
      {
        name: "开始服务时间",
        key: "start_service_msg_time",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "start_service_msg_position",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "到达上车地点",
    key: "arriveBoard",
    value: [
      {
        name: "到达时间",
        key: "arrive_boarding_msg_time",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "arrive_boarding_msg_position",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "乘客上车",
    key: "passengerAboard",
    value: [
      { name: "乘客上车时间", key: "aboard_msg_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "aboard_msg_position",
        span: "16",
        value: "",
        link: "position"
      },
      {
        name: "接乘里程",
        key: "waitMile",
        span: "8",
        value: "",
        unit: "公里",
        type: "number"
      },
      { name: "接乘时长", key: "waitTime", span: "16", value: "" },
      { name: "是否已投保", key: "insure", span: "8", value: "" },
      { name: "保单编号", key: "policyNo", span: "8", value: "" }
    ]
  },
  // {
  //   title: "途径点1",
  //   key: "passingPoints",
  //   value: [
  //     {
  //       name: "到达时间",
  //       key: "passing_points_msg_time0",
  //       span: "8",
  //       value: ""
  //     },
  //     {
  //       name: "车辆位置",
  //       key: "passing_points_msg_position0",
  //       span: "16",
  //       value: "",
  //       link: "position"
  //     }
  //   ]
  // },
  // {
  //   title: "途径点2",
  //   key: "passingPoints",
  //   value: [
  //     {
  //       name: "到达时间",
  //       key: "passing_points_msg_time1",
  //       span: "8",
  //       value: ""
  //     },
  //     {
  //       name: "车辆位置",
  //       key: "passing_points_msg_position1",
  //       span: "16",
  //       value: "",
  //       link: "position"
  //     }
  //   ]
  // },
  // {
  //   title: "途径点3",
  //   key: "passingPoints",
  //   value: [
  //     {
  //       name: "到达时间",
  //       key: "passing_points_msg_time2",
  //       span: "8",
  //       value: ""
  //     },
  //     {
  //       name: "车辆位置",
  //       key: "passing_points_msg_position2",
  //       span: "16",
  //       value: "",
  //       link: "position"
  //     }
  //   ]
  // },
  {
    title: "到达目的地",
    key: "arriveDest",
    value: [
      { name: "到达时间", key: "arrive_dest_msg_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "arrive_dest_msg_position",
        span: "16",
        value: "",
        link: "position"
      },
      {
        name: "行驶里程",
        key: "drivenDistance",
        span: "8",
        value: "",
        unit: "公里",
        type: "number"
      },
      { name: "行驶时长", key: "drivenTime", span: "16", value: "" },
      {
        name: "行程里程",
        key: "tripDistance",
        span: "8",
        value: "",
        unit: "公里",
        type: "number"
      },
      { name: "行程时长", key: "tripDuration", span: "16", value: "" },
      {
        name: "远途里程",
        key: "haulBackTrip",
        span: "8",
        value: "",
        unit: "公里",
        type: "number"
      },
      {
        name: "回程里程",
        key: "backTrip",
        span: "16",
        value: "",
        unit: "公里",
        type: "number"
      }
      // {
      //   name: "夜间时段里程",
      //   key: "nightTrip",
      //   span: "16",
      //   value: "",
      //   unit: "公里",
      //   type: "number"
      // }
    ]
  },
  {
    title: "乘客计费",
    key: "cost",
    value: [
      {
        name: "套餐管理版本",
        key: "wrapVersion",
        span: "24",
        value: "暂无",
        ruleVersion: true
      },
      // { name: "动态折扣", key: "rate", span: "8", value: "", acount: true },
      // {
      //   name: "动态折扣版本",
      //   key: "discountVersion",
      //   span: "8",
      //   value: "暂无",
      //   discount: true
      // },
      {
        name: "起步费",
        key: "startFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "超时等待费",
        key: "waitFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "取消费用",
        key: "cancelFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "里程费",
        key: "overTripFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "时长费",
        key: "overTimeFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "远途里程费",
        key: "haulBackFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      // {
      //   name: "夜间费",
      //   key: "nightFare",
      //   span: "8",
      //   value: "",
      //   unit: "元",
      //   type: "number"
      // },
      {
        name: "回程费",
        key: "returnFee",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      // {
      //   name: "折扣费用",
      //   key: "discountFare",
      //   span: "8",
      //   value: "",
      //   unit: "元",
      //   type: "number"
      // },
      // {
      //   name: "预付款",
      //   key: "rechargeTotalAmountStr",
      //   span: "8",
      //   value: "",
      //   unit: "元",
      //   type: "number"
      // },
      {
        name: "预付款退款",
        key: "sumRechargeRefundedAmountStr",
        span: "16",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "高速费",
        key: "highwayFare",
        span: "8",
        value: "",
        adjust: "",
        unit: "元",
        type: "number"
      },
      {
        name: "路桥费",
        key: "roadBridgeFare",
        span: "8",
        value: "",
        adjust: "",
        unit: "元",
        type: "number"
      },
      {
        name: "停车费",
        key: "parkingFare",
        span: "8",
        value: "",
        adjust: "",
        unit: "元",
        type: "number"
      },
      {
        name: "其他",
        key: "otherFare",
        span: "8",
        value: "",
        adjust: "",
        unit: "元",
        type: "number"
      },
      // {
      //   name: "司机减免",
      //   key: "driverReliefFare",
      //   span: "16",
      //   value: "",
      //   unit: "元",
      //   type: "number"
      // },

      {
        name: "行程计费总额",
        key: "totalFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "退款金额",
        key: "sumRefundedAmountStr",
        span: "16",
        value: "暂无",
        unit: "元"
      },
      {
        name: "客服调价",
        key: "customerServiceAdjustment",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "订单计费金额",
        key: "orderFare",
        span: "16",
        value: "",
        adjust: "",
        unit: "元",
        type: "number"
      },
      {
        name: "优惠券抵扣金额",
        key: "couponAmount",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "优惠券编号",
        key: "xxxx",
        span: "16",
        value: "暂无",
        link: "coupon"
      },
      {
        name: "实付金额",
        key: "payAmount",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "待乘客支付金额",
        key: "waitPassengerPayAmount",
        span: "16",
        value: "",
        unit: "元",
        type: "number"
      }
    ]
  },
  {
    title: "司机计费",
    key: "driverCost",
    value: [
      {
        name: "套餐管理版本",
        key: DriverPrefix + "fareRuleVersion",
        span: "24",
        value: "暂无",
        fareRuleVersion: true
      },
      {
        name: "起步费",
        key: DriverPrefix + "startFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "超时等待费",
        key: DriverPrefix + "waitFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "取消费",
        key: DriverPrefix + "cancelFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "里程费",
        key: DriverPrefix + "overTripFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "时长费",
        key: DriverPrefix + "overTimeFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "远途里程费",
        key: DriverPrefix + "haulBackFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "回程费",
        key: DriverPrefix + "backTripFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "高速费",
        key: DriverPrefix + "highwayFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "路桥费",
        key: DriverPrefix + "roadBridgeFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "停车费",
        key: DriverPrefix + "parkingFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "其他",
        key: DriverPrefix + "otherFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "司机减免",
        key: DriverPrefix + "driverReliefFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "行程计费总额",
        key: DriverPrefix + "routeFlow",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "退款金额",
        key: DriverPrefix + "refundFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "客服调价",
        key: DriverPrefix + "customerServicePriceAdjustment",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "订单计费金额",
        key: DriverPrefix + "orderBillingFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      }
    ]
  },
  {
    title: "支付",
    key: "pay",
    value: [
      { name: "支付时间", key: "payTime", span: "8", value: "" },
      { name: "支付方式", key: "payType", span: "16", value: "" },
      { name: "已预付金额", key: "balanceCash", span: "8", value: "", unit: "元", type: "number" },
      // { name: "运营金", key: "balanceGift", span: '8', value: '', unit: '元', type: 'number' },
      { name: "第三方支付金额", key: "thirdAmount", span: "8", value: "", unit: "元", type: "number" },
      { name: "是否申请发票", key: "billedStatus", span: "8", value: "" },
      { name: "发票编号", key: "invoiceNo", span: "8", value: "", link: "invoice", uuid: "" },
      { name: "发票类型", key: "invoiceType", span: "8", value: "" }
    ]
  },
  {
    title: "首评",
    key: "firstEvaluate",
    value: [
      { name: "乘客评价", title: true, span: "8" },
      { name: "评价时间", key: "evaluateTime1", span: "24", value: "" },
      {
        name: "司机评星",
        key: "evaluateStars11",
        span: "8",
        value: 0,
        star: true
      },
      {
        name: "平台评星",
        key: "evaluateStars12",
        span: "8",
        value: 0,
        star: true
      },
      {
        name: "车辆评星",
        key: "evaluateStars13",
        span: "8",
        value: 0,
        star: true
      },
      { name: "标签", key: "evaluateTags11", span: "8", value: "", tag: true }, // 司机
      { name: "标签", key: "evaluateTags12", span: "8", value: "", tag: true }, // 平台
      { name: "标签", key: "evaluateTags13", span: "8", value: "", tag: true }, // 车辆
      {
        name: "评价内容",
        key: "evaluateContent11",
        span: "8",
        value: "",
        content: true
      }, // 司机
      {
        name: "评价内容",
        key: "evaluateContent12",
        span: "8",
        value: "",
        content: true
      }, // 平台
      {
        name: "评价内容",
        key: "evaluateContent13",
        span: "8",
        value: "",
        content: true
      }, // 车辆
      { name: "司机评价", title: true, span: "8" },
      { name: "评价时间", key: "evaluateTime14", span: "24", value: "" },
      { name: "评价属性", key: "star14", span: "24", value: "" },
      {
        name: "评价标签",
        key: "evaluateTags14",
        span: "8",
        value: "",
        tag: true
      } // 司机
    ]
  },
  {
    title: "追评",
    key: "secondEvaluate",
    value: [
      { name: "评价时间", key: "evaluateTime2", span: "24", value: "" },
      {
        name: "司机评星",
        key: "evaluateStars21",
        span: "8",
        value: 0,
        star: true
      },
      {
        name: "平台评星",
        key: "evaluateStars22",
        span: "8",
        value: 0,
        star: true
      },
      {
        name: "车辆评星",
        key: "evaluateStars23",
        span: "8",
        value: 0,
        star: true
      },
      { name: "标签", key: "evaluateTags21", span: "8", value: "", tag: true }, // 司机
      { name: "标签", key: "evaluateTags22", span: "8", value: "", tag: true }, // 平台
      { name: "标签", key: "evaluateTags23", span: "8", value: "", tag: true }, // 车辆
      {
        name: "评价内容",
        key: "evaluateContent21",
        span: "8",
        value: "",
        content: true
      }, // 司机
      {
        name: "评价内容",
        key: "evaluateContent22",
        span: "8",
        value: "",
        content: true
      }, // 平台
      {
        name: "评价内容",
        key: "evaluateContent23",
        span: "8",
        value: "",
        content: true
      } // 车辆
    ]
  }
]

/* 订单详情-右侧 */
export const orderRightData = [
  {
    title: "基本信息",
    key: "basicInfo",
    value: [
      { name: "城市", key: "cityName", span: "12", value: "" },
      { name: "订单状态", key: "parentMainStatus", span: "12", value: "" },
      { name: "订单子状态", key: "mainStatus", span: "12", value: "" },
      // { name: "业务类型", key: "typeModule", span: "12", value: "" },
      { name: "订单编号", key: "routeNo", span: "24", value: "" },
      // { name: "订单类型", key: "", span: "12", value: "" },
      { name: "虚拟订单类型", key: "scene", span: "12", value: "" },
      { name: "是否代叫车", key: "typeSelf", span: "12", value: "" },
      { name: "套餐名称", key: "wrapName", span: "12", value: "" },
      { name: "上车点", key: "originDetailAddress", span: "24", value: "" },
      { name: "下车点", key: "destDetailAddress", span: "24", value: "" },
      // { name: "途径点1", key: "address0", span: "24", value: "" },
      // { name: "途径点2", key: "address1", span: "24", value: "" },
      // { name: "途径点3", key: "address2", span: "24", value: "" },
      { name: "预约用车时间", key: "departTime", span: "24", value: "" }
    ]
  },
  {
    title: "司乘&车辆信息",
    key: "driverInfo",
    value: [
      {
        name: "乘客ID",
        key: "passengerId",
        span: "12",
        value: "",
        link: "passenger",
        uuid: ""
      },
      { name: "司机ID", key: "driverNo", span: "12", value: "", link: "driver", uuid: "" },
      { name: "乘车人姓名", key: "actualPassengerName", span: "12", value: "" },
      {
        name: "乘车人手机号",
        key: "actualPassengerMobile",
        span: "12",
        value: ""
      },
      { name: "车牌号", key: "plateNum", span: "12", value: "" },
      { name: "车型名称", key: "carModel", span: "12", value: "" },
      { name: "车辆VIN码", key: "vin", span: "24", value: "", link: "vin" }
    ]
  },
  {
    title: "取消信息",
    key: "cancelInfo",
    value: [
      { name: "取消时间", key: "cancelTime", span: "24", value: "" },
      { name: "取消类型", key: "cancelType", span: "12", value: "" },
      { name: "取消方", key: "creatorType", span: "12", value: "" },
      {
        name: "取消原因",
        key: "cancelReason",
        span: "24",
        value: "24",
        content: true
      }
    ]
  }
]

export const showMap = {
  0: ["placeOrder", "beginService", "basicInfo"],
  1: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "basicInfo",
    "driverInfo"
  ],
  2: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "basicInfo",
    "driverInfo"
  ],
  3: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "arriveBoard",
    "basicInfo",
    "driverInfo"
  ],
  4: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "arriveBoard",
    "passengerAboard",
    "passingPoints",
    "basicInfo",
    "driverInfo"
  ],
  5: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "arriveBoard",
    "passengerAboard",
    "passingPoints",
    "arriveDest",
    "basicInfo",
    "driverInfo"
  ],
  6: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "arriveBoard",
    "passengerAboard",
    "passingPoints",
    "arriveDest",
    "cost",
    "driverCost",
    "basicInfo",
    "driverInfo"
  ],
  7: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "arriveBoard",
    "passengerAboard",
    "passingPoints",
    "arriveDest",
    "cost",
    "driverCost",
    "pay",
    "basicInfo",
    "driverInfo"
  ],
  8: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "arriveBoard",
    "passengerAboard",
    "passingPoints",
    "arriveDest",
    "cost",
    "driverCost",
    "pay",
    "firstEvaluate",
    "basicInfo",
    "driverInfo"
  ],
  9: [
    "placeOrder",
    "distributOrder",
    "receiveOrder",
    "beginService",
    "basicInfo",
    "driverInfo",
    "cancelInfo"
  ]
}
