import { mapToList } from '@/libs/util.js'
let submitStatusMap = {
  0: '未报备',
  1: '已报备(正常)',
  2: '已报备(异常)'
}
export const submitStatusList = mapToList(submitStatusMap)
export const auditsMap = {
  0: '待审核',
  1: '审核通过',
  2: '审核驳回',
}
export const auditList = mapToList(auditsMap)

export const inputList = [
  {
    name: 'date-input',
    bind_key: ['dateBegin','dateEnd'],
    placeholder: '请选择日期',
    value: '',
    titleWidth: 45,
    separator: ' 至  ',
    title: '日期'
  },
  {
    name: 'remote-scroll',//下拉
    bind_key: 'queryParam',
    dataKey: "result",
    dataLabel: "result",
    queryName: "param",
    placeholder: "请输入：司机姓名/手机号/车牌号",
    value: '',
    title: '司机信息',
    isHide: false,
    inputWidth:250
  },
  {
    name: "drop-input",
    bind_key: "submitStatus",
    value: "",
    dropList: submitStatusList,
    title: "是否报备：",
    inputWidth:120
  },
  {
    name: "drop-input",
    bind_key: "auditStatus",
    value: "",
    dropList: auditList,
    title: "审核状态：",
    inputWidth:120
  }
]
let photoObj = (that,list,title)=>{
  return {
    class:{
      tableLinkHover: true
    },
    on: {
      click: () => {
        that.openCarousel(list,title)
      }
    }
  }
}
export const parColumns = (that)=>{
  return [
    {
      title: '日期',
      key: 'createTime',
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      ellipsis: true,
      minWidth: 90
    },
    {
      title: '手机号',
      key: 'mobile',
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: '车牌号',
      key: 'plateNumber',
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: '体温℃',
      key: 'temperature',
      tooltip: true,
      ellipsis: true,
      minWidth: 80
    },
    {
      title: '体温照片',
      key: 'temperatureImgs',
      tooltip: true,
      ellipsis: true,
      minWidth: 90,
      render: (h, params) => {
        let list = params.row.temperatureImgs
        if(list.length>0){
          return h('div',photoObj(that,list,'体温照片'), '查看')
        }else{
          return h('div', '无')
        }
      }
    },
    {
      title: '健康码照片',
      key: 'disfectImgs',
      tooltip: true,
      ellipsis: true,
      minWidth: 90,
      render: (h, params) => {
        let list = params.row.disfectImgs
        if(list.length>0){
          return h('div',photoObj(that,list,'健康码照片'), '查看')
        }else{
          return h('div', '无')
        }
      }
    },
    {
      title: '口罩照片',
      key: 'maskImges',
      tooltip: true,
      ellipsis: true,
      minWidth: 90,
      render: (h, params) => {
        let list = params.row.maskImges
        if(list.length>0){
          return h('div',photoObj(that,list,'口罩照片'), '查看')
        }else{
          return h('div', '无')
        }
      }
    },
    {
      title: '提交时间',
      key: 'submitDateTime',
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: '报备状态',
      key: 'submitStatus',
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', submitStatusMap[params.row.submitStatus])
      }
    },
    {
      title: '审核状态',
      key: 'auditStatus',
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', auditsMap[params.row.auditStatus])
      }
    },
    {
      title: '操作',
      key: 'action',
      tooltip: true,
      fixed: 'right',
      width: 180,
      slot: 'action',
    }
  ]  
}
