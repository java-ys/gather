import {
  railList,
  getCarLevelList
} from "_g/config/status-map"
import {
  mapToList,
  checkHasBtn
} from "@/libs/util"
// 全部车型等级options
export const carTypeOptions = {
  1: getCarLevelList(1),
  2: getCarLevelList(2),
  4: getCarLevelList(4),
}

// todo
// 最好写在字典表里
export const railTypeList = railList;

// 围栏数组形式
export const arrRailList = [1, 2, 4, 5, 6, 7, 8, 12, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];


// 图例的数组
export const legendList = [{
  railType: 1,
  railTypeName: "运营围栏",
  railColorClass: "rectangle-1",
  selected: false,
},
{
  railType: 2,
  railTypeName: "流水奖励围栏",
  railColorClass: "rectangle-2",
  selected: false,
},
{
  railType: 4,
  railTypeName: "T3上车点围栏",
  railColorClass: "rectangle-4",
  selected: false,
},
{
  railType: 5,
  railTypeName: "派单围栏",
  railColorClass: "rectangle-5",
  selected: false,
},
{
  railType: 6,
  railTypeName: "交通枢纽围栏",
  railColorClass: "rectangle-6",
  selected: false,
},
{
  railType: 7,
  railTypeName: "T3自定义下车点",
  railColorClass: "rectangle-7",
  selected: false,
},
{
  railType: 8,
  railTypeName: "禁行围栏",
  railColorClass: "rectangle-8",
  selected: false,
},
{
  railType: 12,
  railTypeName: "乘客饮酒管理围栏",
  railColorClass: "rectangle-12",
  selected: false,
},
{
  railType: 14,
  railTypeName: "异常停留围栏",
  railColorClass: "rectangle-14",
  selected: false,
},
{
  railType: 15,
  railTypeName: "调度类型围栏",
  railColorClass: "rectangle-15",
  selected: false,
},
{
  railType: 17,
  railTypeName: "异地车辆派单围栏",
  railColorClass: "rectangle-17",
  selected: false,
},
{
  railType: 18,
  railTypeName: "限号限行围栏",
  railColorClass: "rectangle-18",
  selected: false,
},
{
  railType: 19,
  railTypeName: "行N限N围栏",
  railColorClass: "rectangle-19",
  selected: false,
},
{
  railType: 20,
  railTypeName: "会员绝对优先派单围栏",
  railColorClass: "rectangle-20",
  selected: false,
},
{
  railType: 21,
  railTypeName: "涉性围栏",
  railColorClass: "rectangle-21",
  selected: false,
},
{
  railType: 22,
  railTypeName: "防疫围栏",
  railColorClass: "rectangle-22",
  selected: false,
},
{
  railType: 23,
  railTypeName: "禁止接单围栏",
  railColorClass: "rectangle-23",
  selected: false,
},
{
  railType: 24,
  railTypeName: "高危路段围栏",
  railColorClass: "rectangle-24",
  selected: false,
},
{
  railType: 25,
  railTypeName: "限停围栏",
  railColorClass: "rectangle-25",
  selected: false,
},
{
  railType: 26,
  railTypeName: "地址类型围栏",
  railColorClass: "rectangle-26",
  selected: false,
},
{
  railType: 27,
  railTypeName: "上传乘客健康码围栏",
  railColorClass: "rectangle-27",
  selected: false,
},
{
  railType: 28,
  railTypeName: "人车证过滤围栏",
  railColorClass: "rectangle-28",
  selected: false,
},
]

export const railTypeMap = railList
// 正向/逆向
export const directionMap = {
  1: "正向",
  2: "逆向"
}
export const directionList = mapToList(directionMap)
// 出发地/目的地
export const targerAreaMap = {
  1: "出发地",
  2: "目的地",
  3: "出发地或目的地"
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

// 经纬度和时间段赋值
export const updateCoordsAndTimeRange = (obj) => {
  if (obj.railType === 20) {
    const extAttr = obj.extAttr ? JSON.parse(obj.extAttr) : {
      centerPoints: [{
        lng: "",
        lat: ""
      }],
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
    const {
      useLevelTypeList,
      voiceDoc
    } = extAttr;
    obj.useLevelTypeList = useLevelTypeList;
    obj.voiceDoc = voiceDoc;
  } else {
    obj.navCoords = [{
      lng: "",
      lat: ""
    }]
    obj.timeRanges = [{
      effectiveTime: null
    }]
    obj.useLevelTypeList = []
    obj.voiceDoc = ""
  }
}

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [{
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
        const {
          row
        } = params;
        const {
          serviceType
        } = row;
        let obj = {
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
        const {
          row
        } = params;
        let {
          carLevelList
        } = row;
        carLevelList ? carLevelList = carLevelList.map(it => (that.carLevelList.find(item => item.value === it) || {}).label || "") : carLevelList = []
        return h("div", carLevelList.join(",") || "全部")
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
        const {
          status,
          railType
        } = paramData;
        const canStop = status - 1 === 0 || status - 2 === 0; // 停用：仅未生效、正常状态可以停用
        const canStart = status - 4 === 0 // 启用：仅停用状态电子围栏可以启用。
        // ！！！！！指令设置权限会存在样式问题
        return h("div", [
          railType === 3 || railType === 15 ? "" : h(
            "Button", {
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
                  that.$refs["fenceMap"].init("edit", paramData);
                }
              }
            },
            "编辑"
          ),
          h(
            "Button", {
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
              on: {
                click: () => {
                  that.$refs["fenceMap"].init("detail", paramData);
                }
              }
            },
            "详情"
          ),
          canStart && railType !== 3 && railType !== 15 ?
            h(
              "Button", {
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
                on: {
                  click: () => {
                    that.rowActive(paramData)
                  }
                }
              },
              "启用"
            ) :
            "",
          (canStop && railType !== 3 && railType !== 15) ?
            h(
              "Button", {
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
                on: {
                  click: () => {
                    that.rowActive(paramData)
                  }
                }
              },
              "停用"
            ) :
            "",
          railType === 3 ? "" : h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              style: {
                display: !checkHasBtn("elecfence_control-copy") ? "none" : "inline-block"
              },
              on: {
                click: () => {
                  that.$refs["fenceMap"].init("copy", paramData);
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
export const inputList = [{
  name: "cascader-input",
  bind_key: ["provinceId", "cityId"],
  placeholder: "请选择省市",
  value: [],
  cascaderList: [],
  title: "省/市",
  filterable: true,
  changeOnSelect: false,
  trigger: "click"
},
{
  name: "text-input",
  bind_key: "name",
  placeholder: "请输入名称",
  value: "", // 用于数据绑定
  title: "名称：", // 展示的字段名
  titleWidth: 40
},
{
  name: "drop-input",
  bind_key: "serviceTypes",
  placeholder: "请选择产品线",
  value: [],
  dropList: [],
  title: "产品线：",
  multiple: true
},
{
  name: "drop-input",
  bind_key: "carLevels",
  placeholder: "请选择车型等级",
  value: [],
  dropList: [],
  title: "车型等级：",
  multiple: true
},
{
  name: "drop-input",
  bind_key: "railTypes",
  placeholder: "请选择围栏类型",
  value: [],
  filterable: true,
  dropList: [],
  title: "围栏类型：",
  multiple: true
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
  bind_key: "statusList", // 返回数据的key名
  placeholder: "请选择状态",
  value: [], // 绑定返回数据
  dropList: [], // 级联列表
  title: "状态：", // 展示的字段名
  titleWidth: 40,
  multiple: true
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
  bind_key: "addressTypeList",
  placeholder: "请选择出发地/目的地",
  value: [],
  dropList: targetAreaList,
  title: "出发地/目的地：", // 展示的字段名
  titleWidth: 95,
  multiple: true
}
]

export const emptyFloatParams = { // form表单空数据
  addressTypeList: [], // 出发地目的地数组
  provinceCode: "", // 省code码
  cityCode: "", // 城市code码
  direction: null, // 正逆向
  effectiveTime: "", // 有效时间
  failureTime: "", // 失效时间
  filterType: null, // 过滤的类型
  name: "", // 围栏名称
  railType: "", // 围栏类型
  reason: "", // 原因描述
  reasonType: 0, // 原因类型
  remark: "", // 备注
  scope: "", // 围栏的path(string类型)
  serviceType: "", // 产品线类型
  status: 1, // 围栏的状态
  uuid: "", // 唯一标识
  filterTagList: [], // 过滤标签
  selectScope: 1, // 范围选择 1:地图选择 2:手动填写
  carrierArea: [], // 省市数组
  carLevelList: [], // 车型等级数组
  // todo
  useLevelTypeList: [], // 车型等级数组，可多选
  parkingTime: null, // 限停时间
  tripDistance: null, // 派单最小里程
  voiceDoc: "", // 语音播报内容
  navCoords: [ // 导航坐标数组
    {
      lng: "",
      lat: ""
    }
  ],
  timeRanges: [ // 策略时段数据
    {
      effectiveTime: null
    }
  ],
  extAttr: "", // 额外的属性
  centerPoint: "", // 调度中心点
  sceneCode: [], // 选中场景
  limitTimeList: [{
    limitTime: null,
  }],
  timeRangeType: 0, // 0:全天,1:部分
}
