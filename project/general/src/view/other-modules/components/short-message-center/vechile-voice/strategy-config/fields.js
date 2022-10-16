import { getBusinessLine } from "_g/config/status-map";
import { mapToList } from '@/libs/util.js'

export const businessInfo = getBusinessLine([4, 2])
export const broadcastStatusMap = {
  0:'未播报',
  1:'已播报'
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
    name: 'date-input',
    bind_key: ['startTimeEffective' ,'endTimeEffective'],
    placeholder: '请选择生效日期',
    value: '',
    separator:' 至 ',
    title: '生效日期'
  },
]
export const parColumns = [
  {
    title: '策略名称',
    key: 'strategyName',
    minWidth: 140,
    fixed:'left',
    tooltip: true,
    ellipsis: true
  },
  {
    title: '产品线',
    key: 'businessName',
    tooltip: true,
    minWidth: 90,
    ellipsis: true
  },
  {
    title: '城市',
    key: 'cityName',
    minWidth: 90,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '所属省份',
    key: 'provinceName',
    minWidth: 90,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '生效时间',
    key: 'effectiveTime',
    minWidth: 160,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 90,
    render(h,params) {
      return h('span',statusMap[params.row.effectiveStatus])
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    minWidth: 160,
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
    minWidth: 150,
    tooltip: true,
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    tooltip: true,
    fixed:'right',
    width: 140,
    slot: 'action',
  }
]
