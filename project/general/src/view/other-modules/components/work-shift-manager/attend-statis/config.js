//日报列表
export const dailyRecord = {
  inputList: [
    {
      name: "cascader-input", // 文本输入框名
      bind_key: ["provinceID", "cityCode"], // 返回数据的key名
      placeholder: "请选择省/市",
      value: [], // 绑定返回数据
      cascaderList: [], // 级联列表
      title: "省 / 市：", // 展示的字段名
      changeOnSelect: true
    },
    {
        name: 'drop-input',
        bind_key: 'agentId',
        placeholder: '请选择运营商',
        value: '',
        dropList: [],
        filterable: true,
        clearable: true,
        titleWidth: 50,
        title: '运营商'
      },
      {
      name: 'date-input',
      title: '日期:',
      inputWidth: 220,
      placeholder: '请选择日期',
      bind_key: ['startTime', 'endTime'],
      value: ''
    }
  ],
  columns(_this) {
    return [
      
      {
        title: '日期',
        minWidth: 120,
        key: 'dutyDate',
        // render(h, params) {
        //   return h('span', {}, timeFormat(params.row.dutyDate, 'yyyy-MM-dd'))
        // }
      },
      {
        title: '城市',
        minWidth: 120,
        key: 'cityName',
      },
      {
        title: '运营商',
        minWidth: 120,
        key: 'agentName',
      },
      {
        title: '绑定司机',
        minWidth: 120,
        key: 'bindingDriverNum',
      },
      {
        title: '出勤',
        minWidth: 120,
        key: 'attendanceNum'
      },
      {
        title: '休息',
        minWidth: 120,
        key: 'restNum'
      },
      {
        title: '请假',
        minWidth: 120,
        key: 'askForLeaveNum'
      },
      {
        title: '旷工',
        minWidth: 120,
        key: 'minerNum',
      },
      {
        title: '操作',
        width: 100,
        render(h, params) {
          return h('div', [
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small',
                },
                on: {
                  click() {
                    _this.detailData(params.row);
                  }
                }
              },
              '详情'
            )
          ]);
        }
      }
    ];
  }
};

//日报详情列表
export const dailyDetail = {
  inputList: [{
      name: 'date',
      title: '日期:',
      placeholder: '日期',
      bind_key: ['dutyDate'],
      value: ''
    },
    {
      name: 'text-input',
      title: '排班名称:',
      dropList: [],
      bind_key: 'shiftName',
      value: ''
    },
    {
      name: 'drop-input',
      title: '排班类型:',
      dropList: [],
      bind_key: 'shiftType',
      value: ''
    },
    {
      name: 'text-input',
      bind_key: 'driverName',
      value: '',
      title: '司机姓名：',
      remoteMethod: function () {}, // 远程输入框输入时触发方法
      remoteList: []
    },
    {
      name: 'text-input',
      bind_key: 'driverPhone',
      value: '',
      title: '手机号：',
      remoteMethod: function () {}, // 远程输入框输入时触发方法
      remoteList: []
    },
    {
      name: 'text-input',
      bind_key: 'plateNum',
      value: '',
      title: '车牌号:',
      remoteMethod: function () {}, // 远程输入框输入时触发方法
      remoteList: []
    },
    {
      name: 'drop-input',
      title: '类型:',
      dropList: [],
      bind_key: 'dutyType',
      value: ''
    },
    {
      name: 'drop-input',
      title: '考核:',
      dropList: [],
      bind_key: 'isStandard',
      value: ''
    }
  ],
  columns(_this) {
    return [{
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '日期',
        minWidth: 120,
        key: 'dutyDate',
      },
      {
        title: '排班名称',
        minWidth: 120,
        key: 'shiftName',
      },
      {
        title: '排班类型',
        minWidth: 120,
        key: 'shiftType',
        render(h, params) {
          if (params.row.shiftType - 2 === 0) {
            return h('span', '双班');
          } else if (params.row.shiftType - 1 === 0) {
            return h('span', '单班');
          } else {
            return h('span', '');
          }
        }
      },
      {
        title: '司机ID',
        minWidth: 120,
        key: 'driverNo',
      },
      {
        title: '司机姓名',
        minWidth: 120,
        key: 'driverName',
      },
      {
        title: '司机手机号',
        minWidth: 120,
        key: 'driverPhone',
      },
      {
        title: '车牌号',
        minWidth: 120,
        key: 'plateNum',
      },
      {
        title: '类型',
        minWidth: 120,
        key: 'types',
        render(h, params) {
          const { dutyType } = params.row
          if (dutyType === 1) {
            return h('span', '出勤');
          } else if (dutyType === 2) {
            return h('span', '休息');
          } else if (dutyType === 3) {
            return h('span', '请假');
          } else if (dutyType === 4) {
            return h('span', '停运');
          } else if (dutyType === 5) {
            return h('span', '强制休息');
          } else if (dutyType === 6) {
            return h('span', '旷工');
          } else {
            return h('span', '异常');
          }
        }

      },
      {
        title: '考核',
        minWidth: 120,
        key: 'attendance',
        render(h, params) {
          if (params.row.isStandard === 1) {
            return h('span', '达标');
          } else if (params.row.isStandard === 0) {
            return h('span', '不达标');
          } else {
            return h('span', '');
          }
        }

      },
      {
        title: '在线时长',
        minWidth: 120,
        key: 'onlineTime',
        render(h, params) {
          let text = ''
          if(params.row.recoupOnlineTime > 0) {
            text = `${params.row.onlineTime}(补${params.row.recoupOnlineTime}h)`
          }else {
            text = `${params.row.onlineTime}`
          }
          return h('span', text);
        } 
        
      },
      {
        title: '高峰时长',
        minWidth: 120,
        key: 'peakTime',
        render(h, params) {
          let text = ''
          if(params.row.recoupPeakTime > 0) {
            text = `${params.row.peakTime}(补${params.row.recoupPeakTime}h)`
          }else {
            text = `${params.row.peakTime}`
          }
          return h('span', text);
        } 
      },
      {
        title: '计费时长',
        minWidth: 120,
        key: 'chargeTime',
      }
    ];
  }
}

//月报列表
export const monthlyRecord = {
  inputList: [
    {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceID", "cityCode"], // 返回数据的key名
    placeholder: "请选择省/市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "省 / 市：", // 展示的字段名
    changeOnSelect: true
  },
  {
      name: 'drop-input',
      bind_key: 'agentId',
      placeholder: '请选择运营商',
      value: '',
      dropList: [],
      filterable: true,
      clearable: true,
      titleWidth: 50,
      title: '运营商'
    },
    // {
    //   name: 'text-input',
    //   title: '排班名称:',
    //   dropList: [],
    //   bind_key: 'shiftname',
    //   value: ''
    // },
    {
      name: 'drop-input',
      title: '排班类型:',
      dropList: [],
      bind_key: 'shiftType',
      value: ''
    },
    {
      name: 'month-input',
      title: '时间:',
      placeholder: '请选择月份',
      bind_key: ['dutyMonth'],
      value: ''
    },
    {
      name: 'text-input',
      bind_key: 'driverName',
      value: '',
      title: '司机姓名：',
      placeholder: '请输入',
      // remoteMethod: function () {}, // 远程输入框输入时触发方法
      // remoteList: []
    },
    {
      name: 'text-input',
      bind_key: 'driverPhone',
      value: '',
      title: '手机号：',
      placeholder: '请输入',
      titleWidth: 50,
      // remoteMethod: function () {}, // 远程输入框输入时触发方法
      // remoteList: []
    },
    {
      name: 'text-input',
      bind_key: 'plateNo',
      value: '',
      title: '车牌号:',
      placeholder: '请输入',
      // remoteMethod: function () {}, // 远程输入框输入时触发方法
      // remoteList: []
    },
    {
      name: 'date-input',
      title: '入职日期:',
      inputWidth: 200,
      placeholder: '请选择日期',
      bind_key: ['startTime', 'endTime'],
      value: ''
    },
    {
      name: 'date-input',
      title: '绑车日期:',
      inputWidth: 200,
      placeholder: '请选择日期',
      bind_key: ['startDate', 'endDate'],
      value: ''
    },
    {
      name: 'drop-input',
      title: '类型:',
      dropList: [],
      bind_key: 'dutyType',
      value: ''
    }
  ],

  columns(_this) {
    let list = [{
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '月份',
        minWidth: 120,
        key: 'statsDate',
      },
      {
        title: '司机ID',
        minWidth: 120,
        key: 'driverNo',
      },
      {
        title: '司机姓名',
        minWidth: 120,
        key: 'driverName',
      },
      {
        title: '身份证号',
        minWidth: 120,
        key: 'cardId'
      },
      {
        title: '手机号',
        minWidth: 120,
        key: 'phone'
      },
      {
        title: '车牌号',
        minWidth: 120,
        key: 'plateNum'
      },
      {
        title: '入职日期',
        minWidth: 120,
        key: 'entryDate',
      },
      {
        title: '首次绑车日期',
        minWidth: 120,
        key: 'authTimeStart',
      },
      {
        title: '出勤天数',
        minWidth: 120,
        key: 'monDutyCnt',
        sortable: true
      },
      {
        title: '异常出勤',
        minWidth: 120,
        key: 'monDutyAbnormalCnt'
      },
      {
        title: '达标天数',
        minWidth: 120,
        key: 'monReachCnt',
      },
      {
        title: '请假天数',
        minWidth: 120,
        key: 'monVacationCnt',
        sortable: true
      },
      {
        title: '休息天数',
        minWidth: 120,
        key: 'monRestCnt',
        sortable: true
      },
      {
        title: '旷工天数',
        minWidth: 120,
        key: 'monAbsenteeismCnt',
        sortable: true
      },
    ]
    for (let i = 1, length = 31; i <= length; i++) {
      list.push({
        title: i,
        minWidth: 70,
        align: 'center',
        tooltip: false,
        render(h, params) {
          // let m = 0;
          let onlineRecoupDuration = '';
          let peakRecoupDuration = '';
          for (let m = 0; m < params.row.monthlyDetails.length; m++) {
            if (params.row.monthlyDetails.length && params.row.monthlyDetails[m].day && params.row.monthlyDetails[m].day == i) {
              let monthData = params.row.monthlyDetails[m];
              if(monthData.onlineRecoupDuration > 0) {
                onlineRecoupDuration = `(补${monthData.onlineRecoupDuration}h)`
              }else {
                onlineRecoupDuration = ''
              }
              if(monthData.peakRecoupDuration > 0) {
                peakRecoupDuration = `(补${monthData.peakRecoupDuration}h)`
              }else {
                peakRecoupDuration = ''
              }
              if (monthData.dutyResult == 1) {
                // 出勤
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 200,
                      wordWrap: true,
                      transfer: true,
                      content: `出勤\r\n在线时长：${monthData.onlineDuration}h${onlineRecoupDuration}\r\n高峰时长：${monthData.peakDuration}h${peakRecoupDuration}\r\n计费时长：${monthData.chargDuration}h`,
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'tick': true,
                      },
                      style: {
                        'transform': 'rotate(45deg)'
                      }
                    }),
                  ]);
              } else if (monthData.dutyResult == 2) {
                // 休息
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 200,
                      wordWrap: true,
                      transfer: true,
                      content: "休息",
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'circle': true,
                        'purple': true
                      },
                      style: {
                        'transform': 'translate(0,2px)'
                      }
                    })
                  ])
              } else if (monthData.dutyResult == 3) {
                // 请假
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 200,
                      wordWrap: true,
                      transfer: true,
                      content: `${monthData.applySubName}`,
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'circle': true,
                        'blue': true
                      },
                      style: {
                        'transform': 'translate(0,2px)'
                      }
                    })
                  ])
              } else if (monthData.dutyResult == 4) {
                // 停运
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 200,
                      wordWrap: true,
                      transfer: true,
                      content: `${monthData.applySubName}\r\n在线时长：${monthData.onlineDuration}h${onlineRecoupDuration}\r\n高峰时长：${monthData.peakDuration}h${peakRecoupDuration}\r\n计费时长：${monthData.chargDuration}h`,
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'circle': true,
                        'yellow': true
                      },
                      style: {
                        'transform': 'translate(0,2px)'
                      }
                    })
                  ])
              } else if (monthData.dutyResult == 5) {
                // 强制休息
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 200,
                      wordWrap: true,
                      transfer: true,
                      content: `强制休息`,
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'circle': true,
                        'orange': true
                      },
                      style: {
                        'transform': 'translate(0,2px)'
                      }
                    })
                  ])
              } else if (monthData.dutyResult == 6) {
                // 旷工
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 200,
                      wordWrap: true,
                      transfer: true,
                      content: `旷工\r\n在线时长：${monthData.onlineDuration}h${onlineRecoupDuration}\r\n高峰时长：${monthData.peakDuration}h${peakRecoupDuration}\r\n计费时长：${monthData.chargDuration}h\r\n旷工：${monthData.absentDuration}天`,
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'circle': true,
                        'red': true
                      },
                      style: {
                        'transform': 'translate(0,2px)'
                      }
                    })
                  ])
              } else if (monthData.dutyResult == 7) {
                // 其他
                return h('Poptip', {
                  props: {
                    trigger: 'hover',
                    placement: 'right-start',
                    width: 200,
                    wordWrap: true,
                    transfer: true,
                    content: `其他\r\n在线时长：${monthData.onlineDuration}h${onlineRecoupDuration}\r\n高峰时长：${monthData.peakDuration}h${peakRecoupDuration}\r\n计费时长：${monthData.chargDuration}h`,
                  },
                },
                [
                  h('div', {
                    class: {
                      'circle': true,
                      'green': true
                    },
                    style: {
                      'transform': 'rotate(45deg)'
                    }
                  }),
                ]);
              } else {
                return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      placement: 'right-start',
                      width: 100,
                      wordWrap: true,
                      transfer: true,
                      content: `${monthData.applySubName}\r\n在线时长：${monthData.onlineDuration}h${onlineRecoupDuration}\r\n高峰时长：${monthData.peakDuration}h${peakRecoupDuration}\r\n计费时长：${monthData.chargDuration}h`,
                    },
                  },
                  [
                    h('div', {
                      class: {
                        'circle': true,
                        'green': true
                      },
                      style: {
                        'transform': 'translate(0,2px)'
                      }
                    })
                  ])

              }
              // break;
            }
          }
          // else{
          //   let monthData =  [];
          // }
        }
      })
    }
    return list;
  }
}
