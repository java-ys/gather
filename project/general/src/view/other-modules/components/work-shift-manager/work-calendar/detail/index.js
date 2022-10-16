export const inputList = [
  {
    name: 'text-input',
    bind_key: 'driverName',
    placeholder: '请填写',
    value: '',
    titleWidth: 60,
    title: '司机姓名：'
  }
]
export const tableColumns = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '司机手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '在线时长',
      key: 'onlineDuration',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '高峰时长',
      key: 'peakDuration',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '计费时长',
      key: 'chargeDuration',
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
                  that.$router.push({
                    name: 'atted-type',
                    query: {
                      attedType: 1,
                      uuid: params.row.driverUuid,
                      agentId:that.agentId,
                      driverTag:that.driverTag,
                      cityCode:that.cityCode
                    }
                  })
                }
              }
            }, '历史出勤')
          ]
        )
      }
    }
  ]
}

export const tableColumns2 = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '开始时间',
      key: 'startTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '结束时间',
      key: 'endTime',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '当月累计休息',
      key: 'monthTotalLeave',
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
                  that.$router.push({
                    name: 'atted-type2',
                    query: {
                      attedType: 2,
                      uuid: params.row.driverUuid,
                      agentId:that.agentId,
                      driverTag:that.driverTag,
                      cityCode:that.cityCode
                    }
                  })
                }
              }
            }, '历史休息')
          ]
        )
      }
    }
  ]
}

export const tableColumns3 = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '司机手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '二级类型',
      key: 'subDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = leaveTypeList(params.row.subDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '开始时间',
      key: 'startTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '结束时间',
      key: 'endTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '工作日',
      key: 'leaveCount',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '当月累计请假',
      key: 'monthTotalLeave',
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
                  that.$router.push({
                    name: 'atted-type3',
                    query: {
                      attedType: 3,
                      uuid: params.row.driverUuid,
                      agentId:that.agentId,
                      driverTag:that.driverTag,
                      cityCode:that.cityCode
                    }
                  })
                }
              }
            }, '历史请假')
          ]
        )
      }
    }
  ]
}

export const tableColumns4 = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '电话',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '车牌号',
      key: 'plateNum',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '状态',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '旷工时长（工作日）',
      key: 'absentDuration',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '在线时长',
      key: 'onlineDuration',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '高峰时长',
      key: 'peakDuration',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '计费时长',
      key: 'chargeDuration',
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
                  that.$router.push({
                    name: 'atted-type4',
                    query: {
                      attedType: 4,
                      uuid: params.row.driverUuid,
                      agentId:that.agentId,
                      driverTag:that.driverTag,
                      cityCode:that.cityCode
                    }
                  })
                }
              }
            }, '历史旷工')
          ]
        )
      }
    }
  ]
}


export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableData: []
}

export const detailPageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableData: []
}

export const detailColumns = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '司机手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        console.log(params.row.actualDutyType)

        return h(
          'div', type
        )
      }
    },
    {
      title: '在线时长',
      key: 'onlineDuration',
      tooltip: true,
      minWidth: 150
    },
    {
      title: '高峰时长',
      key: 'peakDuration',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '计费时长',
      key: 'chargeDuration',
      tooltip: true,
      minWidth: 100
    }
  ]
}

export const detailColumns2 = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '司机手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        console.log(params.row.actualDutyType)

        return h(
          'div', type
        )
      }
    },
    {
      title: '开始时间',
      key: 'startTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '结束时间',
      key: 'endTime',
      tooltip: true,
      minWidth: 100
    }
  ]
}

export const detailColumns3 = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '司机手机号',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '二级类型',
      key: 'subDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = leaveTypeList(params.row.subDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '开始时间',
      key: 'startTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '结束时间',
      key: 'endTime',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '工作日',
      key: 'leaveCount',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '当月累计请假',
      key: 'monthTotalLeave',
      tooltip: true,
      minWidth: 100
    }
  ]
}


export const detailColumns4 = (that) => {
  return [
		{
      title: '排班日',
      key: 'shiftDate',
      tooltip: true,
      minWidth: 100
    },
		{
      title: '排班时段',
      key: 'shiftTimeInterval',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '所属运营商',
      key: 'agentName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
		},
		{
      title: '电话',
      key: 'mobile',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '车牌号',
      key: 'plateNum',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '类型',
      key: 'actualDutyType',
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let type = typeList(params.row.actualDutyType)
        return h(
          'div', type
        )
      }
    },
    {
      title: '旷工时长（工作日）',
      key: 'absentDuration',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '在线时长',
      key: 'onlineDuration',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '高峰时长',
      key: 'peakDuration',
      tooltip: true,
      minWidth: 100
    },
    // {
    //   title: '计费时长',
    //   key: 'chargeDuration',
    //   tooltip: true,
    //   minWidth: 100
    // },
    // {
    //   title: '约谈状态',
    //   key: 'effectiveTime',
    //   tooltip: true,
    //   minWidth: 100
    // },
    // {
    //   title: '操作',
    //   key: 'action',
    //   width: 250,
    //   fixed: 'right',
    //   render: (h, params) => {
    //     return h(
    //       'div', [
    //         h('a', {
    //           on: {
    //             click() {

    //             }
    //           }
    //         }, '详情')
    //       ]
    //     )
    //   }
    // }
  ]
}

// 类型匹配
export const typeList = i => {
  switch(i){
    case 1:
      return "出勤"
      break
    case 2:
      return "休息"
      break
    case 3:
      return "请假"
      break
    case 4:
      return "旷工"
      break
    case 6:
      return "旷工"
      break
    }
}

// 二级类型匹配
export const leaveTypeList = i => {
  return i
// switch(i){
//   case 1:
//     return "事假"
//     break
//   case 2:
//     return "病假"
//     break
//   case 3:
//     return "婚假"
//     break
//   case 4:
//     return "丧假"
//     break
//   case 5:
//     return "产假"
//     break
//   case 6:
//     return "陪护假"
//     break
//   case 7:
//     return "年休假"
//     break
// }
}