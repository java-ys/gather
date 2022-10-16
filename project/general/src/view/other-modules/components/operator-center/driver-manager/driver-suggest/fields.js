
import { mapToList } from '@/libs/util.js'
export const statusMap = {
  1: '已答复',
  0: '未答复'
}
export const statusList = mapToList(statusMap)
export const proposalTypeMap = {
  1: '产品建议',
  2: '管理政策'
}
export const proposalTypeList = mapToList(proposalTypeMap)

export const inputList = [
  {
    name: 'text-input',
    bind_key: 'feedbackName',
    value: '',
    title: '建议',
    titleWidth: 50
  },
  {
    name: "drop-input",
    bind_key: "proposalType",
    value: "",
    dropList: proposalTypeList,
    title: "分类",
    inputWidth: 110,
    titleWidth: 50
  },
  {
    name: 'text-input',
    bind_key: 'driverName',
    value: '',
    title: '提交人'
  },
  {
    name: 'text-input',
    bind_key: 'driverNo',
    value: '',
    title: '提交人ID'
  },
  {
    name: 'text-input',
    bind_key: 'driverPhone',
    value: '',
    title: '手机号'
  },
  {
    name: "cascader-input",
    bind_key: ["cityCode", "agentUuid","driverManagerUuid"],
    value: [],
    cascaderList: [],
    placeholder:'请选择市/运营商/司管',
    title: "城市/运营商/司管",
    changeOnSelect: true,
    titleWidth: 110
  },
  {
    name: "date-input", // 文本输入框名
    bind_key: ['startTimeSubmitTime','endTimeSubmitTime'], // 返回数据的key名
    placeholder: "请选择提交日期",
    value: "", // 用于数据绑定
    title: "提交时间：", // 展示的字段名
    inputWidth: 200, // input框的宽度
    options: {},
  },
  {
    name: "drop-input",
    bind_key: "replyStatus",
    value: "",
    dropList: statusList,
    title: "状态",
    inputWidth: 110,
    titleWidth: 50
  }
]
export const parColumns = (that)=>{
  return [
    {
      title: '建议',
      key: 'feedbackName',
      tooltip: true,
      ellipsis: true,
      fixed: 'left',
      minWidth: 200
    },
    {
      title: '分类',
      key: 'proposalType',
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render(h,params){
        return h('div',proposalTypeMap[params.row.proposalType])
      }
    },
    {
      title: '提交人',
      key: 'driverName',
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: '提交人ID',
      key: 'driverNo',
      tooltip: true,
      ellipsis: true,
      minWidth: 130
    },
    {
      title: '手机号',
      key: 'driverPhone',
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: '所属司管',
      key: 'driverManagerName',
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: '提交时间',
      key: 'submitTime',
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: '状态',
      key: 'replyStatus',
      tooltip: true,
      ellipsis: true,
      minWidth: 80,
      render(h,params){
        return h('div',statusMap[params.row.replyStatus])
      }
    },
    {
      title: '答复人',
      key: 'replyCreatorName',
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: '答复时间',
      key: 'replyTime',
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: '操作',
      key: 'action',
      tooltip: true,
      fixed: 'right',
      width: 80,
      slot: 'action',
    }
  ]  
}
