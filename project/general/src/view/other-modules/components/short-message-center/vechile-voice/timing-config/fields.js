import { getBusinessLine } from "_g/config/status-map";
import { mapToList } from '@/libs/util.js'

export const businessInfo = getBusinessLine([4, 2])
export const broadcastStatusMap = {
  1:'未播报',
  2:'已播报'
}
export const statusMap = {
  0:'未开始',
  1:'生效中',
  2:'已失效'
}
export const statusList = mapToList(statusMap)


export const inputList = [
  {
    name: 'remote-scroll',//下拉
    bind_key: 'strategyName',
    dataKey: "strategyName",
    dataLabel: "strategyName",
    queryName: "strategyName",
    placeholder: "请输入策略名称",
    value: '',
    title: '策略名称',
    isHide: false,
  },
  {
    name: 'drop-input',
    bind_key: 'businessType',
    value: '',
    dropList: businessInfo.list,
    title: '产品线',
    placeholder: '请选择',
    inputWidth: 150
  },
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "城市：",
    titleWidth: 50,
    changeOnSelect: false
  },
  {
    name: 'drop-input',
    bind_key: 'effectiveStatus',
    value: '',
    dropList: statusList,
    title: '状态',
    placeholder: '请选择',
    titleWidth: 40,
    inputWidth: 150
  },
  {
    name: 'date-time-input',
    bind_key: ['startTimeBroadcast' ,'endTimeBroadcast'],
    placeholder: '请选择播报时段',
    value: '',
    title: '播报时段：',
    inputWidth: 290,
    format: 'yyyy-MM-dd HH:mm:ss',
    placement: 'bottom-start'
  },
]
export const parColumns = [
  {
    title: '策略名称',
    key: 'strategyName',
    minWidth: 130,
    fixed:'left',
    tooltip: true,
    ellipsis: true
  },
  {
    title: '产品线',
    key: 'businessName',
    tooltip: true,
    minWidth: 80,
    ellipsis: true
  },
  {
    title: '城市',
    key: 'cityName',
    minWidth: 120,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '播报时段',
    key: 'timeRang',
    minWidth: 290,
    tooltip: true,
    ellipsis: true,
    render(h,params) {
      return h('span',`${params.row.startTimeBroadcast}至${params.row.endTimeBroadcast }`)
    }
  },
  {
    title: '生效状态',
    key: 'effectiveStatus',
    minWidth: 90,
    render(h,params) {
      return h('span',statusMap[params.row.effectiveStatus])
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    minWidth: 170,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '操作人',
    key: 'optName',
    minWidth: 90,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '版本号',
    key: 'version',
    minWidth: 120,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '是否播报',
    key: 'broadcastStatus',
    minWidth: 90,
    render(h,params) {
      return h('span',broadcastStatusMap[params.row.broadcastStatus])
    }
  },
  {
    title: '播报车辆数',
    key: 'broadcastCarCount',
    minWidth: 100,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    tooltip: true,
    fixed:'right',
    width: 220,
    slot: 'action',
  }
]
