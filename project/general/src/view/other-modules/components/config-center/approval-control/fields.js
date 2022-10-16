export const taskMap = {
  1: "发送短信",
  2: "赠款申请",
  3: "电补来源配置",
  4: "电补发放",
  5: "营销活动 - 新增",
  7: "营销活动 - 修改",
  6: "APP广告",
  8: "平台协议与法律条款",
  11: "扣款申请",
  12: "PUSH推送",
  13: "司机心声",
  15: "消息模板审批",
  16: "街景照片审批"
}
// 任务类型
let taskList = []
Object.keys(taskMap).forEach(key => {
  taskList.push({
    value: key,
    label: taskMap[key]
  })
})
taskList.splice(5, 1)
taskList.splice(6, 0, { label: "APP广告", value: 6 })
// 状态
let statusMap = {
  0: "待审核",
  1: "已通过",
  2: "已驳回",
  4: "已超时"
}
let statusList = []
Object.keys(statusMap).forEach(key => {
  statusList.push({
    value: key,
    label: statusMap[key]
  })
})
// 发送对象
export const sendMap = {
  0: "乘客",
  1: "司机",
  2: "车机",
  3: "运营商",
}
// 发送范围
export const driverMap = {
  2: "指定乘客",
  3: "指定司机",
  4: "指定运营商",
  5: "乘客批量",
  7: "司机批量",
  10: "用户分群",
}
// table配置
export const returnFields = (that) => {
  return {
    selection: {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    taskName: {
      title: "任务名称",
      key: "taskName",
      ellipsis: false,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h("div", params.row.taskName.replace('_new','').replace('_marketing-activity',''))
      }
    },
    applicant: {
      title: "申请人",
      key: "applicant",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    type: {
      title: "任务类型",
      key: "type",
      ellipsis: true,
      tooltip: true,
      minWidth: 160,
      render: (h, params) => {
        return h("div", taskMap[params.row.type])
      }
    },
    taskDetail: {
      title: "任务详情",
      key: "taskDetail",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h("div", [
          h("Button", {
            props: {
              type: "text",
              ghost: true,
              size: "small"
            },
            style: {
              color: "#2d8cf0",
              textDecoration: "underline"
            },
            on: {
              click: () => {
                let type = params.row.type
                let jobInfo = JSON.parse(params.row.jobInfo || "{}");
                if (type === 15) return that.$router.push("/reach_platform/template-manage/" + params.row.sourceUuid);
                if (type === 5 || type === 7) {
                  if(params.row.taskName.indexOf('_new')>-1){
                    that.$router.pushToAnotherModule("/m2-web-marketing", {
                      path: '/marketing-activity/create-new-activityDetail/' + params.row.uuid,
                      query: {
                        approval:true,
                        mappingUuid:params.row.sourceUuid,
                        snapshotUuid:jobInfo.uuid
                      }
                    });
                  }else if(params.row.taskName.indexOf('_marketing-activity')>-1){
                    console.log('跳转互动营销')
                    that.$router.pushToAnotherModule("/m2-web-marketing", {
                      path: '/marketing-activity/condition-marketing',
                      query: {
                        approval:true,
                        mode:'detail',
                        uuid:jobInfo.uuid
                      }
                    });
                  }else {
                    // that.$router.push({
                    //   path: '/marketing/activity-detail/'+params.row.uuid+'?type=1',
                    //   query: {
                    //     auditStatus: params.row.status
                    //   }
                    // })
                    that.$router.pushToAnotherModule("/m2-web-marketing", {
                      path: '/other-part/activity-detail/' + params.row.uuid,
                      query: {
                        type: 1,
                        auditStatus: params.row.status
                      }
                    });
                  }
                } else {
                  // 其他类型详情
                  let data = {
                    ...params.row,
                    type: type,
                  }
                  that.getDetailInfo(data)
                  /* that.$router.push({
                    path: '/marketing-operation-admin/app-advertising',
                    query: {
                      type: 12,
                      uuid: params.row.uuid
                    }
                  }); */
                }
              }
            }
          }, "查看详情")
        ])
      }
    },
    createTime: {
      title: "提交时间",
      key: "createTime",
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    approver: {
      title: "审批人",
      key: "approver",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    status: {
      title: "状态",
      key: "status",
      ellipsis: true,
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return h("div", statusMap[params.row.status])
      }
    },
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      render: (h, params) => {
        // 所有待审核状态，都有按钮（除了短信任务-待审核状态+已过期状态）
        let isBtn = false
        if (params.row.status === 0) {
          if (params.row.type === 1 &&　params.row.expiryStatus === 1) {
            isBtn = false
          } else {
            isBtn = true
          }
        }
        return h("div", [
          h("Button", {
            props: {
              type: "success",
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            style: {
              display: isBtn ? "inline-block" : "none"
            },
            directives: [{
              name: "hasAuth",
              value: "approval_control-pass"
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: "确认此任务审批通过？",
                  onOk: () => {
                    let data = {
                      uuid: params.row.uuid,
                      status: 1,
                      type:params.row.type
                    }
                    that.approvalSwitch(data)
                  }
                })
              }
            }
          }, "审批通过"),
          h("Button", {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            style: {
              display: isBtn ? "inline-block" : "none"
            },
            directives: [{
              name: "hasAuth",
              value: "approval_control-fail"
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: "确认此任务审批不通过？",
                  onOk: () => {
                    let data = {
                      uuid: params.row.uuid,
                      status: 2,
                      type:params.row.type
                    }
                    that.approvalSwitch(data)
                  }
                })
              }
            }
          }, "审批不通过")
        ])
      }
    }
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "taskName",
    value: "",
    title: "任务名称："
  },
  {
    name: "drop-input",
    bind_key: "type",
    dropList: taskList,
    value: "",
    title: "任务类型：",
    inputWidth: 140
  },
  {
    name: "date-input", // 文本输入框名
    bind_key: "date", // 返回数据的key名
    placeholder: "请选择日期",
    value: "", // 用于数据绑定
    title: "提交时间：", // 展示的字段名
    inputWidth: 200, // input框的宽度
    options: {},
  },
  {
    name: "drop-input",
    bind_key: "status",
    dropList: statusList,
    value: "",
    title: "状态：",
    titleWidth: 40,
    inputWidth: 120, // input框的宽度
  },
  {
    name: "text-input",
    bind_key: "applicant",
    value: "",
    title: "申请人："
  },
]
export const searchData = {}
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
