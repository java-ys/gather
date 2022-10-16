// 业务线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: "快享",
    2: "专享",
    1: "出租车",
  }
  return map[i];
}
export const TASK_TYPE_MAP = {
  0: "检核任务",
  1: "盘点任务"
};
export const TASK_TYPE_ADD_MAP = {
  0: "检核任务",
  // 1: "盘点任务"
};

export const TASK_CLASSIFY_MAP = {
  0: "车辆整洁检核",
  1: "司机工服检核",
  // 2: "车辆盘点任务"
  3: "车贴上刊检核",
};
// 复核状态
export const reCheckMap = {
  // 0: "车辆整洁检核",
  1: "待复核",
  2: "复核通过",
  3: "复核驳回",
};

export const driverTypeList = [
  { value: 0, name: "出租车" },
  { value: 10, name: "自营司机" },
  { value: 20, name: "自营-主司机" },
  { value: 30, name: "自营-副司机" },
  { value: 40, name: "自营-顶班司机" },
  { value: 50, name: "UP司机" },
  { value: 60, name: "UP-主司机" },
  { value: 70, name: "UP-副司机" },
  { value: 80, name: "UP-顶班司机" },
  { value: 90, name: "带车加盟" },
  { value: 100, name: "巡网出租车" },
  // { name: "自营司机", value: 1 },
  // { name: "UP司机", value: 2 },
  // { name: "P司机", value: 3 }
];

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

// 校验任务天数
export const validatorDay = (rule, value, callback) => {
  if (!value) {
    callback(new Error("必填"));
  }
  if (value < 0 || value % 1 !== 0 || value.indexOf(".") > -1) {
    callback(new Error("请输入非负整数"));
  } else {
    callback();
  }
}

// 校验司机ID尾号
export const validatorDriverId = (rule, value, callback) => {
  if (!value) {
    callback(new Error("必填"));
  }
  if (value && value.indexOf(" ") > -1) {
    return callback(new Error("不能有空格"));
  }
  if ((value && value.includes("，")) || (value && value.includes(";")) || (value && value.includes("；"))) {
    return callback(new Error("请使用英文逗号分隔"));
  }
  callback();
}



// 任务执行状态 1.待执行、2.执行中、3.已完成、4.已作废、5.已终止
export const getTaskStatusName = (i) => {
  let map = {
    1: "待执行",
    2: "执行中",
    3: "已完成",
    4: "已作废",
    5: "已终止",
  }
  return map[i];
}
const taskStatusMap = {
  1: "待执行",
  2: "已执行",
  3: "过期未执行",
  4: "已作废",
  5: "已终止",
  6: "无需执行",
  7: "未上线",
}
// 1.待复核 、2. 通过 、3. 驳回 、4. 过期未审核
const reTaskStatusMap = {
  0:"初始",
  1: "待复核",
  2: "通过",
  3: "驳回",
  // 4: "过期未复核",
}
// 违规级别 1.轻微 2.一般 3.严重 4.特大
export const getViolationLevelStatusName = (i) => {
  let map = {
    1: "轻微",
    2: "一般",
    3: "严重",
    4: "特大",
  }
  return map[i];
}

// 司机-任务审核结果： 1.待审核、2.通过、3.违规、4.过期未审核
export const getReviewResultStatus = (i) => {
  let map = {
    1: "待审核",
    2: "通过",
    3: "违规",
    4: "过期未审核",
  }
  return map[i];
}
// 司机-任务审核结果
export const getDriverTaskResultName = (i) => {
  let map = {
    1: "待审核",
    2: "通过",
    3: "违规",
    4: "过期未审核",
  }
  return map[i];
}
// 司机-申诉审核结果 0.待审核 2.申诉通过 3.申诉驳回 4.过期未审核
export const getDriverAppealName = (i) => {
  let map = {
    0: "待审核",
    2: "申诉通过",
    3: "申诉驳回",
    4: "过期未审核",
  }
  return map[i];
}

// 获取任务范围
export const getTargetTypeName = (i) => {
  let map = {
    3: "指定城市",
    2: "指定司机",
    1: "指定运营商"
  }
  return map[i];
}
// 日志数据
export const logColumns = {
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: "操作人",
      minWidth: 80,
      key: "operator"
    },
    {
      title: "UUID",
      minWidth: 100,
      key: "operationUuid"
    },
    {
      title: "所属部门",
      minWidth: 100,
      key: "department"
    },
    {
      title: "IP",
      minWidth: 130,
      key: "ip"
    },
    {
      title: "操作类型",
      minWidth: 100,
      key: "operateType",
      render: (h, params) => {
        return h("div", params.row.operateType === 1 ? "新增" : params.row.operateType === 2 ? "修改" : "删除")
      }
    },
    {
      title: "操作项",
      minWidth: 120,
      key: "operateItem"
    },
    {
      title: "操作后值",
      minWidth: 100,
      render: (h, params) => {
        return h("div", params.row.result === 1 ? "成功" : "失败")
      }

    },
    {
      title: "操作时间",
      minWidth: 170,
      key: "updateTime"
    },
    ];
  }
} // 司机列表数据
export const checkListColumns = {
  columns(_this) {
    return [

      // {
      //   type: 'selection',
      //   title: '序号',
      //   width: 80
      // },
      {
        title: "序号",
        width: 80,
        render(h, params) {
          return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
        }
      },
      {
        title: "司机id",
        minWidth: 200,
        key: "driverId"
      },
      {
        title: "司机姓名",
        minWidth: 200,
        key: "driverName"
      },
      {
        title: "司机手机号",
        minWidth: 150,
        key: "driverPhone"
      },
      {
        title: "车牌号",
        minWidth: 150,
        key: "plateNum"
      },
      {
        title: "车架号",
        minWidth: 150,
        key: "vin"
      },
      {
        title: "运营商名称",
        minWidth: 200,
        key: "agentName"
      }, {
        title: "司管姓名",
        minWidth: 200,
        key: "driverManagerName"
      },
      {
        title: "司管手机号",
        minWidth: 200,
        key: "driverManagerPhone"
      },
      {
        title: "任务执行状态",
        minWidth: 150,
        render: (h, params) => {
          return h("div", taskStatusMap[params.row.taskStatus])
        }
      }, {
        title: "任务接收时间",
        minWidth: 200,
        key: "operateTime"
      },
      {
        title: "任务审核结果",
        minWidth: 150,
        render: (h, params) => {
          return h("div", getDriverTaskResultName(params.row.reviewResult))
        }
      },
      {
        title: "任务复核结果",
        minWidth: 150,
        render: (h, params) => {
          return h("div", reTaskStatusMap[params.row.reCheckStatus])
        }
      },
      {
        title: "违规级别",
        minWidth: 150,
        render: (h, params) => {
          return h("div", getViolationLevelStatusName(params.row.violationLevel))
        }
      },
      {
        title: "处罚金额",
        minWidth: 100,
        key: "finedMoney"
      },
      {
        title: "是否申诉",
        minWidth: 100,
        render: (h, params) => {
          return h("div", params.row.doAppeal === 1 ? "是" : "否")
        }
      },
      {
        title: "申诉结果",
        minWidth: 100,
        render: (h, params) => {
          return h("div", getDriverAppealName(params.row.appealResult))
        }
      },
      {
        title: "操作",
        width: 130,
        fixed: "right",
        render(h, params) {
          return h("div", {
            style: {
              display: "flex",
            }
          }, [
            h(
              "Button", {
                props: {
                  type: "success",
                  ghost: true,
                  size: "small"
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
              "详情"
            ),
            params.row.reCheckStatus === 1 ? 
            h(
              // v-hasAuth="recheckMisson"
              "Button", {
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: "hasAuth",
                  value: "recheck-Missions"
                }],
                on: {
                  click() {
                    _this.checkOrderList(params.row);
                  }
                }
              },
              "复核"
            ) : "",
          ]);
          // 新增
        }
      }
    ];
  }
}
// 列表数据
export const listColumns = {
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },

    // {
    //   type: 'selection',
    //   title: '序号',
    //   width: 80
    // },
    {
      title: "任务id",
      minWidth: 200,
      key: "taskId"
    },
    {
      title: "任务名称",
      minWidth: 200,
      key: "taskName"
    },
    {
      title: "任务类型",
      minWidth: 120,
      key: "taskType",
      render: (h, params) => {
        return h("div", TASK_TYPE_MAP[params.row.taskType]);
      }
    },
    {
      title: "任务分类",
      minWidth: 120,
      key: "taskClassify",
      render: (h, params) => {
        return h("div", TASK_CLASSIFY_MAP[params.row.taskClassify])
      }
    },
    {
      title: "下发方",
      minWidth: 150,
      key: "optName"
    },
    {
      title: "任务范围",
      minWidth: 150,
      key: "targetType",
      render: (h, params) => {
        return h("div", getTargetTypeName(params.row.targetType))
      }
    },
    {
      title: "关联上线",
      minWidth: 120,
      key: "onlineRelation",
      render: (h, params) => {
        return h("div", params.row.onlineRelation === 1 ? "是" : "否")
      }
    },
    {
      title: "任务创建时间",
      minWidth: 200,
      render: (h, params) => {
        return h("div", `${_this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")}`)
      }
    },
    {
      title: "检核日期",
      minWidth: 200,
      key: "effectiveTime",
      render: (h, params) => {
        return h("div", `${_this.$moment(params.row.checkDateStart).format("YYYY-MM-DD")} - ${_this.$moment(params.row.checkDateEnd).format("YYYY-MM-DD")}`)
      }
    },
    {
      title: "任务司机数",
      minWidth: 150,
      key: "driverCount"
    },
    {
      title: "已审核数",
      minWidth: 150,
      key: "reviewCount"
    },
    {
      title: "已复核数",
      minWidth: 150,
      key: "reCheckCount"
    },
    {
      title: "司机端接收时间",
      minWidth: 160,
      render: (h, params) => {
        return h("div", params.row.receiveDate)
      }
    },
    {
      title: "状态",
      minWidth: 120,
      render: (h, params) => {
        return h("div", getTaskStatusName(params.row.taskStatus))
      }
    },

    {
      title: "操作",
      width: 220,
      fixed: "right",
      render(h, params) {
        return h("div", {
          style: {
            display: "flex",
          }
        }, [
          h(
            "Button", {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "operator-check-detail"
              }],
              on: {
                click() {
                  _this.goEditDetail({
                    ...params.row,
                    flag: 3
                  });
                }
              }
            },
            "详情"
          ),
          h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              attrs: {
                disabled: params.row.taskStatus !== 1,

              },
              directives: [{
                name: "hasAuth",
                value: "operator-check-edit"
              }],
              on: {
                click() {
                  _this.goEditDetail({
                    ...params.row,
                    flag: 2
                  });
                }
              }
            },
            "编辑"
          ),
          moreBtn(h, params, _this)
        ]);
      }
    }
    ];
  }
}


let moreBtn = (h, params, _this) => {
  return h("Dropdown", {
    props: {
      transfer: true
    }
  }, [
    h("Button", {
      props: {
        type: "primary",
        ghost: true,
        size: "small"
      },
      style: {
        marginRight: "15px",
        display: "inline-block"
      },
      directives: [{
        name: "hasAuth",
        value: "operator-check-more"
      }],
    }, "更多"),
    h("DropdownMenu", {
      slot: "list",
      style: {
        minWidth: "60px",
        textAlign: "center"
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
  if (params.name === "作废") {
    if (params.row.taskStatus === 1) {
      flag = "block"
    } else {
      flag = "none"
    }
  } else if (params.name === "终止") {
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
  return h("div", {
    style: {
      margin: "5px 0 5px 0",
      color: "#4A4A4A",
      padding: "5px",
      cursor: "pointer",
      fontSize: "12px",
      display: getDropStatus(params)
    },
    on: {
      click: () => {
        if (params.name === "作废" || params.name === "终止") {
          _this.deleteData({
            ...params.row,
            name: params.name
          });
        }
        if (params.name === "检核列表") {
          _this.$router.push({
            name: "check-list",
            query: {
              uuid: params.row.taskUuid
            }
          })
        }
        if (params.name === "日志") {
          _this.goLog(params.row);
        }

      }
    }

  }, params.name)
}

export const formValidate = {
  taskName: [
    {
      required: true,
      message: "必填",
      trigger: "change"
    },
    {
      pattern: /^[^\s]{1,50}$/,
      message: "不能输入空格且最多24位",
      trigger: "change"
    }
  ],
  taskType: [
    {
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  targetType: [
    {
      type: "number",
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  checkDate: [
    {
      required: true,
      validator: validatorTime
    }
  ],
  receiveDate: [
    {
      required: true,
      validator: validatorTime
    }
  ],
  onlineRelation: [
    {
      type: "number",
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  taskFrequency: [{
    validator: (rule, value, callback) => {
      // if (this.formData.taskType === "0") {
      //   return callback();
      // }
      if (!value || !value.length) {
        return callback("频率必须选择")
      }
      callback();
    }
  }],
  violationLevel: [
    {
      validator: (rule, value, callback) => {
        // if (this.formData.taskType === "1") {
        //   return callback();
        // }
        if (!value || !value.length) {
          return callback("违规级别必须选择")
        }
        callback();
      }
      // type: "array",
      // required: true,
      // message: "必选",
      // trigger: "change"
    }
  ],
  uploadCheckStandard: [],
  enclosureNameList: [
    {
      type: "array",
      required: true,
      message: "必填",
      trigger: "change"
    }
  ],
  taskClassify: [
    {
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  cityList: [
    {
      type: "array",
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  driverTypes: [
    {
      type: "array",
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  tailNumbers: [
    {
      required: true,
      validator: validatorDriverId
    }
  ],
  needAgentAduit: [
    {
      type: "number",
      required: true,
      message: "必选",
      trigger: "change"
    }
  ],
  repeatDur: [
    {
      required: true,
      validator: validatorDay
    }
  ],



}