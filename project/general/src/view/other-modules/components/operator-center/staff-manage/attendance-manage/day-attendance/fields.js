export const tableTitle = (that)=>{
  return [
    {
      title: '运营区域',
      key: 'cityName',
      tooltip: true,
      minWidth: 100,
      fixed: 'left'
    },
    {
      title: '运营商',
      key: 'agnetName',
      tooltip: true,
      minWidth: 180
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机手机号',
      key: 'driverMobile',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '司机编号',
      key: 'driverNo',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '考勤日期',
      key: 'statDay',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '日在线时长',
      key: 'onlineDuration',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '日高峰时长',
      key: 'peakDuration',
      tooltip: true,
      minWidth: 120
    },
    /*{
      title: '订单数',
      key: 'billNumber',
      ellipsis: true,
      width: 180
    },
    {
      title: '日考勤',
      key: 'examineResult',
      ellipsis: true,
      width: 180
    },*/
    {
      title: '考勤结果',
      key: 'isAttendence',
      tooltip: true,
      width: 120,
      render:(h, params) =>{
        let isAttendances = ['未达标', '达标']
        return h('span', isAttendances[params.row.isAttendance])
      }
    },
    {
      title: '考勤规则版本',
      key: 'version',
      tooltip: true,
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "text",
              ghost: true,
              size: "small"
            },
            style:{color: '#2d8cf0',textDecoration: 'underline',display: params.row.version && params.row.cityName?'inline-block':'none'},
            on: {
              click: () => {
                that.detailParams = {
                  cityName: params.row.cityName,
                  examineType: 'D',
                  versionNumber: Number(params.row.version.slice(1,4))
                }
                that.isAttenRulesModal = true
              }
            }
          }, params.row.cityName+params.row.version)
        ])
      }
    }
  ]
} 
export const dayPageData = {
  queryAjaxPramas: {},//查询条件obj
  isAttenRulesModal: false,//考勤规则弹窗
  checkDays: [
    {
      text: '达标',
      value: 1
    },
    {
      text: '未达标',
      value: 0
    }
  ],
  validDays: [
    {
      text: '是',
      value: 1
    },
    {
      text: '否',
      value: 2
    },
  ],  
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
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceId', 'cityId'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '省 / 市：',
    changeOnSelect: true
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'agent', // 返回数据的key名
    placeholder: '请输入运营商名',
    value: '', // 用于数据绑定
    title: '运营商：'
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'driver', // 返回数据的key名
    placeholder: '请输入司机姓名',
    value: '', // 用于数据绑定
    title: '司机姓名：'
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'mobile', // 返回数据的key名
    placeholder: '请输入手机号',
    value: '', // 用于数据绑定
    title: '手机号：'
  },
  {
    name: 'date-input', // 文本输入框名
    bind_key: ['statDay', 'statDayEnd'], // 返回数据的key名
    placeholder: '请选择考勤日期',
    value: '', // 用于数据绑定
    title: '考勤日期：'
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'examineResult', // 返回数据的key名
    placeholder: '请选择考勤结果',
    value: '', // 用于数据绑定
    title: '考勤结果：', // 展示的字段名
    dropList: [
      {
          label: '未达标',
          value: 0
      },
      {
          label: '达标',
          value: 1
      }
    ]
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'driverNo', // 返回数据的key名
    placeholder: '请输入司机编号',
    value: '', // 用于数据绑定
    title: '司机编号：'
  }
]