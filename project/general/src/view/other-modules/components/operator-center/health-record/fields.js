import { mapToList } from '@/libs/util.js'
let crowdMap = {
  1: '乘客',
  2: '司机',
}
export const crowdList = mapToList(crowdMap)
export const riskMap = {
  1: '高',
  2: '中',
  3: '低',
}
export const riskList = mapToList(riskMap)

export const inputList = [
  {
    name: 'date-input',
    bind_key: ['startDate','endDate'],
    placeholder: '请选择日期',
    value: '',
    titleWidth: 45,
    separator: ' 至  ',
    title: '日期：'
  },
  {
    name: "drop-input",
    bind_key: "role",
    value: "",
    dropList: crowdList,
    placeholder: '请选择乘客/司机',
    title: "人群：",
    inputWidth:150
  },
  {
    name: "drop-input",
    bind_key: "riskLevel",
    placeholder: '请选择风险等级',
    value: "",
    dropList: riskList,
    title: "风险等级：",
    inputWidth:150
  }
]

export const parColumns = (that)=>{
  return [
    {
      title: '时间',
      key: 'createTime',
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: '人群',
      key: 'role',
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', crowdMap[params.row.role])
      }
    },
    {
      title: '市',
      key: 'cityName',
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: '姓名',
      key: 'userName',
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: '手机号',
      key: 'phone',
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },

    {
      title: '风险等级',
      key: 'riskLevel',
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', riskMap[params.row.riskLevel])
      }
    },
  ]
}
