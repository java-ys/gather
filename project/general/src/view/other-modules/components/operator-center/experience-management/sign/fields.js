export const tableTitle = (that) => {
  return [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    {
      title: '姓名',
      key: 'name',
      tooltip: true,
      minWidth: 100,
    },
    {
      title: '手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 130,
    },
    {
      title: '年龄',
      key: 'age',
      tooltip: true,
      minWidth: 90
    },
    {
      title: '性别',
      key: 'sex',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let sexList = ['', '男', '女']
        return h('span', sexList[params.row.sex])
      }
    },
    {
      title: '行业',
      key: 'occupation',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let occupationList = {
          1: '互联网-软件',
          2: '通讯-硬件',
          3: '房地产-建筑',
          4: '文化传媒',
          5: '金融类',
          6: '消费品',
          7: '汽车-机械',
          8: '教育-翻译',
          9: '贸易-物流',
          10: '生物-医疗',
          11: '能源-化工',
          12: '政府机构',
          13: '服务业',
          14: '其他行业'
        }
        return h('span', occupationList[params.row.occupation])
      }
    },
    {
      title: '学历',
      key: 'education',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let educationList = {
          1: '高中及以下',
          2: '专科',
          3: '本科',
          4: '硕士',
          5: '博士',
        }
        return h('span', educationList[params.row.education])
      }
    },
    {
      title: '用车频次',
      key: 'usageFrequencyType',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let isAttendances = {
          1: '月',
          2: '周',
        }
        let str = '';
        if (params.row.usageFrequencyMin == null) {
          str = `一${isAttendances[params.row.usageFrequencyType]}少于${params.row.usageFrequencyMax}次`
        }
        if (params.row.usageFrequencyMax == null) {
          str = `一${isAttendances[params.row.usageFrequencyType]}${params.row.usageFrequencyMin}次以上`
        }
        if (params.row.usageFrequencyMax != null && params.row.usageFrequencyMin != null) {
          str = `一${isAttendances[params.row.usageFrequencyType]}${params.row.usageFrequencyMin}~${params.row.usageFrequencyMax}次`
        }
        if (params.row.usageFrequencyMax == null && params.row.usageFrequencyMin == null) {
          str = ''
        }
        return h('span', str)
      }
    },
    {
      title: '用车时间',
      key: 'usagePeriod',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '申请时间',
      key: 'submitTime',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '申请状态',
      key: 'status',
      tooltip: true,
      width: 120,
      render: (h, params) => {
        let isAttendances = {
          0: '未提交',
          1: '申请中',
          2: '已通过',
          3: '未通过',
          4: '已删除',
        }
        return h('span', isAttendances[params.row.status])
      }
    },
    {
      title: '审批时间',
      key: 'approverTime',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '备注',
      key: 'approveDesc',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '审批人',
      key: 'approverUuid',
      tooltip: true,
      minWidth: 120
    }
  ]
}
export const signList = {
  queryAjaxPramas: {},
  signData: {},
  queryForm: {
    ageMin: null,
    ageMax: null
  },
  maxlength: 30,
  signType: [
    {
      text: '通过',
      value: 2
    },
    {
      text: '不通过',
      value: 3
    }
  ],
  dropList: [
    {
      label: '高中及以下',
      value: 1
    },
    {
      label: '专科',
      value: 2
    },
    {
      label: '本科',
      value: 3
    },
    {
      label: '硕士',
      value: 4
    },
    {
      label: '博士',
      value: 5
    },
  ],
  timeList: [
    {
      label: '07:00-09:00',
      value: '7:00-9:00'
    },
    {
      label: '09:00-16:00',
      value: '9:00-16:00'
    },
    {
      label: '16:00-19:00',
      value: '16:00-19:00'
    },
    {
      label: '19:00-07:00',
      value: '19:00-7:00'
    },
  ],
  frequencyList: [
    {
      label: '一周6次以上',
      value: '{"usageFrequencyType": 2,"usageFrequencyMin": 6,"usageFrequencyMax": null}'
    },
    {
      label: '一周3-6次',
      value: '{"usageFrequencyType": 2,"usageFrequencyMin": 3,"usageFrequencyMax": 6}'
    },
    {
      label: '一周1-2次',
      value: '{"usageFrequencyType": 2,"usageFrequencyMin": 1,"usageFrequencyMax": 2}'
    },
    {
      label: '一月1-3次',
      value: '{"usageFrequencyType": 1,"usageFrequencyMin": 1,"usageFrequencyMax": 3}'
    },
    {
      label: '一月少于一次',
      value: '{"usageFrequencyType": 1,"usageFrequencyMin": null,"usageFrequencyMax": 1}'
    },
  ],
  newMobel: false,
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  tableColumnsChecked: Object.keys(tableTitle)
}
