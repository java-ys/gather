// 产品线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: '快享',
    2: '专享',
    1: '出租车',
  }
  return map[i];
}
// 生效状态
export const getStatusName = (i) => {
  let map = {
    "-1": '已失效',
    "0": '待生效',
    "1": '生效中',
    "-2": "已失效"
  }
  return map[i];
}

// 操作类型
export const geToperationType = (i) => {
  let map = {
    1: '新增',
    2: '修改',
  }
  return map[i];
}

// 星期值
export const getWeekName = (i) => {
  let map = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
  }
  return map[i];
}
// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    callback();
  }
}
// 详情时间校验
export const validatorTimeDetail = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("结束时间要大于开始时间"));
    } else {
      callback();
    }
  }
}
// 列表数据
export const listColumns = {
  columns(_this) {
    return [{
        title: '序号',
        width: 80,
        render(h, params) {
          return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
        }
      },
      {
        title: '策略名称',
        minWidth: 200,
        key: 'ruleName'
      },
      {
        title: '生效时间',
        minWidth: 150,
        key: 'effectiveTime',
        render: (h, params) => {
          return h('div', _this.$moment(params.row.effectiveTime).format("YYYY-MM-DD HH:mm:ss"))
        }
      },
      {
        title: '产品线',
        minWidth: 100,
        key: 'businessType',
        render: (h, params) => {
          return h('div', getServiceTypeName(params.row.businessType))
        }
      },
      {
        title: '城市',
        minWidth: 100,
        key: 'cityName'
      },
      {
        title: '生效状态',
        minWidth: 100,
        key: 'status',
        render: (h, params) => {
          return h('div', getStatusName(String(params.row.status)))
        }
      },
      {
        title: '版本号',
        minWidth: 100,
        key: 'versionNumber'
      },
      {
        title: '操作人',
        minWidth: 100,
        key: 'updaterName'
      },
      {
        title: '操作',
        width: 220,
        fixed: 'right',
        render(h, params) {
          return h('div', {
            style: {
              display: 'flex',
            }
          }, [

            h(
              'Button', {
                props: {
                  type: 'success',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'day-basediscount-detail'
                }],
                on: {
                  click() {
                    _this.goDetail(params.row.uuid);
                  }
                }
              },
              '详情'
            ),
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'day-basediscount-copy'
                }],
                on: {
                  click() {
                    _this.copy(params.row.uuid);
                  }
                }
              },
              '复制'
            ),
            h(
              'Button', {
                props: {
                  type: 'error',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                style: {
                  display: params.row.status === 0 ? 'flex' : 'none',
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'day-basediscount-delete'
                }],
                on: {
                  click() {
                    _this.deleteData(params.row.uuid);
                  }
                }
              },
              '删除'
            )
          ]);
        }
      }
    ];
  }
}
