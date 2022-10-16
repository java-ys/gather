

export const tableTitle = (that)=>{
  return [
    {
      title: '订单号',
      key: 'orderNo',
      tooltip: true,
      minWidth: 100,
    },
    {
      title: '城市',
      key: 'agentCityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '报备类型',
      key: 'specificTypeDesc',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '产品线',
      key: 'productLineName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '订单类型',
      key: 'orderType',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        switch (params.row.orderType) {
          case 1:
            return h("div", "实时")
          case 2:
            return h("div", "预约")
        }
      }
    },
    {
      title: '车牌号',
      key: 'plateNum',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '品牌车型',
      key: 'brandModel',
      tooltip: true,
      width: 120
    }, 
    {
      title: '司机手机号',
      key: 'driverPhone',
      ellipsis: true,
      width: 180
    },
    {
      title: '司机姓名',
      key: 'driverName',
      ellipsis: true,
      width: 180
    },
    {
      title: '报备时间',
      key: 'reportTime',
      ellipsis: true,
      width: 180
    },
    {
      title: '操作',
      key: "action",
      fixed: "right",
      width: 150,
      render: (h, params) => {
        return h('div', [
          h("Button", {
            props: {
              type: 'primary',
              size: 'small'
          },
          attrs: {
              ghost: 'ghost'
          },
          directives: [{
              name: 'hasAuth',
              value: 'report_detail'
          }],
            on: {
              click: () => {
                that.getReportDetail(params.row.reportUuid)
              }
            }
          }, "详情")
        ])
      }
    }
  ]
}
export const pageData = {
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableData: [],
}

export const inputList = that => {
  return [
    {
      name: 'cascader-input', // 文本输入框名
      bind_key: ['provinceCode', 'cityCode'], // 返回数据的key名
      placeholder: '请选择省/市',
      value: [], // 绑定返回数据
      cascaderList: [], // 级联列表
      title: '城市：',
      changeOnSelect: true,
      titleWidth: 80
    },
    {
      name: 'drop-input', // 文本输入框名
      bind_key: 'agentUuid', // 返回数据的key名
      placeholder: '请选择运营商',
      value: '', // 用于数据绑定
      title: '运营商：', // 展示的字段名
      dropList: that.operatorList,
      titleWidth: 80
    },
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'orderNo', // 返回数据的key名
      placeholder: '请输入订单号',
      value: '', // 用于数据绑定
      title: '订单号：',
      titleWidth: 80
    },
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'driverName', // 返回数据的key名
      placeholder: '请输入司机姓名',
      value: '', // 用于数据绑定
      title: '司机姓名：',
      titleWidth: 80
    },
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'driverPhone', // 返回数据的key名
      placeholder: '请输入手机号',
      value: '', // 用于数据绑定
      title: '司机手机号：',
      titleWidth: 80
    },
    {
      name: 'drop-input', // 文本输入框名
      bind_key: 'specificType', // 返回数据的key名
      placeholder: '请选择报备类型',
      value: '', // 用于数据绑定
      title: '报备类型：', // 展示的字段名
      dropList: [],
      titleWidth: 80
    },
    {
      name: 'date-input', // 文本输入框名
      bind_key: ['reportStartDate', 'reportEndDate'], // 返回数据的key名
      placeholder: '请选择报备日期',
      value: '', // 用于数据绑定
      title: '报备日期：',
      titleWidth: 80
    },
    {
      name: 'drop-input', // 文本输入框名
      bind_key: 'hasDriverOrder', // 返回数据的key名
      placeholder: '请选择',
      value: '', // 用于数据绑定
      title: '是否有工单：', // 展示的字段名
      dropList: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '否'
        }
      ],
      titleWidth: 80
    },
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'sourceWorkOrder', // 返回数据的key名
      placeholder: '请输入工单编号',
      value: '', // 用于数据绑定
      title: '工单编号：',
      titleWidth: 80
    },
  ]
}