import { timeFormat } from "@/libs/util.js";
import { mapToList } from "@/libs/util.js";
export const APPID = "5fa978f732cb478093ee6030b6c7a35c";
// 520315b4d7524001a27a3bde5d052c51
export const reassignMap = [
  { label: "初审", value: "CS" },
  { label: "终审", value: "ZS" },
  { label: "初审申诉", value: "SJ_CS_SS" },
  { label: "终审申诉", value: "SJ_ZS_SS" },
  { label: "城市组审核", value: "SJ_CITY" },
  { label: "总部组审核", value: "SJ_HEAD" }
];

export const judgeResultMap = [
  {
    label: "有责",
    value: "1"
  },
  {
    label: "无责",
    value: "2"
  }
];
export const auditResultMap = [
    {
      label: "通过",
      value: "1"
    },
    {
      label: "驳回",
      value: "2"
    }
  ];
export const bizLineMap = [
  {
    label: "企业用车",
    value: "TYPE_ENT_BIZ"
  },
  {
    label: "包车",
    value: "TYPE_TRIP_BC"
  },
  {
    label: "快专-专车",
    value: "TYPE_MODULE_ZC"
  },
  {
    label: "快专-快车",
    value: "TYPE_MODULE_KC"
  },
  {
    label: "出租车",
    value: "TYPE_MODULE_CZ"
  }
];

export const bizMap = [
  {
    label: "新建",
    value: "XJ"
  },
  {
    label: "初审",
    value: "CS"
  },
  {
    label: "终审",
    value: "ZS"
  },
  {
    label: "终审无责-结束",
    value: "ZS_WZ_END"
  },
  {
    label: "司机确认-申诉",
    value: "SJ"
  },
  {
    label: "司机确认-结束",
    value: "SJ_QR_END"
  },
  {
    label: "司机超时自动确认-结束",
    value: "SJ_QR_AUTO_END"
  },
  {
    label: "司机申诉",
    value: "SJ_SS"
  },
  {
    label: "初审申诉处理",
    value: "SJ_CS_SS"
  },
  {
    label: "终审申诉处理",
    value: "SJ_ZS_SS"
  },
  {
    label: "司机终审申诉-结束",
    value: "SJ_ZS_SS_END"
  },
  {
    label: "更改判责",
    value: "APPEAL_ONCE_MORE"
  },
  {
    label: "三方申诉处理",
    value: "SJ_SF_SSZ"
  },
  {
    label: "三方申诉处理-结束",
    value: "SJ_SF_SSF"
  },
];

export const woCategoryList = [
  // 级联列表
  {
    label: "司机管理",
    value: "SJGL",
    type: "",
    children: [
      {
        label: "风控工单",
        value: "FKGD",
        type: "FK"
      },
      {
        label: "违规工单",
        value: "WGGD",
        type: "DP"
      },
      {
        label: "客诉工单",
        value: "KSGD",
        type: "KS"
      },
      {
        label: "高德工单",
        value: "GDGD",
        type: "GD"
      }
    ]
  }
];

export const typeMap = {
  1: "开屏",
  2: "弹窗",
  3: "会员",
  4: "轮播",
  5: "任务",
  6: "商城",
  7: "自定义H5"
};
export const typeList = mapToList(typeMap);

export const woSourceMap = [
  {
    label: "全部",
    value: 0
  },
  {
    label: "系统创建",
    value: 1
  },
  {
    label: "人工创建",
    value: 2
  }
]

// 搜索条件数据
export const inputList = [
  {
    name: "text-input",
    bind_key: "woCode",
    title: "工单编号",
    titleWidth: 90,
    value: ""
  },
  {
    name: "cascader-input",
    title: "工单分类",
    bind_key: ["categoryFirst", "categorySecond","categoryThird","categoryFourth"], // 返回数据的key名
    placeholder: "请选择工单分类",
    value: [], // 绑定返回数据
    cascaderList: [],
    titleWidth: 90,
    changeOnSelect: true,
    filterable: true,
  },
  {
    name: "cascader-input",
    title: "判责类型",
    bind_key: ["judgeType0", "judgeType1", "judgeType2", "judgeType3"], // 返回数据的key名
    placeholder: "请选择判责类型",
    value: [], // 绑定返回数据
    // judgeName: [], // 绑定返回数据
    cascaderList: [],
    titleWidth: 90,
    changeOnSelect: false
  },
  {
    name: "text-input",
    title: "关联订单编号",
    bind_key: "routePlanNo",
    titleWidth: 90,
    value: ""
  },
  {
    name: "date-time-input",
    title: "创建时间",
    bind_key: ["startTime", "endTime"],
    placeholder: "请选择创建时间",
    titleWidth: 90,
    inputWidth: 260,
    value: (() => {
      const e = new Date();
      const s = new Date();
      s.setDate(e.getDate() - 3);
      return [s.toLocaleString("zh-CN"), e.toLocaleString("zh-CN")];
    })(),
  },
  {
    name: "drop-input",
    title: "城市",
    bind_key: "cityCode",
    dropList: [],
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "drop-input",
    title: "运营商",
    bind_key: "agentId",
    dropList: [],
    titleWidth: 90,
    value: "",
    filterable: true
  },


  // {
  //   name: "drop-input",
  //   title: "产品线",
  //   bind_key: "bizLine",
  //   dropList: bizLineMap,
  //   titleWidth: 90,
  //   value: ""
  // },
  {
    name: "drop-input",
    title: "业务线",
    bind_key: "expandBizLine",
    // 1出租车 2专车 4快享 6惠享 7自动驾驶
    dropList: [],
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "产品线",

    bind_key: "typeModule",
    // 1普通运营 2包车 4顺风车 5老年用车 6企业用车 6企业用车
    dropList: [],
    titleWidth: 90,
    value: ""
  },


  {
    name: "text-input",
    title: "司机Code",
    bind_key: "driverNo",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    title: "司机姓名",
    bind_key: "driverName",
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    title: "司机手机号",
    bind_key: "driverPhone",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "司机类型",
    bind_key: "driverTypes",
    filterable: true,
    multiple: true,
    dropList: [],
    titleWidth: 90,
    value: ""
  },
  {
    name: "text-input",
    title: "车牌号",
    bind_key: "carNumber",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    bind_key: "bizState",
    value: "",
    // dropList: bizMap,
    dropList: [],
    title: "处理状态",
    titleWidth: 90
  },
  {
    name: "drop-input",
    bind_key: "judgeResult",
    value: "",
    dropList: judgeResultMap,
    title: "判责结果",
    titleWidth: 90
  },
  {
    name: "text-input",
    title: "当前处理人",
    bind_key: "updaterName",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "创建方式",
    bind_key: "woSource",
    dropList: woSourceMap,
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "drop-input",
    title: "工单来源",
    bind_key: "orderSource",
    dropList: [
      // {
      //   label: "高德",
      //   value: "GD"
      // },
      // {
      //   label: "核检",
      //   value: "HJ"
      // },
      // {
      //   label: "订单",
      //   value: "DD"
      // },
    ],
    titleWidth: 90,
    value: "",
    filterable: true
  },
  {
    name: "date-time-input",
    title: "工单结束时间",
    bind_key: ["finishStartTime", "finishEndTime"],
    placeholder: "请选择工单结束时间",
    titleWidth: 90,
    inputWidth: 260,
    value: ""
  },
  {
    name: "drop-input",
    title: "自动处理状态",
    bind_key: "punish",
    placeholder: "请选择",
    titleWidth: 90,
    inputWidth: 100,
    value: "",
    dropList: [
      {value: 0, label: "未处罚"},
      {value: 1, label: "封禁成功"},
      {value: 2, label: "封禁失败"},
      {value: 3, label: "冻结成功"},
      {value: 4, label: "冻结失败"},
    ],

  }
];

// 表格列数据
export const tableColumns = _this => {
  return [
    {
      title: "订单编号",
      key: "routeNo",
      minWidth: 180,
      render(h, params) {
        return h(
          "a",
          {
            on: {
              click() {
                // 个人订单
                if (params.row.typeEnt == 1) {
                  _this.$router.push({
                    name: "order-detail",
                    params: { id: params.row.routeId }
                  });
                } else {
                  // 企业订单
                  _this.$router.pushToAnotherModule("/m2-web-companyLines", {
                    path: "/companyCenter/orderManager/orderdetail",
                    query: {
                      id: params.row.routeId,
                      applyNo: params.row.applyNo
                    }
                  });
                }
              }
            }
          },
          params.row.routeNo
        );
      }
    },
    {
      title: "保单编号",
      key: "insuranceId",
      minWidth: 180
    },
    {
      title: "是否已投保",
      key: "policied",
      minWidth: 100,
      render(h, parmas) {
        let map = {
          0: "否",
          1: "是"
        };
        return h("span", {}, map[parmas.row.policied]);
      }
    },
    {
      title: "乘车人姓名",
      key: "actualPasNam",
      width: 100
    },
    {
      title: "乘车人手机号",
      key: "actualPasMob",
      minWidth: 120
    },
    {
      title: "下单人姓名",
      key: "poerName",
      minWidth: 100
    },
    {
      title: "下单人手机号",
      key: "poerMob",
      minWidth: 120
    },
    {
      title: "司机姓名",
      key: "driverName",
      minWidth: 90
    },
    {
      title: "司机手机号",
      key: "driverMob",
      minWidth: 120
    },
    {
      title: "保险起期",
      key: "insurBegin",
      minWidth: 150,
      render(h, params) {
        return h(
          "span",
          {},
          timeFormat(params.row.insurBegin, "YYYY-MM-DD hh:mm:ss")
        );
      }
    },
    {
      title: "保险止期",
      key: "insurEnd",
      minWidth: 150,
      render(h, params) {
        return h(
          "span",
          {},
          timeFormat(params.row.insurEnd, "YYYY-MM-DD hh:mm:ss")
        );
      }
    },
    {
      title: "操作",
      width: 100,
      fixed: "right",
      render(h, params) {
        return h(
          "div",
          {
            style: {
              display: "flex"
            }
          },
          [
            h(
              "Button",
              {
                props: {
                  type: "success",
                  ghost: true,
                  size: "small"
                },
                class: {
                  tableBtn: true
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "insurance-info-view"
                  }
                ],
                on: {
                  click() {
                    _this.goDetail(params.row);
                  }
                }
              },
              "查看保单"
            )
          ]
        );
      }
    }
  ];
};
export const defaultData = {
  total: 0,
  current: 1,
  pageSize: 10,
  columnFields: [],
  motorcadeColumn: [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      // 车队纬度
      key: "date",
      title: "日期",
      minWidth: 208
    },
    {
      key: "agentName",
      title: "运营商",
      minWidth: 168,
      tooltip: true
    },
    {
      key: "teamName",
      title: "车队",
      minWidth: 168,
      tooltip: true
    },
    {
      key: "captainName",
      title: "车队队长",
      ellipsis: true,
      minWidth: 128
    },
    {
      key: "aOptDriCnt",
      title: "司机数",
      minWidth: 112
    },
    {
      key: "dDutyMatchStandardDriRatioPercent",
      title: "考勤达标率",
      minWidth: 112
    },
    {
      key: "dFinishCnt",
      title: "完成订单数",
      minWidth: 112
    },
    {
      key: "dRealTimeFinishCnt",
      title: "实时单完成订单数",
      minWidth: 168
    },
    {
      key: "dAppointmentFinishCnt",
      title: "预约单完成订单数",
      minWidth: 168
    },
    {
      key: "dGotCashFlow",
      title: "订单总支付(元)",
      minWidth: 168
    },
    {
      key: "dAvgGotCashFlow",
      title: "人均订单总实付(元)",
      minWidth: 168
    },
    {
      key: "dAvgOnlineDurationTime",
      title: "人均在线时长",
      minWidth: 168
    },
    {
      key: "dAvgPeakDurationTime",
      title: "人均高峰时长",
      minWidth: 168
    },
    {
      key: "dCruiseMileageRatioPercent",
      title: "空驶率（里程）",
      minWidth: 168
    },
    {
      key: "dCruiseDurationRatioPercent",
      title: "空驶率（时长）",
      minWidth: 168
    },
    {
      key: "dBeNegEvaRatioPercent",
      title: "差评率",
      minWidth: 112
    },
    {
      key: "dAvgServiceMileage",
      title: "人均服务里程(km)",
      minWidth: 168
    },
    {
      key: "dAvgPickupMileage",
      title: "人均接驾里程(km)",
      minWidth: 168
    },
    {
      key: "dAvgChargingMileage",
      title: "人均计费里程(km)",
      minWidth: 168
    },
    {
      key: "dNegEvaCnt",
      title: "被差评订单数",
      minWidth: 168
    },
    {
      key: "dBeComplainedOrdCnt",
      title: "被投诉订单数",
      minWidth: 168
    },
    {
      key: "dInfractionCnt",
      title: "违章统计",
      minWidth: 112
    },
    {
      key: "dCashFlowFare",
      title: "行程流水(元)",
      minWidth: 128
    },
    {
      key: "dReplyFinishRatioPercent",
      title: "接起订单率",
      minWidth: 112
    },
    {
      key: "dOnlineDriCnt",
      title: "上线司机数",
      minWidth: 112
    },
    {
      key: "dFinishDriCnt",
      title: "完单司机数",
      minWidth: 112
    },
    {
      key: "dEffectiveDriCnt",
      title: "有效司机数",
      minWidth: 112
    },
    {
      key: "dMatchStandardDriCnt",
      title: "达标司机数",
      minWidth: 112
    },
    {
      key: "dOnlineDriRatioPercent",
      title: "司机上线率",
      minWidth: 112
    },
    {
      key: "dFinishDriRatioPercent",
      title: "司机完单率",
      minWidth: 112
    },
    {
      key: "dAvgFinishCnt",
      title: "司均完单数",
      minWidth: 112
    },
    {
      key: "dAvgDriCashFlowFare",
      title: "司均流水(元)",
      minWidth: 128
    },
    {
      key: "dAvgFinDriFinishCnt",
      title: "完单司机人均单数",
      minWidth: 168
    },
    {
      key: "dAvgFinDriCashFlowFare",
      title: "完单司机人均流水(元)",
      minWidth: 180
    },
    {
      key: "dBrushCnt",
      title: "刷单司机数",
      minWidth: 112
    },
    {
      key: "dTph",
      title: "TPH",
      minWidth: 168
    },

    {
      key: "dFph",
      title: "FPH",
      minWidth: 112
    },
    {
      key: "dPeakDurationTime",
      title: "高峰时长",
      minWidth: 168
    },
    {
      key: "dServiceDurationTime",
      title: "服务时长",
      minWidth: 168
    },
    {
      key: "dMileage",
      title: "总里程(km)",
      minWidth: 168
    }
  ],
  operationColumn: [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      key: "date",
      title: "日期",
      minWidth: 168
    },
    {
      key: "agentName",
      title: "运营商",
      minWidth: 168,
      tooltip: true
    },
    {
      key: "aComplianceDriCnt",
      title: "合规司机数",
      minWidth: 112
    },
    {
      key: "aOperatingVehCnt",
      title: "投运车辆数",
      minWidth: 112
    },
    {
      key: "aOperatingDriRatioPercent",
      title: "运营率",
      minWidth: 112
    },
    {
      key: "dRealTimeFinishCnt",
      title: "实时单完成订单数",
      minWidth: 182
    },
    {
      key: "dAppointmentFinishCnt",
      title: "预约单订单完成订单数",
      minWidth: 188
    },
    {
      key: "dAvgFinishCnt",
      title: "人均完成订单量",
      minWidth: 168
    },
    {
      key: "dCashFlowFare",
      title: "订单总流水(元)",
      minWidth: 130
    },
    {
      key: "dGotCashFlow",
      title: "订单总实付(元)",
      minWidth: 168
    },
    {
      key: "dAvgGotCashFlow",
      title: "人均订单实付(元)",
      minWidth: 168
    },
    {
      key: "dAvgOnlineDurationTime",
      title: "人均在线时长",
      minWidth: 168
    },
    {
      key: "dAvgPeakDurationTime",
      title: "人均高峰时长",
      minWidth: 168
    },
    {
      key: "dCruiseMileageRatioPercent",
      title: "空驶率（里程）",
      minWidth: 168
    },
    {
      key: "dCruiseDurationRatioPercent",
      title: "空驶率（时长）",
      minWidth: 168
    },
    {
      key: "replyRouteCntRatioPercent",
      title: "应答率",
      minWidth: 112
    },
    {
      key: "dBeNegEvaRatioPercent",
      title: "差评率",
      minWidth: 112
    },
    {
      key: "dInfractionCnt",
      title: "违章次数",
      minWidth: 112
    },

    {
      key: "dFinishCnt",
      title: "完成订单数",
      minWidth: 168
    },
    {
      key: "dReplyFinishRatioPercent",
      title: "接起完单率",
      minWidth: 168
    },
    {
      key: "dAvgCashFlowFare",
      title: "单均流水(元)",
      minWidth: 168
    },
    {
      key: "dEntryDriCnt",
      title: "新增入职司机数",
      minWidth: 168
    },
    {
      key: "dDimissionDriCnt",
      title: "新增流失司机数",
      minWidth: 168
    },
    {
      key: "aEntryDriCnt",
      title: "累计入职司机数",
      minWidth: 168
    },

    {
      key: "yEntryDriCnt",
      title: "当年入职司机数",
      minWidth: 168
    },
    {
      key: "aOnJobDriCnt",
      title: "在职司机数",
      minWidth: 168
    },
    {
      key: "aBindDriCnt",
      title: "绑车司机数",
      minWidth: 168
    },
    {
      key: "dBindDriCnt",
      title: "新增绑车司机数",
      minWidth: 168
    },
    {
      key: "dOnlineDriCnt",
      title: "上线司机数",
      minWidth: 168
    },
    {
      key: "dFinishDriCnt",
      title: "完单司机数",
      minWidth: 168
    },

    {
      key: "dEffectiveDriCnt",
      title: "有效司机数",
      minWidth: 168
    },
    {
      key: "dMatchStandardDriCnt",
      title: "达标司机数",
      minWidth: 168
    },
    {
      key: "dOnlineDriRatio",
      title: "司机上线率",
      minWidth: 168
    },
    {
      key: "dFinishDriRatioPercent",
      title: "司机完单率",
      minWidth: 112
    },
    {
      key: "dAvgDriCashFlowFare",
      title: "司均流水(元)",
      minWidth: 168
    },
    {
      key: "dAvgFinDriFinishCnt",
      title: "完单司机人均单数",
      minWidth: 168
    },

    {
      key: "dAvgFinDriCashFlowFare",
      title: "完单司机人均流水(元)",
      minWidth: 180
    },
    {
      key: "dBrushCnt",
      title: "刷单司机数",
      minWidth: 168
    },
    {
      key: "dTph",
      title: "TPH",
      minWidth: 168
    },
    {
      key: "dFph",
      title: "FPH",
      minWidth: 112
    },
    {
      key: "dEffectiveVehRatioPercent",
      title: "投运有效率",
      minWidth: 168
    },
    {
      key: "aBindDriVehCnt",
      title: "绑定司机车辆数",
      minWidth: 168
    },
    {
      key: "dGetOnlineVehCnt",
      title: "上线车辆数",
      minWidth: 168
    },
    {
      key: "dAvgVehFinishCnt",
      title: "车均完单数",
      minWidth: 168
    },
    {
      key: "dAvgVehCashFlowFare",
      title: "车均流水(元)",
      minWidth: 168
    },
    {
      key: "dAvgOnlineVehFinishCnt",
      title: "上线车均完单数",
      minWidth: 168
    },
    {
      key: "dAvgOnlineVehCashFlowFare",
      title: "上线车均流水(元)",
      minWidth: 168
    },
    {
      key: "dAvgVehOnlineDurationTime",
      title: "车均上线时长",
      minWidth: 168
    },
    {
      key: "dPeakDurationTime",
      title: "高峰时长",
      minWidth: 168
    },
    {
      key: "dServiceDurationTime",
      title: "服务时长",
      minWidth: 168
    },
    {
      key: "dMileage",
      title: "总里程(km)",
      minWidth: 168
    }
  ],
  tableData: []
};

export const driverColumn = that => {
  return [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      key: "woCode",
      title: "工单编号",
      minWidth: 208
    },
    {
      key: "categoryFirstDesc",
      title: "一级工单分类",
      ellipsis: true,
      tooltip: true,
      minWidth: 168,
      // render: (h, params) => {
      //   const { categoryFirst } = params.row;
      //   let text = "";
      //   if (categoryFirst === "SJGL") {
      //     text = "司机管理";
      //   }
      //   return h("span", text);
      // }
    },
    {
      key: "categorySecondDesc",
      title: "二级工单分类",
      ellipsis: true,
      tooltip: true,
      minWidth: 138,
      // render: (h, params) => {
      //   const { categorySecond } = params.row;
      //   let text = "";
      //   if (categorySecond === "FKGD") {
      //     text = "风控工单";
      //   } else if (categorySecond === "KSGD") {
      //     text = "客诉工单";
      //   } else if (categorySecond === "WGGD") {
      //     text = "违规工单";
      //   } else if (categorySecond === "GDGD") {
      //     text = "高德工单";
      //   }
      //   return h("span", text);
      // }
    },
    {
      key: "categoryThirdDesc",
      title: "三级工单分类",
      ellipsis: true,
      tooltip: true,
      minWidth: 128
    },
    {
      key: "categoryFourthDesc",
      title: "四级工单分类",
      ellipsis: true,
      tooltip: true,
      minWidth: 128
    },
    // {
    //   key: "judgeTypeF",
    //   title: "一级判责分类",
    //   ellipsis: true,
    //   tooltip: true,
    //   minWidth: 168
    // },
    // {
    //   key: "judgeTypeS",
    //   title: "二级判责分类",
    //   ellipsis: true,
    //   tooltip: true,
    //   minWidth: 112
    // },
    {
      key: "createTime",
      title: "创建时间",
      ellipsis: true,
      tooltip: true,
      minWidth: 168
    },
    {
      key: "cityName",
      title: "城市",
      ellipsis: true,
      tooltip: true,
      minWidth: 112
    },
    {
      key: "typeModuleDesc",
      title: "产品线",
      minWidth: 128,
      // render(h, { row }) {
      //   let f = (bizLineMap.find(it=> it.value === row.bizLine)||{}).label
      //   return h("span", {}, f || "");
      // }
    },
    {
      key: "expandBizLineDesc",
      title: "业务线",
      minWidth: 128
    },
    {
      key: "routePlanNo",
      title: "关联订单编号",
      ellipsis: true,
      tooltip: true,
      minWidth: 170
    },
    {
      key: "driverNo",
      title: "司机Code",
      ellipsis: true,
      tooltip: true,
      minWidth: 170
    },
    {
      key: "driverName",
      title: "司机姓名",
      ellipsis: true,
      tooltip: true,
      minWidth: 170
    },
    {
      key: "driverPhone",
      title: "司机手机号",
      ellipsis: true,
      tooltip: true,
      minWidth: 170
    },
    {
      key: "driverType",
      title: "司机类型",
      ellipsis: true,
      tooltip: true,
      minWidth: 170,
      render(h, { row }) {
        let f = that.driverTypeList.filter(item => item.driverType == Number(row.driverType))
        return h("span", {}, row.driverType && f.length ? f[0].driverTypeDesc : "");
      }
    },
    {
      key: "agentName",
      title: "运营商",
      minWidth: 112
    },
    {
      key: "updaterName",
      title: "当前处理人",
      minWidth: 168,
      render: (h, params) => {
        const { runState, updaterName } = params.row;
        let text = "";
        if (runState !== "FINISH") {
          text = updaterName;
        }
        return h("span", text);
      }
    },
    {
      key: "runState",
      title: "处理状态",
      minWidth: 168,
      // render: (h, params) => {
      //   const { runState, bizState } = params.row;
      //   debugger
      //   let text = "";
      //   if (runState === "FINISH") {
      //     text = "已完结";
      //   } else {
      //     const has = bizMap.find(item => item.value === bizState);
      //     text = has ? has.label : "";
      //   }
      //   return h("span", text);
      // }
      // render(create, { row }) {
      //   let { bizState } = row;
      //   // console.log()
      //   // debugger
      //   return <span>{ bizState ? bizState : "/" }</span>
      // }
      render:(h, { row }) =>{
        let { bizState } = row;
         const text = that.runStateLabelMap[bizState] ||""
        return h("span", text);
      }
    },
    {
      key: "costTime",
      title: "处理耗时",
      ellipsis: true,
      tooltip: true,
      minWidth: 170,
      render: (h, params) => {
        const { costTime } = params.row;
        let text = `${parseInt(costTime / 60)}小时${costTime % 60}分钟`;
        return h("span", text);
      }
    },
    {
      key: "updateTime",
      title: "结束时间",
      ellipsis: true,
      tooltip: true,
      minWidth: 170,
      render: (h, params) => {
        const { runState, updateTime } = params.row;
        let text = runState === "FINISH" ? updateTime : "";
        return h("span", text);
      }
    },
    {
      key: "judgeResult",
      title: "判责结果",
      ellipsis: true,
      tooltip: true,
      minWidth: 168,
      render: (h, params) => {
        const { judgeResult } = params.row;
        let text = "";
        if (judgeResult === 1) {
          text = "有责";
        } else if (judgeResult === 2) {
          text = "无责";
        }
        return h("span", text);
      }
    },
    {
      key: "lastName",
      title: "处理人",
      ellipsis: true,
      tooltip: true,
      minWidth: 168
    },
    {
      key: "carNumber",
      title: "车牌号",
      ellipsis: true,
      tooltip: true,
      minWidth: 128
    },
    {
      key: "orderSourceName",
      title: "工单来源",
      ellipsis: true,
      tooltip: true,
      minWidth: 128,
      render(create, { row }) {
        let { orderSourceName } = row;
        return <span>{ orderSourceName ? orderSourceName : "/" }</span>
      }
    },
    {
      title: "操作",
      width: 200,
      fixed: "right",
      align: "center",
      render(h, { row }) {
        const { woCode, showModifyJudge, bizState } = row;
        return h(
          "div",
          {
            style: {
              display: "flex"
            }
          },
          [
            h(
              "Button",
              {
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
                    let name = "work-order-detail"
                    // if(bizState === "SJ_CITY") {
                    //   name = "city-order-detail"
                    // }
                    that.$router.push({
                      name,
                      query: {
                        woCode
                      }
                    });
                  }
                }
              },
              "详情"
            ),
            h(
              "Button",
              {
                props: {
                  type: "primary",
                  ghost: true,
                  size: "small"
                },
                class: {
                  tableBtn: true
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "work-order-remove"
                  }
                ],
                on: {
                  click() {
                    that.delData(row);
                  }
                }
              },
              "删除"
            ),
            showModifyJudge ? h(
              "Button",
              {
                props: {
                  type: "primary",
                  ghost: true,
                  size: "small"
                },
                class: {
                  tableBtn: true
                },
                // style: {
                //   display: showModifyJudge ? "inline-block" : "none"
                // },
                directives: [
                  {
                    name: "hasAuth",
                    value: "work-order-again-appeal"
                  }
                ],
                on: {
                  click() {
                    that.$router.push({
                      name: "work-order-detail",
                      query: {
                        woCode,
                        appealAgain: showModifyJudge // 是否可以更改判责
                      }
                    });
                  }
                }
              },
              "更改判责"
            ) : null
          ]
        );
      }
    }
  ];
};

export const formRuleAssign = _this => {
  return {
    users: [
      {
        required: true,
        type: "array",
        message: "请选择",
        trigger: "change",
        /*
         * iview Select multiple 校验缺陷
         * 自定义验证 + 表单隐藏时 resetFields
         */
        validator: (rule, value, callback) => {
          if (_this.showModalAssign && (!value || !value.length)) {
            return callback(new Error("请选择"));
          }
          callback();
        }
      }
    ]
  };
};
