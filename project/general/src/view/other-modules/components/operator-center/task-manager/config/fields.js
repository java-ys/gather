import moment from "moment"

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

const DAY_TIME_FORMAT = 'YYYY-MM-DD'

// 产品线map
export const businessLineMap = {
  1: "快享",
  2: "专享",
  3: "企业用车",
  4: '包车',
}

// 任务类型map
export const taskTypeMap = {
  1: "调度任务",
  2: "学习任务",
  3: "激励任务",
  4: "奖金瓜分任务",
}

// 任务状态
export const taskStatusMap = {
  1: "审核中",
  2: "审核通过",
  3: "审核驳回",
  0: "待审核",
  4: "启用",
  5: "停用"
}

// 操作类型map
export const operateTypeMap = {
  1: "新增",
  2: "编辑",
  3: '删除',
  4: '复制',
  5: '停用'
}

// 操作指标map
export const taskStandardMap = {
  6: "到达围栏",
  7: "到达围栏且接单"
}

// 任务指标学习任务map
export const taskStandardForStudyMap = {
  1: "完成学习",
  2: "参加考试",
  3: "通过考试"
}

// 任务指标激励任务map
export const taskStandardForAwardMap = {
  // 4: "完单量",
  // 5: "流水金额",
  16: "完单量",
  32: "流水金额",
  64: "在线时长",
  128: "在线天数"
}
// 任务指标奖金瓜分任务map
export const taskStandardForBonusMap = {
  4: "完单量",
  5: "流水金额",
}
export const carStatusMap = {
  1: "接乘",
  2: "服务",
  3: "巡游"
}

export const orderSourceMap = {
  7: "高德运营",
  12: "车巴达",
  17: "同程",
  13: "易企",
  26: "胜意科技",
  20: "阿里",
  22: "租租车",
  24: "分贝通",
  11: "招商",
  9: "首约",
  25: "广州悦行",
  1: "APP移动端",
  2: "微信公众号",
  3: "电话叫车",
  4: "PC网站",
  5: "后台下单",
  8: "微信小程序",
  10: "苏宁",
  14: "支付宝小程序",
  16: "旗妙",
  18: "凤凰有车",
  19: "H5",
  21: "美团",
  23: "东航",
  27: "掌上高铁",
  28: "销巴科技",
  29: "差旅壹号",
  30: "车城智行",
  15: '平安',
  31: '招行总部',
  32: '携程',
  33: '航旅纵横'
}

export const awardCalculateMap = {
  1: "叠加奖",
  2: "阶梯奖",
}

// 激励任务-任务指标-流水
// 流水固定奖
// 流水分成奖
// export const awardFlowMap = {
//   3: "流水固定奖",
//   4: "流水分成奖",
// }

// 激励任务-任务指标-完单
// 叠加奖
// 阶梯奖
// export const awardOrderMap = {
//   1: "叠加奖",
//   2: "阶梯奖",
// }

export const awardTypeMap = {
  1: "叠加奖",
  2: "阶梯奖",
  4: "流水分成奖",
}

// 第二步
// 司机类型map
export const driverTypeMap = {
  1: "自营司机",
  2: "自营-主司机",
  3: "自营-副司机",
  4: "UP司机",
  5: "UP-主司机",
  6: "UP-副司机",
}

// 任务触发类型map
export const taskTriggerTypeMap = {
  1: "自动触发",
  2: "主动触发",
}


// 任务触发类型 奖金瓜分
export const taskTriggerTypeReward = {
  1: "自动触发",
  3: "手动报名",
}


// 实时任务map
export const realTimeMap = {
  1: "是",
  2: "否",
}

// 重置周期
export const cycleMap = {
  1: "按天",
  2: "按周",
}

// 星期
export const weekMap = {
  1: "周一",
  2: "周二",
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  0: '周日'
}


export const notifyTypeMap = {
  1: "语音播报",
  2: "消息提醒",
  3: '公告',
  4: '短信',
}

export const broadcastTypeMap = {
  1: "文字录入",
  2: "语音上传",
}

// 订单达成任务条件
export const orderFlowHitRuleMap = {
  1: "接单时间",
  2: "完单时间",
}

export const broadcastTypeOptions = Object.keys(broadcastTypeMap).map(item => ({
  value: Number(item),
  label: broadcastTypeMap[item]
}))

export const notifyTypeOptions = Object.keys(notifyTypeMap).map(item => ({
  value: Number(item),
  label: notifyTypeMap[item]
}))

export const cycleOptions = Object.keys(cycleMap).map(item => ({
  value: Number(item),
  label: cycleMap[item]
}))

export const weekOptions = Object.keys(weekMap).map(item => ({
  value: Number(item),
  label: weekMap[item]
}))

// 任务触发类型options
export const taskTriggerTypeOptions = Object.keys(taskTriggerTypeMap).map(item => ({
  value: Number(item),
  label: taskTriggerTypeMap[item]
}))

// 任务触发类型options 奖金瓜分
export const taskTriggerTypeRewardOptions = Object.keys(taskTriggerTypeReward).map(item => ({
  value: Number(item),
  label: taskTriggerTypeReward[item]
}))


// 司机类型options
export const driverTypeOptions = Object.keys(driverTypeMap).map(item => ({
  value: Number(item),
  label: driverTypeMap[item]
}))

// 实时任务options
export const realTimeOptions = Object.keys(realTimeMap).map(item => ({
  value: Number(item),
  label: realTimeMap[item]
}))


// 产品线options
export const businessLineOptions = Object.keys(businessLineMap).map(item => ({
  value: Number(item),
  label: businessLineMap[item]
}))

// 激励任务-任务指标-流水
// 流水固定奖
// 流水分成奖
// export const awardFlowOptions = Object.keys(awardFlowMap).map(item => ({
//   value: Number(item),
//   label: awardFlowMap[item]
// }))


// 激励任务-任务指标-完单
// 叠加奖
// 阶梯奖
// export const awardOrderOptions = Object.keys(awardOrderMap).map(item => ({
//   value: Number(item),
//   label: awardOrderMap[item]
// }))


// 激励任务-奖励计算方式
export const awardTypeOptions = Object.keys(awardTypeMap).map(item => ({
  value: Number(item),
  label: awardTypeMap[item]
}))
// 任务指标
export const taskStandardOptions = Object.keys(taskStandardMap).map(item => ({
  value: Number(item),
  label: taskStandardMap[item]
}))

//  车辆状态options
export const carStatusOptions = Object.keys(carStatusMap).map(item => ({
  value: Number(item),
  label: carStatusMap[item]
}))

// 任务类型可选数据
export const taskTypeOptions = Object.keys(taskTypeMap).map(item => ({
  value: Number(item),
  label: taskTypeMap[item]
}))

// 订单达成任务条件可选数据
export const orderFlowHitRuleOptions = Object.keys(orderFlowHitRuleMap).map(item => ({
  value: Number(item),
  label: orderFlowHitRuleMap[item]
}))

// // 任务审核状态options
// export const approveStatusOptions = Object.keys(approveStatusMap).map(item => ({
//   value: Number(item),
//   label: approveStatusMap[item]
// }))

// 任务状态可选数据
export const taskStatusOptions = Object.keys(taskStatusMap).map(item => ({
  value: Number(item),
  label: taskStatusMap[item]
}))
taskStatusOptions.unshift({
  value: 10,
  label: '全部'
})


// 学习任务 任务指标
export const taskStandardForStudyOptions = Object.keys(taskStandardForStudyMap).map(item => ({
  value: Number(item),
  label: taskStandardForStudyMap[item]
}))


// 激励任务-任务指标
export const taskStandardForAwardOptions = Object.keys(taskStandardForAwardMap).map(item => ({
  value: Number(item),
  label: taskStandardForAwardMap[item]
}))

//奖金瓜分任务-任务指标
export const taskStandardForBonusOptions = Object.keys(taskStandardForBonusMap).map(item => ({
  value: Number(item),
  label: taskStandardForBonusMap[item]
}))
// 订单来源渠道
export const orderSourceOptions = Object.keys(orderSourceMap).map(item => ({
  value: Number(item),
  label: orderSourceMap[item]
}))
orderSourceOptions.unshift({
  value: 34,
  label: '全部'
})

// 奖励计算方式
export const awardCalculateOptions = Object.keys(awardCalculateMap).map(item => ({
  value: Number(item),
  label: awardCalculateMap[item]
}))


// 表格标题
export const tableTitle = (that) => {
  return [{
      title: "任务编码",
      key: "taskCode",
      tooltip: true,
      width:220
    },
    {
      title: "任务名称",
      key: "taskName",
      tooltip: true,
      minWidth:120
    },
    {
      title: "备注",
      key: "taskRemark",
      tooltip: true,
      minWidth:120
    },
    {
      title: "任务类型",
      key: "taskType",
      width:110,
      render(h, params) {
        return h("div", taskTypeMap[params.row.taskType]);
      }
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      width:100,
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth:240,
      tooltip: true,
    },
    {
      title: "任务起止日期",
      key: "taskStartToEnd",
      tooltip: true,
      width:170,
      render(h, params) {
        return h("div", {}, `${moment(params.row.taskStartDate).format(TIME_FORMAT)} ~ ${moment(params.row.taskEndDate).format(TIME_FORMAT)}`)
      }
    },
    {
      title: "任务状态",
      key: "taskStatus",
      width:100,
      render(h, params) {
        return h("div", taskStatusMap[params.row.taskStatus]);
      }
    },
    {
      title: "操作",
      key: "operate",
      width: 350,
      fixed:'right',
      render: (h, params) => {
        return h("div", {
          class: {
            'operate': true
          }
        }, [
          h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            directives: [{
              name: "hasAuth",
              value: "task-list-detail"
            }],
            on: {
              click: () => {
                that.goDetail(params.row)
              }
            }
          }, "详情"),
          // 任务状态为待审核、审核驳回的任务可编辑；
          (String(params.row.taskStatus) === "3" || String(params.row.taskStatus) === "0") ? h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            style: {
              marginLeft: '8px'
            },
            directives: [{
              name: "hasAuth",
              value: "task-list-edit"
            }],
            on: {
              click: () => {
                that.goEdit(params.row)
              }
            }
          }, "编辑") : '',
          // 待审核&已驳回可以审核
          (String(params.row.taskStatus) === "3" || String(params.row.taskStatus) === "0") ? h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            style: {
              marginLeft: '8px'
            },
            directives: [{
              name: "hasAuth",
              value: "task-list-approve"
            }],
            on: {
              click: () => {
                that.goApprove(params.row)
              }
            }
          }, "提交审核") : '',
          // h("Button", {
          //   props: {
          //     type: "text",
          //     ghost: true,
          //     size: "small"
          //   },
          //   // directives: [{
          //   //   name: "hasAuth",
          //   //   value: "task-list-termination"
          //   // }],
          //   on: {
          //     click: () => {
          //       that.termination(params.row)
          //     }
          //   }
          // }, "终止"),
          // 当任务状态为审核通过、启用时显示该按钮；
          (String(params.row.taskStatus) === "2" || String(params.row.taskStatus) === "4") ? h("Button", {
            props: {
              size: "small",
              type: 'default'
            },
            directives: [{
              name: "hasAuth",
              value: "task-list-disable"
            }],
            style: {
              marginLeft: '8px'
            },
            on: {
              click: () => {
                that.toggleStatus(params.row)
              }
            }
          }, "停用") : "",

          // String(params.row.taskStatus) === "1" ? h("Button", {
          //   props: {
          //     type: "text",
          //     ghost: true,
          //     size: "small"
          //   },
          //   // directives: [{
          //   //   name: "hasAuth",
          //   //   value: "task-list-active"
          //   // }],
          //   on: {
          //     click: () => {
          //       that.toggleStatus(params.row)
          //     }
          //   }
          // }, "启用") : "",
          // String(params.row.approveStatus) === "1" ? h("Button", {
          //   props: {
          //     type: "text",
          //     ghost: true,
          //     size: "small"
          //   },
          //   // directives: [{
          //   //   name: "hasAuth",
          //   //   value: "task-list-approve"
          //   // }],
          //   on: {
          //     click: () => {
          //       that.launchApprove(params.row)
          //     }
          //   }
          // }, "审核") : "",
          // h("Button", {
          //   props: {
          //     type: "text",
          //     ghost: true,
          //     size: "small"
          //   },
          //   // directives: [{
          //   //   name: "hasAuth",
          //   //   value: "task-list-delete"
          //   // }],
          //   on: {
          //     click: () => {
          //       that.deleteTask(params.row)
          //     }
          //   }
          // }, "删除"),
          h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            style: {
              marginLeft: '8px'
            },
            directives: [{
              name: "hasAuth",
              value: "task-list-copy"
            }],
            on: {
              click: () => {
                that.copyTask(params.row)
              }
            }
          }, "复制"),
          // String(params.row.taskStatus) === "1" ? h("Button", {
          //   props: {
          //     type: "text",
          //     ghost: true,
          //     size: "small"
          //   },
          //   // directives: [{
          //   //   name: "hasAuth",
          //   //   value: "task-list-off"
          //   // }],
          //   on: {
          //     click: () => {
          //       that.offTask(params.row)
          //     }
          //   }
          // }, "下架") : "",
          h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            style: {
              marginLeft: '8px'
            },
            directives: [{
              name: "hasAuth",
              value: "task-list-log"
            }],
            on: {
              click: () => {
                that.viewLog(params.row)
              }
            }
          }, "日志"),
        // 任务状态为待审核、
        String(params.row.taskStatus) === "0" ? h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            style: {
              marginLeft: '8px'
            },
            // directives: [{
            //   name: "hasAuth",
            //   value: "task-list-delete"
            // }],
            on: {
              click: () => {
                that.deleteTask(params.row)
              }
            }
          }, "删除") : '',
        ])
      }
    }
  ]
}

// 列表数据
export const listPageData = {
  queryParams: {}, // 查询条件obj
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  tableColumnsChecked: Object.keys(tableTitle)
}

// 查询条件
export const inputList = [{
    name: "text-input", // 文本输入框名
    bind_key: "taskName", // 返回数据的key名
    placeholder: "请输入任务名称",
    value: "", // 用于数据绑定
    title: "任务名称：",
    maxlength: 20
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "taskType", // 返回数据的key名
    placeholder: "请选择",
    value: '', // 用于数据绑定
    title: "任务类型：", // 展示的字段名
    dropList: taskTypeOptions
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityCode", // 返回数据的key名
    placeholder: "请选择",
    value: '', // 用于数据绑定
    title: "城市：", // 展示的字段名
    dropList: []
  },
  // {
  //   name: "cascader-input", // 文本输入框名
  //   bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
  //   placeholder: "",
  //   value: [''], // 绑定返回数据
  //   cascaderList: [], // 级联列表
  //   title: "城市：",
  //   changeOnSelect: true
  // },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "agentUuidList", // 返回数据的key名
    placeholder: "请选择",
    value: [], // 用于数据绑定
    title: "运营商：", // 展示的字段名
    dropList: [],
    multiple: true,
    needDisabled: false,
    disabledIndex: ''
  },
  // {
  //   name: "drop-input", // 文本输入框名
  //   bind_key: "approveStatus", // 返回数据的key名
  //   placeholder: "请选择",
  //   value: "", // 用于数据绑定
  //   title: "任务审核状态：", // 展示的字段名
  //   dropList: approveStatusOptions,
  //   titleWidth: 100
  // },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "taskStatus", // 返回数据的key名
    placeholder: "请选择",
    value: '', // 用于数据绑定
    title: "任务状态：", // 展示的字段名
    dropList: taskStatusOptions,
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "taskRemark", // 返回数据的key名
    placeholder: "请输入备注",
    value: "", // 用于数据绑定
    title: "备注：",
    maxlength: 50
  },
]

// 校验任务名称
const validTaskName = (rule, params, callback) => {
  if (!params) {
    callback(new Error("请输入任务名称,20字内"))
  } else if (params.length > 20) {
    callback(new Error("请输入任务名称,20字内"));
  } else {
    callback()
  }
}


// 日志列表数据
export const logPageData = {
  queryParams: {}, // 查询条件obj
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
}

// 日志表格标题
export const logTableTitle = () => {
  return [{
      title: "ID",
      key: "id",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("div", {}, params.row.index)
      }
    },
    {
      title: "操作类型",
      key: "operateType",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("div", {}, operateTypeMap[params.row.operateType])
      }
    },
    {
      title: "操作内容",
      key: "operateItem",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("div", {}, params.row.operateItem)
      }
    },
    {
      title: "操作时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("div", {}, moment(params.row.updateTime).format(TIME_FORMAT))
      }
    },
    {
      title: "操作人",
      key: "operatorName",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("div", {}, params.row.operatorName)
      }
    },
    {
      title: "IP地址",
      key: "ip",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        return h("div", {}, params.row.ip)
      }
    }
  ]
}



// 校验任务类型
const validTaskType = (rule, params, callback) => {
  if (!params) {
    callback(new Error("请选择任务类型"))
  } else {
    callback()
  }
}

const validCityCode = (rule, params, callback) => {
  if (!params) {
    callback(new Error("请选择城市"))
  } else {
    callback()
  }
}

const validAgent = (rule, params, callback) => {
  if (!params || !params[0]) {
    callback(new Error("请选择运营商"))
  } else {
    callback()
  }
}

const validTaskDesc = (rule, params, callback) => {
  if (!params) {
    callback(new Error("请输入任务描述,2000字内"))
  } else if (params.length > 2000) {
    callback(new Error("请输入任务描述,2000字内"))
  } else {
    callback()
  }
}

const validFence = (that) => (rule, params, callback) => {
  if (!that.addData.selectedList || !that.addData.selectedList['fence'] || that.addData.selectedList['fence'].length === 0) {
    callback(new Error("请选择电子围栏"))
  } else {
    callback()
  }
}

const validTaskStandard = (rule, params, callback) => {
  if (!params) {
    callback(new Error("请选择任务指标"))
  } else {
    callback()
  }
}
const validOrderFlowHitRule = (rule, params, callback) => {
  if (!params) {
    callback(new Error("请选择订单命中任务配置"))
  } else {
    callback()
  }
}

const validCarStatus = (rule, params, callback) => {
  if (!params || params.length === 0) {
    callback(new Error("请选择车辆状态"))
  } else {
    callback()
  }
}


// step1 form valid
export const step1Rules = (that) => {
  return {
    // 任务名称
    taskName: [{
      validator: validTaskName
    }],
    // 任务类型
    taskType: [{
      validator: validTaskType
    }],
    // 城市
    cityCode: [{
      validator: validCityCode
    }],
    // 运营商
    agentUuidList: [{
      validator: validAgent
    }],
    // // 任务描述
    // taskDescribe: [{
    //   validator: validTaskDesc
    // }],
    // 电子围栏
    taskFence: [{
      validator: validFence(that)
    }],
    // 任务指标
    taskStandard: [{
      validator: validTaskStandard
    }],
    // 车辆状态
    validCarStatus: [{
      validator: validCarStatus
    }],
  }
}

const validTaskTime = (that) => (rule, params, callback) => {
  if (!that.addData.startDate) {
    callback(new Error("请选择开始日期"))
  } else if (!that.addData.endDate) {
    callback(new Error("请选择结束日期"))
  } else {
    callback()
  }
}
const validSignUpTime = (that) => (rule, params, callback) => {
  if (!that.addData.applyStartDate) {
    callback(new Error("请选择开始时间"))
  } else if (!that.addData.applyEndDate) {
    callback(new Error("请选择结束时间"))
  } else {
    callback()
  }
}
const validShowTime = (that) => (rule, params, callback) => {
  if (!that.addData.showTime) {
    callback(new Error("请选择任务在司机APP端显示时间"))
  }  else {
    callback()
  }
}


const validStartDate = (that) => (rule, params, callback) => {
  if (!that.addData.startDate) {
    callback(new Error("请选择开始日期"))
  } else {
    callback()
  }
}


const validEndDate = (that) => (rule, params, callback) => {
  if (!that.addData.endDate) {
    callback(new Error("请选择结束日期"))
  } else {
    callback()
  }
}

const validNotifyType = (rule, params, callback) => {
  if (!params || params.length === 0) {
    callback(new Error("请至少选择一个终端"))
  } else {
    callback()
  }
}

const validEnableContent = (that) => (rule, params, callback) => {
  if (!that.addData.broadcast.enableContent) {
    callback(new Error("请输入启用播报内容"))
  } else if (that.addData.broadcast.enableContent.length > 100) {
    callback(new Error("启用播报内容最大限制100字符"))
  } else {
    callback()
  }
}

const validDisableContent = (that) => (rule, params, callback) => {
  if (that.addData.broadcast.disableContent && that.addData.broadcast.disableContent.length > 100) {
    callback(new Error("停用播报内容最大限制100字符"))
  } else {
    callback()
  }
}


const validMessageEnableContent = (that) => (rule, params, callback) => {
  if (!that.addData.message.content) {
    callback(new Error("请输入启用消息内容"))
  } else if (that.addData.message.content.length > 100) {
    callback(new Error("任务启用消息内容最大限制100字符"))
  } else {
    callback()
  }
}

const validMessageDisableContent = (that) => (rule, params, callback) => {
  if (that.addData.message.disableContent && that.addData.message.disableContent.length > 100) {
    callback(new Error("任务停用消息内容最大限制100字符"))
  } else {
    callback()
  }
}

const validNotifyTitle = (that) => (rule, params, callback) => {
  if (!that.addData.notify.title) {
    callback(new Error("公告标题必填"))
  } else if (that.addData.notify.title.length > 100) {
    callback(new Error("公告标题最大限制100字符"))
  } else {
    callback()
  }
}

const validWeek = (that) => (rule, params, callback) => {
  if (that.addData.cycle === 2 && (!that.addData.week || that.addData.week.length === 0)) {
    callback(new Error("请选择重复间隔周数"))
  } else {
    callback()
  }
}

const validDay = (that) => (rule, params, callback) => {
  if (that.addData.cycle === 1 && (!that.addData.day)) {
    callback(new Error("请选择重置周期天数"))
  } else {
    callback()
  }
}

const validWeekPeriod = (that) => (rule, params, callback) => {
  if (that.addData.cycle === 2 && (!that.addData.weekPeriod)) {
    callback(new Error("请选择重置间隔周数"))
  } else {
    callback()
  }
}

const validApplyLimit = (that) => (rule, params, callback) => {
  if (String(params).indexOf('.') > -1 ) {
    callback(new Error("请输入大于0的整数"))
  } else {
    callback()
  }
}


// step2 form valid
export const step2Rules = (that) => {
  return {
    // 通知终端
    notifyType: [{
      validator: validNotifyType
    }],
    // 开始日期-结束日期
    taskTime: [{
      validator: validTaskTime(that)
    }],
    // 开始日期-结束日期
    signUpTime: [{
      validator: validSignUpTime(that)
    }],
    // app展示时间
    showTime: [{
      validator: validShowTime(that)
    }],
    // 任务启用播报内容
    enableContent: [{
      validator: validEnableContent(that)
    }],
    // 停用播报内容
    disableContent: [{
      validator: validDisableContent(that)
    }],
    // 任务启用消息内容
    messageEnableContent: [{
      validator: validMessageEnableContent(that)
    }],
    // 停用消息内容
    messageDisableContent: [{
      validator: validMessageDisableContent(that)
    }],
    // 公告标题
    notifyTitle: [{
      validator: validNotifyTitle(that)
    }],
    // 重复间隔周几
    week: [{
      validator: validWeek(that)
    }],
    // day
    day: [{
      validator: validDay(that)
    }],
    // 重复间隔周数
    weekPeriod: [{
      validator: validWeekPeriod(that)
    }],
    // 手动报名人数上限
    applyLimit: [{
      validator: validApplyLimit(that)
    }],
  }
}



const validBusinessLineList = (that) => (rule, params, callback) => {
  if (!that.addData.businessLineList || that.addData.businessLineList.length === 0) {
    callback(new Error("请选择产品线"))
  } else {
    callback()
  }
}
const validTaskStandardList = (that) => (rule, params, callback) => {
  if (!that.addData.taskStandardList || that.addData.taskStandardList.length === 0) {
    callback(new Error("请选择任务指标"))
  } else {
    callback()
  }
}

const validOrderSourceList = (that) => (rule, params, callback) => {
  if (!that.addData.orderSourceList || that.addData.orderSourceList.length === 0) {
    callback(new Error("请选择订单渠道"))
  } else {
    callback()
  }
}


const validAwardCalculate = (that) => (rule, params, callback) => {
  if (!that.addData.awardCalculate) {
    callback(new Error("请选择奖励计算方式"))
  } else {
    callback()
  }
}

const validShareStartAmount = (that) => (rule, params, callback) => {
  if (!params ||
    params < 0.01 ||
    params > 100000 ||
    (String(params).indexOf('.') > -1 &&
      String(params).split('.')[1].length > 2)) {
    callback(new Error(`流水金额只能输入0.01-100000之间的数，如是小数，只能保留两位`))
    return
  }
  callback()
}
const validOnlineDays = (that) => (rule, params, callback) => {
  if (!params ||
    params < 1 ||
    params > 100000 ||
    (String(params).indexOf('.') > -1)) {
    callback(new Error(`在线天数只能输入1-100000之间的整数`))
    return
  }
  callback()
}
const validOnlineDuration = (that) => (rule, params, callback) => {
  if (!params ||
    params < 0.01 ||
    params > 24 ||
    (String(params).indexOf('.') > -1 &&
      String(params).split('.')[1].length > 2)) {
    callback(new Error(`在线时长只能输入0.01-24之间的数，如是小数，只能保留两位`))
    return
  }
  callback()
}
const validShareProportion = (that) => (rule, params, callback) => {
  // 流水分成奖
  if (that.addData.awardCalculate === 4) {
    if (!params ||
      params < 0.01 ||
      params > 100 ||
      (String(params).indexOf('.') > -1 &&
        String(params).split('.')[1].length > 2)) {
      callback(new Error(`流水分成只能输入0.01-100之间的数，如是小数，只能保留两位`))
      return
    }
    callback()
  }
  callback()
}

const validCompleteCount = (that) => (rule, params, callback) => {
  if (params === null || params === "" || params === undefined || String(params).indexOf('.') > -1) {
    callback(new Error(`请输入完单数，完单数不能输入小数`))
    return
  }
  callback()
}

const validRewardTotalAmount = (rule, params, callback) => {
  if (!params || params > 99999999 ||(String(params).indexOf('.') > -1)) {
    callback(new Error(`请输入奖金池0-99999999的数值`))
    return
  }
  callback()
}
// step3 form valid
export const step3Rules = (that) => {
  return {
    businessLineList: [{
      validator: validBusinessLineList(that)
    }],
    taskStandardList: [{
      validator: validTaskStandardList(that)
    }],
    orderSourceList: [{
      validator: validOrderSourceList(that)
    }],
    awardCalculate: [{
      validator: validAwardCalculate(that)
    }],
    shareStartAmount: [{
      validator: validShareStartAmount(that)
    }],
    onlineDays:[{
      validator: validOnlineDays(that)
    }],
    onlineDuration:[{
      validator: validOnlineDuration(that)
    }],
    completeCount: [{
      validator: validCompleteCount(that)
    }],
    shareProportion: [{
      validator: validShareProportion(that)
    }],
    // 订单命中任务配置：
    orderFlowHitRule: [{
      validator: validOrderFlowHitRule
    }],
    rewardTotalAmount: [{
      validator: validRewardTotalAmount
    }],
     // 任务指标
     taskStandard: [{
      validator: validTaskStandard
    }],
  }
}

export const copyRuleValidate = (that) => {
  return {
    // 任务名称
    taskName: [{
      validator: validTaskName
    }],
    // 开始日期-结束日期
    startDate: [{
      validator: validStartDate(that)
    }],
    // endDate
    endDate: [{
      validator: validEndDate(that)
    }],
  }
}

// 流水分成奖励方式
export const orderFlowMap = [
  {
    label: "奖励方式一配置",
    value: 1
  },
  {
    label: "奖励方式二配置",
    value: 2
  }
]

