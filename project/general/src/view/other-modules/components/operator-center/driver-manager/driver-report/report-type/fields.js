
export const tableTitle = (that)=>{
  return [
    {
      title: '报备类型',
      key: 'reportDesc',
      tooltip: true,
      minWidth: 300
    },
    {
      title: '状态',
      key: 'enableStatus',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        switch (params.row.enableStatus) {
          case 0:
            return h("div", "已停用")
          case 1:
            return h("div", "启用中")
        }
      }
    },
    {
      title: '最新操作时间',
      key: 'updateTime',
      tooltip: true,
      minWidth: 180
    },
    {
      title: '操作人',
      key: 'optName',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '操作',
      key: "action",
      fixed: "right",
      width: 300,
      render: (h, params) => {
        return h('div', [
          h(
            "Button",
            {
              directives: [
                {
                  name: "hasAuth",
                  value: "report-type-edit"
                }
              ],
              style: {
                display: params.row.parentUuid === '0' ? 'none' : 'inline-block'
              },
              'class': {
                tableBtn: true
              },
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              on: {
                click: () => {
                  that.handleItem('编辑报备类型', 'E')
                  that.detailReport(params.row.recordUuid)
                }
              }
            },
            "编辑"),
            h("Button", {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              'class': {
                tableBtn: true
              },
              style: {
                display: params.row.parentUuid === '0' || params.row.enableStatus === 0 ? 'none' : 'inline-block'
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "report-type-stop"
                }
              ],
              on: {
                click: () => {
                  that.$Modal.confirm({
                    title: "提示",
                    content: "确定停用吗？",
                    onOk: () => {
                      that.setEnableStatus(params.row.recordUuid, 1)
                    }
                  })
                }
              }
            }, "停用"),
            h("Button", {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              style: {
                display: params.row.parentUuid === '0' || params.row.enableStatus === 1 ? 'none' : 'inline-block'
              },
              'class': {
                tableBtn: true
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "report-type-enable"
                }
              ],
              on: {
                click: () => {
                  that.setEnableStatus(params.row.recordUuid, 2)
                }
              }
            }, "启用"),
          h('Button', {
            props: {
              type: "success",
              ghost: true,
              size: "small"
            },
            style: {
              display: params.index === 0 || that.tableData.length === 0 || params.row.parentUuid === '0' ? 'none' : 'inline-block'
            },
            'class': {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'report-type-up'
            }],
            on: {
              click: () => {
                that.moveReportType(params.row.recordUuid, 1)
              }
            }
          }, '上移'),
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            style: {
              display: params.index === that.tableData.length-1 || that.tableData.length === 0 || params.row.parentUuid === '0' ? 'none' : 'inline-block'
            },
            'class': {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'report-type-down'
            }],
            on: {
              click: () => {
                that.moveReportType(params.row.recordUuid, 2)
              }
            }
          }, '下移')
        ])
      }
    }
  ]
}
export const pageData = {
  total: 0,
  currPage: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableData: [],
}

export const inputList = that => {
  return [
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'reportDesc', // 返回数据的key名
      placeholder: '请输入',
      value: '', // 用于数据绑定
      title: '司机报备类型：',
      titleWidth: 100
    },
    {
      name: 'drop-input', // 文本输入框名
      bind_key: 'enableStatus', // 返回数据的key名
      placeholder: '请选择状态',
      value: '', // 用于数据绑定
      title: '状态：', // 展示的字段名
      dropList: [
        {
          value: 1,
          label: '启用中'
        },
        {
          value: 0,
          label: '已停用'
        }
      ],
      titleWidth: 60
    }
  ]
}