// 产品线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: "快享",
    2: "专享",
    1: "出租车",
  }
  return map[i];
}
// 生效状态
export const getStatusName = (i) => {
  let map = {
    "-1": "已失效",
    "0": "待生效",
    "1": "生效中",
    "-2": "已失效"
  }
  return map[i];
}

// 操作类型
export const geToperationType = (i) => {
  let map = {
    1: "新增",
    2: "修改",
  }
  return map[i];
}
// 1经济型 2舒适型 3行政型 4商务型 5尊贵型
export const getVehicleLevelName = (i) => {
  let map = {
    1: "经济型",
    2: "舒适型",
    3: "行政型",
    4: "商务型",
    5: "尊贵型",
    9: "豪华型"
  }
  return map[i];
}

// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    callback();
  }
}
// 详情时间校验
export const validatorTimeDetail = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("结束时间要大于开始时间"));
    } else {
      callback();
    }
  }
}
// 列表数据
export const listColumns = {
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.searchParams.currPage - 1) * _this.searchParams.pageSize + params.index + 1);
      }
    },
    {
      title: "策略名称",
      minWidth: 200,
      key: "strategyName"
    },
    {
      title: "生效时间",
      minWidth: 160,
      key: "effectiveTime",
      render: (h, params) => {
        return h("div", _this.$moment(params.row.effectiveTime).format("YYYY-MM-DD HH:mm:ss"))
      }
    },
    {
      title: "城市",
      minWidth: 80,
      key: "cityCode",
      render: (h, params) => {
        return h("div", _this.authCityMap[String(params.row.cityCode)])
      }
    },
    {
      title: "产品线",
      minWidth: 80,
      key: "productLine",
      render: (h, params) => {
        return h("div", getServiceTypeName(params.row.productLine))
      }
    },

    {
      title: "车型等级",
      minWidth: 100,
      key: "vehicleLevel",
      render: (h, params) => {
        return h("div", getVehicleLevelName(String(params.row.vehicleLevel)))
      }
    },
    {
      title: "状态",
      minWidth: 100,
      key: "state",
      render: (h, params) => {
        return h("div", getStatusName(String(params.row.state)))
      }
    },
    {
      title: "版本号",
      minWidth: 100,
      key: "versions"
    },
    {
      title: "操作人",
      minWidth: 100,
      key: "updaterName"
    },
    {
      title: "操作",
      width: 220,
      fixed: "right",
      render(h, params) {
        return h("div", {
          style: {
            display: "flex",
          }
        }, [

          h(
            "Button", {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "day-baseprice-detail"
              }],
              on: {
                click() {
                  _this.goDetail(params.row.uuid);
                }
              }
            },
            "详情"
          ),
          h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "day-baseprice-copy"
              }],
              on: {
                click() {
                  _this.copy(params.row.uuid);
                }
              }
            },
            "复制"
          ),
          h(
            "Button", {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              style: {
                display: params.row.state === 0 ? "flex" : "none",
              },
              directives: [{
                name: "hasAuth",
                value: "day-baseprice-delete"
              }],
              on: {
                click() {
                  _this.deleteData(params.row.uuid);
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
    ];
  }
}
// 校验时间为空
export const tripListValidate = (rule, value, callback) => {
  if (value && !value[0]) {
    callback(new Error("请选择时段"));
  } else {
    callback()
  }
}
export const formValidate1 = {
  strategyName: [{
    required: true,
    message: "请填写策略名称",
    trigger: "change"
  }],
  productLine: [{
    required: true,
    message: "请选择产品线",
    trigger: "change",
    type: "number"
  }],
  effectiveTime: [{
    required: true,
    validator: validatorTime
  }],
  cityCode: [{
    required: true,
    message: "必选"
  }],
  vehicleLevel: [{
    required: true,
    message: "请选择车型等级",
    trigger: "change",
    type: "number"
  }],

}

export const formValidate2 = {
  time: [{
    required: true,
    type: "array",
    message: "请选择时段",
    trigger: "change"
  }, {
    required: true,
    validator: tripListValidate,
    trigger: "change"
  }],
  startFare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "blur"
  }],
  startTrip: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
  startDuration: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const formValidate3 = {
  lowestFare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
  lowestModel: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],

}
export const formValidate4 = {
  time: [{
    required: true,
    type: "array",
    message: "请选择时段",
    trigger: "change"
  }, {
    required: true,
    validator: tripListValidate,
    trigger: "change"
  }],
  fare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const formValidate5 = {
  time: [{
    required: true,
    type: "array",
    message: "请选择时段",
    trigger: "change"
  }, {
    required: true,
    validator: tripListValidate,
    trigger: "change"
  }],
  fare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const formValidate6 = {
  beyondTimeFare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
  freeWaitTime: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const formValidate7 = {
  time: [{
    required: true,
    type: "array",
    message: "请选择时段",
    trigger: "change"
  }, {
    required: true,
    validator: tripListValidate,
    trigger: "change"
  }],
  fare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const formValidate8 = {
  creditRate: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const formValidate9 = {
  time: [{
    required: true,
    type: "array",
    message: "请选择时段",
    trigger: "change"
  }, {
    required: true,
    validator: tripListValidate,
    trigger: "change"
  }]
}
export const formValidate10 = {
  longTrip: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
  fare: [{
    type: "number",
    required: true,
    message: "请填写",
    trigger: "change"
  }],
}
export const addData = {
  strategyName: "", // 策略名称
  productLine: 4, // 产品线
  effectiveTime: "", // 生效时间
  cityCode: "", // 城市
  vehicleLevel: "", // 车型等级
  // 起步费
  baseFare: {
    isStartFares: true,
    isLow: true,
    startFares: [{
      startDuration: null,
      startTrip: null,
      startTime: "",
      endTime: "",
      startFare: null,
      time: []
    }],
    // 最低消费
    lowestFare: null,
    lowestModel: null
  },
  // 里程时段
  tripFares: [{
    fare: null,
    startTime: "",
    endTime: "",
    time: []
  }],
  // 时长时段
  timeFares: [{
    fare: null,
    startTime: "",
    endTime: "",
    time: []
  }],
  // 超时等待
  isOver: true,
  beyondTimeFare: null,
  freeWaitTime: null,
  // 夜间费
  isNight: true,
  nightFares: [{
    fare: null,
    startTime: "",
    endTime: "",
    time: []
  }],
  // 信用金比例
  isCreditRate: true,
  creditRate: null,
  // 远途时段
  longTripFares: [{
    longTripFareDtos: [{
      fare: null,
      longTrip: null
    }],
    time: [],
    startTime: "",
    endTime: ""
  }],

}



let abc = {
  "cityUuid": "3535",
  "baseFare": {
    "startFares": [{
      "startDuration": 11,
      "startTrip": 11.09,
      "startTime": "11:11:09",
      "endTime": "11:11:11",
      "startFare": 11.11
    }],
    "lowestFare": 1.1,
    "lowestModel": 1
  },
  "cityCode": "123456",
  "effectiveTime": 1600531200000,
  "modifier": "22222222222222222222222",
  "creatorName": "朱伟",
  "vehicleLevel": 2,
  "beyondTimeFare": 55.55,
  "updater": "zhuwei",
  "productLine": 2,
  "modifyTime": 1599557319107,
  "cityName": "南京",
  "areaName": "江宁区",
  "strategyName": "策略名称",
  "creator": "3333333333333333333333333333333",
  "modifyDate": 1599557319107,
  "creditRate": 66,
  "provinceCode": "provinceCode",
  "longTripFares": [{
    "longTripFareDtos": [{
      "fare": 22.22,
      "longTrip": 22.21
    }],
    "startTime": "22:22:21",
    "endTime": "22:22:22"
  }],
  "updateTime": 1599557319107,
  "areaCode": "702424",
  "createTime": 1599557319107,
  "versions": 1,
  "nightFares": [{
    "fare": 33.3,
    "startTime": "33:33:32",
    "endTime": "33:33:33"
  }],
  "provinceName": "provinceName",
  "freeWaitTime": 77,
  "tripFares": [{
    "fare": 33.3,
    "startTime": "44:44:43",
    "endTime": "44:44:44"
  }],
  "timeFares": [{
    "fare": 33.3,
    "startTime": "33:33:32",
    "endTime": "33:33:33"
  }]
}
