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

import { getPersonGroup, getTaskStatusName, getSendModeName } from "../fields.js";

// logType
export const logTypeMap = {
  1: '新增',
  2: '编辑',
  3: '停用',
  4: '删除'
}
export const getLogType = (i) => {
  return logTypeMap[i];
}

// 日志数据
export const logColumns = {
  columns(_this) {
    return [{
      title: 'ID',
      width: 80,
      render(h, params) {
        return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: '操作类型',
      minWidth: 100,
      key: 'operateType',
      render: (h, params) => {
        return h('div', getLogType(params.row.handleType))
      }
    },
    {
      title: '操作时间',
      minWidth: 170,
      render: (h, params) => {
        return h('div', `${_this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss")}`)
      }
    },
    {
      title: '操作人',
      minWidth: 80,
      key: 'updater'
    },
    {
      title: 'IP地址',
      minWidth: 130,
      key: 'ipAddress'
    }
    ];
  }
}

export const getDayTitle = (day) => {
  return day.length === 8 ? day.slice(0, 4) + '/' + day.slice(4, 6) + '/' + day.slice(6, 8) : ''
}

export const getPushTitle = (day) => {
  return day.slice(0, 8)
}

export function renderTel(tel) {
  if (!tel || typeof tel !== "string") return "-";
  let pat = /(\d{3})\d*(\d{4})/;
  return tel.replace(pat, "$1****$2");
}

// 列表数据
export const listColumns = {
  columns(_this) {
    return [
      // {
      //   title: "序号",
      //   width: 80,
      //   render(h, params) {
      //     return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      //   }
      // },
      {
        title: "编号",
        minWidth: 200,
        key: 'configCode'
      },
      {
        title: '名称',
        minWidth: 200,
        key: 'configName'
      },
      {
        title: "生效日期",
        minWidth: 200,
        // key: 'startDay'
        render: (h, params) => {
          return h('div', getDayTitle(params.row.startDay) + '-' + getDayTitle(params.row.endDay))
        }
      },
      {
        title: "发放周期",
        minWidth: 100,
        render: (h, params) => {
          return h('div', getSendModeName(params.row.pushCycleType))
        }
      },

      {
        title: "推送时间",
        width: 100,
        render: (h, params) => {
          return h('div', getPushTitle(params.row.pushCycleTime))
        }
      },

      {
        title: "人群分类",
        width: 100,
        render: (h, params) => {
          return h('div', getPersonGroup(params.row.userType))
        }
      },
      {
        title: "发送人数",
        minWidth: 100,
        key: 'pushUserNumber'
      },
      {
        title: "状态",
        width: 100,
        render: (h, params) => {
          return h('div', getTaskStatusName(params.row.onlineState))
        }
      },
      {
        title: "提交时间",
        minWidth: 200,
        render: (h, params) => {
          return h('div', `${_this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss")}`)
        }
      },
      {
        title: '操作',
        width: 350,
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
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                style: {
                  display: params.row.onlineState !== 0 ? 'none' : 'inline-block',
                },
                on: {
                  click() {
                    _this.$router.push({
                      name: "nps-send-edit",
                      query: {
                        configId: params.row.configId
                      }
                    })
                  }
                }
              },
              '编辑'
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
                directives: [{
                  name: 'hasAuth',
                  value: 'nps_send-stop'
                }],
                style: {
                  display: params.row.onlineState == 1 ? 'inline-block' : 'none',
                },
                on: {
                  click() {
                    _this.handleStopUse(params.row)
                  }
                }
              },
              '停用'
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
                  value: 'nps_send-detail'
                }],
                on: {
                  click() {
                    _this.$router.push({
                      name: "nps-send-detail",
                      query: {
                        configId: params.row.configId
                      }
                    })
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
                // style: {
                //   display: params.row.taskStatus !== 1 ? 'none' : 'inline-block',
                // },
                on: {
                  click() {
                    _this.handleCopy(params.row)
                  }
                }
              },
              '复制'
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
                  value: 'nps_questionnaire-logQueryPage'
                }],
                on: {
                  click() {
                    _this.goLog(params.row);
                  }
                }
              },
              '日志'
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
                style: {
                  display: params.row.onlineState == 0 ? 'none' : 'inline-block',
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'nps_send-analyseHome'
                }],
                on: {
                  click() {
                    _this.$router.push({
                      name: "nps-send-analyse",
                      query: {
                        configId: params.row.configId,
                        configName: params.row.configName
                      }
                    })
                  }
                }
              },
              '分析下载'
            )
          ]);
        }
      }
    ];
  }
}

// 沉默逻辑设置数据
export const slienceItem = [{
  label: '乘客填写问卷沉默期',
  propName: 'passengerSubmit',
  unit: '天'
}, {
  label: '乘客收到未填写问卷沉默期',
  propName: 'passengerUncommit',
  unit: '天'
}, {
  label: '司机填写问卷沉默期',
  propName: 'driverSubmit',
  unit: '天'
}, {
  label: '司机收到未填写问卷沉默期',
  propName: 'driverUncommit',
  unit: '天'
}]

let moreBtn = (h, params, _this) => {
  return h('Dropdown', {
    props: {
      transfer: true
    }
  }, [
    h('Button', {
      props: {
        type: "primary",
        ghost: true,
        size: "small"
      },
      style: {
        marginRight: '15px',
        display: 'inline-block'
      },
      directives: [{
        name: 'hasAuth',
        value: 'operator-check-more'
      }],
    }, '更多'),
    h('DropdownMenu', {
      slot: 'list',
      style: {
        minWidth: '60px',
        textAlign: 'center'
      }
    }, [dropBtn(h, {
      ...params,
      name: "检核列表",

    }, _this), dropBtn(h, {
      ...params,
      name: "作废"
    }, _this), dropBtn(h, {
      ...params,
      name: "终止"
    }, _this), dropBtn(h, {
      ...params,
      name: "日志"
    }, _this)])
  ])
}
let getDropStatus = (params) => {
  let flag = ""
  if (params.name === '作废') {
    if (params.row.taskStatus === 1) {
      flag = "block"
    } else {
      flag = "none"
    }
  } else if (params.name === '终止') {
    if (params.row.taskStatus === 2) {
      flag = "block"
    } else {
      flag = "none"
    }
  } else {
    flag = "block"
  }
  return flag
}
let dropBtn = (h, params, _this) => {
  return h('div', {
    style: {
      margin: '5px 0 5px 0',
      color: '#4A4A4A',
      padding: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      display: getDropStatus(params)
    },
    on: {
      click: () => {
        if (params.name === '作废' || params.name === '终止') {
          _this.deleteData({
            ...params.row,
            name: params.name
          });
        }
        if (params.name === '检核列表') {
          _this.$router.push({
            name: 'check-list',
            query: {
              uuid: params.row.taskUuid
            }
          })
        }
        if (params.name === '日志') {
          _this.goLog(params.row);
        }

      }
    }

  }, params.name)
}
