
import { mapToList } from '@/libs/util.js'
export const statusMap = {
  0: '停用中',
  1: '启用中'
}

export const typeMap = {
  0: '',
  1: '司管客服',
  2: '官方客服'
}

export const typeList = [
  {
    value:"1",
    name:'司管客服'
  },
  {
    value:"2",
    name:"官方客服"
  }
]

export const statusList = mapToList(statusMap)

export const inputList = [
  {
    name: 'text-input',
    bind_key: 'faqName',
    value: '',
    title: '问题名称'
  },
  {
    name: "drop-input",
    bind_key: "faqStatus",
    value: "",
    dropList: statusList,
    title: "状态",
    inputWidth: 110,
    titleWidth: 40
  }
]
export const parColumns = (that)=>{
  return [
    {
      title: '问题名称',
      key: 'faqName',
      tooltip: true,
      ellipsis: true,
      minWidth: 200
    },
    {
      title: '分类',
      key: 'catalogName',
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: '更新时间',
      key: 'updateTime',
      tooltip: true,
      ellipsis: true,
      minWidth: 170
    },
    {
      title: '操作人',
      key: 'optName',
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: '客服类型',
      key: '',
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render(h,params){
        return h('div',typeMap[params.row.customerServiceType])
      }
    },
    {
      title: '已解决评价次数',
      key: 'resolvedCount',
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: '未解决评价次数',
      key: 'unResolvedCount',
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: '状态',
      key: 'faqStatus',
      tooltip: true,
      ellipsis: true,
      minWidth: 80,
      render(h,params){
        return h('div',statusMap[params.row.faqStatus])
      }
    },
    {
      title: '操作',
      key: 'action',
      tooltip: true,
      fixed: 'right',
      width: 240,
      slot: 'action',
    }
  ]  
}
export const ruleValidate = {
  faqName: [{ required: true, message: '请填写问题名称', trigger: 'change' }],
  replyDesc: [{ required: true, message: '请填写答案', trigger: 'change' }],
  customerServiceType: [
    { required: true, message: '请选择客服类型', trigger: 'change' }
  ],
}