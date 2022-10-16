import {
  timeFormat
} from '@/libs/util';

const statusList = [
  {
    label: '初始',
    value: 0
  },
  {
    label: '启用中',
    value: 1
  },
  {
    label: '已停用',
    value: 2
  }
];

// 终端类型
export const terminalTypeList = [
  {
    label: '全部',
    value: ""
  },
  {
    label: '小程序',
    value: 0
  },
  // {
  //   label: 'H5',
  //   value: 1
  // }
];

// 乘推司/司推司搜索项
export let inputList = [
  // {
  //   name: 'text-input',
  //   title: '活动名称',
  //   titleWidth: 90,
  //   value: '',
  //   bind_key: 'activityName'
  // },
  {
    name: 'drop-input',
    title: '终端类型',
    titleWidth: 90,
    value: '',
    bind_key: 'terminalType',
    dropList: terminalTypeList
  },
  {
    name: 'drop-input',
    title: '状态',
    titleWidth: 50,
    value: '',
    bind_key: 'recStatus',
    dropList: statusList
  },
  {
    name: 'cascader-input',
    title: '城市',
    titleWidth: 50,
    value: ['', ''],
    bind_key: ['provinceICode', 'cityCode'],
    cascaderList: []
  },
];

// 乘推司/司推司机列表项
export const tableColumns = _this => {
  return [
    {
      title: '序号',
      key: 'cityConfId',
      minWidth: 80,
      fixed: 'left',
    },
    {
      title: '终端类型',
      key: 'terminalType',
      minWidth: 40,
      render(h, params) {
        let data = params.row;
        let configType;
        terminalTypeList.map(item => {
          if (item.value === data.terminalType) {
            configType = item.label;
          }
        });
        return h('span', {}, configType);
      }
    },
    {
      title: '城市',
      key: 'cityName',
      minWidth: 80,
      render(h, params) {
        let cityName;
        const cityList = _this.cityList.reduce((pre, cur) => [...pre, ...(!!cur.children ? cur.children : [])], [{ label: '全国', value: 1 }])
        cityList.forEach(item => {
          if (params.row.cityCode == item.value) {
            cityName = item.label;
          }
        })
        return h('span', {}, `${cityName}`);
      }
    },
    {
      title: '操作人',
      key: 'modifierName',
      tooltip: true,
      minWidth: 80
    },
    {
      title: "最新操作时间",
      key: 'modifiedTime',
      tooltip: true,
      minWidth: 160
    },
    {
      title: '状态',
      key: 'status',
      minWidth: 50,
      render(h, params) {
        let data = params.row;
        let status;
        statusList.map(item => {
          if (item.value === data.recStatus) {
            status = item.label;
          }
        });
        return h('span', {}, status);
      }
    },
    {
      title: '操作',
      key: 'operation',
      render(h, params) {
        let data = params.row;
        return h(
          'div', {
            style: {
              margin: '0 5px'
            }
          },
          [
            h(
              'Button', {
                style: {
                  margin: '0 15px'
                },
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'show',
                  value: data.recStatus === 0
                }, {
                  name: 'hasAuth',
                  value: 'driver-recruit-landing-config-edit'
                }],
                on: {
                  click() {
                    _this.editConfigure(params.row.cityConfId);
                  }
                }
              },
              '编辑'
            ),
            h(
              'Button', {
                style: {
                  margin: '0 15px'
                },
                props: {
                  type: 'error',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'show',
                  value: data.recStatus === 1
                },
                  {
                    name: 'hasAuth',
                    value: 'driver-recruit-landing-config-close'
                  }
                ],
                on: {
                  click() {
                    _this.$Modal.confirm({
                      title: '提示',
                      content: '确认停用此配置',
                      onOk: () => {
                        _this.finishData(params.row);
                      }
                    });
                  }
                }
              },
              '停用'
            ),
            h(
              'Button', {
                style: {
                  margin: '0 15px'
                },
                props: {
                  type: 'error',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'show',
                  value: data.recStatus === 0
                },
                  {
                    name: 'hasAuth',
                    value: 'driver-recruit-landing-config-open'
                  }
                ],
                on: {
                  click() {
                    _this.$Modal.confirm({
                      title: '提示',
                      content: '确认启用此配置',
                      onOk: () => {
                        _this.openData(params.row);
                      }
                    });
                  }
                }
              },
              '启用'
            ),
            h(
              'Button', {
                style: {
                  margin: '0 15px'
                },
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'driver-recruit-landing-config-detail'
                }],
                on: {
                  click() {
                    _this.$router.push({
                      path: 'driver-recruit-landing-page/detail/' + params.row.cityConfId
                    });
                  }
                }
              },
              '详情'
            ),
            // h(
            //   'Button', {
            //     style: {
            //       margin: '0 0 0 15px'
            //     },
            //     props: {
            //       type: 'primary',
            //       ghost: true,
            //       size: 'small'
            //     },
            //     directives: [{
            //       name: 'hasAuth',
            //       value: 'driver-configure-log'
            //     }],
            //     on: {
            //       click() {
            //         _this.showRecord = true;
            //         _this.getModalTableData(params.row.id);
            //       }
            //     }
            //   },
            //   '操作记录'
            // )
          ]
        );
      },
      minWidth: 150
    }
  ];
};

// 操作日志
export const modalTableColumns = _this => {
  return [{
    title: '序号',
    minWidth: 10,
    render(h, params) {
      return h('span', {}, (_this.modalTable.current - 1) * _this.modalTable.pageSize + params.index + 1);
    }
  },
    {
      title: '操作人',
      key: 'operator'
    },
    {
      title: '操作类型',
      key: 'operateType',
      render(h, params) {
        let operateType = params.row.operateType;
        return h('span', {}, `${operateType}`);
      }
    },
    {
      title: '操作内容',
      key: 'operateContent'
    },
    {
      title: 'IP',
      key: "ipAddr"
    },
    {
      title: '操作时间',
      key: 'operateTime',
      minWidth: 120,
      render(h, params) {
        return h('span', {}, `${timeFormat(params.row.operateTime, 'yyyy-mm-dd')}`);
      }
    }
  ];
};

export const operationTypeOptions = [
  {
    value: '1',
    text: '自营模式',
    viewText: '标准模式',
  },
  {
    value: '2',
    text: 'UP模式',
    viewText: '自由模式',
  },
  // {
  //   value: '3',
  //   text: 'P模式',
  //   viewText: 'P模式',
  // },
]
