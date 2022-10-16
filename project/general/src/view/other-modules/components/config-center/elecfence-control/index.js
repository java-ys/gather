
import { railList, getCarLevelList } from "_g/config/status-map"
import { mapToList, checkHasBtn } from "@/libs/util"
// 全部车型等级options
export const carTypeOptions = {
  1: getCarLevelList(1),
  2: getCarLevelList(2),
  4: getCarLevelList(4),
}

/**
 * @author 朱鹏辉
 * @returns {2:返回值}
 * @description{3:详细描述:过滤运营围栏和人车证过滤围栏，这两种围栏移到城市电子围栏菜单中，本页面不展示}
 * @date 2022-01-17
*/
 const filterRailList = railList.filter( item => {
  return item.value !== 1 && item.value !== 28 
})

export const railTypeMap = filterRailList
// 正向/逆向
export const directionMap = {
  1: "正向",
  2: "逆向"
}
export const directionList = mapToList(directionMap)
// 出发地/目的地
export const targerAreaMap = {
  1: "出发地",
  2: "目的地"
}
export const targetAreaList = mapToList(targerAreaMap)

export const statusData = {
  1: "正常",
  2: "未生效",
  3: "失效",
  4: "停用"
}

export const serviceTypeData = {
  4: "快享",
  2: "专享",
  1: "出租车"
}

// 经纬度和时间段
const updateCoordsAndTimeRange = (obj) => {
  if (obj.railType === 20) {
    const extAttr = obj.extAttr ? JSON.parse(obj.extAttr) : {
      centerPoints: [
        {
          lng: "",
          lat: ""
        }
      ],
      effectTimes: [{}]
    }
    obj.navCoords = []
    obj.timeRanges = []
    extAttr.centerPoints.forEach(item => {
      obj.navCoords.push(item)
    })
    extAttr.effectTimes.forEach(item => {
      obj.timeRanges.push({
        effectiveTime: item.startTime ? [item.startTime, item.endTime] : null
      })
    })
  } else if (obj.railType === 22) {
    const extAttr = obj.extAttr ? JSON.parse(obj.extAttr) : ""
    const { useLevelTypeList, voiceDoc } = extAttr;
    obj.useLevelTypeList = useLevelTypeList;
    obj.voiceDoc = voiceDoc;
  } else {
    obj.navCoords = [
      {
        lng: "",
        lat: ""
      }
    ]
    obj.timeRanges = [
      {
        effectiveTime: null
      }
    ]
    obj.useLevelTypeList = []
    obj.voiceDoc = ""
  }
}

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: "序号",
        key: "num",
        tooltip: true,
        width: 70,
        fixed: "left",
        render: (h, params) => {
          return h(
            "div",
            that.pageSize * (that.current - 1) + params.index + 1
          )
        }
      },
      {
        title: "名称",
        key: "name",
        tooltip: true,
        minWidth: 150,
        fixed: "left"
      },
      {
        title: "城市",
        key: "city",
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          let cityCode = params.row.cityCode
          const getCityName = cityCode => {
            let newJSON = {}
            that.cityList.forEach(item => {
              item.children &&
                item.children.length &&
                item.children.forEach(element => {
                  newJSON[element.cityID] = element.__label
                })
            })
            return newJSON[cityCode] || "暂无"
          }
          return h("div", getCityName(cityCode))
        }
      },
      {
        title: "产品线",
        key: "serviceType",
        tooltip: true,
        minWidth: 90,
        render: (h, params) => {
          const { row } = params;
          const { serviceType } = row;
          let obj = {
            5: '全部',
            ...that.businessGradeName.productKeyValue
          }
          return h("div", obj[serviceType] || "暂无")
        }
      },
      {
        title: "车型等级",
        key: "carLevel",
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          const { row } = params;
          let { carLevelList } = row;
          carLevelList ? carLevelList = carLevelList.map(it => (that.carLevelList.find(item => item.value === it)||{}).label || ""):carLevelList = []
          return h("div", carLevelList.join(',') || "全部")
        }
      },
      {
        title: "围栏类型",
        key: "railType",
        tooltip: true,
        minWidth: 135,
        render: (h, params) => {
          let text = "暂无"
          railTypeMap.forEach(item => {
            if (item.value === params.row.railType) text = item.label
          })
          return h("div", text)
        }
      },
      {
        title: "正向/逆向",
        key: "direction",
        tooltip: true,
        minWidth: 100,
        render: (h, params) => {
          return h("div", directionMap[params.row.direction])
        }
      },
      {
        title: "出发地/目的地",
        key: "addressTypeList",
        tooltip: true,
        minWidth: 120,
        render: (h, params) => {
          let res = []
          params.row.addressTypeList && params.row.addressTypeList.forEach(item => {
            res.push(targerAreaMap[item])
          })
          return h("div", res.join(","))
        }
      },
      {
        title: "创建时间",
        key: "createTime",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "生效时间",
        key: "effectiveTime",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "失效时间",
        key: "failureTime",
        minWidth: 180,
        tooltip: true
      },
      {
        title: "状态",
        key: "status",
        tooltip: true,
        minWidth: 80,
        render: (h, params) => {
          let statusTitle = statusData[params.row.status] || "暂无"
          return h("div", statusTitle)
        }
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 250,
        render: (h, params) => {
          const paramData = params.row;
          const { status, railType } = paramData;
          const canStop = status - 1 === 0 || status - 2 === 0; // 停用：仅未生效、正常状态可以停用
          const canStart = status - 4 === 0 // 启用：仅停用状态电子围栏可以启用。
          // ！！！！！指令设置权限会存在样式问题
          return h("div", [
            railType === 3 || railType === 15 ? "" : h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("elecfence_control-edit") ? "none" : "inline-block"
                },
                // directives: [
                //   {
                //     name: "hasAuth",
                //     value: "elecfence_control-edit"
                //   }
                // ],
                on: {
                  click: () => {
                    let newJSON = {
                      name: "",
                      carrierArea: [],
                      serviceType: "",
                      railType: "运营围栏",
                      scope: "",
                      scopes: "",
                      getpathData: [],
                      effectiveTime: "",
                      failureTime: "",
                      remark: "",
                      useLevelTypeList: [],
                      voiceDoc: "",
                      status: 0,
                      cityCode: "",
                      tripDistance: null,
                      extAttr: "",
                      carLevelList:[]
                    }
                    that.title = "编辑电子围栏"
                    that.updateType = "edit"
                    that.uuid = paramData.uuid
                    for (let key in newJSON) {
                      if (paramData[key]) newJSON[key] = paramData[key]
                    }
                    if (paramData.reason == null) {
                      newJSON.reason = ""
                      newJSON.reasonType = 0
                    } else {
                      newJSON.reason = paramData.reason
                      newJSON.reasonType = paramData.reason ? 1 : 0
                    }
                    newJSON.scopes = paramData.scope
                    newJSON.getpathData = paramData.scope.split("&")
                    newJSON.carrierArea = [
                      paramData.provinceCode,
                      paramData.cityCode
                    ]
                    if (newJSON.railType === 1) {
                      newJSON.direction = paramData.direction
                      newJSON.filterType = paramData.filterType
                      newJSON.filterTagList = paramData.filterTagList
                      newJSON.addressTypeList = paramData.addressTypeList
                    }
                    if (newJSON.railType === 15) {
                      newJSON.centerPoint = paramData.centerPoint
                    }
                    if (newJSON.railType - 25 === 0) { // 限停围栏
                      if(paramData.extAttr && JSON.parse(paramData.extAttr)) {
                        newJSON.parkingTime = JSON.parse(paramData.extAttr)?.parkingTime
                      }
                    }
                    updateCoordsAndTimeRange(newJSON)
                    let carTypes = that.bizTypeList.find(it => it.value === newJSON.serviceType) || {}
                    that.$refs['float'].carLevelList = carTypes.children || []
                    that.floatParams = newJSON
                    that.isPop = true
                    that.invalidEditor = false
                  }
                }
              },
              "编辑"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "info",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("elecfence_control-detail") ? "none" : "inline-block"
                },
                // directives: [
                //   {
                //     name: "hasAuth",
                //     value: "elecfence_control-detail"
                //   }
                // ],
                on: {
                  click: () => {
                    let newJSON = {
                      name: "",
                      carrierArea: [],
                      serviceType: "",
                      railType: "",
                      scope: "",
                      getpathData: [],
                      effectiveTime: "",
                      failureTime: "",
                      remark: "",
                      useLevelTypeList: [],
                      voiceDoc: "",
                      status: 0,
                      tripDistance: null,
                      extAttr: "",
                      carLevelList:[]
                    }
                    that.title = "查看电子围栏"
                    for (let key in newJSON) {
                      if (paramData[key]) newJSON[key] = paramData[key]
                    }
                    if (paramData.reason == null) {
                      newJSON.reason = ""
                      newJSON.reasonType = 0
                    } else {
                      newJSON.reason = paramData.reason
                      newJSON.reasonType = paramData.reason ? 1 : 0
                    }
                    newJSON.scopes = paramData.scope
                    newJSON.getpathData = paramData.scope.split("&")
                    newJSON.carrierArea = [
                      paramData.provinceCode,
                      paramData.cityCode
                    ]
                    if (newJSON.railType === 1) {
                      newJSON.direction = paramData.direction
                      newJSON.filterType = paramData.filterType
                      newJSON.filterTagList = paramData.filterTagList
                      newJSON.addressTypeList = paramData.addressTypeList
                    }
                    if (newJSON.railType === 15) {
                      newJSON.centerPoint = paramData.centerPoint
                    }
                    if (newJSON.railType - 25 === 0) { // 限停围栏
                      if(paramData.extAttr && JSON.parse(paramData.extAttr)) {
                        newJSON.parkingTime = JSON.parse(paramData.extAttr)?.parkingTime
                      }
                    }
                    // todo 构造 经纬度和时间段
                    updateCoordsAndTimeRange(newJSON)
                    let carTypes = that.bizTypeList.find(it => it.value === newJSON.serviceType) || {}
                    that.$refs['float'].carLevelList = carTypes.children || []
                    that.floatParams = newJSON
                    that.isPop = true
                    that.invalidEditor = true
                  }
                }
              },
              "详情"
            ),
            canStart && railType !== 3 && railType !== 15
              ? h(
                "Button",
                {
                  class: {
                    tableBtn: true,
                  },
                  props: {
                    type: "success",
                    ghost: true,
                    size: "small"
                  },
                  style: {
                    display: !checkHasBtn("elecfence_control-active") ? "none" : "inline-block"
                  },
                  // directives: [{
                  //   name: 'hasAuth',
                  //   value: 'elecfence_control-active'
                  // }],
                  on: {
                    click: () => {
                      that.rowActive(paramData)
                    }
                  }
                },
                "启用"
              )
              : "",
            (canStop && railType !== 3 && railType !== 15)
              ? h(
                "Button",
                {
                  class: {
                    tableBtn: true,
                  },
                  style: {
                    color: "red",
                    borderColor: "red"
                  },
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  style: {
                    display: !checkHasBtn("elecfence_control-deactive") ? "none" : "inline-block"
                  },
                  // directives: [{
                  //   name: 'hasAuth',
                  //   value: 'elecfence_control-deactive'
                  // }],
                  on: {
                    click: () => {
                      that.rowActive(paramData)
                    }
                  }
                },
                "停用"
              )
              : "",
            railType === 3 ? "" : h(
              "Button",
              {
                props: {
                  type: "primary",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("elecfence_control-copy") ? "none" : "inline-block"
                },
                // directives: [
                //   {
                //     name: "hasAuth",
                //     value: "elecfence_control-copy"
                //   }
                // ],
                on: {
                  click: () => {
                    let newJSON = {
                      name: "",
                      carrierArea: [],
                      serviceType: "",
                      railType: "运营围栏",
                      scope: "",
                      scopes: "",
                      getpathData: [],
                      effectiveTime: "",
                      failureTime: "",
                      remark: "",
                      useLevelTypeList: [],
                      voiceDoc: "",
                      status: 0,
                      tripDistance: null,
                      extAttr: ""
                    }
                    that.title = "复制电子围栏"
                    that.updateType = "edit"
                    that.uuid = paramData.uuid
                    for (let key in newJSON) {
                      if (paramData[key]) newJSON[key] = paramData[key]
                    }
                    if (paramData.reason == null) {
                      newJSON.reason = ""
                      newJSON.reasonType = 0
                    } else {
                      newJSON.reason = paramData.reason
                      newJSON.reasonType = paramData.reason ? 1 : 0
                    }
                    newJSON.scopes = paramData.scope
                    newJSON.getpathData = paramData.scope.split("&")
                    newJSON.carrierArea = [
                      paramData.provinceCode,
                      paramData.cityCode
                    ]
                    if (newJSON.railType === 1) {
                      newJSON.direction = paramData.direction
                      newJSON.filterType = paramData.filterType
                      newJSON.filterTagList = paramData.filterTagList
                      newJSON.addressTypeList = paramData.addressTypeList
                    }
                    if (newJSON.railType === 15) {
                      newJSON.centerPoint = paramData.centerPoint
                    }
                    if (newJSON.railType - 25 === 0) { // 限停围栏
                      if(paramData.extAttr && JSON.parse(paramData.extAttr)) {
                        newJSON.parkingTime = JSON.parse(paramData.extAttr)?.parkingTime
                      }
                    }
                    // todo 构造 经纬度和时间段
                    updateCoordsAndTimeRange(newJSON)
                    //newJSON.serviceType = String(newJSON.serviceType)
                    newJSON.copy = true
                    that.floatParams = newJSON
                    that.isPop = true
                    that.invalidEditor = false
                  }
                }
              },
              "复制"
            )
          ])
        }
      }
    ]
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "name",
    placeholder: "请输入名称",
    value: "", // 用于数据绑定
    title: "名称：", // 展示的字段名
    titleWidth: 40
  },
  {
    name: "cascader-input",
    bind_key: ["provinceId", "cityId"],
    placeholder: "请选择省/市",
    value: [],
    cascaderList: [],
    title: "省 / 市：",
    filterable: true,
    changeOnSelect: true,
    trigger: "click"
  },
  {
    name: "drop-input",
    bind_key: "serviceType",
    placeholder: "请选择产品线",
    value: "",
    dropList: [],
    title: "产品线："
  },
  {
    name: "drop-input",
    bind_key: "carLevel",
    placeholder: "请选择车型等级",
    value: "",
    dropList: [],
    title: "车型等级："
  },
  {
    name: "drop-input",
    bind_key: "railType",
    placeholder: "请选择围栏类型",
    value: "",
    filterable: true,
    dropList: [],
    title: "围栏类型："
  },
  {
    name: "time-input",
    bind_key: "millis",
    placeholder: "请选择创建时间",
    value: "",
    title: "创建时间："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    value: "", // 绑定返回数据
    dropList: [], // 级联列表
    title: "状态：", // 展示的字段名
    titleWidth: 40
  },
  {
    name: "drop-input",
    bind_key: "direction",
    placeholder: "请选择正向/逆向",
    value: "",
    dropList: directionList,
    title: "正向/逆向："
  },
  {
    name: "drop-input",
    bind_key: "placeType",
    placeholder: "请选择出发地/目的地",
    value: "",
    dropList: targetAreaList,
    title: "出发地/目的地：", // 展示的字段名
    titleWidth: 95
  }
]
