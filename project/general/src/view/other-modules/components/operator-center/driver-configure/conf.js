import {
  timeFormat
} from '@/libs/util';
const statusList = [{
  label: '初始',
  value: 1
},
{
  label: '启用中',
  value: 2
},
{
  label: '已终止',
  value: 3
}
];

// 司机类型
export const driverList = [
  {
    label: '全部',
    value: ""
  },
  {
    label: '乘推司',
    value: 1
  },
  {
    label: '司推司',
    value: 2
  }
  ];

// 乘推司/司推司搜索项
export let inputList = [{
  name: 'text-input',
  title: '活动名称',
  titleWidth: 90,
  value: '',
  bind_key: 'activityName'
},
{
  name: 'drop-input',
  title: '状态',
  titleWidth: 50,
  value: '',
  bind_key: 'status',
  dropList: statusList
},
{
  name: 'drop-input',
  title: '类型',
  titleWidth: 90,
  value: '',
  bind_key: 'configType',
  dropList: driverList
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
      title: '活动编码',
      key: 'activityCode',
      minWidth: 80,
      fixed: 'left',
    },    
    {
      title: '活动名称',
      key: 'activityName',
      tooltip: true,
      minWidth: 80
    },
    {
      title: '类型',
      key: 'configType',
      minWidth: 40,
      render(h, params) {
        let data = params.row;
        let configType;
        driverList.map(item => {
          if (item.value === data.configType) {
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
        let provinceName, cityName;
        _this.cityList.forEach(item => {
          if (params.row.province == item.value) {
            provinceName = item.label;
            item.children.forEach(item => {
              if (params.row.cityCode == item.value) {
                cityName = item.label;
              }
            })
          }
        })
        return h('span', {}, `${provinceName}  ${cityName}`);
      }
    },
    {
      title: '状态',
      key: 'status',
      minWidth: 50,
      render(h, params) {
        let data = params.row;
        let status;
        statusList.map(item => {
          if (item.value === data.status) {
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
                  value: data.status === 1
                },{
                  name: 'hasAuth',
                  value: 'driver-configure-edit'
                }],
                on: {
                  click() {
                    _this.editConfigure(params.row.id);
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
                    value: data.status === 2
                  },
                  {
                    name: 'hasAuth',
                    value: 'driver-configure-open'
                  }
                ],
                on: {
                  click() {
                    _this.$Modal.confirm({
                      title: '提示',
                      content: '确认终止后，该城市推荐奖励页面将使用默认页面模板展示',
                      onOk: () => {
                        _this.finishData(params.row);
                      }
                    });
                  }
                }
              },
              '终止'
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
                    value: data.status === 1
                  },
                  {
                    name: 'hasAuth',
                    value: 'driver-configure-close'
                  }
                ],
                on: {
                  click() {
                    _this.$Modal.confirm({
                      title: '提示',
                      content: '确认启用后，该城市推荐奖励页面将使用该页面模板展示',
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
                  value: 'driver-configure-detail'
                }],
                on: {
                  click() {
                    _this.$router.push({
                      path: 'driver-configure-detail/' + params.row.id
                    });
                  }
                }
              },
              '详情'
            ),
            h(
              'Button', {
                style: {
                  margin: '0 0 0 15px'
                },                
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'driver-configure-log'
                }],
                on: {
                  click() {
                    _this.showRecord = true;
                    _this.getModalTableData(params.row.id);
                  }
                }
              },
              '操作记录'
            )
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
