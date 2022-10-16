/* 司机管理->人员管理 */
import router from "@/router";
import { getBusinessLine } from "_g/config/status-map"

/** 司机状态映射表 */
const driverStatusMap = {
  1: "正常",
  2: "短期封号",
  3: "长期封号",
  4: "未审核",
  5: "删除",
  6: "离职",
  7: "黑名单",
  8: "强制下线",
  9: "冻结"
}
/** 司机管理黑名单状态 */
const blackStatusMap = {
  1: "封号",
  2: "解封",
  3: "拉黑",
  4: "移除黑名单"
}
/** 订单类型 */
const orderTypeStatusMap = {
  1: "实时",
  2: "预约"
}
/** 订单状态 */
const orderMainStatusMap = {
  0: "约车中",
  1: "预约中",
  2: "接乘中",
  3: "已抵达接乘地",
  4: "载乘中",
  5: "已抵达目的地",
  6: "待支付",
  7: "待评价",
  8: "行程结束",
  9: "行程取消"
}
/** 请假类型 */
let leaveTypeMap = {
  1: "事假",
  2: "病假",
  3: "正常休息"
}
/** 请假类型 */
let leaveStatusMap = {
  1: "待审批",
  2: "审批通过",
  3: "审批不通过"
}
// 拉黑类型
let blackTypeMap = {
  1: "取消订单",
  2: "行程结束"
}
// 移出操作的类型：1-手动移出 2-超时移出
let removeTypeMap = {
  1: "手动移出",
  2: "超时移出"
}

// 司机任务指标类型
let indexTypeMap = {
  1:"完成学习",
  2:"参加考试",
  3:"通过考试",
  4:"完单",
  5:"流水",
  6:"到达围栏",
  7:"到达围栏且接单",
}

//司机任务类型
export const taskList=[
  {
    value:-1,
    name:"全部"
  },
  {
    value:1,
    name:"调度任务"
  },
  {
    value:2,
    name:"学习任务"
  },
  {
    value:3,
    name:"激励任务"
  },
]

//司机任务订单是否有效
export const validList=[
  {
    value:-1,
    name:'全部'
  },
  {
    value:1,
    name:'是'
  },
  {
    value:0,
    name:'否'
  },
]

// 人员管理主页列表
export const driverList = (that) => {
  console.log("that.unFriendCls", that.unFriendCls)
  return {
    name: {
      title: "姓名",
      key: "name",
      tooltip: true,
      fixed: "left",
      width: 100
    },
    mobile: {
      title: "手机号",
      key: "mobile",
      tooltip: true,
      width: 120
    },
    unFriendNum: {
      title: "拉黑次数",
      key: "unFriendNum",
      tooltip: true,
      width: 120,
      sortable: "custom",
      className: that.unFriendCls.class
    },
    score: {
      title: "星级评价分数",
      key: "score",
      tooltip: true,
      width: 130,
      sortable: true,
      className: that.scoreCls.class,
      render(h, params) {
        return h("span", {
        }, params.row.score ? Number(params.row.score).toFixed(1) : 0)
      }
    },
    driverNo: {
      title: "司机ID",
      key: "driverNo",
      tooltip: true,
      width: 160
    },
    agentName: {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      width: 200,
    },
    plateNum: {
      title: "车牌号",
      key: "plateNum",
      tooltip: true,
      width: 100
    },
    modelName: {
      title: "车型",
      key: "modelName",
      tooltip: true,
      width: 100
    },
    city: {
      title: "运营城市",
      key: "city",
      tooltip: true,
      width: 100
    },
    driverManagerName: {
      title: "司管姓名",
      key: "driverManagerName",
      tooltip: true,
      width: 100
    },
    driverManagerMobile: {
      title: "司管手机号",
      key: "driverManagerMobile",
      tooltip: true,
      width: 120
    },
    entryTime: {
      title: "入职时间",
      key: "entryTime",
      tooltip: true,
      width: 120
    },
    status: {
      title: "状态",
      key: "status",
      tooltip: true,
      width: 70,
      render: (h, params) => {
        return h("span", {
          domProps: {
            textContent: driverStatusMap[params.row.status]
          }
        })
      }
    },
    createdOn: {
      title: "添加时间",
      key: "createdOn",
      tooltip: true,
      width: 160
    },
    abortRemark: {
      title: "备注",
      key: "abortRemark",
      tooltip: true,
      width: 200
    }
  }
};
export const pageData = {
  isLoading: false, // loading
  isUpImg: false,
  isShowUnblockTime: false, // 是否显示解封时间
  queryAjaxPramas: {}, // 查询条件
  isShowMore: false,
  isShowBlockade: false, // 是否显示封号弹窗
  searchData: { }, // 搜索条件绑定对象
  blockadeTitle: "封号",
  joinTime: "", // 入职时间
  isShowAlert: false, // 确认司机是否离职警告
  isAudit: false, // 详情弹窗
  otherOperateModalTitle: "加入黑名单",
  auditId: 0,
  isShowOtherModal: false, // 加入黑名单 离职 移出黑名单 解封、冻结、解冻弹窗
  commonFormData: {}, // 当前人员信息
  blockadeFormData: {},
  blockadeRule: {
    blockEnd: [
      { required: true, message: "必填" }
    ],
    type: [{ required: true, message: "必填" }],
    operateRemark: [
      { required: true, message: "必填" },
      { type: "string", max: 400, message: "最多输入400字符", trigger: "blur" }
    ]
  },
  blacklistFormData: {},
  otherOperateRule: {
    operateRemark: [
      { required: true, message: "必填" },
      { type: "string", max: 400, message: "最多输入400字符", trigger: "blur" }
    ]
  },
  isShowAudit: false,
  total: 0,
  current: 1,
  pageSize: 10,
  // customList: { ...driverList },
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: ["name", "mobile", "modelName", "plateNum",
    "city", "agentName", "driverManagerName", "driverManagerMobile",
    "entryTime", "unFriendNum", "score", "createdOn", "status", "abortRemark"],
  // sidx: 'csmId',
  // sord: 'desc',
  tableData: []
}

/** 档案详情 */
export const recordData = {
  activeIndex: "1",
  driverLicenseOn: "",
  entryTime: "",
  isShowMap: false,
  homeAddress: "",
  driverBaseInfo: {
  },
  baseDetail: {},
  driveLicenceDetail: {},
  educationalRecord: [
    {
      text: "博士",
      value: "1"
    },
    {
      text: "研究生",
      value: "2"
    },
    {
      text: "本科",
      value: "3"
    },
    {
      text: "大专",
      value: "4"
    },
    {
      text: "中专",
      value: "5"
    },
    {
      text: "高中",
      value: "6"
    },
    {
      text: "初中",
      value: "7"
    },
    {
      text: "小学",
      value: "8"
    }
  ],
  baseDetailRule: {
    name: [
      { required: true, message: "必填" }
    ],
    age: [
      { type: "number", message: "必须填写18-65之间的数字", min: 18, max: 65 }
    ],
    idCard: [
      { required: true, message: "必填" }
    ],
    mobile: [
      { required: true, message: "必填" }
    ],
    entryTime: [
      { required: true, message: "必填" }
    ]
  },
  driveLicenceDetailRule: {
    licenseId: [
      { required: true, message: "必填" }
    ],
    driverType: [
      { required: true, message: "必填" }
    ]
  },
  qualificationDetail: {},
  qualificationDetailRule: {},
  carDetail: {},
  driverLeaderDetail: {},
  maxUpLoadCount: 3,
  drivingLicenceHomeImg: [],
  drivingLicenceSubImg: [],
  faceImg: [],
  idCardFaceImg: [],
  idCardBackImg: [],
  driverIdCardImg: [],
  facePhotoList: []
}

/** 订单记录 */
export const orderList = [
  {
    title: "订单号",
    key: "orderNo",
    ellipsis: true,
    tooltip: true,
    width: 180,
    render: (h, params) => {
      return h("a", {
        on: {
          click: () => {
            router.push({
              path: "/order/order-detail/" + params.row.uuid
            })
          }
        }
      }, params.row.orderNo)
    }
  },
  {
    title: "下单时间",
    key: "createTime",
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: "完成时间",
    key: "arriveTime",
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: "订单类型",
    key: "typeTime",
    ellipsis: true,
    tooltip: true,
    width: 160,
    render: (h, params) => {
      return h("span", {
      }, orderTypeStatusMap[params.row.typeTime])
    }
  },
  {
    title: "起点",
    key: "originAddress",
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: "终点",
    key: "destAddress",
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: "途径点",
    key: "passingAddresses",
    width: 160,
    tooltip: true,
    /* render:(h,params)=>{
      let text = params.row.passingAddresses
      // if (Array.isArray(params.row.passingAddresses)) {
      //   text = params.row.passingAddresses.join(',');
      // }
      return h('Tooltip', {
        props: {
            content: text,
            placement: 'bottom-start'
        },
        style: {
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
      }
      }, text)
    } */
  },
  {
    title: "状态",
    key: "status",
    ellipsis: true,
    tooltip: true,
    width: 160,
    render: (h, params) => {
      return h("span", {
      }, orderMainStatusMap[params.row.status])
    }
  },
  {
    title: "金额",
    key: "confirmOrderFare",
    ellipsis: true,
    tooltip: true,
    width: 160
  },
]

/** 封号记录 */
export const blockList = [
  {
    title: "类型",
    key: "action",
    ellipsis: true,
    render: (h, params) => {
      return h("span", {
        domProps: {
          textContent: blackStatusMap[params.row.action]
        }
      })
    }
  },
  {
    title: "备注",
    key: "operateRemark",
    ellipsis: true
  },
  {
    title: "操作人",
    key: "operateUser",
    ellipsis: true
  },
  {
    title: "添加时间",
    key: "createTime",
    ellipsis: true
  },
]

/** 上下线记录 */
export const signLogList = [
  {
    title: "上线时间",
    key: "onWorkTime",
    ellipsis: true
  },
  {
    title: "下线时间",
    key: "offWorkTime",
    ellipsis: true
  },
  {
    title: "操作人",
    key: "operateUser",
    ellipsis: true
  },
  {
    title: "备注",
    key: "operateRemark",
    ellipsis: true
  }
]
/** 违章记录 */
export const violationRecordList = [
  {
    title: "车型",
    key: "modelName",
    ellipsis: true,
    width: 160
  },
  {
    title: "车牌号",
    key: "plateNum",
    ellipsis: true,
    width: 160
  },
  {
    title: "违章时间",
    key: "changeTime",
    ellipsis: true,
    width: 160
  },
  {
    title: "扣分",
    key: "penaltyPoint",
    ellipsis: true,
    width: 160
  },
  {
    title: "罚款",
    key: "fines",
    ellipsis: true,
    width: 160
  },
  {
    title: "违章描述",
    key: "reason",
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: "处理状态",
    key: "status",
    ellipsis: true,
    width: 160,
    render: (h, params) => {
      if (params.row.status == 1) {
        return h("div", [
          h("span", {
            style: {
              color: "#AD3A37",
            }
          }, "待处理"),
        ])
      }
      if (params.row.status == 2) {
        return h("div", [
          h("span", {
            style: {
              color: "#009a61"
            }
          }, "已处理"),
        ])
      }
    }
  },
  {
    title: "备注",
    key: "remark",
    ellipsis: true,
    width: 160
  },
]
/** 请假记录 */
export const leaveRecordList = [
  {
    title: "请假类型",
    key: "type",
    ellipsis: true,
    width: 160,
    render: (h, params) => {
      return h(
        "span", {},
        leaveTypeMap[params.row.type]
      )
    }
  },
  {
    title: "开始时间",
    key: "startTime",
    ellipsis: true,
    width: 160
  },
  {
    title: "结束时间",
    key: "endTime",
    ellipsis: true,
    width: 160
  },
  {
    title: "请假天数",
    key: "days",
    ellipsis: true,
    width: 160
  },
  {
    title: "请假事由",
    key: "reason",
    ellipsis: true,
    width: 160
  },
  {
    title: "添加时间",
    key: "createTime",
    ellipsis: true,
    width: 160
  },
  {
    title: "审批人",
    key: "approver",
    ellipsis: true,
    width: 160
  },
  {
    title: "审批时间",
    key: "approvalTime",
    ellipsis: true,
    width: 160
  },
  {
    title: "审批状态",
    key: "status",
    ellipsis: true,
    width: 160,
    render: (h, params) => {
      let text = leaveStatusMap[params.row.status]
      return h("span", {
      }, text)
    }
  },
  {
    title: "备注",
    key: "failReason",
    ellipsis: true,
    width: 160
  }
]
/** 通话记录 */
export const callTableList = [
  {
    title: "关联订单",
    key: "orderNo",
    ellipsis: true,
    minthWidth: 160,
    render: (h, params) => {
      return h("a", {
        domProps: {
          textContent: params.row.orderNo
        },
        on: {
          click() {
            let orderId = params.row.orderUuid
            router.push({
              path: "/order/order-detail/" + orderId
            })
          }
        }
      })
    }
  },
  {
    title: "主叫号码",
    key: "dialerMobile",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "被叫号码",
    key: "answerMobile",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "开始时间",
    key: "startTime",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "结束时间",
    key: "endTime",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "通话时长",
    key: "callDuration",
    ellipsis: true,
    minthWidth: 160
  }
]

/** 乘客拉黑记录 */
export const userBlackList = [
  {
    title: "关联订单ID",
    key: "orderNo",
    ellipsis: true,
    render: (h, params) => {
      return h("a", {
        domProps: {
          textContent: params.row.orderNo
        },
        on: {
          click() {
            let orderId = params.row.orderUuid
            router.push({
              path: "/order/order-detail/" + orderId
            })
          }
        }
      })
    }
  },
  {
    title: "产品线",
    key: "businessType",
    ellipsis: true,
    render: (h, params) => {
      return h("span", getBusinessLine().map[params.row.businessType])
    }

  },
  {
    title: "乘客手机号",
    key: "passengerPhone",
    ellipsis: true
  },
  {
    title: "拉黑时间",
    key: "defriendTime",
    ellipsis: true
  },
  {
    title: "拉黑类型",
    key: "type",
    ellipsis: true,
    render: (h, params) => {
      return h("span", blackTypeMap[params.row.type])
    }
  }
]
/** 移出乘客黑名单记录 */
export const removeUserBlackList = [
  {
    title: "乘客手机号",
    key: "passengerPhone",
    ellipsis: true,
    minthWidth: 160,
    render: (h, params) => {
      return h("a", {
        domProps: {
          textContent: params.row.passengerPhone
        },
        on: {
          click() {
            router.push({
              path: "/customer/customer-detail/" + params.row.passengerUuid
            })
          }
        }
      })
    }
  },
  {
    title: "移除时间",
    key: "removeTime",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "移出类型",
    key: "type",
    ellipsis: true,
    minthWidth: 160,
    render: (h, params) => {
      return h("span", removeTypeMap[params.row.type])
    }
  }
]
/** 修改/详情数据 */
export const detailData = {
  isShowRecord: true,
  isHideAppraiseRecord: false,
  isShowTopMenu: true,
  name: "无名",
  starCount: 0,
  face: "",
  activeIndex: '0',
  isLoading: false,
  total: 0,
  photoTotal: 0,
  current: 1,
  photoCurrentPage: 1,
  pageSize: 10,
  photoPageSize: 12,
  evaluateTotal: 0,
  evaluateCurrentPage: 1,
  evaluatePageSize: 15,
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  evaluateColumns: [],
  evaluateData: [],
  allTagData: [],
  tableData: [],
  searchDate: null,
  carUuid: null,
  startTime: null,
  endTime: null,
  carNoList: [],
  singleDriverDetail: [
    {
      title: "里程",
      key: "serviceMileage",
      value: "暂无数据"
    },
    {
      title: "订单量",
      key: "orderCount",
      value: "暂无数据"
    },
    {
      title: "营业总额",
      key: "totalIncome",
      value: "暂无数据"
    },
    {
      title: "司机电话",
      key: "mobile",
      value: "暂无数据"
    },
    {
      title: "身份证号码",
      key: "idCard",
      value: "暂无数据"
    },
    {
      title: "城市",
      key: "city",
      value: "杭州"
    },
    {
      title: "运营商",
      key: "agentName",
      value: "重庆车联科技"
    },
    {
      title: "司机ID",
      key: "driverNo",
      value: "暂无数据"
    },
    {
      title: "连续服务时长",
      key: "keepFareDura",
      value: "暂无数据"
    },
    {
      title: "过去7天总服务时长",
      key: "sevDura",
      value: "暂无数据"
    }
  ],
  pickureList: [],
  tagSearchValue: {},
  tagColumns: [
    {
      title: "标签",
      key: "tag"
    },
    {
      title: "次数",
      key: "count"
    }
  ],
  tagDatas: []
}
/** 被评价记录 */
export const evaluateColumns = [
  {
    title: "评价标签",
    key: "evaluateTag",
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "评价内容",
    key: "content",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "星级",
    key: "score",
    width: 100
  },
  {
    title: "订单编号",
    key: "orderNo",
    ellipsis: true,
    tooltip: true,
    render: (h, params) => {
      return h("a", {
        domProps: {
          textContent: params.row.orderNo
        },
        on: {
          click() {
            let orderId = params.row.orderUuid
            router.push({
              path: "/order/order-detail/" + orderId
            })
          }
        }
      })
    }
  }
]

/** 被投诉记录 */
export const complainedList = [
  {
    title: "关联订单号",
    key: "complainNo",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "投诉原因",
    key: "contents",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "投诉类型",
    key: "complainType",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "投诉结果",
    key: "visitResult",
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: "投诉时间",
    key: "visitTime",
    ellipsis: true,
    minthWidth: 160
  }
]

//司机任务table
export const taskColumns = (that) => {
  return [
    {
      title: '操作',
      key: "action",
      minWidth: 150,
      fixed: 'right',
      render(h, params) {
        return h('div', {
          style: {
            display: 'flex',
          }
        }, [
          h('Button', {
            props: {
              type: 'success',
              ghost: true,
              size: 'small'
            },
            class: {
              tableBtn: true
            },
            on: {
              click() {
                that.taskDetail=params.row
                that.showModal=true
                if(that.taskDetail.taskType!=2 && !(that.taskDetail.taskType==1 && that.taskDetail.indexType==6)){
                  that.orderTotal=0
                  that.taskOrderList=[]
                  that.dateValue=[]
                  that.orderCurrent = 1;
                  that.searchOrderList={
                    validFlag:'',
                    orderEndTime:'',
                    orderStartTime:''
                  },
                  that.getOrderList();
                }
              }
            }
          },'详情')
        ]);
      }
    },
    {
      title: "任务ID",
      key: "taskId",
      ellipsis:true,
      minWidth: 260,
      tooltip: true,
    },
    {
      title: "任务名",
      key: "taskName",
      minWidth: 150,
      tooltip: true,
    },
    {
      title: "任务类型",
      key: "taskTypeStr",
      minWidth: 100,
    },
    {
      title: "任务状态",
      key: "instanceStatusStr",
      minWidth: 100,
    },
    {
      title: "任务是否达成",
      key: "isTaskComplete",
      minWidth: 100,
    },
    {
      title: "任务目标",
      key: "taskTargetReward",
      minWidth: 150,
      render: (h, params) => {
        let obj=JSON.parse(params.row.taskTargetReward)
        let completeName=indexTypeMap[params.row.indexType]
        if(params.row.indexType===4 || params.row.indexType===5 || params.row.indexType===7){
          let arr=[]
          let count
          obj.setRewardList.forEach(item=>{
            count=params.row.indexType===5?item.shareStartAmount:item.completeCount
            var name=count+(params.row.indexType===5?"元":"单")
            arr.push(name)
          })
          completeName=arr.join("/")
        }
        return h("span", {
          domProps: {
            textContent:completeName
          }
        })
      }
    },
    {
      title: "完单数(单)",
      key: "rewardProgressCount",
      minWidth: 100,
    },
    {
      title: "完单流水(元)",
      key: "rewardProgressFlow",
      minWidth: 100,
    },
    {
      title: "奖励发放总额",
      key: "allMoney",
      minWidth: 100,
      render: (h, params) => {
        let money=params.row.rewardAmount?params.row.rewardAmount+'元':''
        let i=params.row.rewardAmount&& params.row.rewardIntegral? "+":''
        let integral=params.row.rewardIntegral?params.row.rewardIntegral +'T币':''
        return h("span", {
          domProps: {
            textContent: money+i+integral
          }
        })
      }
    },
    {
      title: "任务截止时间",
      key: "taskEndDate",
      minWidth: 150,
      tooltip: true,
    }
  ]
}

/** 任务关联订单 */
export const orderColumns = (that) => {
  return [
    {
      title: "订单编号",
      key: "routeNo",
      width: 180,
      ellipsis:true,
      tooltip: true,
      render: (h, params) => {
        return h("a", {
          domProps: {
            textContent: params.row.routeNo
          },
          on: {
            click() {
              let orderId = params.row.orderId
              that.showModal=false
              that.$router.push({
                path: "/order/order-detail/" + orderId
              })
            }
          }
        })
      }
    },
    {
      title: "接单时间",
      key: "orderTime",
      ellipsis:true,
      width: 155,
      tooltip: true,
    },
    {
      title: "流水(元)",
      key: "orderFare",
      width: 90
    },
    {
      title: "是否为有效单",
      key: "validFlag",
      width: 80,
      render: (h, params) => {
        return h("span", {
          domProps: {
            textContent: params.row.validFlag==0?"无效":"有效"
          }
        })
      }
    },
    {
      title: "无效原因",
      key: "reasonMsg",
      width: 145
    },
    {
      title: "奖励发放明细",
      key: "rewardDetail",
      width: 140,
      render: (h, params) => {
        let arr=params.row.rewardDetail?JSON.parse(params.row.rewardDetail):'';
        let money=arr.cashMoney && arr.cashMoney!=='0'?arr.cashMoney+'元':''
        let i=arr.cashMoney && arr.cashMoney!=='0'&& arr.integral && arr.integral!=='0'? "+":''
        let integral=arr.integral && arr.integral!=='0'?Number(arr.integral).toFixed(0) +'T币':''
        return h("span", {
          domProps: {
            textContent:money+i+integral
          }
        })
      }
    },
    {
      title: "奖励发放时间",
      key: "rewardTime",
      ellipsis:true,
      tooltip: true,
      width: 155
    }
  ]
}

/** 任务关联学习 */
export const studyColumns = [
  {
    title: "任务名",
    key: "evaluateTag",
    width: 155,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "学习/考试完成时间",
    key: "content",
    width: 160,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "是否为有效单",
    key: "score",
    width: 110
  },
  {
    title: "无效原因",
    key: "scores",
    width: 120
  },
  {
    title: "奖励发放明细",
    key: "score",
    width: 110
  },
  {
    title: "奖励发放时间",
    key: "score",
    width: 160,
    ellipsis: true,
  }
]
