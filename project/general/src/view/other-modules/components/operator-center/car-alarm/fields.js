import { timeFormat } from "@/libs/util";
import { typeModuleMap } from "_g/config/status-map";
// 业务线
let lineList=[
  {
    label: '快享',
    value: 4
  }
]
let lineMap= typeModuleMap
// lineList.forEach(item=>{
//   lineMap[item.value] = item.label
// })
// 状态
let statusList=[
  {
    label: '告警中',
    value: 1
  },
  {
    label: '已解除',
    value: 2
  }
]
let statusMap= {}
statusList.forEach(item=>{
  statusMap[item.value] = item.label
})
// 告警类型
let typeList=[
  {
    label: '实时同步告警',
    value: '1'
  },
  {
    label: '续航告警',
    value: '2'
  },
  {
    label: '里程告警',
    value: '3'
  },
  {
    label: 'TBOX告警',
    value: '4'
  },
  {
    label: 'GPS告警',
    value: '5'
  },
  {
    label: '车机告警',
    value: '6'
  },
  {
    label: '报警按钮告警',
    value: '7'
  },
  {
    label: '人脸识别失败告警',
    value: '8'
  },
  {
    label: '车机位置异常告警',
    value: '9'
  },
  {
    label: '点火状态下TBOX心跳异常告警',
    value: '10'
  },
  {
    label: '熄火状态下TBOX心跳异常告警',
    value: '11'
  },
  {
    label: 'AIBOX登陆异常告警',
    value: '12'
  },
  {
    label: 'TBOX数据完整性异常告警',
    value: '13'
  },
  {
    label: 'token验签失败告警',
    value: '14'
  },
  {
    label: 'token过期告警',
    value: '15'
  },
  {
    label: '车机屏未激活告警',
    value: '16'
  }
]
let typeMap= {}
typeList.forEach(item=>{
  typeMap[item.value] = item.label
})
let chargingStatusMap = {
  0: '未充电',
  1: '充电中'
}
let carStatusMap = {
  1:'点火',
  2:'熄火'
}
// table配置
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    vin: {
      title: '车辆VIN码',
      key: 'vin',
      ellipsis: true,
      tooltip: true,
      minWidth: 170
    },
    carNo: {
      title: '车牌号',
      key: 'carNo',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    driver: {
      title: '司机姓名/电话',
      key: 'driver',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    type: {
      title: '告警类型',
      key: 'type',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h('div', typeMap[params.row.type])
      }
    },
    alarmTime: {
      title: '告警时间',
      key: 'alarmTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        return h('div', timeFormat(params.row.alarmTime, "yyyy-mm-dd"))
      }
    },
    status: {
      title: '当前告警状态',
      key: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 90,
      render: (h, params) => {
        return h('div', statusMap[params.row.status])
      }
    },
    longitude: {
      title: '当前位置',
      key: 'longitude',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h('Tooltip', {
          props:{
            content:params.row.adress,
            'max-width':'250'
          },
          class:{
           'ellips-box':true
          },
          style: {
            'color':'#2d8cf0',
            'cursor':'pointer',
            'max-width':'160px'
          }
        },[
          h('span',{
            on: {
              click: () => {
                that.orderCarStatus = {
                  longitude:params.row.longitude,
                  latitude:params.row.latitude
                }
                that.popMap = true
              }
            }
          },params.row.adress)
        ])
      }
    },
    enduranceMiles: {
      title: '当前续航里程(Km)',
      key: 'enduranceMiles',
      ellipsis: true,
      tooltip: true,
      minWidth: 90
    },
    carStatus: {
      title: '当前车辆状态',
      key: 'carStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 80,
      render: (h, params) => {
        return h('div', carStatusMap[params.row.carStatus])
      }
    },
    chargingStatus: {
      title: '当前充电状态',
      key: 'chargeStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 80,
      render: (h, params) => {
        return h('div', chargingStatusMap[params.row.chargingStatus])
      }
    },
    speed: {
      title: '当前车速(Km/h)',
      key: 'speed',
      ellipsis: true,
      tooltip: true,
      minWidth: 90
    },
    alarmLifyTime: {
      title: '告警解除时间',
      key: 'alarmLifyTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        let val = params.row.alarmLifyTime?timeFormat(params.row.alarmLifyTime, "yyyy-mm-dd"):''
        return h('div', val)
      }
    },
    alarmSolver: {
      title: '告警解除人',
      key: 'alarmSolver',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    alarmResolvedDesc: {
      title: '故障原因及解除方案',
      key: 'alarmResolvedDesc',
      ellipsis: true,
      tooltip: true,
      minWidth: 150
    },
    comment: {
      title: '备注',
      key: 'comment',
      ellipsis: true,
      tooltip: true,
      minWidth: 150
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'car-alarm-remove'
            // }],
            on: {
              click: () => {
                that.seletedCarVin = params.row.vin
                that.contrlModal = true
              }
            }
          }, '远程控制'),
          h('Button', {
            props: {
              type: "primary",
              ghost: true,
              size: "small"
            },
            style:{
              display: params.row.status === 1 && params.row.type != '1' && Number(params.row.type)<8 ? 'inline-block':'none'
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'car-alarm-remove'
            }],
            on: {
              click: () => {
                that.cancelModalData = {
                  uuid:params.row.uuid,
                  alarmResolvedDesc:'',
                  comment:''
                }
                that.cancelModal = true
              }
            }
          }, '解除告警'),
          h('Button', {
            props: {
              type: "success",
              ghost: true,
              size: "small"
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'car-alarm-remove'
            // }],
            on: {
              click: () => {
                that.popHistoryViewStatus = true
                that.carId = params.row.vin
              }
            }
          }, '操作记录')
        ])
      }
    }
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "vin",
    placeholder: "请输入车辆VIN码",
    value: "",
    title: "车辆VIN码：",
    titleWidth: 80
  },
  {
    name: "text-input",
    bind_key: "carNo",
    placeholder: "请输入车牌号",
    value: "",
    title: "车牌号："
  },
  {
    name: "drop-input",
    bind_key: "status",
    placeholder: "请选择当前状态",
    dropList: statusList,
    clearable:true,
    value: "",
    title: "当前告警状态：",
    titleWidth: 90,
    inputWidth: 150
  },
  {
    name: "drop-input",
    bind_key: "type",
    placeholder: "请选择告警类型",
    dropList: typeList,
    clearable:true,
    value: "",
    title: "告警类型：",
  },
  {
    name: 'date-time-input',
    bind_key: ['alarmTimeRangeStart', 'alarmTimeRangeEnd'],
    placeholder: '请选择告警时间',
    value: '',
    title: '告警时间：',
    inputWidth: 260
  },
]
export const searchData = {}
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
export const ruleValidate = {
  alarmResolvedDesc:[
    { required: true, message: '请填写故障原因及解除方案', trigger: 'blur' }
  ]
}