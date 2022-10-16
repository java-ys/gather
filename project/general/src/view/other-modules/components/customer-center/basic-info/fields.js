import {
  consumeTypeMap,
  couponStatusMap,
  couponTypeMap,
  freezeTypeMap,
  orderMainStatusMap,
  payTypeMap,
  rechargeTypeMap,
  sexMap,
  shareTypeMap,
  typeModuleMap,
  typeTimeMap
} from "_g/config/status-map"
import router from "@/router"
import { timeFormat } from "@/libs/util.js";

export const accountStatusMap = {
  0: "正常",
  1: "长期封号",
  2: "短期封号",
  9: "已注销"
}
let accountStatusList = [
  {
    value: 0,
    label: "正常"
  },
  {
    value: 1,
    label: "长期封号"
  },
  {
    value: 2,
    label: "短期封号"
  },
  {
    value: 9,
    label: "已注销"
  },
]

/* 用户列表 */
export const fields = {
  nickname: {
    title: "乘客昵称",
    key: "nickname",
    tooltip: true,
    minWidth: 150,
  },
  realname: {
    title: "乘客姓名",
    key: "realname",
    tooltip: true,
    minWidth: 100,
    fixed: "left"
  },
  mobile: {
    title: "乘客手机号",
    key: "mobile",
    tooltip: true,
    minWidth: 150
  },
  sex: {
    title: "性别",
    key: "sex",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("span", {
        domProps: {
          textContent: sexMap[params.row.sex]
        }
      })
    }
  },
  age: {
    title: "年龄",
    key: "age",
    tooltip: true,
    minWidth: 80
  },
  grealnameOrNot: {
    title: "是否实名",
    key: "realnameOrNot",
    tooltip: true,
    minWidth: 150,
    render: (h, params) => {
      let text = "未实名"
      if (params.row.realnameOrNot) text = "已实名"
      return h("span", text)
    }
  },
  cash: {
    title: "现金",
    key: "cash",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("span", {
        domProps: {
          textContent: params.row.cash + "元"
        }
      })
    }
  },
  status: {
    title: "账号状态",
    key: "status",
    tooltip: true,
    minWidth: 150,
    render: (h, params) => {
      return h("span", accountStatusMap[params.row.status])
    }
  },
  registerTime: {
    title: "注册时间",
    key: "registerTime",
    tooltip: true,
    width: 180
  }
}

/* 订单记录 */
export const orderHistory = [
  {
    title: "订单编号",
    key: "routeNo",
    tooltip: true,
    minWidth: 200,
    fixed: "left",
    render: (h, params) => {
      return h("a", {
        on: {
          click: () => {
            if (params.row.typeModule === 5) {
              // router.push({
              //   name: 'hitch-order-detail',
              //   query: {
              //     status: params.row.orderStatus,
              //   },
              //   params: {
              //     id: params.row.orderUuid
              //   }
              // })
              router.pushToAnotherModule("/m2-pickride-web", {
                path: `/hitch-center/hitch-data/hitch-order-detail/${params.row.orderUuid}`,
                query: {
                  status: params.row.orderStatus,
                }
              })
              return;
            }
            if (params.row.typeEnt === 2) {
              // router.push({
              //     path: '/companyCenter/orderManager/orderdetail',
              //     query: {
              //         id: params.row.orderUuid,
              //         applyNo: params.row.applyNo
              //     }
              // })
              router.pushToAnotherModule("/m2-web-companyLines", {
                path: "/companyCenter/orderManager/orderdetail",
                query: {
                  id: params.row.orderUuid,
                  applyNo: params.row.applyNo
                }
              })
              return
            }
            router.push({
              name: "order-detail",
              params: {
                id: params.row.orderUuid
              }
            })
          }
        }
      }, params.row.routeNo)
    }
  },
  {
    title: "业务类型",
    key: "typeModule",
    tooltip: true,
    minWidth: 200,
    render: (h, params) => {
      return h("span", typeModuleMap[params.row.typeModule])
    }
  },
  {
    title: "订单类型",
    key: "orderType",
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h("span", typeTimeMap[params.row.orderType])
    }
  },
  {
    title: "下单时间",
    key: "createTime",
    tooltip: true,
    width: 160
  },
  {
    title: "订单金额（元）",
    key: "orderFare",
    tooltip: true,
    width: 160
  },
  {
    title: "乘车人姓名",
    key: "passengerName",
    tooltip: true,
    width: 80
  },
  {
    title: "乘车人电话",
    key: "passengerMobile",
    tooltip: false,
    width: 120
  },
  {
    title: "车牌",
    key: "licensePlateNumber",
    tooltip: false,
    width: 120
  },
  {
    title: "司机",
    key: "driverName",
    tooltip: false,
    width: 80
  },
  {
    title: "司机电话",
    key: "driverMobile",
    tooltip: false,
    width: 120
  },
  {
    title: "订单状态",
    key: "orderStatus",
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h("span", orderMainStatusMap[params.row.orderStatus])
    }
  }
]

/* 充值记录 */
export const rechargeHistory = [
  {
    title: "充值流水号",
    tooltip: true,
    minWidth: 100,
    key: "tradeId"
  },
  {
    title: "充值时间",
    key: "rechargeTime",
    tooltip: true,
    minWidth: 100,
  },
  {
    title: "充值类型",
    key: "rechargeType",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let map = {
        2: "客户充值",
        3: "客服充值",
        4: "活动奖励"
      }
      return h("span", map[params.row.rechargeType])
    }
  },
  {
    title: "活动名称",
    tooltip: true,
    minWidth: 110,
    key: "activityName",
    render: (h, params) => {
      return h("a", {
        on: {
          click: () => {
            // router.push({
            //     name: 'activity-detail',
            //     params: {
            //         id: params.row.activityId
            //     }
            // })
            router.pushToAnotherModule("/m2-web-marketing", {
              path: `/marketing/activity-detail/${params.row.activityId}`
            });
          }
        }
      }, params.row.activityName)
    }
  },
  {
    title: "现金（元）",
    tooltip: true,
    minWidth: 100,
    key: "accountCashStr"
  },
  {
    title: "运营金（元）",
    tooltip: true,
    minWidth: 100,
    key: "accountGiftStr"
  },
  {
    title: "支付方式",
    key: "payPattern",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("span", payTypeMap[params.row.payPattern])
    }
  }
]

/* 消费记录 */
export const expenseHistory = [
  {
    title: "订单编号",
    key: "relatedOrder",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("a", {
        on: {
          click: () => {
            router.push({
              name: "order-detail",
              params: {
                id: params.row.orderUuid
              }
            })
          }
        }
      }, params.row.relatedOrder)
    }
  },
  {
    title: "支付时间",
    key: "consumeTime",
    tooltip: true,
    minWidth: 100,
  },
  {
    title: "消费类型",
    key: "consumeType",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("span", consumeTypeMap[params.row.consumeType])
    }
  },
  {
    title: "现金（元）",
    tooltip: true,
    minWidth: 100,
    key: "accountCashStr"
  },
  {
    title: "运营金（元）",
    tooltip: true,
    minWidth: 100,
    key: "accountGiftStr"
  },
  {
    title: "支付方式",
    key: "payPattern",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("span", payTypeMap[params.row.payPattern])
    }
  }
]

let payOrderTypeMap = {
  1: "行程车费支付-线上",
  2: "充值",
  3: "购卡",
  4: "行程车费支付 - 线下",
  5: "行程车费支付 - 自动扣款",
  6: "电费支付",
  7: "充电账户充值",
  8: "客服直接赠送",
  9: "营销直接赠送",
  10: "企业行程支付",
  11: "企业充值 - 线上",
  12: "企业充值 - 线下",
  13: "企业账单付款 - 线上",
  14: "企业账单付款 - 线下",
  15: "行程自动预付款",
  16: "司机缴纳保证金",
  17: "个人行程退款",
  18: "个人充值退款"
}

let refundChannelMap = {
  1: "支付宝",
  2: "微信",
  3: "一网通",
  4: "余额",
  5: "优惠券",
  6: "线下支付",
  7: "营销或者客服操作",
  8: "银联支付",
  9: "企业账户支付",
  10: "支付宝PC支付",
  11: "银联B2B",
  12: "企业线下支付",
  13: "行程预付款",
  14: "微信小程序支付"
}

let refundStatusMap = {
  1: "创建",
  2: "退款中",
  3: "已退款",
  4: "作废"
}
let jbMap = {
  2: '否',
  1: '是'
}
let gmMap = {
  2: '否',
  3: '不清楚',
  1: '是'
}

/* 退款记录 */
export const refundHistory = (_this) => {
  return [
    {
      title: "订单编号",
      key: "refundBatchNo",
      tooltip: true,
      minWidth: 100
    }, {
      title: "退款类型",
      key: "payOrderType",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("span", {}, payOrderTypeMap[params.row.payOrderType])
      }
    }, {
      title: "现金退款金额（元）",
      key: "cashRefundedAmountStr",
      tooltip: true,
      minWidth: 150
    }, {
      title: "运营金退款金额（元）",
      key: "giftRefundedAmountStr",
      tooltip: true,
      minWidth: 160
    }, {
      title: "退款渠道",
      key: "refundChannel",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("span", {}, refundChannelMap[params.row.refundChannel])
      }
    }, {
      title: "流水号",
      key: "transactionId",
      tooltip: true,
      width: 170
    }, {
      title: "申请时间",
      key: "createTime",
      tooltip: true,
      width: 180
    }, {
      title: "到账时间",
      key: "refundTime",
      tooltip: true,
      width: 180
    }, {
      title: "退款原因",
      key: "refundReason",
      tooltip: true,
      width: 180
    }, {
      title: "退款状态",
      key: "refundStatus",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("span", {}, refundStatusMap[params.row.refundStatus])
      }
    }
  ]
}

/* 优惠券 */
export const coupons = [
  {
    title: "优惠券名称",
    key: "couponName",
    width: 150,
    tooltip: true,
    fixed: "left"
  },
  {
    title: "活动名称",
    key: "xxxx",
    width: 150,
    tooltip: true,
    render: (h, params) => {
      return h("a", {
        on: {
          click: () => {
            if(params.row.oldActivity){
              router.pushToAnotherModule("/m2-web-marketing", {
                path: `/marketing/activity-detail/${params.row.activityId}`
              });
            }else{
              router.pushToAnotherModule("/m2-web-marketing", {
                path: `/marketing/activityCenter/create-new-activityDetail/${params.row.activityId}`
              });
            }
          }
        }
      }, params.row.activityName)
    }
  },
  {
    title: "优惠券类型",
    key: "couponType",
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h("span", couponTypeMap[params.row.couponType])
    }
  },
  {
    title: "面额（元）",
    key: "couponMoney",
    tooltip: true,
    width: 100
  },
  {
    title: "发放时间",
    key: "createdOn",
    tooltip: true,
    width: 120
  },
  {
    title: "有效期",
    key: "expiryDate",
    tooltip: true,
    width: 190,
    render: (h, params) => {
      return h("span", params.row.expiryDateBegin + " ~ " + params.row.expiryDateEnd)
    }
  },
  {
    title: "券状态",
    key: "grantState",
    tooltip: true,
    width: 100,
    fixed: "right",
    render: (h, params) => {
      return h("span", couponStatusMap[params.row.grantState])
    }
  }
]

/* 账号管控记录 */
export const banHistory = [
  {
    title: "封号时间",
    key: "disableTime",
    tooltip: true,
    minWidth: 100,
  },
  {
    title: "封号类型",
    tooltip: true,
    minWidth: 100,
    key: "action",
    render: (h, params) => {
      return h("span", freezeTypeMap[params.row.action])
    }
  },
  {
    title: "封号期限",
    tooltip: true,
    minWidth: 250,
    key: "xxxx",
    render: (h, params) => {
      return h("span", params.row.disableTime + " ~ " + params.row.blockEnd)
    }
  },
  {
    title: "操作人",
    key: "operator",
    tooltip: true,
    minWidth: 100,
  },
  {
    title: "备注",
    tooltip: true,
    minWidth: 100,
    key: "comment"
  }
]

/* 紧急联系人 */
export const emergencyContact = [
  {
    tooltip: true,
    minWidth: 150,
    title: "紧急联系人姓名",
    key: "name"
  },
  {
    tooltip: true,
    minWidth: 100,
    title: "手机号",
    key: "mobile"
  },
  {
    tooltip: true,
    minWidth: 150,
    title: "是否自动分享",
    key: "autoShareOrNot",
    render: (h, params) => {
      let text = "否"
      if (params.row.autoShareOrNot) text = "是"
      return h("span", text)
    }
  },
  {
    tooltip: true,
    minWidth: 100,
    title: "添加时间",
    key: "addTime",
  },
  {
    tooltip: true,
    minWidth: 100,
    title: "备注",
    key: "comment"
  }
]

/* 行程分享记录 */
export const tripSharing = [
  {
    tooltip: true,
    minWidth: 100,
    title: "分享时间",
    key: "shareTime"
  },
  {
    tooltip: true,
    minWidth: 100,
    title: "分享类型",
    key: "shareType",
    render: (h, params) => {
      return h("span", shareTypeMap[params.row.shareType])
    }
  },
  {
    tooltip: true,
    minWidth: 100,
    title: "紧急联系人",
    key: "emergencyContactPerson"
  },
  {
    tooltip: true,
    minWidth: 100,
    title: "分享内容",
    key: "content"
  }
]

/** 预付款 */
export const getPayment = (_this) => {
  return [
    {
      tooltip: true,
      minWidth: 100,
      title: "订单编号",
      key: "orderNo",
      render: (h, params) => {
        return h("a", {
          on: {
            click() {
              if (!params.row.uuid) {
                _this.$Message.warning("当前记录行程ID不存在")
                return
              }
              _this.$router.push({ name: "order-detail", params: { id: params.row.uuid }})
            }
          }
        }, params.row.orderNo)
      }
    },
    {
      tooltip: true,
      minWidth: 100,
      title: "预付款金额（元）",
      key: "advancePayment",
    },
    {
      tooltip: true,
      minWidth: 100,
      title: "预付款时间",
      key: "advenceTime"
    },
    {
      tooltip: true,
      minWidth: 100,
      title: "预付款退款金额（元）",
      key: "adviceRefundAmont"
    },
    {
      tooltip: true,
      minWidth: 100,
      title: "预付款退款到账时间",
      key: "adviceRefundTime"
    },
    {
      tooltip: true,
      minWidth: 100,
      title: "退款状态",
      key: "refundStatus",
      render: (h, params) => {
        let map = {
          1: "创建",
          2: "退款中",
          3: "已退款",
          4: "作废"
        }
        return h("span", {}, map[params.row.refundStatus])
      }
    },
  ]
}

export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    current: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  sidx: "csmId",
  sord: "desc",
  tableData: [],
  passengerUuid: "",
  isShow: false,
  isShowTime: false, // 封号->是否显示具体时间
  queryForm: {},
  searchData: {},
  orderTips: {}, // 订单记录
  rechargeTips: {}, // 充值记录
  consumptionTips: {}, // 消费记录
  disableAccountTips: {}, // 封号记录
  emergencyContactTips: {}, // 紧急联系人
  tripShareTips: {}, // 行程分享记录
  formRule: {
    blockType: [
      { required: true, message: "必填", trigger: "blur" }
    ],
    date: [
      { required: true, type: "date", message: "必填", trigger: "change" }
    ],
    comment: [
      { required: true, message: "必填", trigger: "blur" }
    ]
  }
}

export const inputList = [
  {
    name: "text-input",
    bind_key: "realName",
    placeholder: "请填写乘客姓名",
    value: "",
    title: "乘客姓名："
  },
  {
    name: "text-input",
    bind_key: "mobile",
    placeholder: "请填写乘客手机号",
    value: "",
    titleWidth: 80,
    title: "乘客手机号："
  },
  {
    name: "date-time-input",
    bind_key: ["startTime", "endTime"],
    placeholder: "请选择注册时间",
    value: "",
    title: "注册时间：",
    inputWidth: 300
  },
  {
    name: "drop-input",
    bind_key: "accountStatus",
    placeholder: "请选择",
    value: "",
    title: "账号状态",
    dropList: accountStatusList,
    titleWidth: 80,
    inputWidth: 300
  },
]

export const customerData = [
  {
    key: "basicInfo",
    title: "基本信息",
    value: [
      { name: "乘客手机号", key: "mobile", span: "12", value: "" },
      { name: "账号状态", key: "status", span: "12", value: "" },
      { name: "乘客姓名", key: "name", span: "12", value: "" },
      { name: "实名制状态", key: "dautoynmStatus", span: "12", value: "" },
      { name: "乘客昵称", key: "nickName", span: "12", value: "" },
      { name: "证件类型", key: "IDCardType", span: "12", value: "身份证" },
      { name: "年龄", key: "age", span: "12", value: "" },
      { name: "证件号", key: "iDNO", span: "12", value: "" },
      { name: "籍贯", key: "nativePalce", span: "12", value: "" },
      { name: "头像", key: "face", span: "12", value: "" },
      { name: "性别", key: "sex", span: "24", value: "" },
    ]
  },
  {
    key: "registerInfo",
    title: "注册信息",
    value: [
      { name: "注册时间", key: "registerTime", span: "12", value: "" },
      { name: "注册城市", key: "registerArea", span: "12", value: "" },
      { name: "注册渠道", key: "registerChannel", span: "12", value: "" },
      { name: "注册来源", key: "registerSource", span: "12", value: "" }
    ]
  },
  {
    key: "logoutInfo",
    title: "注销信息",
    value: [
      { name: "注销时间", key: "cancellationTime", span: "12", value: "" },
      { name: "注销验证方式", key: "cancellationIdentifyType", span: "12", value: "" }
    ]
  },
  {
    key: "occupationInfo",
    title: "职业信息",
    value: [
      { name: "邮箱", key: "email", span: "12", value: "" },
      { name: "行业", key: "industry", span: "12", value: "" },
      { name: "公司", key: "company", span: "12", value: "" },
      { name: "职业", key: "profession", span: "12", value: "" },
      { name: "个性签名", key: "characterSignature", span: "24", value: "" }
    ]
  },
  {
    key: "walletInfo",
    title: "钱包信息",
    value: [
      { name: "余额", key: "passengerAccountBalance", span: "24", value: "", unit: "元" },
      { name: "现金", key: "cash", span: "24", value: "", unit: "元" },
      { name: "运营金", key: "accountGiftMoney", span: "24", value: "", unit: "元" }
    ]
  },
  {
    key: "otherInfo",
    title: "其他信息",
    value: [
      { name: "客户端APP版本", key: "appVersion", span: "12", value: "" },
      { name: "设备型号", key: "deviceTypeAndToken", span: "12", value: [] },
      { name: "最近一次冒泡城市", key: "lastStayCity", span: "24", value: "" },
      { name: "最近一次下单城市", key: "lastOrderCity", span: "24", value: "" }
    ]
  },
  {
    key: "otherInfo",
    title: "医疗急救卡信息",
    value: [
      { name: "出生日期", key: "birthDay", span: "12", value: "", default: '未填写'},
      { name: "血型", key: "bloodType", span: "12", value: '', default: '未填写'},
      { name: "身高", key: "height", span: "12", value: "", default: '未填写' },
      { name: "体重", key: "weight", span: "12", value: "", default: '未填写' },
      { name: "是否有突发疾病史", key: "hasSuddenIllness", span: "12", value: "", map: jbMap, default: '未填写', under: 'suddenIllness',underValue:''},
      { name: "是否有药物过敏反应", key: "hasDrugAllergy", span: "12", value: "", map: gmMap, default: '未填写', under: 'drugAllergy',underValue:''  }
    ]
  }
]

/** 商品获取记录 */
export const commodityRecordColumns = [
  {
    title: "商品编号",
    minWidth: 120,
    key: "spuCode"
  },
  {
    title: "商品名称",
    minWidth: 150,
    key: "spuName"
  },
  {
    title: "订单编号",
    minWidth: 120,
    key: "orderCode"
  },
  {
    title: "现金支付",
    minWidth: 100,
    key: "payCash"
  },
  {
    title: "消耗积分",
    minWidth: 100,
    key: "payIntegral"
  },
  {
    title: "日期",
    minWidth: 150,
    key: "createTime"
  },
]
/** 等级变更记录 */
export const levelChangeRecordColumns = [
  {
    key: "grade",
    title: "当前等级",
    minWidth: 100,
    render(h, params) {
      return h("span", `lv${params.row.grade}`)
    }
  },
  {
    key: "gradeSource",
    title: "等级来源",
    minWidth: 100,
    render: (h, params) => {
      if (!_this.gradeSourceList) return
      let data = _this.gradeSourceList.find(item => item.value == params.row.gradeSource) || {};
      return h("span", {}, data.label)
    }
  },
  {
    key: "gradeBeginTime",
    title: "等级开始日期",
    minWidth: 100,
    render(h, params) {
      return h("span", {}, timeFormat(params.row.gradeBeginTime, "yyyy-MM-dd ss"))
    }
  },
  {
    key: "gradeExceptEndTime",
    title: "等级预计结束日期",
    minWidth: 100,
    render(h, params) {
      return h("span", {}, timeFormat(params.row.gradeExceptEndTime, "yyyy-MM-dd ss"))
    }
  },
  {
    key: "preGrade",
    title: "上一等级",
    minWidth: 100,
    render(h, params) {
      return h("span", `lv${params.row.preGrade}`)
    }
  },
  {
    key: "preGradeAmass",
    title: "上一等级累计积分",
    minWidth: 100
  },
]
/** 积分获取记录 */
export const integralRecordColumns = [
  {
    title: "城市",
    minWidth: 50,
    key: "cityName"
  },
  {
    title: "会员等级",
    minWidth: 50,
    key: "currentGrade",
    render(h, params) {
      return h("span", `lv${params.row.currentGrade}`)
    }
  },
  {
    title: "订单类型",
    minWidth: 50,
    key: "orderType",
    render(h, params) {
      if (params.row.orderType === 1) {
        return h("span", "实时")
      }
      else {
        return h("span", "预约")
      }
    }
  },
  {
    title: "业务线",
    minWidth: 50,
    key: "businessType",
    render: (h, params) => {
      let data = _this.businessTypeList.find(item => item.value == params.row.businessType) || {};
      return h("span", {}, data.label)

    }
  },
  {
    title: "类型",
    minWidth: 100,
    key: "exchangeSubType",
    render: (h, params) => {
      let data = _this.excahngeTypeList.find(item => item.value == params.row.exchangeSubType) || {};
      return h("span", {}, data.label)
    }
  },
  {
    title: "积分数量",
    minWidth: 100,
    key: "exchangeAmount"
  },
  {
    title: "日期",
    minWidth: 100,
    key: "createTime",
    render(h, params) {
      return h("span", {}, timeFormat(params.row.createTime, "yyyy-MM-dd ss"))
    }
  },
]
/** 任务记录 */
export const taskRecordColumns = [
  {
    title: "领取城市",
    minWidth: 120,
    key: "cityName"
  },
  {
    title: "任务编号",
    minWidth: 120,
    key: "taskCode"
  },
  {
    title: "奖励积分",
    minWidth: 120,
    key: "rewardAmount"
  },
  {
    title: "进度",
    minWidth: 100,
    key: "progress",
    render(h, params) {
      return h("span", {}, `${params.row.cumulativeCount} / ${params.row.amassCount}`)
    }
  },
  {
    title: "领取时间日期",
    minWidth: 150,
    key: "",
    render(h, params) {
      return h("span", {}, timeFormat(params.row.taskGetTime))
    }
  },
  {
    title: "任务到期时间",
    minWidth: 150,
    key: "",
    render(h, params) {
      return h("span", {}, timeFormat(params.row.taskEndTime))
    }
  },
]
