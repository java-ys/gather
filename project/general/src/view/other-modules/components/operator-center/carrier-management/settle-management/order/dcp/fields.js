export const billStatusList = [
  { label: "未提交", value: "0" },
  { label: "待城市确认", value: "1" },
  { label: "待运营商确认", value: "2" },
  { label: "重新提交", value: "4" },
  { label: "城市申诉处理中", value: "5" },
  { label: "完结", value: "6" }
];

export const typesList = [
  { label: "奖励", value: 0 },
  { label: "扣款", value: 1 }
];

const calModeList = [
  { label: "阶梯模式", value: "1" },
  { label: "非阶梯模式", value: "2" }
];
export const calModeConvert = v => {
  const f = calModeList.find(it => it.value - v === 0);
  return f ? f.label : "";
};

const operationModeList = [
  { label: "A", value: 1 },
  { label: "Up", value: 2 }
];
export const operationModeConvert = v => {
  const f = operationModeList.find(it => it.value - v === 0);
  return f ? f.label : "";
};

export const inputList = [
  {
    name: "month-input",
    bind_key: "brokerageMonth",
    placeholder: "请选择月份",
    titleWidth: 60,
    value: "",
    title: "月份："
    // options: {
    //   // 只能选择小于当前月
    //   disabledDate: date => {
    //     const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
    //     return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
    //   }
    // }
  },
  // {
  //   name: "cascader-input",
  //   bind_key: ["provinceCode", "cityCode"],
  //   placeholder: "请选择城市",
  //   value: [],
  //   cascaderList: [],
  //   filterable: true,
  //   title: "城市：",
  //   changeOnSelect: false,
  //   titleWidth: 60,
  //   inputWidth: 165
  // },
  {
    name: "drop-input",
    title: "城市：",
    dropList: [],
    bind_key: "cityCode",
    filterable: true,
    value: "",
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuid",
    filterable: true,
    value: "",
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    title: "状态：",
    titleWidth: 60,
    filterable: true,
    value: "",
    bind_key: "auditStatus",
    dropList: billStatusList
  }
];

function tableHeader(text, desc) {
  return function(h, {row}) {
    let t = {props: {
      content: desc
      }}
    return (<div><span>{text}</span><Tooltip max-width={360} style=" margin-bottom: 2px; margin-left: 6px;" {...t}>
      <Icon type="ios-information-circle" size="14" color="#2d8cf0"/>
    </Tooltip></div>)
  }
}

export const tableColumns = _this => {
  return [
    {
      type: "selection",
      align: "center",
      width: 80
    },
    {
      title: "账单编号",
      key: "billingNo",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "月份",
      key: "brokerageMonth",
      minWidth: 120,
      // render(h, params) {
      //   let bDate = params.row.billingDate || "";
      //   let f = bDate.replace(/(\d{4})(\d{2})/gi, "$1-$2");
      //   return h("span", {}, f);
      // }
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 120
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 160
    },
    {
      title: "运营模式",
      key: "operationMode",
      minWidth: 140,
    },
    {
      title: "订单总量",
      key: "finishOrdCn",
      minWidth: 120,
    },
    {
      title: "订单总流水",
      key: "sumSalFlow",
      minWidth: 120
    },
    {
      title: "风控订单量",
      key: "riskOrdCn",
      minWidth: 120
    },
    {
      title: "风控订单流水",
      key: "riskFlow",
      minWidth: 120
    },
    {
      title: "计佣流水(元)",
      key: "sumLeaFlow",
      minWidth: 140,
      renderHeader: tableHeader('计佣流水(元)', '订单总流水-风控订单流水')
    },
    {
      title: "计佣单量",
      key: "leagueOrdCn",
      minWidth: 180,
      renderHeader: tableHeader('计佣单量', '订单总量-风控订单量')
    },

    {
      title: "基础佣金",
      key: "sumManDriLea",
      minWidth: 180
    },
    {
      title: "奖励佣金",
      key: "sumAwaDriLea",
      minWidth: 180
    },
    {
      title: "服务扣减佣金",
      key: "comPenLea",
      minWidth: 180
    },

    {
      title: "合规扣减佣金",
      key: "normPenLea",
      minWidth: 180
    },
    {
      title: "其他补发佣金",
      key: "reissueLea",
      minWidth: 180
    },

    {
      title: "其他扣减佣金",
      key: "deductionLea",
      minWidth: 180
    },

    {
      title: "总分佣金额",
      key: "sumLeagueBonus",
      minWidth: 180,
      renderHeader: tableHeader('总分佣金额', '总分佣金额=基础佣金+奖励佣金-服务扣减佣金-合规扣减佣金+其他补发佣金-其他扣减佣金')
    },
    {
      title: "状态",
      key: "auditStatusDes",
      minWidth: 150
    },
    {
      title: "当前处理人",
      key: "handler",
      minWidth: 120
    },
    {
      title: '操作',
      fixed: 'right',
      width: 340,
      key: 'operation',
      render: (h, {row}) => {
        let types = row.taskStatus - 1 === 0 ? "error" : "success"
        let isCanSupplyOrDeduct = [0, 4].includes(+row.billingStatus)
        let t = {props: {type: types}};
        return (
          <Row type="flex">
            <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                {...getDirectives("dcp-detail")}
                onClick={() => _this.openDriverList (row)}
              >
                查看明细
              </Button>
            </Col>
            {isCanSupplyOrDeduct ? <Col offset="1">
              <Button
                type="info"
                ghost
                size="small"
                {...getDirectives("dcp-supply")}
                onClick={() => _this.addSupply (row)}
              >
                添加补发
              </Button>
            </Col> : null}
            {isCanSupplyOrDeduct ? <Col offset="1">
              <Button
                type="warning"
                ghost
                size="small"
                {...getDirectives("dcp-deduct")}
                onClick={() => _this.addDeduction (row)}
              >
                添加扣减
              </Button>
            </Col> : null}
            <Col offset="1">
              <Button
                {...t}
                ghost
                size="small"
                {...getDirectives("dcp-log")}
                onClick={() => _this.log (row)}
              >
                日志
              </Button>
            </Col>
          </Row>
        );
      },
    },
  ];
};
function getDirectives(value, directivesList = []) {
  if(!value) return {}
  return {
    directives: [...directivesList, {name: 'hasAuth',
      value}]
  }
}
export const inputListProcess = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "billingNo", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "申请单编号：",
    titleWidth: "100"
  }
];

export const tableColumnsProcess = _this => {
  return [
    {
      title: "申请单编号",
      key: "billingNo",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "月份",
      key: "billingDate",
      minWidth: 120
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 120
    },
    {
      title: "应结金额(元)",
      key: "shouldSettleAmount",
      minWidth: 160
    },
    {
      title: "奖励金额(元)",
      key: "rewardAmount",
      minWidth: 160
    },
    {
      title: "扣减金额(元)",
      key: "deductionAmount",
      minWidth: 160
    },
    {
      title: "实际结算(元)",
      key: "realSettleAmount",
      minWidth: 120
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 170
    },

    {
      title: "状态",
      key: "billingStatus",
      minWidth: 150,
      render(h, { row }) {
        let f = billStatusList.find(it => it.value - row.billingStatus === 0);
        return h("span", f ? f.label : "");
      }
    },
    {
      title: "当前处理人",
      key: "handler",
      minWidth: 120
    },
    {
      title: "操作",
      fixed: "right",
      width: 120,
      key: "operation",
      render(h, params) {
        let row = params.row;
        return h("div", [
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
              on: {
                click() {
                  _this.rowClickHandle(row);
                }
              }
            },
            "处理"
          )
        ]);
      }
    }
  ];
};
export const tableColumnsProcessDone = _this => {
  return [
    {
      title: "申请单编号",
      key: "billingNo",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "月份",
      key: "billingDate",
      minWidth: 120
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 120
    },
    {
      title: "应结金额(元)",
      key: "shouldSettleAmount",
      minWidth: 160
    },
    {
      title: "奖励金额(元)",
      key: "rewardAmount",
      minWidth: 160
    },
    {
      title: "扣减金额(元)",
      key: "deductionAmount",
      minWidth: 160
    },
    {
      title: "实际结算(元)",
      key: "realSettleAmount",
      minWidth: 120
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 170
    },

    {
      title: "状态",
      key: "billingStatus",
      minWidth: 150,
      render(h, { row }) {
        let f = billStatusList.find(it => it.value - row.billingStatus === 0);
        return h("span", f ? f.label : "");
      }
    },
    {
      title: "当前处理人",
      key: "handler",
      minWidth: 120
    }
  ];
};
export const detailTable1Detail = _this => {
  return [
    {
      title: "考核指标",
      key: "indexName"
    },
    {
      title: "实际达成",
      key: "completeRate"
    },
    {
      title: "奖励系数",
      key: "ratio"
    },
    {
      title: "权重",
      key: "weight"
    },
    {
      title: "得分",
      key: "score"
    }
  ];
};

export const detailTableBusinessDetail = _this => {
  return [
    {
      title: "业务",
      key: "name"
    },
    {
      title: "流水",
      key: "flow"
    }
  ];
};

export const columnProcess = [
  { title: "时间", key: "createTime" },
  { title: "节点名称", key: "nodeName" },
  { title: "节点处理人", key: "nodeHandler" },
  { title: "操作", key: "handle" },
  { title: "处理意见", key: "handleOpinion" }
];

export const columnsFile = [
  {
    title: "附件名称",
    key: "attachName",
    render(h, params) {
      return h(
        "span",
        {
          class: {
            "f-f": true
          },
          on: {
            click() {
              let url = params.row.attachUrl;
              url && window.open(url);
            }
          }
        },
        params.row.attachName
      );
    }
  },
  { title: "上传时间", key: "createTime", width: 200 },
  { title: "上传人员", key: "attachSubmitter", width: 200 }
];
