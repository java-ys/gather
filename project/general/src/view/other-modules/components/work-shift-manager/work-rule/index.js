export const inputList = [
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['cityCode', 'cityCode'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '城市：', // 展示的字段名
    changeOnSelect: false,
    titleWidth: 40,
  },
  {
    name: 'drop-input',
    bind_key: 'driverTag', // 返回数据的key名
    placeholder: '请选择',
    value: '',
		title: '司机类型：',
		titleWidth: 60,
    dropList: [
    ],
  },
  {
    name: 'drop-input',
    bind_key: 'shiftType',
    placeholder: '请选择',
    value: '',
    titleWidth: 60,
    title: '排班类型：',
    dropList: [{
        value: 1,
        label: '单班'
      },
      {
        value: 2,
        label: '双班'
      }
    ],
  },
  {
    name: 'text-input',
    bind_key: 'shiftName',
    placeholder: '请填写',
    value: '',
    titleWidth: 60,
    title: '排班名称：'
  },
  {
    name: 'drop-input',
    bind_key: 'status', // 返回数据的key名
    placeholder: '请选择',
    value: '',
		title: '状态：',
		titleWidth: 60,
    dropList: [
      {
				value: 0,
        label: '未生效'
			},
			{
				value: 1,
        label: '生效中'
			},
			{
				value: -2,
        label: '已失效'
			}
    ],
  },
]

export const tableColumns = (that) => {
  return [{
      title: '排班名称',
      key: 'shiftName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '排班类型',
      key: 'shiftType',
      tooltip: true,
			minWidth: 100,
			render(h,params) {
				let statusMap = {
					1: '单班',
					2: '双班',
			  }
				return h('div',statusMap[params.row.shiftType])
			}
    },
    {
      title: '适用城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机类型',
      key: 'driverTagName',
      tooltip: true,
      minWidth: 100,
			render(h,params) {
        if(params.row.shiftRuleDetailsDtoList) {
          let list = []
          params.row.shiftRuleDetailsDtoList.forEach( (element,index) => {
            list.push(element.driverTagName)
          });
          return h('div',list.join('，'))
        }
			}
    },
    {
      title: '排班时段',
      key: 'shiftStartTime',
      minWidth: 180,
      render(h,params) {
        if(params.row.shiftRuleDetailsDtoList) {
          let list = []
          params.row.shiftRuleDetailsDtoList.forEach( (element,index) => {
              if( element.shiftStartTime >element.shiftEndTime ) {
                list.push(element.shiftStartTime + ' - 次日' + element.shiftEndTime)
              }else {
                list.push(element.shiftStartTime + ' - ' + element.shiftEndTime)
              }

          });
          return h('div',{
            domProps:{//原生的属性
                title:list.length? list.join('，'): '',
            },
            style:{
              display:'inline-block',
              width:'180' + 'px',
              overflow:'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap',
              lineHeight: 30+'px',
              height:30+'px',
            }
          },list.join('，'))
        }
      }
    },
    {
      title: '生效时间',
      key: 'effectiveTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '状态',
      key: 'status',
      tooltip: true,
      minWidth: 100,
      render(h,params) {
				let statusMap = {
					'0': '未生效',
					'1': '生效中',
					'-2': '已失效',
			  }
				return h('div',statusMap[params.row.status])
			}
    },
    {
      title: '更新时间',
      key: 'updateTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '版本号',
      key: 'version',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (h, params) => {
        return h(
          'div', [
            h('a', {
              directives: [{
                name: 'hasAuth',
                value: 'driver-detail-rule'
              }],
							on: {
								click() {
                  that.shiftUuid = params.row.shiftUuid;
                  that.modalName = '查看详情'
                  that.ruleType = 'X';
                  that.modal1 = true;
									
								}
							}
            }, '详情'),
            h('a', {
              style: {
                marginLeft: '10px',
              },
              directives: [{
                name: 'hasAuth',
                value: 'driver-edit-rule'
              }],
							on: {
								click() {
                  that.shiftUuid = params.row.shiftUuid;
                  that.modalName = '编辑排班'
                  that.ruleType = 'E';
                  that.modal1 = true;
								}
							}
            }, '编辑')
          ]
        )
      }
    }
  ]
}

// 日志表格
export const initTableColumns = that => {
  return [
    {
      type: "index",
      title: "序号",
      align: "left"
    },
    {
      title: "操作人",
      key: "operatorName",
      tooltip: true,
      align: "left"
    },
    {
      title: "UUID",
      key: "operatorNo",
      tooltip: true,
      align: "left"
    },
    {
      title: "所属部门",
      key: "deptName",
      tooltip: true,
      align: "left"
    },
    {
      title: "IP",
      key: "operatorIp",
      tooltip: true,
      align: "left"
    },
    {
      title: "操作类型",
      key: "operateTypeDesc",
      tooltip: true,
      align: "left",
    },
    {
      title: "操作项",
      key: "operationItem",
      tooltip: true,
      align: "left",
    },
    {
      title: "操作后值",
      key: "operateResult",
      tooltip: true,
      align: "left",
      render(h,params) {
        let text = params.row.operateResult == true ? '成功' : '失败'
        return h('div',text)
      }
    },
    {
      title: "操作时间",
      key: "operateTime",
      tooltip: true,
      align: "left"
    }
  ];
};

export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: []
}
