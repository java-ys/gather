import { mapToList } from '@/libs/util.js'

export const terminalMap = {
  1: '自营App',
  8: '微信小程序',
  14: '支付宝小程序'
}
export const sceneMap = {
  1: '普通叫车',
  2: '代叫车'
}
export const statusMap = {
  1: '有效',
  0: '无效'
}
export const terminalList = mapToList(terminalMap)
export const sceneList = mapToList(sceneMap)
export const statusList = [
  {
    label: '有效',
    value: 1
  },
  {
    label: '无效',
    value: 0
  }
]

/**
 * @param {Array} list
 * @param {*} data
 * @param {String} keyName
 * @param {String} resKey
 * @returns { String }
 */
 export const getListObjItemValue = (list, val, keyName = "value", resKey = "label") => {
  const item =  list.find(it => it[keyName] === val) || {}
  return item[resKey] || ""
}
export const inputList = [
  {
    name: 'drop-input',
    bind_key: 'extendBizType',
    value: '',
    dropList: [],
    title: '业务线',
    placeholder: '请选择业务线',
    titleWidth: 80,
    inputWidth: 200,
  },
  {
    name: 'drop-input',
    bind_key: 'businessLine',
    value: '',
    dropList: [],
    title: '产品线',
    placeholder: '请选择产品线',
    titleWidth: 80,
    inputWidth: 200,
  },
  {
    name: 'drop-input',
    bind_key: 'terminalList',
    value: '',
    dropList: terminalList,
    title: '终端',
    placeholder: '请选择终端',
    titleWidth: 40,
    inputWidth: 320,
    multiple: true
  },
  {
    name: 'drop-input',
    bind_key: 'sceneList',
    value: '',
    dropList: sceneList,
    title: '场景',
    placeholder: '请选择场景',
    titleWidth: 40,
    multiple: true
  },
  {
    name: 'drop-input',
    bind_key: 'status',
    value: '',
    dropList: statusList,
    title: '状态',
    placeholder: '请选择状态',
    titleWidth: 40,
    inputWidth: 120
  }
]
export const parColumns = that => {
  return  [
    {
      title: "业务线",
      key: "extendBizType",
      tooltip: true,
      minWidth: 100,
      render: (h, { row }) => {
        let text = getListObjItemValue(that.businessGradeList, row.extendBizType);
        return h("div", text);
      }
    },
    {
      title: '终端',
      key: 'terminal',
      minWidth: 130,
      render(h,params) {
        return h('span',terminalMap[params.row.terminal])
      }
    },
    {
      title: '场景',
      key: 'scene',
      minWidth: 120,
      render(h,params) {
        return h('span',sceneMap[params.row.scene])
      }
    },
    {
      title: '状态',
      key: 'status',
      minWidth: 90,
      render(h,params) {
        return h('span',statusMap[params.row.status])
      }
    },
    {
      title: '更新时间',
      key: 'updateTime',
      minWidth: 170,
      render(h,params) {
        return h('span',params.row.updateTime?params.row.updateTime.replace(/-/g,'/'):'')
      }
    },
    {
      title: '操作人',
      key: 'updater',
      minWidth: 90,
      tooltip: true,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      tooltip: true,
      fixed:'right',
      minWidth: 150,
      slot: 'action',
    }
  ]
}