// 紧急程度
export const urgencyDegree = [
  {label: '高', value: 1},
  {label: '中', value: 2},
  {label: '低', value: 3}
];
// 处理状态(明细)
export const processState = [
  {label: '待处理', value: 0},
  {label: '有责', value: 1},
  {label: '无责', value: 2},
  {label: '无法判责', value: 3}
];
// 处理状态(汇总)
const processStateCollect = [
  {label: '待处理', value: 1},
  {label: '已处理', value: 2},
]
// 处理耗时
export const processingTime = [
  {label: '7天以上', value: 1},
  {label: '7天以下', value: 2}
];
// 申诉结果
export const complaintResult = [
  {label: '申诉成功', value: 1},
  {label: '申诉失败', value: 2}
];
// 审核结果
export const auditStatus = [
  {label: '待审核', value: 0},
  {label: '审核通过', value: 1},
  {label: '审核不通过', value: 2}
];
// 违规类型
export const illegalType = [
  {label: '轻微有责工单', value: 1},
  {label: '一般有责工单', value: 2},
  {label: '严重有责工单', value: 3},
  {label: '特大有责工单', value: 4}
]
// 来源渠道
export const orderSource = [
  {label: 'm2', value: 1},
  {label: '高德', value: 2}
]

// 工单明细
export const orderDetail = {
  inputList: [
    {name: 'text-input', title: '工单号', value: '', bind_key: 'sourceWorkOrder'},
    {name: 'drop-input', title: '来源渠道', value: '', bind_key: 'source', dropList: orderSource, changeOnSelect: true},
    {name: 'cascader-input', title: '工单类型', value: [], bind_key: ['firstOrderType', 'secondOrderType', 'thirdOrderType'],
      cascaderList: [], changeOnSelect: true},
    {name: 'drop-input', title: '紧急程度', value: '', bind_key: 'emergentLevel', dropList: urgencyDegree},
    {name: 'drop-input', title: '城市', value: '', bind_key: 'cityName', dropList: [], filterable: true},
    {name: 'text-input', title: '关联订单编号', value: '', bind_key: 'orderNo', titleWidth: 90},
    {name: 'text-input', title: '司机ID', value: '', bind_key: 'driverNo'},
    {name: 'text-input', title: '司机姓名', value: '', bind_key: 'driverName'},
    {name: 'text-input', title: '运营商', value: '', bind_key: 'agentName'},
    {name: 'date-input', title: '创建时间', value: [], bind_key: ['createStartTime', 'createEndTime'], placeholder: '请选择'},
    {name: 'drop-input', title: '处理状态', value: '', bind_key: 'responsibilityType', dropList: processState},
    {name: 'section-input', title: '处理耗时(小时)', value1: null, value2: null, bind_key: ['handleStartTime', 'handleEndTime'], placeholder: '请输入',
      inputWidth: 70, titleWidth: 100}
  ],
  columns(_this) {
    return [
      {title: '工单号', key: 'sourceWorkOrder', minWidth: 100, tooltip: true, align: 'center'},
      {title: '来源渠道', key: 'source', render(h, params) {
        return h('span', {}, translateLabel(orderSource, params.row[params.column.key]))
      }, width: 100, align: 'center'},
      {title: '一级工单类型', key: 'firstOrderName', minWidth: 100, align: 'center'},
      {title: '二级工单类型', key: 'secondOrderName', minWidth: 100, align: 'center'},
      {title: '三级工单类型', key: 'thirdOrderName', minWidth: 100, align: 'center'},
      {
        title: '紧急程度', key: 'emergentLevel', render(h, params) {
          return h('span', {}, translateLabel(urgencyDegree, params.row[params.column.key]))
        }, width: 100, align: 'center'
      },
      {title: '城市', key: 'cityName', width: 80, align: 'center'},
      {title: '关联订单编号', key: 'orderNo', tooltip: true, minWidth: 100},
      {title: '司机ID', key: 'driverNo', tooltip: true, minWidth: 100, align: 'center'},
      {title: '司机姓名', key: 'driverName', width: 100, align: 'center'},
      {title: '运营商', key: 'agentName', width: 100, align: 'center'},
      {title: '创建时间', key: 'createTime', minWidth: 130, align: 'center'},
      {
        title: '处理状态', key: 'responsibilityType', render(h, params) {
          return h('span', {}, translateLabel(processState, params.row[params.column.key]));
        }, width: 100, align: 'center'
      },
      {title: '处理耗时', key: 'handleTime', width: 110, align: 'center', render(h, params) {
        let times = params.row[params.column.key];
        if(!times) return;
        let str = '';
        let hour = Math.floor(times / 60);
        hour && (str = `${hour}小时`)
        return h('span', {}, `${str}${times % 60}分`);
      }},
      {title: '处理时间', key: 'dealTime', minWidth: 130, align: 'center'},
      {title: '处理人', key: 'dealUserName', width: 100, align: 'center'},
      {
        title: '操作', render(h, params) {
          return h('span', {
            class: ['operate-span'],
            directives: [
              {name: 'hasAuth', value: 'order-detail-detail'}
            ],
            on: {
              click() {
                _this.showDetailModal(params.row);
              }
            }
          }, '详情')
        }, width: 80
      }
    ]
  }
};
// 工单汇总统计
export const orderCollect = {
  inputList: [
    {name: 'drop-input', title: '城市', value: '', bind_key: 'cityName', dropList: [], filterable: true},
    {name: 'drop-input', title: '运营商', value: '', bind_key: 'agentName', dropList: [], filterable: true},
    {name: 'drop-input', title: '处理状态', value: '', bind_key: 'dealStatus', dropList: [
      {label: '未处理', value: 0},
      {label: '已判责', value: 1}
    ]},
    {name: 'drop-input', title: '违规类型', value: '', bind_key: 'violationType', dropList: illegalType},
    {name: 'drop-input', title: '处理耗时', value: '', bind_key: 'consumeTimeLevel', dropList: processingTime},
    {name: 'date-input', title: '工单创建日期', value: [], bind_key: ['startTime', 'endTime'], titleWidth: 90, placeholder: '请选择'}
  ],
  columns: [
    {title: '工单创建日期', key: 'createTime'},
    {title: '工单量', key: 'count'}
  ]
};
// 申诉工单明细
export const appealOrderDetail = {
  inputList: [
    {name: 'drop-input', title: '城市', value: '', bind_key: 'cityName', dropList: [], filterable: true},
    {name: 'text-input', title: '司机ID', value: '', bind_key: 'driverNo'},
    {name: 'text-input', title: '司机姓名', value: '', bind_key: 'driverName'},
    {name: 'text-input', title: '运营商', value: '', bind_key: 'agentName', filterable: true},
    {name: 'text-input', title: '关联工单号', value: '', bind_key: 'sourceWorkOrder', titleWidth: 90},
    {name: 'date-input', title: '创建时间', value: [], bind_key: ['createStartTime', 'createEndTime'], placeholder: '请选择'},
    {name: 'drop-input', title: '处理状态', value: '', bind_key: 'dealStatus', dropList: [
      {label: '已处理', value: 1},
      {label: '未处理', value: 2},
    ]},
    {name: 'drop-input', title: '申诉结果', value: '', bind_key: 'result', dropList: complaintResult}
  ],
  columns(_this) {
    return [
      // {title: '申诉工单号', key: 'orderId', tooltip: true},
      {title: '城市', key: 'cityName'},
      {title: '司机ID', key: 'driverNo', tooltip: true},
      {title: '司机姓名', key: 'driverName'},
      {title: '运营商', key: 'agentName'},
      {
        title: '关联工单号', key: 'sourceWorkOrder', render(h, params) {
          return h('span', {
            class: ['operate-span'],
            on: {
              click() {
                _this.showConnectOrderModal(params.row)
              }
            }
          }, `${params.row[params.column.key] || ''}`)
        }
      },
      {
        title: '处理状态', key: 'dealStatus', render(h, params) {
          let map = {
            1: '已处理',
            2: '未处理'
          }
          return h('span', {}, map[params.row[params.column.key]]);
        }
      },
      {title: '创建时间', key: 'createTime'},
      {
        title: '申诉结果', key: 'result', render(h, params) {
          return h('span', {}, translateLabel(complaintResult, params.row[params.column.key]));
        }
      },
      {title: '处理时间', key: 'dealTime'},
      {title: '处理耗时', key: 'handleTime', render(h, params) {
        let times = params.row[params.column.key];
        if(!times) return;
        let str = '';
        let hour = Math.floor(times / 60);
        hour && (str = `${hour}小时`)
        return h('span', {}, `${str}${times % 60}分`);
      }},
      {title: '处理人', key: 'updateUserName'},
      {
        title: '操作', render(h, params) {
          return h('span', {
            class: ['operate-span'],
            directives: [
              {name: 'hasAuth', value: 'appeal-order-detail-detail'}
            ],
            on: {
              click() {
                _this.showDetailModal(params.row)
              }
            }
          }, '详情')
        }
      }
    ]
  }
};
// 申诉工单汇总
export const appealOrderCollect = {
  inputList: [
    {name: 'drop-input', title: '城市', value: '', bind_key: 'cityName', dropList: [], filterable: true},
    {name: 'drop-input', title: '运营商', value: '', bind_key: 'agentName', dropList: [], filterable: true},
    {name: 'drop-input', title: '处理状态', value: '', bind_key: 'dealStatus', dropList: [
      {label: '已处理', value: 1},
      {label: '未处理', value: 2}
    ]},
    {name: 'drop-input', title: '申诉结果', value: '', bind_key: 'result', dropList: complaintResult},
    {name: 'date-input', title: '工单创建日期', value: [], bind_key: ['startTime', 'endTime'], placeholder: '请选择', titleWidth: 90}
  ],
  columns: [
    {title: '工单创建日期', key: 'createTime'},
    {title: '工单量', key: 'count'}
  ]
};
// 工单视频查看申请审批
export const orderVideo = {
  inputList: [
    {name: 'text-input', title: '申请人', value: '', bind_key: 'applicant'},
    {name: 'drop-input', title: '城市', value: '', bind_key: 'cityName', dropList: [], filterable: true},
    {name: 'drop-input', title: '运营商', value: '', bind_key: 'agentName', dropList: [], filterable: true},
    {name: 'text-input', title: '关联工单号', value: '', bind_key: 'sourceWorkOrder', titleWidth: 90},
    {name: 'date-input', title: '申请时间', value: [], bind_key: ['applyStartTime', 'applyEndTime'], placeholder: '请选择'},
    {name: 'drop-input', title: '审核状态', value: '', bind_key: 'approvalStatus', dropList: auditStatus}
  ],
  columns(_this) {
    return [
      {title: '申请人', key: 'applicant'},
      {title: '申请人手机号', key: 'mobile'},
      {title: '城市', key: 'cityName'},
      {title: '运营商', key: 'agentName'},
      {
        title: '关联工单号', key: 'sourceWorkOrder', render(h, params) {
          return h('span', {
            class: ['operate-span'],
            on: {
              click() {
                _this.showConnectModal(params.row);
              }
            }
          }, `${params.row[params.column.key] || ''}`)
        }
      },
      {title: '申请时间', key: 'applyTime'},
      {title: '申请原因', key: 'applyReason'},
      {title: '视频类型', key: 'videoType', render(h, params) {
        let map = {
          1: '车内和车外视频',
          2: '车内视频',
          3: '车外视频'
        }
        return h('span', {}, `${map[params.row[params.column.key]]}`)
      }},
      {
        title: '审核状态', key: 'approvalStatus', render(h, params) {
          return h('span', {}, translateLabel(auditStatus, params.row[params.column.key]));
        }
      },
      {title: '驳回原因', key: 'rejectReason', tooltip: true},
      {title: '审核时间', key: 'approvalTime'},
      {title: '审核人', key: 'approvalUser'},
      {
        title: '操作', render(h, params) {
          return h('div', {
            class: ['operate-wrap']
          }, [
            h('span', {
              directives: [
                {name: 'show', value: params.row.approvalStatus === 0},
                {name: 'hasAuth', value: 'order-video-pass'}
              ],
              on: {
                click() {
                  _this.passData(params.row);
                }
              }
            }, '通过'),
            h('span', {
              directives: [
                {name: 'show', value: params.row.approvalStatus === 0},
                {name: 'hasAuth', value: 'order-video-fail'}
              ],
              on: {
                click() {
                  _this.showFailModal(params.row);
                }
              }
            }, '驳回'),
            h('span', {
              directives: [
                {name: 'hasAuth', value: 'order-video-detail'}
              ],
              on: {
                click() {
                  _this.showDetailModal(params.row);
                }
              }
            }, '查看视频')
          ])
        },
        minWidth: 100
      }
    ]
  }
};

export const mixins = {
  methods: {
    resetInputList({cityList, agentList} = {}) {
      cityList && (this.inputList[this.inputListMap.cityList].dropList = cityList);
      agentList && (this.inputList[this.inputListMap.agentList].dropList = agentList);
    }
  },
  watch: {
    cityList: {
      handler(value) {
        this.resetInputList({cityList: value});
      },
      immediate: true
    }
  }
}

export function translateLabel(arr, key) {
  let obj = arr.find(item => item.value === key);
  return `${obj ? obj.label : ''}`;
}
