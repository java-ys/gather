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

import { getPersonGroup, getTaskStatusName } from "../fields.js";

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
        title: 'IP',
        minWidth: 130,
        key: 'ipAddress'
      }
    ];
  }
}

// 列表数据
export const listColumns = {
  columns(_this) {
    return [
      // {
      //   title: '序号',
      //   width: 80,
      //   render(h, params) {
      //     return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      //   }
      // },
      {
        title: '问卷编号',
        minWidth: 150,
        key: 'questionnaireCode'
      },
      {
        title: '问卷名称',
        minWidth: 200,
        key: 'questionnaireName'
      },
      {
        title: '人群分类',
        width: 100,
        render: (h, params) => {
          return h('div', getPersonGroup(params.row.userType))
        }
      },
      {
        title: '提交时间',
        minWidth: 150,
        render: (h, params) => {
          return h('div', `${_this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss")}`)
        }
      },
      {
        title: '操作',
        width: 260,
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
                on: {
                  click() {
                    _this.goEdit(params.row);
                  }
                }
              },
              '编辑'
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
                on: {
                  click() {
                    _this.goDetail(params.row);
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
                on: {
                  click() {
                    _this.goCopy(params.row);
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
                on: {
                  click() {
                    _this.goLog(params.row);
                  }
                }
              },
              '日志'
            )
          ]);
        }
      }
    ];
  }
}
