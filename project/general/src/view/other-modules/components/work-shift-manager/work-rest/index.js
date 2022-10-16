import { delRest } from "_o/api/rest.js";
export const inputList = [{
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
    name: 'text-input',
    bind_key: 'shiftName',
    placeholder: '请填写',
    value: '',
    titleWidth: 60,
    title: '排班名称：'
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
  }
]

export const tableColumns = (that) => {
  return [
		{
      title: '城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
		{
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
      render(h, params) {
        let statusMap = {
          1: '单班',
          2: '双班',
        }
        return h('div', statusMap[params.row.shiftType])
      }
    },
    {
      title: '周休息(/人)',
      key: 'restDays',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '周休息额百分比',
      key: 'weekRestRatio',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '周请假额百分比',
      key: 'weekLeaveRatio',
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
              on: {
                click() {
                  that.restType = "X"
                  that.restModal = '查看详情'
                  that.id = params.row.id
                  that.modalShow = true;
                }
              }
            }, '详情'),
            h('a', {
              style: {
                marginLeft: '10px',
              },

              on: {
                click(){
                  that.restType = "E"
                  that.restModal = '编辑休息规则'
                  that.id = params.row.id
                  that.modalShow = true;
                }
              }
						}, '编辑'),
						h('a', {
              style: {
                marginLeft: '10px',
              },

              on: {
                click(){
                  that.$Modal.confirm({
                    title: "确认删除？",
                    onOk: () => {
                      delRest({ id: params.row.id }).then((res) => {
                        that.getList()
                      })
                    }
                  });
                }
              }
            }, '删除'),
          ]
        )
      }
    }
  ]
}

// 日志表格
export const initTableColumns = that => {
  return [{
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
      key: "operatorUuid",
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
      render(h, params) {
        let text = params.row.operateResult == true ? '成功' : '失败'
        return h('div', text)
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
    pageSize: 20
  },
  pageSizeOpts: [20, 50, 100],
  tableColumns: [],
  tableData: []
}
