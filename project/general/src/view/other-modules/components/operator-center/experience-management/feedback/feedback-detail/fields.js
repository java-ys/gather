
// 提报单状态
export const statusMap = {
  1: '评估中',
  2: '未采纳',
  3: '已采纳',
  4: '已解决'
}
let statusList = []
Object.keys(statusMap).forEach(key => {
  statusList.push({
    value: key,
    label: statusMap[key]
  })
})
// 评估等级
export const gradeMap = {
  1: '无影响',
  2: '低级',
  3: '中级',
  4: '高级',
  5: '严重'
}
let gradeList = []
Object.keys(gradeMap).forEach(key => {
  gradeList.push({
    value: key,
    label: gradeMap[key]
  })
})
// 处理方式
export const modeMap = {
  2: '产品优化',
  1: '修复漏洞',
}
let modeList = []
Object.keys(modeMap).forEach(key => {
  modeList.push({
    value: key,
    label: modeMap[key]
  })
})
export const tableTitle = (that) => {
  return [
    {
      title: '提报单编号',
      key: 'feedbackCode',
      tooltip: true,
      minWidth: 100,
      fixed: 'left'
    },
    {
      title: '提报人姓名',
      key: 'userName',
      tooltip: true,
      minWidth: 180
    },
    {
      title: '提报人手机号',
      key: 'userMobile',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '提报单类型',
      key: 'feedbackTypeName',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '提报单提交时间',
      key: 'feedbackDate',
      tooltip: true,
      minWidth: 140
    },
    {
      title: '提报单状态',
      key: 'assessStatus',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('span', statusMap[params.row.assessStatus])
      }
    },
    {
      title: '等级',
      key: 'assessLevel',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('span', gradeMap[params.row.assessLevel])
      }
    },
    {
      title: '处理方式',
      key: 'assessHandle',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('span', modeMap[params.row.assessHandle])
      }
    },
    {
      title: '奖励T币',
      key: 'assessCoin',
      tooltip: true,
      width: 120,
    },
    {
      title: '评估人/解决人',
      key: 'billNumber',
      ellipsis: true,
      width: 160,
      render: (h, params) => {
        let str = params.row.assessUserName==''&&params.row.resolveUserName==''?'':`${params.row.assessUserName}/${params.row.resolveUserName}`
        return h('span', str)
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 250,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'success',
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'feedback-detail'
            }],
            on: {
              click: () => {
                that.isDetailModal = true;
                that.detailParams={
                  uuid: params.row.uuid
                }
              }
            }
          }, '详情'),
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            style: {
              display: params.row.assessStatus === 1  ? 'inline-block' : 'none'
            },
            directives: [{
              name: 'hasAuth',
              value: 'feedback-handle'
            }],
            on: {
              click: () => {
                that.isEvaluateModal = true;
                that.evaluateParams={
                  uuid: params.row.uuid
                }
              }
            }
          }, '评定'),
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            style: {
              display: !params.row.assessCoin&& (params.row.assessStatus == 3||params.row.assessStatus == 4) ? 'inline-block' : 'none'
            },
            directives: [{
              name: 'hasAuth',
              value: 'feedback-send'
            }],
            on: {
              click: () => {
                that.istModal = true;
                that.tParams={
                  uuid: params.row.uuid
                }
              }
            }
          }, 'T币发放'),
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            style: {
              display: params.row.assessStatus == 3 ? 'inline-block' : 'none'
            },
            directives: [{
              name: 'hasAuth',
              value: 'feedback-solve'
            }],
            on: {
              click: () => {
                that.isSolveModal = true;
                that.solveParams={
                  uuid: params.row.uuid,
                  resolveUserName: params.row.resolveUserName
                }
              }
            }
          }, '已解决'),
        ])
      }
    }

  ]
}
export const feedbackData = {
  queryAjaxPramas: {},
  isDetailModal: false,//详情页
  isSolveModal: false,//已解决页
  isEvaluateModal: false,//评价页
  istModal: false,//T币页
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  tableColumnsChecked: Object.keys(tableTitle)
}

export const inputList = [
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'userNameLike', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '提报人姓名：', // 展示的字段名
    titleWidth: 75
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'userMobileLike', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '提报人手机号：', // 展示的字段名
    titleWidth: 85
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'feedbackTypeUuid', // 返回数据的key名
    placeholder: '请选择',
    value: '', // 用于数据绑定
    title: '提报单类型：', // 展示的字段名
    dropList: [],
    titleWidth: 75
  },
  {
    name: 'date-time-input',
    bind_key: ['feedbackDateStart' ,'feedbackDateEnd'],
    placeholder: '请选择提交日期',
    value: '',
    title: '提报单提交时间：',
    titleWidth: 100,
    inputWidth:250
},
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'assessStatus', // 返回数据的key名
    placeholder: '请选择',
    value: '', // 用于数据绑定
    title: '提报单状态：', // 展示的字段名
    dropList: statusList,
    titleWidth: 75
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'assessLevel', // 返回数据的key名
    placeholder: '请选择',
    value: '', // 用于数据绑定
    title: '评估等级：', // 展示的字段名
    dropList: gradeList
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'assessHandle', // 返回数据的key名
    placeholder: '请选择',
    value: '', // 用于数据绑定
    title: '处理方式：', // 展示的字段名
    dropList: modeList
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'assessUserNameLike', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '评估人：'
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'resolveUserNameLike', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '解决人：'
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'feedbackCode', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '提报单编号：', // 展示的字段名
    titleWidth: 75
  },
]