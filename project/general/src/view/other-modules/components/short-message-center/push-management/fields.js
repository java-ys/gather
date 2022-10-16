
import { listToMap } from '@/libs/util.js'
export const statusList = [
  {
    label: '处理中',
    value: 4
  },
  {
    label: '待推送',
    value: 2
  },
  {
    label: '已推送',
    value: 1
  },
  {
    label: '已撤销',
    value: 3
  },
  {
    label: '待审核',
    value: 5
  },
  {
    label: '已驳回',
    value: 6
  },
  {
    label: '已失效',
    value: 7
  },

]
export const pushStatusMap = listToMap(statusList)
export const batchStatusMap = {
  ...pushStatusMap,
  4: '数据处理中'
}
export const fields = {
  inputList: [
    {
      name: 'text-input',
      bind_key: 'title',
      placeholder: '请输入',
      value: '',
      title: 'PUSH标题：'
    },
    {
      name: 'cascader-input',
      bind_key: ['provinceCode', 'cityCodes'],
      placeholder: '请选择',
      value: [],
      cascaderList: [],
      title: '发送城市 ：',
      filterable: true,
    },
    {
      name: 'drop-input',
      bind_key: 'pushRole',
      placeholder: '请选择',
      value: '',
      dropList: [{
        value: '1',
        label: '司机'
      },
      {
        value: '2',
        label: '乘客'
      },
      ],
      title: '发送对象：'
    },
    {
      name: 'date-input',
      bind_key: ['pushStartTime', 'pushEndTime'],
      placeholder: '请选择',
      value: '',
      title: '发送日期：'
    },
    {
      name: 'date-input',
      bind_key: ['createdStartTime', 'createdEndTime'],
      placeholder: '请选择',
      value: '',
      title: '任务创建日期：',
      titleWidth: 90,
    },
    {
      name: 'drop-input',
      bind_key: 'pushStatus',
      placeholder: '请选择',
      value: '',
      dropList: statusList,
      title: '状态 :',
      titleWidth: 45,
    }
  ]
}

export const parColumns = (that) => {
  return [
    {
      type: 'selection',
      width: 60,
      fixed: 'left',
      align: 'center'
    },
    {
      title: '序号',
      type: "index",
      minWidth: 70,
      fixed: 'left',
      key:'index',
      fixDisabled:true
    },
    {
      key: 'title',
      title: 'PUSH标题',
      minWidth: 160,
      tooltip: true,
      fixed: 'left',
      fixDisabled:true
    },

    {
      key: 'subTitle',
      title: 'PUSH副标题',
      minWidth: 160,
      tooltip: true
    },
    {
      title: '发送城市',
      key: 'cityNames',
      minWidth: 150,
      tooltip: true
    },
    {
      key: 'pushRole',
      title: '发送对象',
      minWidth: 160,
      tooltip: true,
      render: (j, params) => {
        return j('div', [
          j('span', {
            style: {
              display: (params.row.pushRole == 1) ? 'inline-block' : 'none'
            }
          }, '司机'),
          j('span', {
            style: {
              display: (params.row.pushRole == 2) ? 'inline-block' : 'none'
            }
          }, '乘客'),
        ])
      }
    },
    {
      key: 'target',
      title: '用户选择方式',
      minWidth: 160,
      tooltip: true,
      render: (j, params) => {
        return j('div', [
          j('span', {
            style: {
              display: (params.row.target == 1) ? 'inline-block' : 'none'
            }
          }, '指定用户或者司机'),
          j('span', {
            style: {
              display: (params.row.target == 2) ? 'inline-block' : 'none'
            }
          }, '指定条件 '),
          j('span', {
            style: {
              display: (params.row.target == 3) ? 'inline-block' : 'none'
            }
          }, '批量'),
          j('span', {
            style: {
              display: (params.row.target == 4) ? 'inline-block' : 'none'
            }
          }, '用户分群'),
        ])
      }
    },
    {
      key: 'pushLink',
      title: '跳转链接',
      minWidth: 160,
      tooltip: true
    },
    {
      key: 'pushStatus',
      title: '状态',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('div', [pushStatusMap[params.row.pushStatus]])
      }
    },
    {
      key: 'sendQuantity',
      title: '发送人数',
      minWidth: 140,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===4 ? '-' : row.sendQuantity
        return h('span', res)
      }
    },
    {
      key: 'reachQuantity',
      title: '送达人数',
      minWidth: 140,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===1 ? row.reachQuantity : '-'
        return h('span', res)
      }
    },
    {
      key: 'notReachQuantity',
      title: '未送达人数',
      minWidth: 140,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===1 ? row.notReachQuantity : '-'
        return h('span', res)
      }
    },
    {
      title: '送达率',
      key: 'reachQuantityRatio',
      minWidth: 100,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===1 ? `${row.reachQuantityRatio}%` : '-'
        return h('span', res)
      }
    },
    {
      key: 'haveRead',
      title: '已读人数',
      minWidth: 140,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===1 ? row.haveRead : '-'
        return h('span', res)
      }
    },
    {
      key: 'notRead',
      title: '未读人数',
      minWidth: 140,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===1 ? row.notRead : '-'
        return h('span', res)
      }
    },
    {
      title: '阅读率',
      key: 'haveReadRatio',
      minWidth: 100,
      tooltip: true,
      render: (h, {row}) => {
        let res = row.pushStatus===1 ? `${row.haveReadRatio}%` : '-'
        return h('span', res)
      }
    },
    {
      key: 'pushTime',
      title: '发送时间',
      minWidth: 160,
      tooltip: true
    },
    {
      key: 'creatorName',
      title: '创建人',
      minWidth: 160,
      tooltip: true
    },
    {
      key: 'createTime',
      title: '创建时间',
      minWidth: 160,
      tooltip: true
    },
    {
      key: 'action',
      title: '操作',
      width: 140,
      fixed: 'right',
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'info',
              ghost: true,
              size: 'small'
            },
            directives: [{
              name: 'hasAuth',
              value: 'push-center-detail'
            }],
            on: {
              click: () => {
                let id = params.row.uuid
                // that.goToDetail(id)
                that.getDetail(id)
                that.detailModal = true
              }
            }
          }, '详情'),
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: 'small'
            },
            directives: [{
              name: 'hasAuth',
              value: 'push-center-giveUp'
            }],
            style: {
              marginLeft: '15px',
              display: params.row.pushStatus == 2|| params.row.pushStatus ===4? 'inline-block' : 'none',
            },
            on: {
              click: () => {
                that.handleAbord(params.row)
              }
            }
          }, '撤销'),
        ])
      }
    },
  ]
}