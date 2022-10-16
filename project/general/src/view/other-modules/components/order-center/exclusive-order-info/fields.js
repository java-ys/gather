import {
  orderMainStatusMap,
  typeTimeMap,
  typeModuleMap,
  orderInfoSourceMap
} from "_g/config/status-map"

// 针对司机计费兼容
export const DriverPrefix = "driverItem-";

// 车型等级类型
export const getcarLevelName = (i) => {
  let map = {
    1: "快享",
    2: "舒适型",
    3: "行政型",
    4: "商务型",
    5: "尊贵型",
    9: "豪华型",
    8: "自动驾驶",
    10: "惠享"
  }
  return map[i];
}

export const getSourceText = (i) => {
  return orderInfoSourceMap[i]
}

export const VirtualOrder = (i) => {
  let map = {
    0: "无",
    1: "无",
    2: "虚拟派单"
  }
  return map[i];
}
/* 订单列表 */
export const fields = {
  typeModule: {
    title: "业务类型",
    dataIndex: "orderType",
    fixed: "left",
    width: 100,
    customRender(text) {
      return typeModuleMap[text];
    }
  },
  routeNo: {
    title: "订单编号",
    dataIndex: "routeNo",
    fixed: "left",
    width: 180
  },
  cityName: {
    title: "城市",
    dataIndex: "cityName",
    fixed: "left",
    width: 100
  },
  source: {
    title: "订单来源",
    dataIndex: "source",
    width: 120,
    customRender(text) {
      // console.log(text)
      return getSourceText(text);
    }
  },
  typeTime: {
    title: "订单类型",
    dataIndex: "typeTime",
    width: 60,
    customRender(text) {
      return typeTimeMap[text];
    }
  },
  createTime: {
    title: "下单时间",
    dataIndex: "createTime",
    width: 170
  },
  actualPasNam: {
    title: "乘车人姓名",
    dataIndex: "actualPasNam",
    width: 120
  },
  actualPasMob: {
    title: "乘车人手机号",
    dataIndex: "actualPasMob",
    width: 120
  },
  nickName: {
    title: "下单人昵称",
    dataIndex: "nickName",
    width: 120
  },
  passengerName: {
    title: "下单人姓名",
    dataIndex: "orderPassengerName",
    width: 120
  },
  passengerMobile: {
    title: "下单人手机号",
    dataIndex: "orderPassengerMobile",
    width: 120
  },
  driverName: {
    title: "司机",
    dataIndex: "driverName",
    width: 100
  },
  driverMobile: {
    title: "司机手机号",
    dataIndex: "driverMobile",
    width: 120
  },
  plateNum: {
    title: "车牌",
    dataIndex: "plateNum",
    width: 100
  },
  carLevelName: {
    title: "车型",
    dataIndex: "carLevelName",
    width: 80
  },
  vehicleLevel: {
    title: "车型等级",
    dataIndex: "vehicleLevel",
    width: 100,
    customRender(text) {
      // console.log(text)
      return getcarLevelName(text);
    }
  },
  originAddress: {
    title: "出发地",
    dataIndex: "originAddress"
  },
  destAddress: {
    title: "目的地",
    dataIndex: "destAddress",
    width: 200
  },
  totalFare: {
    title: "订单金额",
    dataIndex: "totalFare",
    width: 100
  },
  mainStatus: {
    title: "订单状态",
    dataIndex: "mainStatus",
    width: 100,
    customRender(text) {
      return orderMainStatusMap[text];
    }
  },
  driverEvaluteScore: {
    title: "乘客对司机的评价星级",
    dataIndex: "driverEvaluteScore",
    width: 100,
    customRender(text) {
      let txt = text ? text + "星" : ""
      return txt;
    }
  },
  action: {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 100,
    scopedSlots: { customRender: "action" }
  }
};

/** 途径点修改记录 */
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

/**
 * 订单详情-左侧
 * @description 车辆位置和时间的key命名规则: 状态类型_tiem/状态类型_position
 * @description 评价的key也是类似的命名规则
 */
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
      {
        name: "冒泡动态折扣",
        key: "bubbleDynamicDiscount",
        span: "8",
        value: "",
        acount: true
      },
      {
        name: "冒泡预估时长",
        key: "bubbleEstimateDuration",
        span: "8",
        value: ""
      },
      {
        name: "冒泡预估里程",
        key: "bubbleEstimateMileage",
        span: "16",
        value: "",
        unit: "公里",
        type: "number"
      },
      { name: "下单时间", key: "routePlanCreateTime", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "1_position",
        span: "16",
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
      { name: "动态折扣", key: "rate", span: "8", value: "", acount: true },
      {
        name: "定价规则版本",
        key: "ruleVersion",
        span: "8",
        value: "暂无",
        ruleVersion: true
      },
      {
        name: "预估里程",
        key: "planTrip",
        span: "8",
        value: "",
        unit: "公里",
        type: "number"
      },
      { name: "预估时长", key: "planDuration", span: "16", value: "" }
    ]
  },
  {
    title: "派单",
    key: "distributOrder",
    value: [
      { name: "派单时间", key: "2_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "2_position",
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
      { name: "接单时间", key: "3_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "3_position",
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
        key: "4_time",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "4_position",
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
        key: "5_time",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "5_position",
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
      { name: "乘客上车时间", key: "6_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "6_position",
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
  {
    title: "途径点1",
    key: "passingPoints",
    value: [
      {
        name: "到达时间",
        key: "7_time0",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "7_position0",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "途径点2",
    key: "passingPoints",
    value: [
      {
        name: "到达时间",
        key: "7_time1",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "7_position1",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "途径点3",
    key: "passingPoints",
    value: [
      {
        name: "到达时间",
        key: "7_time2",
        span: "8",
        value: ""
      },
      {
        name: "车辆位置",
        key: "7_position2",
        span: "16",
        value: "",
        link: "position"
      }
    ]
  },
  {
    title: "到达目的地",
    key: "arriveDest",
    value: [
      { name: "到达时间", key: "8_time", span: "8", value: "" },
      {
        name: "车辆位置",
        key: "8_position",
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
        name: "夜间时段里程",
        key: "nightTrip",
        span: "16",
        value: "",
        unit: "公里",
        type: "number"
      }
    ]
  },
  {
    title: "乘客计费",
    key: "cost",
    value: [
      {
        name: "定价规则版本",
        key: "ruleVersion",
        span: "8",
        value: "暂无",
        ruleVersion: true
      },
      { name: "动态折扣", key: "rate", span: "8", value: "", acount: true },
      {
        name: "动态折扣版本",
        key: "discountVersion",
        span: "8",
        value: "暂无",
        discount: true
      },
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
      {
        name: "夜间费",
        key: "nightFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "折扣费用",
        key: "discountFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "渠道折扣费用",
        key: "channelDiscountFare",
        span: "8",
        value: "",
        type: "number"
      },
      {
        name: "预付款",
        key: "rechargeTotalAmountStr",
        span: "8",
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
        name: "渠道直减费用",
        key: "channelDirectMinus",
        span: "8",
        value: "",
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
      {
        name: "司机减免",
        key: "driverReliefFare",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
      {
        name: "预付款退款",
        key: "sumRechargeRefundedAmountStr",
        span: "8",
        value: "",
        unit: "元",
        type: "number"
      },
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
        span: "8",
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
        span: "8",
        value: "",
        adjust: "",
        unit: "元",
        type: "number"
      },
      {
        name: "计费方式",
        key: "priceMeasureWay",
        span: "8",
        value: "实时计费"
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
        name: "定价规则版本",
        key: DriverPrefix + "fareRuleVersion",
        span: "8",
        value: "暂无",
        fareRuleVersion: true
      },
      {
        name: "订单预估流水",
        key: DriverPrefix + "planRouteFlow",
        span: "16",
        value: "",
        unit: "元",
        type: "number"
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
        name: "夜间费",
        key: DriverPrefix + "nightFare",
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
      },
      {
        name: "计费方式",
        key: DriverPrefix + "driverFareMethod",
        span: "8",
        value: ""
      }
    ]
  },
  {
    title: "支付",
    key: "pay",
    value: [
      { name: "支付时间", key: "payTime", span: "8", value: "" },
      { name: "支付方式", key: "payType", span: "16", value: "" },
      { name: "现金（余额）", key: "balanceCash", span: "8", value: "", unit: "元", type: "number" },
      { name: "运营金（余额）", key: "balanceGift", span: "8", value: "", unit: "元", },
      { name: "礼品卡（余额）", key: "giftAmount", span: "8", value: "", unit: "元", uuid: "" },
      { name: "T币数量", key: "integralNum", span: "8", value: "", unitCase: "integralAmount" },
      { name: "T币抵扣", key: "integralAmount", span: "8", value: "", unit: "元", },
      // { name: "运营金", key: "balanceGift", span: '8', value: '', unit: '元', type: 'number' },
      { name: "第三方支付金额", key: "thirdAmount", span: "8", value: "", unit: "元", type: "number" },
      { name: "是否申请发票", key: "billedStatus", span: "8", value: "" },
      { name: "发票编号", key: "invoiceNo", span: "8", value: "", link: "invoice", uuid: "" },
      { name: "发票类型", key: "invoiceType", span: "8", value: "" },
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

/** 订单详情-右侧 */
export const orderRightData = [
  {
    title: "基本信息",
    key: "basicInfo",
    value: [
      { name: "订单状态", key: "mainStatus", span: "12", value: "" },
      { name: "业务类型", key: "typeModule", span: "12", value: "" },
      { name: "车型等级", key: "carLevel", span: "12", value: "" },
      { name: "订单来源", key: "source", span: "12", value: "" },
      { name: "订单编号", key: "routeNo", span: "24", value: "" },
      { name: "订单类型", key: "typeTime", span: "12", value: "" },
      { name: "虚拟订单类型", key: "scene", span: "12", value: "" },
      { name: "是否代叫车", key: "typeSelf", span: "12", value: "" },
      { name: "出发地", key: "originDetailAddress", span: "24", value: "" },
      { name: "目的地", key: "destDetailAddress", span: "24", value: "" },
      { name: "途径点1", key: "address0", span: "24", value: "" },
      { name: "途径点2", key: "address1", span: "24", value: "" },
      { name: "途径点3", key: "address2", span: "24", value: "" },
      { name: "预约用车时间", key: "departTime", span: "24", value: "" }
    ]
  },
  {
    title: "司乘&车辆信息",
    key: "driverInfo",
    value: [
      {
        name: "下单人姓名",
        key: "passengerName",
        span: "12",
        value: "",
        link: "passenger",
        uuid: ""
      },
      { name: "状态", key: "accountStatus", span: "12", value: "" },
      { name: "下单人手机号", key: "passengerMobile", span: "12", value: "" },
      { name: "乘车人姓名", key: "actualPassengerName", span: "12", value: "" },
      {
        name: "乘车人手机号",
        key: "actualPassengerMobile",
        span: "12",
        value: ""
      },
      {
        name: "司机姓名",
        key: "actualDriverName",
        span: "12",
        value: "",
        link: "driver",
        uuid: ""
      },
      { name: "司机手机号", key: "actualDriverMobile", span: "12", value: "" },
      { name: "车牌号", key: "plateNum", span: "12", value: "" },
      { name: "车型名称", key: "carModel", span: "12", value: "" },
      { name: "车辆VIN码", key: "vin", span: "24", value: "", link: "vin" },
      { name: "乘客是否饮酒报备", key: "drinkFlag", span: "12", value: "" },
      { name: "报备人员", key: "reporter", span: "12", value: "" }
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
  },
  {
    title: "接机信息",
    key: "routeTrafficDto",
    value: [
      { name: "航空公司", key: "trafficName", span: "12", value: "" },
      { name: "航班号", key: "trafficNumber", span: "12", value: "" },
      { name: "航班状态", key: "status", span: "12", value: "" },
      { name: "计划起飞时间", key: "planDepartTime", span: "12", value: "" },
      { name: "计划到达时间", key: "planArrivalTime", span: "12", value: "" },
      { name: "预计起飞时间", key: "estimatedDepartTime", span: "12", value: "" },
      { name: "预计到达时间", key: "estimatedArrivalTime", span: "12", value: "" },
      { name: "实际起飞时间", key: "actualDepartTime", span: "12", value: "" },
      { name: "实际到达时间", key: "actualArrivalTime", span: "24", value: "" }
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
    // 'routeTrafficDto',
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
