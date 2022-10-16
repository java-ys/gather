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
// 校验日期
// export const validatorTime = (rule, value, callback) => {
//   let date = value;
//   if (!date) {
//     callback(new Error("必选"));
//   }
//   let timestamp = new Date(date).getTime();
//   if (timestamp < Date.now()) {
//     callback(new Error("生效时间不得小于当前时间"));
//   } else {
//     callback();
//   }
// }

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
    3: "全部",
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



export const qualificationTypeStatus = {
  1: "注册安全工程师",
  2: "生产经营单位从业人员培训合格证书",
  3: "道路运输企业主要负责人和安全生产管理人员安全考核合格证明",
  99: "其他"
}
export const certificationType = {
  1: "企业主要负责人",
  2: "安全管理人员"
}
export const statusType = {
  0: "未创建",
  1: "待生效",
  2: "生效中",
  3: "已失效"
}



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
        width: 100,
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
            )
          ]);
        }
      }
    ];
  }
}
// 列表数据
export const listColumns = {
  columns(_this) {
    return [

      //   {
      //   title: "序号",
      //   width: 80,
      //   render(h, params) {
      //     return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      //   }
      // },

      // // {
      // //   type: 'selection',
      // //   title: '序号',
      // //   width: 80
      // // },
      // {
      //   title: "任务id",
      //   minWidth: 200,
      //   key: "taskId"
      // },
      // {
      //   title: "任务名称",
      //   minWidth: 200,
      //   key: "taskName"
      // },
      // {
      //   title: "任务类型",
      //   minWidth: 120,
      //   key: "taskType",
      //   render: (h, params) => {
      //     return h("div", TASK_TYPE_MAP[params.row.taskType]);
      //   }
      // },
      // {
      //   title: "下发方",
      //   minWidth: 200,
      //   key: "optName"
      // },
      // {
      //   title: "任务范围",
      //   minWidth: 150,
      //   key: "targetType",
      //   render: (h, params) => {
      //     return h("div", getTargetTypeName(params.row.targetType))
      //   }
      // },
      // {
      //   title: "关联上线",
      //   minWidth: 120,
      //   key: "onlineRelation",
      //   render: (h, params) => {
      //     return h("div", params.row.onlineRelation === 1 ? "是" : "否")
      //   }
      // },
      // {
      //   title: "任务创建时间",
      //   minWidth: 200,
      //   render: (h, params) => {
      //     return h("div", `${_this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")}`)
      //   }
      // },
      // {
      //   title: "检核日期",
      //   minWidth: 200,
      //   key: "effectiveTime",
      //   render: (h, params) => {
      //     return h("div", `${_this.$moment(params.row.checkDateStart).format("YYYY-MM-DD")} - ${_this.$moment(params.row.checkDateEnd).format("YYYY-MM-DD")}`)
      //   }
      // },
      // {
      //   title: "任务司机数",
      //   minWidth: 150,
      //   key: "driverCount"
      // },
      // {
      //   title: "司机端接收时间",
      //   minWidth: 160,
      //   render: (h, params) => {
      //     return h("div", params.row.receiveDate)
      //   }
      // },
      // {
      //   title: "状态",
      //   minWidth: 120,
      //   render: (h, params) => {
      //     return h("div", getTaskStatusName(params.row.taskStatus))
      //   }
      // },



      {
        title: "姓名",
        key: "name",
        minWidth: 168,
        render: (h, params) => {
          let rowesData = params.row
          return h("div", rowesData.name || "暂无")
        }
      },
      {
        title: "手机号",
        key: "phone",
        minWidth: 168,
      },
      {
        title: "身份证号",
        key: "idCard",
        minWidth: 200,
      },
      {
        title: "公司",
        key: "agentName",
        minWidth: 168,
      },
      {
        title: "城市",
        key: "cityName",
        minWidth: 168,
      },
      {
        title: "证书编号",
        key: "certificationNum",
        minWidth: 200,
      },
      {
        title: "安全职业资格类型",
        key: "qualificationType",
        minWidth: 168,
        render: (h, params) => {
          let rowesData = params.row
          return h("div", qualificationTypeStatus[rowesData.qualificationType])
        }
      },
      {
        title: "证书专业类别",
        key: "certificationType",
        minWidth: 168,
        render: (h, params) => {
          let rowesData = params.row
          return h("div", certificationType[rowesData.certificationType])
        }
      },
      {
        title: "发证单位",
        key: "certificationUnit",
        minWidth: 168,
      },
      {
        title: "有效期起",
        key: "validityStartTime",
        minWidth: 168,
      },
      {
        title: "有效期止",
        key: "validityEndTime",
        minWidth: 168,
      },
      {
        title: "证书图片",
        key: "validityEndTime",
        minWidth: 168,
        render: (h, params) => {
          return h("div", {
            style: {
              display: "flex",
              justifyContent: "space-between"
            }
          }, [
            h("a", {
              style: {
                color: "#ff8533",
              },
              on: {
                click: () => {
                  _this.picUuid = params.row.certificationImages
                  const picurls =   _this.handleView()

                  console.log(picurls)

                }
              },
            }, "查看"),

          ])
        }

      },
      {
        title: "状态",
        key: "status",
        minWidth: 168,
        render: (h, params) => {
          let rowesData = params.row
          return h("div", statusType[rowesData.status])
        }
      },
      {
        title: "操作人",
        key: "operator",
        minWidth: 168,
      },
      {
        title: "操作时间",
        key: "operateTime",
        minWidth: 168,
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
          // h(
          //   "Button", {
          //     props: {
          //       type: "success",
          //       ghost: true,
          //       size: "small"
          //     },
          //     class: {
          //       tableBtn: true
          //     },
          //     directives: [{
          //       name: "hasAuth",
          //       value: "operator-check-detail"
          //     }],
          //     on: {
          //       click() {
          //         _this.goEditDetail({
          //           ...params.row,
          //           flag: 3
          //         });
          //       }
          //     }
          //   },
          //   "详情"
          // ),
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
                // attrs: {
                //   disabled: params.row.taskStatus !== 1,

                // },
                directives: [{
                  name: "hasAuth",
                  value: "operator-check-edit"
                }],
                on: {
                // click() {
                  click: async () => {
                    let tmpData = params.row
                    if (params.row.certificationImages && params.row.certificationImages.length > 0) {
                      const picurl =  await _this.getUrlByUuid(params.row.certificationImages[0])
                      tmpData.picData = {
                        privateUrl: picurl,
                        uuid: params.row.certificationImages[0]
                      }
                    } else {
                      tmpData.picData = {
                        privateUrl: "",
                        uuid: null
                      }
                    }
                    _this.goEditDetail({
                      ...tmpData,
                      flag: 2,
                      temDate: params.row.validityStartTime,
                      temDateEnd: params.row.validityEndTime,
                    });
                  }
                }
              },
              "编辑"
            ),
          // moreBtn(h, params, _this)
          ]);
        }
      }
    ];
  }
}


// let moreBtn = (h, params, _this) => {
//   return h("Dropdown", {
//     props: {
//       transfer: true
//     }
//   }, [
//     h("Button", {
//       props: {
//         type: "primary",
//         ghost: true,
//         size: "small"
//       },
//       style: {
//         marginRight: "15px",
//         display: "inline-block"
//       },
//       directives: [{
//         name: "hasAuth",
//         value: "operator-check-more"
//       }],
//     }, "更多"),
//     h("DropdownMenu", {
//       slot: "list",
//       style: {
//         minWidth: "60px",
//         textAlign: "center"
//       }
//     }, [dropBtn(h, {
//       ...params,
//       name: "检核列表",

//     }, _this), dropBtn(h, {
//       ...params,
//       name: "作废"
//     }, _this), dropBtn(h, {
//       ...params,
//       name: "终止"
//     }, _this), dropBtn(h, {
//       ...params,
//       name: "日志"
//     }, _this)])
//   ])
// }
// let getDropStatus = (params) => {
//   let flag = ""
//   if (params.name === "作废") {
//     if (params.row.taskStatus === 1) {
//       flag = "block"
//     } else {
//       flag = "none"
//     }
//   } else if (params.name === "终止") {
//     if (params.row.taskStatus === 2) {
//       flag = "block"
//     } else {
//       flag = "none"
//     }
//   } else {
//     flag = "block"
//   }
//   return flag
// }
// let dropBtn = (h, params, _this) => {
// return h("div", {
//   style: {
//     margin: "5px 0 5px 0",
//     color: "#4A4A4A",
//     padding: "5px",
//     cursor: "pointer",
//     fontSize: "12px",
//     display: getDropStatus(params)
//   },
//   on: {
//     click: () => {
//       if (params.name === "作废" || params.name === "终止") {
//         _this.deleteData({
//           ...params.row,
//           name: params.name
//         });
//       }
//       if (params.name === "检核列表") {
//         _this.$router.push({
//           name: "check-list",
//           query: {
//             uuid: params.row.taskUuid
//           }
//         })
//       }
//       if (params.name === "日志") {
//         _this.goLog(params.row);
//       }

//     }
//   }

// }, params.name)
// }

export const inputList = [
  // {
  //   name: "cascader-input", // 级联
  //   bind_key: ["provinceCode", "cityCode"],
  //   value: [],
  //   cascaderList: [],
  //   filterable: true,
  //   title: "城市级联"
  // },
  // {
  //   name: "drop-input",
  //   bind_key: "cityCode",
  //   value: "",
  //   dropList: [],
  //   title: "城市",
  //   titleWidth: 40,
  //   inputWidth: 150,
  //   filterable: true
  // },
  {
    name: "remote-scroll", // 下拉
    bind_key: "organId",
    dataKey: "id",
    dataLabel: "name",
    queryName: "name",
    placeholder: "请输入公司名称",
    value: "",
    title: "公司",
    isHide: false,
  },
  {
    name: "text-input",
    bind_key: "name",
    value: "",
    title: "姓名",
    inputWidth: 150,
    titleWidth: 40,
  },
  {
    name: "text-input",
    bind_key: "telephone",
    value: "",
    title: "手机号码",
    inputWidth: 150,
    titleWidth: 70,
  }
];

export const tableCols = (props) => [
  {
    title: "选择",
    type: "selection",
    width: 75
  },
  {
    title: "姓名",
    key: "name",
    render: (h, params) => {
      let rowesData = params.row
      return h("div", rowesData.name || "暂无")
    },
    minWidth: 330
  },
  {
    title: "手机号",
    key: "telephone",
    minWidth: 330
  },
  {
    title: "状态",
    key: "status",
    tooltip: true,
    minWidth: 330,
    render: (h, params) => {
      return h("div", params.row.status === 1 ? "在职" : "离职")
    }
  }
]