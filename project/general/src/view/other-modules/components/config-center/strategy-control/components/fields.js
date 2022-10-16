import {
  getBusinessLine,
  carTypeMapAll,
  getCarLevelList
} from "_g/config/status-map";
import { mapToList } from "@/libs/util.js";
import {defaultRuleList} from "../fields"
import { freeze } from "@/mixins/base";
// 系统策略表格控制
export const serviceTypeMap = {
  1: "出租车",
  2: "专享",
  4: "快享",
  8: "包车",
  11: "企业用车",
  5: "顺风车"
}
export const serviceTypeMapForDriverCancel = {
  2: "专享",
  4: "快享",
  10: "包车",
  14: "企业用车"
}
// 全部车型等级 {"1#1" : "xxx", "2#1": "xxxx"}
export const carTypeMap = carTypeMapAll
// 全部车型等级options
export const carTypeOptions = {
  2: getCarLevelList(2),
  4: getCarLevelList(4),
}
let orderTypeMap = {
  1: "实时",
  2: "预约"
}
let statusMap = {
  "1": "生效中",
  "-2": "已失效",
  "0": "未开始"
}
let statusList = [{
  value: 0,
  label: "未开始"
},
{
  value: 1,
  label: "生效中"
},
{
  value: -2,
  label: "已失效"
}
]
// 司机取消策略
let statusMap2 = {
  "-1": " 删除",
  "1": "生效中",
  "-2": "已失效",
  "0": "未开始",
}
let statusList2 = [{
  value: 0,
  label: "未开始"
},
{
  value: 1,
  label: "生效中"
},
{
  value: -2,
  label: "已失效"
}
]
// 业务线
let businessTypeList = [{
  value: 4,
  label: "快享"
},
{
  value: 2,
  label: "专享"
},
{
  value: 1,
  label: "出租车"
}
]
// 业务线
let businessTypeList2 = [{
  value: 4,
  label: "快享"
},
{
  value: 2,
  label: "专享"
},
{
  value: 10,
  label: "包车"
},
{
  value: 14,
  label: "企业用车"
},
]
// 业务线
let businessTypeList3 = [{
  value: "4",
  label: "快享"
},
{
  value: "2",
  label: "专享"
},
{
  value: "1",
  label: "出租车"
},
{
  value: "5",
  label: "顺风车"
}
]

// 预约单改派-产品线
let bookingLine = getBusinessLine([4, 2])
export const bookingLineList = bookingLine.list
export const bookingLineMap = bookingLine.map
// 预约单改派-状态
let bookingStatusMap = {
  0: "已停用",
  1: "已启用"
}
const bookingStatusList = []
Object.keys(bookingStatusMap).forEach(key => {
  bookingStatusList.push({
    value: Number(key),
    label: bookingStatusMap[key]
  })
})

export const typeTripMap = {
  0: "普通场景",
  4: "接机",
  5: "送机",
  6: "接站",
  7: "送站"
}
export const typeTripList = mapToList(typeTripMap)

// 乘客取消订单
let index = {
  title: "序号",
  type: "index",
  width: 80,
  align: "center"
}
let cityName = {
  title: "适用城市",
  key: "cityName",
  tooltip: true,
  minWidth: 100
}
let expandBizLine = {
  title: "业务线",
  key: "expandBizLine",
  tooltip: true,
  minWidth: 100,
  render: (h, params) => {
    return h("div", serviceTypeMap[params.row.businessType] || "")
  }
}
let businessType = {
  title: "产品线",
  key: "businessType",
  tooltip: true,
  minWidth: 100,
  render: (h, params) => {
    return h("div", serviceTypeMap[params.row.businessType] || "")
  }
}
let carType = {
  title: "车型等级",
  key: "carLevel",
  tooltip: true,
  minWidth: 100,
  render: (h, params) => {
    return h("div", carTypeMap[params.row.businessType + "#" + params.row.carLevel] || "")
  }
}
let typeTime = {
  title: "订单类型",
  key: "typeTime",
  tooltip: true,
  minWidth: 120,
  render: (h, params) => {
    return h("div", orderTypeMap[params.row.typeTime] || "")
  }
}
let strategyName = {
  title: "策略名称",
  key: "strategyName",
  tooltip: true,
  minWidth: 170
}
let effectiveTime = {
  title: "生效时间",
  key: "effectiveTime",
  tooltip: true,
  minWidth: 160
}
let updateTime = {
  title: "更新时间",
  key: "updateTime",
  tooltip: true,
  minWidth: 160
}
let status = {
  title: "状态",
  key: "status",
  tooltip: true,
  minWidth: 90,
  render: (h, params) => {
    return h("div", statusMap[String(params.row.status)] || "已失效")
  }
}
// 司机取消策略
let status2 = {
  title: "状态",
  key: "status",
  tooltip: true,
  minWidth: 90,
  render: (h, params) => {
    return h("div", statusMap2[String(params.row.status)] || "已失效")
  }
}
let updater = {
  title: "操作人",
  key: "updater",
  tooltip: true,
  minWidth: 90
}
let versionName = {
  title: "版本号",
  key: "versionName",
  tooltip: true,
  minWidth: 90
}
// 司机取消订单
let cityName2 = {
  title: "城市",
  key: "cityName",
  tooltip: true,
  minWidth: 100
}
let ruleName = {
  title: "策略名称",
  key: "ruleName",
  tooltip: true,
  minWidth: 150
}
let serviceType2 = {
  title: "产品线",
  key: "serviceType",
  ellipsis: true,
  tooltip: true,
  minWidth: 120,
  render: (h, params) => {
    let Text = serviceTypeMapForDriverCancel[params.row.businessType]
    return h("div", Text)
  }
}
let versionNumber = {
  title: "版本号",
  key: "version",
  tooltip: true,
  minWidth: 90
}
let nightServiceBeginTime = {
  title: "夜晚服务时间段",
  key: "nightServiceBeginTime",
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h("div", params.row.nightServiceEndTime ? (params.row.nightServiceBeginTime + " - " + params.row.nightServiceEndTime) : "")
  }
}
let morningPeakBeginTime = {
  title: "早高峰时段",
  key: "morningPeakBeginTime",
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h("div", params.row.morningPeakEndTime ? (params.row.morningPeakBeginTime + " - " + params.row.morningPeakEndTime) : "")
  }
}
let eveningPeakBeginTime = {
  title: "晚高峰时段",
  key: "eveningPeakBeginTime",
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h("div", params.row.eveningPeakEndTime ? (params.row.eveningPeakBeginTime + " - " + params.row.eveningPeakEndTime) : "")
  }
}
let otherPeakBeginTime = {
  title: "其他高峰时段",
  key: "otherPeakBeginTime",
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h("div", params.row.otherPeakEndTime ? (params.row.otherPeakBeginTime + " - " + params.row.otherPeakEndTime) : "")
  }
}
let source = {
  title: "用车渠道",
  key: "sourceName",
  minWidth: 120
}
let typeTrip = {
  title: "用车场景",
  key: "typeTrip",
  minWidth: 120,
  render: (h, { row }) => {
    let Text = typeTripMap[row.typeTrip]
    return h("div", Text)
  }
}

let detailBtn = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "info",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: false,
          item: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}

let copyBtn = (that, params, type) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          item: params.row
        }
        that.$emit("copyNew", obj)
      }
    }
  }
}

let editBtn = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: true,
          item: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}
let deleteBtn = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "error",
      ghost: true,
      size: "small"
    },
    style: {
      display: Number(params.row.status) === 0 ? "inline-block" : "none"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type
        }
        that.$emit("axiosDelete", obj)
      }
    }
  }
}
// 表格columns
// 乘客取消策略
export const cancelColumns = (that) => {
  return {
    index,
    strategyName,
    expandBizLine: {
      title: "业务线",
      key: "expandBizLine",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        const { businessKeyValue } = that.businessGradeName
        return h("div", businessKeyValue[expandBizLine] || "")
      }
    },
    businessType: {
      title: "产品线",
      key: "businessType",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { row: { businessType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("div", productKeyValue[businessType] || "")
      }
    },
    typeTime,
    carType: {
      title: "车型等级",
      key: "carLevel",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { row: { businessType, carLevel }} = params
        const { productCarKeyValue } = that.businessGradeName
        return h("div", productCarKeyValue[`${businessType}#${carLevel}`]
          || "")
      }
    },
    source,
    typeTrip,
    cityName,
    effectiveTime,
    status,
    updater,
    versionName,
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 240,
      render: (h, params) => {
        return h("div", [
          h("Button", detailBtn(that, params, "1", "cancelDetail"), "详情"),
          h("Button", editBtn(that, params, "1", "cancelEdit"), "编辑"),
          h("Button", copyBtn(that, params, "1"), "复制"),
          h("Button", deleteBtn(that, params, "1", "cancelEdit"), "删除")
        ])
      }
    }
  }
}
// 司机取消策略
export const deviateColumns = (that) => {
  return {
    index,
    ruleName,
    cityName2,
    expandBizLine: {
      title: "业务线",
      key: "expandBizLine",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        const { businessKeyValue } = that.businessGradeName
        return h("div", businessKeyValue[expandBizLine] || "")
      }
    },
    serviceType2: {
      title: "产品线",
      key: "serviceType",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        const { row: { businessType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("div", productKeyValue[businessType] || "")
      }
    },
    source,
    typeTrip,
    effectiveTime,
    status2,
    updater,
    versionNumber,
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 240,
      render: (h, params) => {
        return h("div", [
          h("Button", detailBtn(that, params, "2", "driverCancelDetail"), "详情"),
          h("Button", editBtn(that, params, "2", "driverCancelEdit"), "编辑"),
          h("Button", copyBtn(that, params, "2"), "复制"),
          h("Button", deleteBtn(that, params, "2", "alarmDelite"), "删除")
        ])
      }
    }
  }
}
// 时间段及高峰策略
export const timeColumns = (that) => {
  return {
    index,
    cityName,
    strategyName,
    // nightServiceBeginTime,
    morningPeakBeginTime: {
      ...morningPeakBeginTime,
      title: "工作日" + morningPeakBeginTime.title,
      render: (h, {row: { workTimePeakList: [obj] }}) => {
        return h("div", obj && obj.morningPeakBeginTime ? (obj.morningPeakBeginTime + " - " + obj.morningPeakEndTime) : "")
      }
    },
    eveningPeakBeginTime: {
      ...eveningPeakBeginTime,
      title: "工作日" + eveningPeakBeginTime.title,
      render: (h, {row: { workTimePeakList: [obj] }}) => {
        return h("div", obj && obj.eveningPeakBeginTime ? (obj.eveningPeakBeginTime + " - " + obj.eveningPeakEndTime) : "")
      }
    },
    otherPeakBeginTime: {
      ...otherPeakBeginTime,
      title: "工作日" + otherPeakBeginTime.title,
      render: (h, {row: { workTimePeakList: [obj] }}) => {
        return h("div", obj && obj.otherPeakBeginTime ? (obj.otherPeakBeginTime + " - " + obj.otherPeakEndTime) : "")
      }
    },
    effectiveTime,
    status,
    updater,
    versionName,
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (h, params) => {
        return h("div", [
          h("Button", detailBtn(that, params, "3", "timeDetail"), "详情"),
          // h('Button',editBtn(that,params,'3') , '编辑')
          h("Button", deleteBtn(that, params, "3", "timeDelete"), "删除")
        ])
      }
    }
  }
}

let editPriority = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: true,
          rowData: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}
let deletePriority = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "error",
      ghost: true,
      size: "small"
    },
    style: {
      display: Number(params.row.status) === 1 ? "inline-block" : "none"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type
        }
        that.$emit("axiosDelete", obj)
      }
    }
  }
}
export const channelDropList = [{ // 三方平台优先级-订单渠道 当前只有一个选项
  value: 1,
  label: "高德运营"
}]
export const tacticColumns = (that) => {
  return {
    index,
    channel: {
      title: "订单渠道",
      key: "orderChannel",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let finds = channelDropList.find(it => it.value - params.row.orderChannel === 0)
        return h("div", finds ? finds.label : "暂无")
      }
    },
    city: {
      title: "适用城市",
      key: "cityName",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let {
          row
        } = params
        return h("div", `${row.provinceName}${row.cityName}`)
      }
    },
    ratio: {
      title: "系数",
      key: "coefficient",
      tooltip: true,
      minWidth: 80
    },
    updateTime: {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 100
    },
    operator: {
      title: "操作人",
      key: "updaterName",
      tooltip: true,
      minWidth: 80
    },
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (h, params) => {
        return h("div", [
          h("Button", editPriority(that, params, "4", "priorityEdit"), "编辑"),
          h("Button", deletePriority(that, params, "4", "priorityDelete"), "删除")
        ])
      }
    }
  }
}
export const bookingColumns = (that) => {
  return {
    index,
    cityName,
    expandBizLine: {
      title: "业务线",
      key: "expandBizLine",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        const { businessKeyValue } = that.businessGradeName
        return h("div", businessKeyValue[expandBizLine] || "")
      }
    },
    businessType: {
      title: "产品线",
      key: "businessType",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { row: { businessType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("div", productKeyValue[businessType] || "")
      }
    },
    reassignTimeLimit: {
      title: "改派时间限制(分钟)",
      key: "reassignTimeLimit",
      tooltip: true,
      minWidth: 120
    },
    reassignFrequencyLimit: {
      title: "每日改派次数上限",
      key: "reassignFrequencyLimit",
      tooltip: true,
      minWidth: 120
    },
    status: {
      ...status,
      render: (h, params) => {
        return h("div", bookingStatusMap[params.row.status])
      }
    },
    updateTime: {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 140
    },
    updater,
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (h, params) => {
        let text = "停用"
        let type = "error"
        let status = 0
        if (params.row.status === 0) {
          text = "启用"
          type = "info"
          status = 1
        }
        return h("div", [
          h("Button", {
            "class": {
              tableBtn: true
            },
            props: {
              type: type,
              ghost: true,
              size: "small"
            },
            directives: [{
              name: "hasAuth",
              value: "strategy_control-bookingShift"
            }],
            on: {
              click: () => {
                let obj = {
                  uuid: params.row.uuid || null,
                  status
                }
                that.$emit("axiosShift", obj)
              }
            }
          }, text),
          h("Button", editBtn(that, params, "7", "bookingEdit"), "编辑")
        ])
      }
    }
  }
}

// 搜索列表
// 城市条件搜索
export let cityObj = {
  name: "cascader-input", // 文本输入框名
  bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
  placeholder: "请选择省/市",
  value: [], // 绑定返回数据
  cascaderList: [], // 级联列表
  title: "省 / 市：", // 展示的字段名
  changeOnSelect: true,
  filterable: true,
  trigger: "click"
}
// 城市条件搜索-只返回城市code
export let openCityObj = {
  name: "drop-input", // 文本输入框名
  bind_key: "cityCode", // 返回数据的key名
  dropList: []
}
// 状态条件搜索
let statusObj = {
  name: "drop-input",
  bind_key: "status",
  placeholder: "请选择状态",
  value: "",
  titleWidth: 50,
  dropList: statusList,
  title: "状态：",
  inputWidth: 120
}
// 状态条件搜索-司机取消警策略
let statusObj2 = {
  name: "drop-input",
  bind_key: "status",
  placeholder: "请选择状态",
  value: "",
  titleWidth: 40,
  dropList: statusList2,
  title: "状态：",
  inputWidth: 120
}
// 产品线车型等级搜索
export let productLine = {
  key: "productLine",
  name: "cascader-input", // 文本输入框名
  bind_key: ["expandBizLine", "businessType", "carLevel"], // 返回数据的key名
  placeholder: "请选择产品线/车型等级",
  value: [], // 绑定返回数据
  cascaderList: [
  ], // 级联列表
  title: "业务线/产品线/车型等级：", // 展示的字段名
  titleWidth: 150,
  changeOnSelect: false
}
// 策略名称
let nameObj = {
  name: "text-input",
  bind_key: "strategyName",
  placeholder: "请输入策略名称",
  value: "",
  title: "策略名称："
}
let nameObj2 = {
  name: "text-input",
  bind_key: "ruleName",
  placeholder: "请输入策略名称",
  value: "",
  title: "策略名称：",
}
export const channelObj = {
  name: "drop-input",
  bind_key: "source",
  placeholder: "请选择用车渠道",
  value: "",
  dropList: [],
  title: "用车渠道："
}
// export const businessLine = {
//   name: "drop-input",
//   bind_key: "source",
//   placeholder: "请选择业务线",
//   value: "",
//   dropList: [],
//   title: "业务线："
// }
let sceneObj = {
  name: "drop-input",
  bind_key: "typeTrip",
  placeholder: "请选择用车场景",
  value: "",
  dropList: typeTripList,
  title: "用车场景："
}
// 乘客取消策略-inputlist
let cancelInputList = [
  {
    ...nameObj
  },
  {
    ...cityObj
  },
  {
    key: "productLine",
    name: "cascader-input", // 文本输入框名
    bind_key: ["expandBizLine", "businessType", "carLevel"], // 返回数据的key名
    placeholder: "请选择产品线/车型等级",
    value: [], // 绑定返回数据
    cascaderList: [
    ], // 级联列表
    title: "业务线/产品线/车型等级：", // 展示的字段名
    titleWidth: 150,
    changeOnSelect: false
  },
  { ...channelObj },
  { ...sceneObj },
  {
    ...statusObj
  }

]
// 司机取消策略-inputlist
let deviateInputList = [
  {
    ...nameObj2
  },
  {
    ...cityObj
  },
  {
    key: "expandBizLine",
    name: "drop-input", // 文本输入框名
    bind_key: "expandBizLine", // 返回数据的key名
    placeholder: "请选择产品线",
    value: "", // 绑定返回数据
    dropList: [
    ], // 级联列表
    title: "业务线：", // 展示的字段名
    titleWidth: 80,
    changeOnSelect: false
  },
  {
    key: "partProductLine",
    name: "drop-input", // 文本输入框名
    bind_key: "businessType", // 返回数据的key名
    placeholder: "请选择产品线",
    value: "", // 绑定返回数据
    dropList: [
    ], // 级联列表
    title: "产品线：", // 展示的字段名
    titleWidth: 80,
    changeOnSelect: false
  },
  // {
  //   name: "drop-input",
  //   bind_key: "businessType",
  //   placeholder: "请选择产品线",
  //   value: "",
  //   dropList: [{
  //     value: 4,
  //     label: "快享"
  //   },
  //   {
  //     value: 2,
  //     label: "专享"
  //   },
  //   {
  //     value: 10,
  //     label: "包车"
  //   },
  //   {
  //     value: 14,
  //     label: "企业用车"
  //   }
  //   ],
  //   title: "产品线：",
  //   inputWidth: 150
  // },
  { ...channelObj },
  { ...sceneObj },
  {
    ...statusObj2
  }
]
let timeInputList = [{
  ...cityObj
},
{
  ...statusObj
},
{
  ...nameObj
}
]
let pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
// 乘客取消策略
export const cancelData = {
  searchData: {},
  inputList: cancelInputList,
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}
// 司机取消策略
export const deviateData = {
  searchData: {},
  inputList: deviateInputList,
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}
export const timeData = {
  searchData: {},
  inputList: timeInputList,
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}

export const tacticData = {
  searchData: {},
  inputList: [{
    name: "drop-input",
    bind_key: "channelSource",
    placeholder: "请选择",
    value: "",
    titleWidth: 70,
    dropList: channelDropList,
    title: "订单渠道：",
    inputWidth: 140
  }, {
    ...cityObj,
    // changeOnSelect: false,
    title: "适用城市",
    placeholder: "请选择",
    inputWidth: 140
  }],
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}

// 订单热区价值对象
// 产品线list
export const serviceTypeList = [{
  value: 4,
  label: "快享"
},
{
  value: 2,
  label: "专享"
},
{
  value: 1,
  label: "出租车"
}
]
// 订单热区价值对象
export const hotAreaData = {
  searchData: {},
  inputList: [{
    name: "drop-input",
    bind_key: "serviceType",
    placeholder: "请选择",
    value: "",
    titleWidth: 70,
    dropList: serviceTypeList,
    title: "产品线：",
    inputWidth: 140
  }, {
    ...cityObj,
    // changeOnSelect: false,
    title: "适用城市",
    placeholder: "请选择",
    inputWidth: 140,
    changeOnSelect: false,
    value: [],
    titleWidth: 70
  }],
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}
// 订单热区价值对象
export const orderPriorityData = {
  searchData: {},
  inputList: [{
    name: "drop-input",
    bind_key: "serviceType",
    placeholder: "请选择",
    value: "",
    titleWidth: 70,
    dropList: serviceTypeList,
    title: "产品线：",
    inputWidth: 140
  }, {
    ...cityObj,
    // changeOnSelect: false,
    title: "适用城市",
    changeOnSelect: false,
    placeholder: "请选择",
    inputWidth: 140,
    value: [],
    titleWidth: 70
  }],
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}
// 校验等级
export const validLevel = (rule, value, callback) => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    callback(new Error("等级必须为数值类型"))
    return false
  }
  if (newValue < 0) {
    callback(new Error("等级数值必须大于0"))
    return false
  }
  const splitValue = String(value).split(".")
  if (splitValue.length === 2 && splitValue[1].length > 2) {
    callback(new Error("等级数值仅限精确至小数点后两位"))
    return false
  }
  callback()
}
// 校验系数
export const validCofficient = (rule, value, callback) => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    callback(new Error("系数必须为数值类型"))
    return false
  }
  if (newValue < 0.1 || newValue > 2.0) {
    callback(new Error("系数仅可输入0.1到2.0之间的数值"))
    return false
  }
  const splitValue = String(value).split(".")
  if (splitValue.length === 2 && splitValue[1].length > 2) {
    callback(new Error("系数仅限精确至小数点后两位"))
    return false
  }
  callback()
}

let hotAreaModelData = {
  serviceType: "",
  city: [],
  // 可以选择的热力值等级策略表单
  // 模板
  levelData: [{
    level: {
      from: "",
      to: ""
    },
    coefficient: ""
  }]
}
let hotAreaRules = {
  // 产品线
  serviceType: [{
    required: true,
    message: "请选择产品线"
  }],
  // 适用城市
  city: [{
    required: true,
    message: "请选择城市"
  }],
  levelData: {
    // 等级
    level: [{
      required: true,
      message: "请输入热力值"
    },
    {
      trigger: "blur",
      validator: validLevel
    }
    ],
    coefficient: [{
      required: true,
      message: "请输入系数"
    },
    {
      trigger: "blur",
      validator: validCofficient
    }
    ]
  }
}
let detailHotArea = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: false,
          rowData: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}
let editHotArea = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: true,
          rowData: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}
let deleteHotArea = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "error",
      ghost: true,
      size: "small"
    },
    style: {
      // 什么情况下可以删除
      // display: Number(params.row.status) === 1 ? 'inline-block' : 'none'
      display: "inline-block"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type
        }
        that.$emit("axiosDelete", obj)
      }
    }
  }
}
export const hotAreaColumns = (that) => {
  return {
    index,
    cityName: {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let {
          row
        } = params
        return h("div", row.cityName)
      }
    },
    productLineName: {
      title: "产品线",
      key: "serviceType",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let finds = serviceTypeList.find(it => it.value - params.row.serviceType === 0)
        return h("div", finds ? finds.label : "暂无")
      }
    },
    updateTime: {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 100
    },
    updaterName: {
      title: "操作人",
      key: "updaterName",
      tooltip: true,
      minWidth: 80
    },
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 180,
      render: (h, params) => {
        return h("div", [
          h("Button", detailHotArea(that, params, "5", "hotAreaDetail"), "详情"),
          h("Button", editHotArea(that, params, "5", "hotAreaEdit"), "编辑"),
          h("Button", deleteHotArea(that, params, "5", "hotAreaDelete"), "删除")
        ])
      }
    }
  }
}

let orderPriorityModelData = {
  serviceType: "",
  city: [],
  // 可以选择的热力值等级策略表单
  // 模板
  levelData: [{
    level: {
      from: "",
      to: ""
    },
    coefficient: ""
  }]
}
let orderPriorityRules = {
  // 产品线
  serviceType: [{
    required: true,
    message: "请选择产品线"
  }],
  // 适用城市
  city: [{
    required: true,
    message: "请选择城市"
  }],
  levelData: {
    // 等级
    level: [{
      required: true,
      message: "请输入等级"
    },
    {
      trigger: "blur",
      validator: validLevel
    }
    ],
    coefficient: [{
      required: true,
      message: "请输入系数"
    },
    {
      trigger: "blur",
      validator: validCofficient
    }
    ]
  }
}
let detailOrderPriority = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: false,
          rowData: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}
let editOrderPriority = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: true,
          rowData: params.row
        }
        that.$emit("axiosDetail", obj)
      }
    }
  }
}
let deleteOrderPriority = (that, params, type, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "error",
      ghost: true,
      size: "small"
    },
    style: {
      // 什么情况下可以删除
      // display: Number(params.row.status) === 1 ? 'inline-block' : 'none'
      display: "inline-block"
    },
    directives: [{
      name: "hasAuth",
      value: "strategy_control-" + hasAuth
    }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type
        }
        that.$emit("axiosDelete", obj)
      }
    }
  }
}
export const orderPriorityColumns = (that) => {
  return {
    index,
    cityName: {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let {
          row
        } = params
        return h("div", row.cityName)
      }
    },
    productLineName: {
      title: "产品线",
      key: "serviceType",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let finds = serviceTypeList.find(it => it.value - params.row.serviceType === 0)
        return h("div", finds ? finds.label : "暂无")
      }
    },
    updateTime: {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 100
    },
    updaterName: {
      title: "操作人",
      key: "updaterName",
      tooltip: true,
      minWidth: 80
    },
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 180,
      render: (h, params) => {
        return h("div", [
          h("Button", detailOrderPriority(that, params, "6", "orderPriorityDetail"), "详情"),
          h("Button", editOrderPriority(that, params, "6", "orderPriorityEdit"), "编辑"),
          h("Button", deleteOrderPriority(that, params, "6", "orderPriorityDelete"), "删除")
        ])
      }
    }
  }
}

export const bookingData = {
  searchData: {},
  inputList: [{
    ...cityObj,
    bind_key: ["cityCode", "cityCode"],
    title: "城市",
    placeholder: "请选择",
    inputWidth: 140,
    changeOnSelect: false,
    value: [],
    titleWidth: 70,
    needCb: true
  },
  {
    name: "drop-input",
    key: "expandBizLine",
    bind_key: "expandBizLine",
    placeholder: "请选择业务线",
    value: "",
    titleWidth: 50,
    dropList: [],
    title: "业务线：",
    inputWidth: 120
  },
  {
    name: "drop-input",
    bind_key: "businessType",
    placeholder: "请选择产品线",
    value: "",
    titleWidth: 50,
    dropList: [],
    title: "产品线：",
    inputWidth: 120
  },
  {
    ...statusObj,
    dropList: bookingStatusList
  }
  ],
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}

let tabObj = {
  tabNamePone: "cancelTab"
}

// 日期大于当前日校验
export const validTimeRange = (rule, value, callback) => {
  if (!value[0] || !value[1]) {
    callback(new Error("请选择时间范围"))
  } else {
    callback()
  }
}
// 日期大于当前日校验
export const validNowTime = (rule, value, callback) => {
  let now = new Date()
  let dataTime = new Date(value)
  if (dataTime < now) {
    callback(new Error("选择时间不能小于当前时间"))
  } else {
    callback()
  }
}
// 整数校验
export const integerValidate = (rule, value, callback) => {
  if (value % 1 !== 0) {
    callback(new Error("请输入整数"))
  } else {
    callback()
  }
}
export const ruleInTime = {
  left: null,
  right: null,
  cancelFee: null
}
export const ruleOutTime = {
  ...ruleInTime,
  driverArrived: null
}
// 新增编辑免费取消
let cancelModelData = {
  // 免费取消新增策略
  businessType: "", // 产品线
  carLevel: "", // 车型等级
  typeTime: "", // 订单类型
  strategyName: "", // 策略名称
  city: [], // 适用城市
  money: null, // 取消费
  source: null, // 用车渠道
  typeTrip: null, // 用车场景
  effectiveTime: "",
  freeCancleMinute: null, // 接单后免费取消时间
  outCancleMinute: null, // 接单后超时取消时间
  continuedCancelLimit: true, // 连续取消次数限制
  dailyCancelLimit: false, // 每日取消次数限制
  continuedCancelMinute: null, // 连续取消次数限制-几分钟内  10分钟写死,不能修改
  continuedCancelNum: null, // 连续取消次数限制-主动取消次数
  continuedCancelNoMinute: null, // 连续取消次数限制-禁止下单分钟
  dailyCancelMinute: null, // 每日取消次数限制-几分钟内
  dailyCancelNum: null, // 每日取消次数限制-主动取消次数
  dailyCancelNoMinute: null, // 每日取消次数限制-禁止下单分钟
  noResponseCancelMinute: null, // 行程开始前免费取消时间
  driverLaterMinute: null, // 司机可迟到时间
  useChannelRuleFee: null,
  expandBizLine: null,
  defaultRule: 0, // 0 1 连续取消规则限制 是否使用默认规则
  continuousCancelRules: JSON.parse(JSON.stringify(defaultRuleList)) // 自定义连续取消规则
  ,useStepRule: '' //是否使用阶梯规则
  ,stepRulesInTime: [{...ruleInTime}] // 接单后X分钟内及时取消阶梯规则列表
  ,stepRulesAfterTime: [{...ruleOutTime}] // 接单后X分钟外取消阶梯规则列表
}
let cancelRules = {
  // expandBizLine: [{
  //   required: true,
  //   type: "number",
  //   message: "请选择业务线"
  // }],
  businessType: [{
    required: true,
    type: "number",
    message: "请选择产品线"
  }],
  carLevel: [{
    required: true,
    type: "number",
    message: "请选择车型等级"
  }],
  typeTime: [{
    required: true,
    type: "number",
    message: "请选择订单类型"
  }],
  money: [{
    required: true,
    type: "number",
    message: "请填写取消费"
  }],
  cancelRate: [{
    required: true,
    type: "number",
    message: "请填写取消比例"
  }],
  source: [{
    required: true,
    message: "请填写用车渠道"
  }],
  typeTrip: [{
    required: true,
    message: "请填写用车场景"
  }],
  cityCodes: [{
    required: true,
    type: "array",
    trigger: "change",
    message: "请选择适用城市"
  }],
  strategyName: [{
    required: true,
    message: "请输入策略名称"
  },
  {
    type: "string",
    max: 20,
    message: "最多输入20个字",
    trigger: "blur"
  },
  {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
    message: "仅支持中文英文和数字",
    trigger: "blur"
  }
  ],
  effectiveTime: [{
    required: true,
    message: "请选择生效时间"
  },
  {
    trigger: "blur",
    validator: validNowTime
  }
  ],
  freeCancleMinute: [{
    required: true,
    type: "number",
    message: "请填写接单后免费取消时间"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  noResponseCancelMinute: [{
    required: true,
    type: "number",
    message: "请填写无责取消时间"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  driverLaterMinute: [{
    required: true,
    type: "number",
    message: "请填写司机可迟到时间"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  useChannelRuleFee: [
    {
      required: true,
      type: "string",
      message: "请选择是否使用渠道规则收取取消费"
    },
  ],
  useStepRule: [
    {
      required: true,
      // type: "string",
      message: "请选择是否阶梯设置"
    },
  ],
  outCancleMinute: [{
    required: true,
    type: "number",
    message: "请填写接单后超时取消时间"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  continuedCancelMinute: [{
    required: true,
    type: "number",
    message: "必填"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  continuedCancelNum: [{
    required: true,
    type: "number",
    message: "必填"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  continuedCancelNoMinute: [{
    required: true,
    // type: "number",
    message: "必填"
  }
  // {
  //   trigger: "blur",
  //   validator: integerValidate
  // }
  ],
  dailyCancelMinute: [{
    required: true,
    type: "number",
    message: "必填"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  dailyCancelNum: [{
    required: true,
    type: "number",
    message: "必填"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ],
  dailyCancelNoMinute: [{
    required: true,
    type: "number",
    message: "必填"
  },
  {
    trigger: "blur",
    validator: integerValidate
  }
  ]
}
// 新增司机取消策略
let deviateModelData = {
  ruleName: "", // 名称
  businessTypeList: "", // 业务线
  expandBizLine: null,
  dailyCancelLimitOn: 0, // 是否启用每日取消上限, 0: 否, 1: 是
  dailyCancelLimit: null, // 每日取消上限次数, 当dailyCancelLimitOn = 1时生效
  totalCancelLimitType: null, // 总计取消上限类型（1：按自然周；2，按自然月）
  totalCancelLimit: null, // 总计取消上限值
  tags: [], // 司机标签
  creater: "", // 创建人
  cityCode: "", // 适用城市
  effectiveTimes: "",
  source: null, // 用车渠道
  typeTrip: null, // 用车场景
  rules: [{
    startTime: "",
    endTime: "",
    distance: null,
    unconnectedCount: null,
    unconnectedSecond: null,
    waitTime: null
  }]
}
let deviateRules = {
  expandBizLine: [{
    required: true,
    message: "请选择业务线"
  }],
  businessTypeList: [{
    type: "array",
    required: true,
    message: "请选择业务线"
  }],
  divergeTime: [{
    required: true,
    message: "请填写偏离时限"
  },
  {
    trigger: "change",
    validator: integerValidate
  }
  ],
  divergeNum: [{
    required: true,
    message: "请填写偏离次数"
  },
  {
    trigger: "change",
    validator: integerValidate
  }
  ],
  source: [{
    required: true,
    message: "请填写用车渠道"
  }],
  typeTrip: [{
    required: true,
    message: "请填写用车场景"
  }],
  tags: [{
    required: true,
    message: "请填写适用司机"
  }],
  cityCode: [{
    required: true,
    message: "请选择城市"
  }],
  ruleName: [{
    required: true,
    message: "请输入策略名称"
  },
  {
    type: "string",
    max: 20,
    message: "最多输入20个字",
    trigger: "blur"
  },
  {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
    message: "仅支持中文英文和数字",
    trigger: "blur"
  }
  ]
}

let automationRules = {
  productLines: [{
    required: true,
    message: "请选择业务线"
  }],
  cityCode: [{
    required: true,
    message: "请选择城市"
  }
  ]
}
// 新增编辑时间段和高峰
let timeModelData = {
  strategyName: "", // 策略名称
  city: [], // 适用城市
  effectiveTime: "", // 生效时间
  nightServiceBeginTime: "", // 夜间服务开始时间
  nightServiceEndTime: "", // 夜间服务结束时间
  morningPeakBeginTime: "", // 早高峰时段开始
  morningPeakEndTime: "", // 早高峰时段结束
  eveningPeakBeginTime: "", // 晚高峰时段开始
  eveningPeakEndTime: "", // 晚高峰时段结束
  otherPeakBeginTime: "", // 其他高峰时段开始
  otherPeakEndTime: "" // 其他高峰时段结束
}
let timeRules = {
  strategyName: [{
    required: true,
    message: "请输入策略名称"
  },
  {
    type: "string",
    max: 20,
    message: "最多输入20个字",
    trigger: "blur"
  },
  {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
    message: "仅支持中文英文和数字",
    trigger: "blur"
  }
  ],
  city: [{
    required: true,
    message: "请选择城市"
  }],
  effectiveTime: [{
    required: true,
    message: "请选择时间"
  },
  {
    trigger: "change",
    validator: validNowTime
  }
  ],
  nightServiceBeginTime: [{
    required: true,
    message: "请选择夜间服务开始时段"
  }],
  nightServiceEndTime: [{
    required: true,
    message: "请选择夜间服务结束时段"
  }],
  morningPeakBeginTime: [{
    required: true,
    message: "早高峰开始时段"
  }],
  morningPeakEndTime: [{
    required: true,
    message: "早高峰结束时段",
  }],
  eveningPeakBeginTime: [{
    required: true,
    message: "晚高峰开始时段",
  }],
  eveningPeakEndTime: [{
    required: true,
    message: "晚高峰结束时段",
  }]
}

let tacticModelData = {
  channel: null, // 订单渠道
  city: [], // 使用城市
  ratio: "" // 系数 (0, 2], 可1位小数
};
let tacticRules = {
  channel: [{
    required: true,
    message: "请选择类型"
  }],
  city: [{
    required: true,
    message: "请选择城市"
  }],
  ratio: [
    { required: true, message: "不能为空" },
    {
      trigger: "blur",
      validator: (rule, value, callback) => {
        let isNaN = Number.isNaN(Number(value));
        let errorMsg = "请输入0, 2之间数值";
        let error = new Error(errorMsg);
        isNaN && callback(error)
        let isNumber = ({}).toString.call(Number(value)) === "[object Number]";
        !isNumber && callback(error)
        let inRange = value > 0 && value <= 2;
        !inRange && callback(error)

        if (!(/^(\d+|\d+\.\d{1})$/).test(value)) {
          errorMsg = "只支持1位小数"
          callback(new Error(errorMsg))
        }
        callback()
      }
    },
  ],
}

const baseCopy = (...rest) => rest.map(data => JSON.parse(JSON.stringify(data)))

let defaultBookingModalData = {
  expandBizLine: "",
  businessType: "",
  carLevels: [],
  cityCode: "",
  reassignTimeLimit: null,
  reassignFrequencyLimit: null
}
let bookingModelData = {
  ...defaultBookingModalData
}
// 校验时间限制
export const validateTimeLimit = (rule, value, callback) => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    callback(new Error("时间限制必须为数值类型"))
    return false
  }
  if (newValue < 1) {
    callback(new Error("时间限制数值必须大于0"))
    return false
  }
  callback()
}
// 校验时间限制
export const validateFrequencyLimit = (rule, value, callback) => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    callback(new Error("次数限制必须为数值类型"))
    return false
  }
  if (newValue < 1) {
    callback(new Error("次数限制数值必须大于0"))
    return false
  }
  callback()
}
// 校验业务线
export const validateBusiness = (rule, value, callback) => {
  if (value === null) callback(new Error("请选择产品线"));
  else callback();
};
// 校验车型
export const validateCarLevel = (rule, value, callback) => {
  if (value === null) callback(new Error("请选择车型等级"));
  else callback();
};
let bookingRules = {
  businessType: [{
    required: true,
    validator: validateBusiness,
    trigger: "blur",
  }],
  carLevel: [{
    required: true,
    validator: validateCarLevel,
    trigger: "blur",
  }],
  cityCode: [{
    required: true,
    message: "请选择城市",
    trigger: "blur",
  }],
  reassignTimeLimit: [{
    required: true,
    type: "number",
    message: "请填写改派时间限制"
  }, {
    trigger: "blur",
    validator: validateTimeLimit
  }],
  reassignFrequencyLimit: [{
    required: true,
    type: "number",
    message: "请填写每日改派次数限制"
  }, {
    trigger: "blur",
    validator: validateFrequencyLimit
  }]
}

export const validList = [{
  value: "1",
  label: "生效"
},
{
  value: "0",
  label: "不生效"
}
]

let restModelData = {
  fareThreVal: "",
  restThreVal: "",
  reserveThreVal: "",
  alarmThreVal: "",
  sevFareThreVal: "",
  status: "0"
}
let restModelUuid = ""
let restModelOriginStatus = ""

export const validTime = (rule, value, callback) => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    callback(new Error("必须为数值类型"))
    return false
  }
  if (newValue < 1) {
    callback(new Error("数值必须大于0"))
    return false
  }
  if (String(value).indexOf(".") > -1) {
    callback(new Error("请输入整数"))
    return false
  }
  callback()
}

export const validHour = (rule, value, callback) => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    callback(new Error("必须为数值类型"))
    return false
  }
  if (newValue < 0) {
    callback(new Error("数值必须大于0"))
    return false
  }
  const splitValue = String(value).split(".")
  if (splitValue.length === 2 && splitValue[1].length > 1) {
    callback(new Error("数值仅限精确至小数点后一位"))
    return false
  }
  callback()
}

let restRules = {
  fareThreVal: [{
    required: true,
    message: "请输入整数分钟数"
  }, {
    trigger: "blur",
    validator: validTime
  }],
  restThreVal: [{
    required: true,
    message: "请输入整数分钟数"
  }, {
    trigger: "blur",
    validator: validTime
  }],
  reserveThreVal: [{
    required: true,
    message: "请输入整数分钟数"
  }, {
    trigger: "blur",
    validator: validTime
  }],
  alarmThreVal: [{
    required: true,
    message: "请输入整数分钟数"
  }, {
    trigger: "blur",
    validator: validTime
  }],
  sevFareThreVal: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    trigger: "blur",
    validator: validHour
  }],
}

// 司机派单策略
export let driverScheduleTabModelData = {
  status: "1",
}

export let dispatchList = [
  {
    value: "-2",
    label: "否"
  },
  {
    value: "1",
    label: "是"
  }
]
// 进线自动化策略
export const automationColumns = (that) => {
  return {
    cityName,
    businessType,
    updateTime,
    updater,
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (h, params) => {
        return h("div", [
          h("Button", detailBtn(that, params, "8", "cancelDetail"), "详情"),
          h("Button", editBtn(that, params, "8", "cancelEdit"), "编辑")
        ])
      }
    }
  }
}
export const automationInitData = [
  {
    name: "物品遗失",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "LostBelongings"
  },
  {
    name: "账单费用疑问",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "BillDoubt"
  },
  {
    name: "司机绕路",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "DriverCycleRoad"
  },
  {
    name: "未上车产生费用",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "BillNoService"
  },
  {
    name: "司机服务态度恶劣",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "DriverBadManner"
  },
  {
    name: "退款问题",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "RefundProblem"
  },
  {
    name: "司机拒绝来接我",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "DriverRefuseSer"
  },
  {
    name: "司机/车辆信息不符",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "DCarNoMatch"
  },
  {
    name: "司机短信/电话打扰我",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "DriverHarass"
  },
  {
    name: "司机提前计费",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "PreCharge"
  },
  {
    name: "司机多收附加费",
    type: "乘客申诉场景",
    value: "",
    level: "",
    key: "MoreExtraFare"
  },
  {
    name: "失物招领",
    type: "司机申诉场景",
    value: "",
    level: "",
    key: "PickLostBelongs"
  },
  {
    name: "投诉乘客行为",
    type: "司机申诉场景",
    value: "",
    level: "",
    key: "ComplaintP"
  }
]
export const automationData = {
  searchData: {},
  inputList: [
    {
      ...cityObj,
      bind_key: ["provinceUuid", "cityUuid"],
      title: "城市",
      placeholder: "请选择",
      inputWidth: 140,
      changeOnSelect: false,
      value: [],
      titleWidth: 70,
      needCb: true
      // ...openCityObj,
      // placeholder: "请选择",
      // inputWidth: 140,
      // changeOnSelect: true,
      // value: "",
      // titleWidth: 70,
      // title: "城市",
    }, {
      name: "drop-input",
      bind_key: "serviceType",
      placeholder: "请选择",
      value: "",
      titleWidth: 70,
      dropList: businessTypeList3,
      title: "产品线：",
      inputWidth: 140
    }],
  pageObj: {
    ...pageObj
  },
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], // 表格数据
  rootTabelData: [] // 表格元数据
}
export let driverScheduleRules = {
  status: [{
    required: true,
    message: "请选择是否向司机派发用车时间不在其当班时间的预约单"
  }],
}

export const homeData = {
  tabObj,
  businessTypeList,
  driverScheduleRules,
  driverScheduleTabModelData,
  dispatchList,
  cancelModelData,
  cancelRules: freeze(cancelRules),
  deviateModelData,
  deviateRules: freeze(deviateRules),
  timeModelData,
  timeRules: freeze(timeRules),
  tacticModelData,
  restModelData,
  restModelUuid,
  restModelOriginStatus,
  restRules: freeze(restRules),
  businessTypeList2: freeze(businessTypeList2),
  businessTypeList3: freeze(businessTypeList3),
  // validList,
  // 订单热区价值
  hotAreaData,
  hotAreaRules: freeze(hotAreaRules),
  orderPriorityData,
  orderPriorityRules: freeze(orderPriorityRules),
  bookingData,
  tacticRules: freeze(tacticRules),
  serviceTypeList,
  hotAreaModelData,
  orderPriorityModelData,
  channelDropList,
  originData: baseCopy(cancelData, deviateData, timeData, tacticData, hotAreaData, orderPriorityData, bookingData),
  bookingModelData,
  bookingRules: freeze(bookingRules),
  bookingLineList,
  bookingLineMap,
  defaultBookingModalData,
  automationColumns,
  automationRules: freeze(automationRules)
}
