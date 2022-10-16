let teleMap = {
  0: '联通',
  1: '移动'
}
let simMap = {
  "-1":"认证失败",
  "0": "未认证",
  "1": "认证中",
  "2":"已认证",
   "3": "已解绑"
}
// table数据
export const returnFields = (that) => {
  return {
    xuhao: {
      title: '序号',
      key: 'xuhao',
      minWidth: 60,
      render: (h, params) => {
        let index = params.index + 1
        let before = that.pageSize * (that.current - 1)
        return h('div', before + index)
      }
    },
    cityName: {
      title: '城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    rewardAmount: {
      title: '适用运营商',
      key: 'agentName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    ruleStatus: {
      title: '通讯运营商',
      key: 'ruleStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let arr = params.row.carrier.split(',')
        let text = ''
        arr.forEach(element => {
          text = text + ' ' + teleMap[element]
        })
        return h('div', text)
      }
    },
    // simAuthStatus: {
    //   title: '实名认证状态',
    //   key: 'simAuthStatus',
    //   ellipsis: true,
    //   tooltip: true,
    //   minWidth: 120,
    //   render: (h, params) => {
    //     return h('div', "关闭")
    //   }
    // },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 190,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'warning',
              ghost: true,
              size: 'small'
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'sim-config-edit'
            }],
            on: {
              click: () => {
                let data = {
                  uuid: params.row.uuid,
                  agentUuid: params.row.agentUuid,
                  agentuuid: params.row.agentuuid,
                  carriershow: params.row.carrier.split(','),
                  carrier: params.row.carrier,
                  simAuthStatus: params.row.simAuthStatus,
                  provinceCode: params.row.provinceCode,
                  cityCode: params.row.cityCode,
                  citycode: params.row.cityCode
                }
                that.getDetail(data)
              }
            }
          }, '编辑'),
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: 'small'
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'sim-config-delete'
            }],
            on: {
              click: () => {
                that.handleDelete(params.row.uuid)
              }
            }
          }, '删除')
        ])
      }
    }
  }
}

// table数据2
export const returnFields2 = (that) => {
  return {
    xuhao: {
      title: '序号',
      key: 'xuhao',
      minWidth: 60,
      render: (h, params) => {
        let index = params.index + 1
        let before = that.pageSize * (that.current - 1)
        return h('div', before + index)
      }
    },
    cityName: {
      title: '城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    agentName: {
      title: '运营商',
      key: 'agentName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    plateNum: {
      title: '车牌号',
      key: 'plateNum',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let text2 = params.row.carrierName ? '(' + params.row.carrierName + ')' : ''
        let text = params.row.plateNum + text2
        return h('div', text)
      }
    },
    vin: {
      title: '车架号',
      key: 'vin',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    iccId: {
      title: 'ICCID',
      key: 'iccId',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    mobile: {
      title: '手机卡号',
      key: 'phoneNum',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    // simAuthStatus: {
    //   title: '实名认证状态',
    //   key: 'simAuthStatus',
    //   ellipsis: true,
    //   tooltip: true,
    //   minWidth: 120,
    //   render: (h, params) => {
    //     let text = simMap[params.row.simAuthStatus]
    //     return h('div', text)
    //   }
    // },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 190,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: 'small'
            },
            class: {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'sim-config-delete'
            }],
            on: {
              click: () => {
                that.handleDelete(params.row.uuid)
              }
            }
          }, '删除')
        ])
      }
    }
  }
}

// 搜索列表数据
export const inputList = [
  // {
  //   name: 'cascader-input', // 文本输入框名
  //   bind_key: ['provinceCode', 'cityCode'], // 返回数据的key名
  //   placeholder: '请选择省/市',
  //   value: [], // 绑定返回数据
  //   cascaderList: [], // 级联列表
  //   filterable: true,
  //   title: '城市：'
  // },
  {
    name: 'cascader-input',
    inputWidth: '180',
    key: 'operatorName',
    bind_key: ['provinceCode', 'cityCode','agentUuid'],
    cascaderList: [],
    placeholder: '请选择运营商',
    value: [],
    title: '所属运营商：',
    titleWidth: 100
  },
  {
    name: 'drop-input',
    bind_key: 'carrier',
    inputWidth: '120',
    placeholder: '请选择状态',
    dropList: [
      {
        value: '_all',
        label: '全部'
      },
      {
        value: '0',
        label: '联通'
      },
      {
        value: '1',
        label: '移动'
      }
    ],
    value: 1,
    title: '通讯运营商：',
    clearable: true,
    titleWidth: 120
  },
  // {
  //   name: 'drop-input',
  //   bind_key: 'simAuthStatus',
  //   placeholder: '请选择状态',
  //   dropList: [
  //     {
  //       value: '0',
  //       label: '关闭'
  //     },
  //     {
  //       value: '1',
  //       label: '开启'
  //     },
  //     {
  //       value: '0,1',
  //       label: '全部'
  //     }
  //   ],
  //   value: 1,
  //   title: '状态：',
  //   clearable: true
  // }
]
// 搜索列表 搜索列表数据
export const inputList2 = [
  // {
  //   name: 'cascader-input', // 文本输入框名
  //   bind_key: ['provinceCode', 'cityCode'], // 返回数据的key名
  //   placeholder: '请选择省/市',
  //   value: [], // 绑定返回数据
  //   cascaderList: [], // 级联列表
  //   filterable: true,
  //   title: '城市：'
  // },
  {
    name: 'cascader-input',
    inputWidth: '180',
    key: 'operatorName',
    bind_key: ['provinceCode', 'cityCode','agentUuid'],
    cascaderList: [],
    placeholder: '请选择运营商',
    value: [],
    title: '所属运营商：',
    titleWidth: 100
  },
  {
    name: 'text-input',
    bind_key: 'plateNum',
    placeholder: '请输入车牌号',
    value: '',
    title: '车牌号:'
  },
  {
    name: 'text-input',
    bind_key: 'vin',
    placeholder: '请输入车架号',
    value: '',
    title: '车架号:'
  },
  {
    name: 'drop-input',
    bind_key: 'carrier',
    placeholder: '请选择状态',
    inputWidth: '180',
    dropList: [
      {
        value: '_all',
        label: '全部'
      },
      {
        value: '0',
        label: '联通'
      },
      {
        value: '1',
        label: '移动'
      },
    ],
    value: '',
    title: '通讯运营商：',
    clearable: true,
    titleWidth: 100
  }
]
// 表单校验
export const addCityParamsRule = {
  city: [
    {
      required: true,
      type: 'array',
      min: 2,
      message: '城市不能为空',
      trigger: 'change'
    }
  ], // 城市
  rewardAmount: [
    { required: true, type: 'number', message: '奖励金额不能为空', trigger: 'blur' }
  ] // 品牌
}
export const ruleValidate = {
  cityCode: [
    { required: true, type: 'string', message: '不能为空', trigger: 'change' }
  ],
  agentUuid: [
    { required: true, type: 'string', message: '不能为空', trigger: 'change' }
  ],
  carrier: [
    { required: true, type: 'string', message: '不能为空', trigger: 'change' }
  ]
}
