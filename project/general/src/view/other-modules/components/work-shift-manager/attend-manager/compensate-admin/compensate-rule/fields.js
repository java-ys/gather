export const ruleData = {
  inputList: [{
      name: 'cascader-input', // 文本输入框名
      bind_key: ['cityCode', 'cityCode'], // 返回数据的key名
      placeholder: '请选择省/市',
      value: [], // 绑定返回数据
      cascaderList: [], // 级联列表
      title: '城市：', // 展示的字段名
      changeOnSelect: false,
      titleWidth: 40,
      inputWidth: 165,
    },
    {
      name: 'text-input',
      bind_key: 'categoryName',
      value: '',
      titleWidth: 60,
      title: '停运类型',
      inputWidth: 165,
    },
  ],
  columns(_this) {
    return [{
        title: '适用城市',
        minWidth: 120,
        key: 'cityName',
      },
      {
        title: '停运类型',
        minWidth: 120,
        key: 'categoryName',
      },
      {
        title: '二级类型',
        minWidth: 120,
        key: 'subCategoryName',
      },
      {
        title: '最大可补偿时长(小时)',
        minWidth: 120,
        key: 'recoupDuration'
      },
      // {
      //   title: '更新时间',
      //   minWidth: 120,
      //   key: 'modifiedTimes'
      // },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render(h, params) {
          return h('div', [
            h('a', {
              on: {
                click() {
                  _this.detail(params.row)
                }

              }
            }, '详情'),
            h('a', {
              style: {
                marginLeft: '10px',
              },
              on: {
                click() {
                  _this.editRule(params.row)
                }
              }
            }, '编辑'),
            h('a', {
              style: {
                marginLeft: '10px',
              },

              on: {
                click() {
                  _this.delete(params.row.id)
                }
              }
            }, '删除'),
          ]);
        }
      }
    ];
  }
};

export const logTableColumns = _this => {
  return [
    // {
    //   title: '序号',
    //   minWidth: 10,
    //   render(h, params) {
    //     return h('span', {}, (_this.modalTable.current - 1) * _this.modalTable.pageSize + params.index + 1);
    //   }
    // },
    {
      title: '操作人',
      minWidth: 100,
      key: 'operatorName'
    },
    {
      title: '操作时间',
      key: 'operateTime',
      minWidth: 120,
      render(h, params) {
        return h('span', {}, `${timeFormat(params.row.operateTime, 'yyyy-mm-dd')}`);
      }
    },
    {
      title: '补偿时段',
      key: 'operateTime',
      minWidth: 120,
    },
    {
      title: '补偿时长',
      key: 'operateTime',
      minWidth: 120,
    },
    {
      title: '补偿对象',
      key: 'operateTime',
      minWidth: 100,
    },
    {
      title: '补偿统计',
      key: 'operateTime',
      minWidth: 100,
    },
  ];
};



// 日志表格
export const initTableColumns = that => {
  return [
    {
      // type: "index",
      key: 'num',
      title: "序号",
      align: "left",
      render: (h, params) => {
        return h(
          'div',
          that.logPageSize * (that.logCurrPage - 1) + params.index + 1
        )
      }
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
