import { tacticsEnum, productLineEnum, operateTypeEnum, reissueList, deductList } from "@/config";
import { findO, getDirectives } from "@/mixins/base";
import { listToMapFnGenerator } from "@/libs/util"
export const billStatusList = [
  { label: "未提交", value: "0" },
  { label: "待城市确认", value: "1" },
  { label: "待运营商确认", value: "2" },
  { label: "运营商已确认", value: "3" },
  { label: "合作伙伴申诉处理中", value: "4" },
  { label: "城市申诉处理中", value: "5" },
  { label: "完结", value: "6" },
  { label: "作废", value: "7" },
  { label: "结算审核中", value: "8" },
  { label: "结算申请驳回", value: "9" },
  { label: "结算中", value: "10" },
];

export const billSourceList = [
  { label: "手动导入", value: 0 },
  { label: "系统计算", value: 1 },
];

export const billSourceMap = Object.freeze(listToMapFnGenerator("value", "label")(billSourceList))
// 仅状态为“作废”“未提交”“合作伙伴申诉处理中”三个状态可操作重生账单、批量重生账单；
export const canRebuildStatusList = Object.freeze([0, 4, 7])

const calModeList = [
  { label: "阶梯模式", value: "1" },
  { label: "非阶梯模式", value: "2" },
];
export const calModeConvert = (v) => findO(v, calModeList).label;

const operationModeList = [
  { label: "A", value: 1 },
  { label: "Up", value: 2 },
];
export const operationModeConvert = (v) => findO(v, operationModeList).label;
const protocolList = [
  { label: "未生成", value: 0 },
  { label: "已生成", value: 1 },
]
export const inputList = [
  {
    name: "month-input",
    bind_key: "billingDate",
    placeholder: "请选择月份",
    titleWidth: 60,
    value: "",
    title: "月份：",
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
  //   bind_key: ["provinceCode", "cityUuid"],
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
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuid",
    filterable: true,
    value: "",
    titleWidth: 60,
  },
  {
    name: "drop-input",
    title: "运营模式：",
    titleWidth: 60,
    value: "",
    bind_key: "operateType",
    dropList: operateTypeEnum,
  },
  {
    name: "drop-input",
    title: "产品线：",
    titleWidth: 60,
    value: "",
    bind_key: "businessType",
    dropList: productLineEnum,
  },
  {
    name: "drop-input",
    title: "状态：",
    titleWidth: 60,
    value: "",
    bind_key: "billingStatus",
    dropList: billStatusList,
  },
  {
    name: "drop-input",
    title: "账单来源：",
    titleWidth: 60,
    value: "",
    bind_key: "billingSource",
    dropList: billSourceList,
  },
  // {
  //   name: "drop-input",
  //   title: "是否生成协议：",
  //   titleWidth: 90,
  //   value: "",
  //   bind_key: "createdFlag",
  //   dropList: protocolList
  // }
];
const allType = [{ label: "不限", value: -1 }]

export const getOperateType = s => {
  s = String(s)
  return (s.split(",")).map(v => findO(v, [...operateTypeEnum, ...allType]).label).filter(Boolean).join(", ")
}

export const getBusinessType = s => {
  s = String(s)
  return (s.split(",")).map(v => findO(v, [...productLineEnum, ...allType]).label).filter(Boolean).join(", ")
}

export const tableColumns = (_this) => {
  return [
    {
      type: "selection",
      align: "center",
      width: 80,
    },
    {
      title: "账单编号",
      key: "billingNo",
      tooltip: true,
      minWidth: 160,
    },
    {
      title: "月份",
      key: "billingDate",
      minWidth: 120,
      render(h, params) {
        let bDate = params.row.billingDate || "";
        let f = bDate.replace(/(\d{4})(\d{2})/gi, "$1-$2");
        return h("span", {}, f);
      },
    },
    {
      title: "账单来源",
      key: "billingSource",
      minWidth: 120,
      render(h, { row }) {
        return h("span", {}, billSourceMap[row.billingSource]);
      },
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 120,
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 160,
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 140,
      render(h, { row }) {
        return (<span>{getOperateType(row.operateType)}</span>);
      },
    },
    {
      title: "产品线",
      key: "businessType",
      minWidth: 160,
      render(h, { row }) {
        return (<span>{getBusinessType(row.businessType)}</span>);
      },
    },
    {
      title: "总分佣金额",
      key: "totalAmount",
      minWidth: 160,
      renderHeader: (h, row) => {
        let t = {
          props: {
            content: "总分佣金额=基础金额+补发金额-扣减金额",
          },
          style: {
            bottom: "1px",
          },
        };
        return (
          <div>
            <span>总分佣金额</span>
            <Tooltip
              max-width={360}
              style=" margin-bottom: 2px; margin-left: 6px;"
              {...t}
            >
              <Icon type="ios-information-circle" size="14" color="#2d8cf0" />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "基础佣金",
      key: "basicAmount",
      minWidth: 120,
    },
    {
      title: "补发佣金",
      key: "reissueAmount",
      minWidth: 120,
    },
    {
      title: "扣减佣金",
      key: "deductionAmount",
      minWidth: 120,
    },
    {
      title: "流水维度",
      key: "statisticsDimension",
      minWidth: 120,
      render: (h, { row }) => {
        const descList = ["", "司机", "运营商"];
        return (<span>{descList[Number(row.statisticsDimension)]}</span>)
      }
    },
    {
      title: "计算方式",
      key: "calMode",
      minWidth: 120,
      render: (h, { row }) => {
        const descList = ["", "阶梯", "非阶梯", "浮动"];
        return (<span>{descList[Number(row.calMode)]}</span>)
      }
    },
    {
      title: "计佣流水(元)",
      key: "commissionOrderFlow",
      minWidth: 160,
      renderHeader: (h, row) => {
        let t = {
          props: {
            content: "订单总流水-风控订单流水",
          },
          style: {
            bottom: "1px",
          },
        };
        return (
          <div>
            <span>计佣流水(元)</span>
            <Tooltip
              max-width={360}
              style=" margin-bottom: 2px; margin-left: 6px;"
              {...t}
            >
              <Icon type="ios-information-circle" size="14" color="#2d8cf0" />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "计佣单量",
      key: "commissionOrderNum",
      minWidth: 120,
      renderHeader: (h, row) => {
        let t = {
          props: {
            content: "订单总量-风控订单量",
          },
          style: {
            bottom: "1px",
          },
        };
        return (
          <div>
            <span>计佣单量</span>
            <Tooltip
              max-width={360}
              style=" margin-bottom: 3px; margin-left: 6px;"
              {...t}
            >
              <Icon type="ios-information-circle" size="14" color="#2d8cf0" />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "订单总量",
      key: "totalOrderNum",
      minWidth: 120,
    },
    {
      title: "订单总流水",
      key: "totalOrderFlow",
      minWidth: 120,
    },
    {
      title: "风控订单量",
      key: "riskOrderNum",
      minWidth: 120,
    },
    {
      title: "风控订单流水",
      key: "riskOrderFlow",
      minWidth: 180,
    },
    {
      title: "状态",
      key: "billingStatus",
      minWidth: 150,
      render(h, { row }) {
        return h("span", findO(row.billingStatus, billStatusList).label);
      },
    },
    {
      title: "当前处理人",
      key: "handler",
      minWidth: 120,
    },
    {
      title: "操作",
      fixed: "right",
      width: 390,
      key: "operation",
      render: (h, { row }) => {
        /*
        查看、日志，所有状态的数据都进行操作；
        添加补发/补扣、作废，仅未提交状态时可以操作；
        已付款，仅结算中状态可以操作；
        仅状态为“作废”“未提交”“合作伙伴申诉处理中”三个状态可操作重生账单、批量重生账单；
        */
        let types = row.taskStatus - 1 === 0 ? "error" : "success";
        let isCanSupplyOrDeduct = [0, 4].includes(Number(row.billingStatus));
        let t = { props: { type: types }};
        let payed = row.billingStatus - 10 === 0; // 结算中
        let canRebuild = canRebuildStatusList.includes(row.billingStatus)
        return (
          <Row type="flex">
            <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                {...getDirectives("dp-order-detail")}
                onClick={() => _this.rowClickHandle(row)}
              >
                查看
              </Button>
            </Col>
            {isCanSupplyOrDeduct ? (
              <Col offset="1">
                <Button
                  type="info"
                  ghost
                  size="small"
                  {...getDirectives("dp-order-supply")}
                  onClick={() => _this.addSupply(row)}
                >
                  添加补发/扣减
                </Button>
              </Col>
            ) : null}
            {isCanSupplyOrDeduct ? (
              <Col offset="1">
                <Button
                  type="warning"
                  ghost
                  size="small"
                  {...getDirectives("dp-order-invalid")}
                  onClick={() => _this.invalid(row)}
                >
                  作废
                </Button>
              </Col>
            ) : null}
            {payed ? (
              <Col offset="1">
                <Button
                  type="warning"
                  ghost
                  size="small"
                  {...getDirectives("dp-order-pay")}
                  onClick={() => _this.isPayed(row)}
                >
                  已付款
                </Button>
              </Col>
            ) : null}
            <Col offset="1">
              <Button
                {...t}
                ghost
                size="small"
                {...getDirectives("dp-order-log")}
                onClick={() => _this.log(row)}
              >
                日志
              </Button>
            </Col>
            {canRebuild ? (
              <Col offset="1">
                <Button
                  type="primary"
                  ghost
                  size="small"
                  {...getDirectives("check-rebuild-bill-btn")}
                  onClick={() => _this.reBuildBill([row.uuid])}
                >
                重生账单
                </Button>
              </Col>
            ) : null}

          </Row>
        );
      },
    },
  ];
};

export const detailTable1 = (_this) => {
  return [
    {
      title: "考核指标",
      key: "indexName",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.indexName,
          },
          on: {
            input: (val) => {
              _this.formData.billingIndexResList[index].indexName = val;
            },
          },
        });
      },
    },
    {
      title: "实际达成",
      key: "completeRate",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.completeRate,
          },
          on: {
            input: (val) => {
              _this.formData.billingIndexResList[index].completeRate = val;
            },
          },
        });
      },
    },
    {
      title: "奖励系数",
      key: "ratio",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.ratio,
          },
          on: {
            input: (val) => {
              _this.formData.billingIndexResList[index].ratio = val;
            },
          },
        });
      },
    },
    {
      title: "权重",
      key: "weight",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.weight,
          },
          on: {
            input: (val) => {
              _this.formData.billingIndexResList[index].weight = val;
            },
          },
        });
      },
    },
    {
      title: "得分",
      key: "score",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.score,
          },
          on: {
            input: (val) => {
              _this.formData.billingIndexResList[index].score = val;
            },
          },
        });
      },
    },

    {
      title: "操作",
      fixed: "right",
      width: 100,
      key: "operation",
      render(h, params) {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small",
              },
              on: {
                click() {
                  _this.deleteRow(params);
                },
              },
            },
            "删除"
          ),
        ]);
      },
    },
  ];
};

export const detailTableBusiness = (_this) => {
  return [
    {
      title: "业务",
      key: "name",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.name,
          },
          on: {
            input: (val) => {
              _this.formData.billingFlowResList[index].name = val;
            },
          },
        });
      },
    },
    {
      title: "流水",
      key: "flow",
      render: (h, params) => {
        let { row, index } = params;
        return h("Input", {
          props: {
            value: row.flow,
          },
          on: {
            input: (val) => {
              _this.formData.billingFlowResList[index].flow = val;
            },
          },
        });
      },
    },
  ];
};

export const inputListProcess = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "billingNo", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "账单编号：",
    titleWidth: "100",
  },
];

// 待处理账单
export const tableColumnsProcess = (_this, typeName) => {
  return [
    {
      title: "账单编号",
      key: "billingNo",
      tooltip: true,
      minWidth: 160,
    },
    {
      title: "月份",
      key: "billingDate",
      minWidth: 120,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160,
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 120,
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 140,
      render(h, { row }) {
        return (<span>{getOperateType(row.operateType)}</span>);
      },
    },
    {
      title: "产品线",
      key: "businessType",
      minWidth: 160,
      render(h, { row }) {
        return (<span>{getBusinessType(row.businessType)}</span>);
      },
    },
    {
      title: "总分佣金额",
      key: "totalAmount",
      minWidth: 160
    },
    {
      title: "基础佣金",
      key: "basicAmount",
      minWidth: 120,
    },
    {
      title: "补发佣金",
      key: "reissueAmount",
      minWidth: 120,
    },
    {
      title: "扣减佣金",
      key: "deductionAmount",
      minWidth: 120,
    },
    {
      title: "流水维度",
      key: "statisticsDimension",
      minWidth: 120,
      render: (h, { row }) => {
        const descList = ["", "司机", "运营商"];
        return (<span>{descList[Number(row.statisticsDimension)]}</span>)
      }
    },
    {
      title: "计算方式",
      key: "calMode",
      minWidth: 120,
      render: (h, { row }) => {
        const descList = ["", "阶梯", "非阶梯", "浮动"];
        return (<span>{descList[Number(row.calMode)]}</span>)
      }
    },
    {
      title: "计佣流水(元)",
      key: "commissionOrderFlow",
      minWidth: 160
    },
    {
      title: "计佣单量",
      key: "commissionOrderNum",
      minWidth: 120
    },
    {
      title: "订单总量",
      key: "totalOrderNum",
      minWidth: 120,
    },
    {
      title: "订单总流水",
      key: "totalOrderFlow",
      minWidth: 120,
    },
    {
      title: "风控订单量",
      key: "riskOrderNum",
      minWidth: 120,
    },
    {
      title: "风控订单流水",
      key: "riskOrderFlow",
      minWidth: 180,
    },
    {
      title: "状态",
      key: "billingStatus",
      minWidth: 150,
      render(h, { row }) {
        return h("span", findO(row.billingStatus, billStatusList).label);
      },
    },
    {
      title: "当前处理人",
      key: "handler",
      minWidth: 120,
    },
    {
      title: "操作",
      fixed: "right",
      width: 240,
      key: "operation",
      render(h, params) {
        let row = params.row;
        const { billingStatus } = row;
        return (
          <Row type="flex">
            <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                {...getDirectives("dp-order-todo-open")}
                onClick={() => _this.rowClickHandle(row)}
              >
                查看账单
              </Button>
            </Col>
            {billingStatus - 4 === 0 || billingStatus - 5 === 0 ? <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                {...getDirectives("dp-order-todo-appeal")}
                onClick={() => _this.appealAudit(row)}
              >
                申诉审核
              </Button>
            </Col> : null }
            {billingStatus - 8 === 0 ? <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                {...getDirectives("dp-order-todo-settle")}
                onClick={() => _this.settleAudit(row)}
              >
                结算审核
              </Button>
            </Col> : null }
          </Row>)
      }
    }
  ];
};
export const tableColumnsProcessDone = (_this, typeName) => {
  return [
    {
      title: "账单编号",
      key: "billingNo",
      tooltip: true,
      minWidth: 160,
      render(h, { row }) {
        return (
          <span
            style={"color: #2d8cf0; cursor: pointer"}
            onClick={() => _this.rowClickHandle(row)}
          >
            {row.billingNo}
          </span>
        );
      },
    },
    {
      title: "月份",
      key: "billingDate",
      minWidth: 120,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160,
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 120,
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 140,
      render(h, { row }) {
        return (<span>{getOperateType(row.operateType)}</span>);
      },
    },
    {
      title: "产品线",
      key: "businessType",
      minWidth: 160,
      render(h, { row }) {
        return (<span>{getBusinessType(row.businessType)}</span>);
      },
    },
    {
      title: "总分佣金额",
      key: "totalAmount",
      minWidth: 160
    },
    {
      title: "基础佣金",
      key: "basicAmount",
      minWidth: 120,
    },
    {
      title: "补发佣金",
      key: "reissueAmount",
      minWidth: 120,
    },
    {
      title: "扣减佣金",
      key: "deductionAmount",
      minWidth: 120,
    },
    {
      title: "流水维度",
      key: "statisticsDimension",
      minWidth: 120,
      render: (h, { row }) => {
        const descList = ["", "司机", "运营商"];
        return (<span>{descList[Number(row.statisticsDimension)]}</span>)
      }
    },
    {
      title: "计算方式",
      key: "calMode",
      minWidth: 120,
      render: (h, { row }) => {
        const descList = ["", "阶梯", "非阶梯", "浮动"];
        return (<span>{descList[Number(row.calMode)]}</span>)
      }
    },
    {
      title: "计佣流水(元)",
      key: "commissionOrderFlow",
      minWidth: 160
    },
    {
      title: "计佣单量",
      key: "commissionOrderNum",
      minWidth: 120
    },
    {
      title: "订单总量",
      key: "totalOrderNum",
      minWidth: 120,
    },
    {
      title: "订单总流水",
      key: "totalOrderFlow",
      minWidth: 120,
    },
    {
      title: "风控订单量",
      key: "riskOrderNum",
      minWidth: 120,
    },
    {
      title: "风控订单流水",
      key: "riskOrderFlow",
      minWidth: 180,
    },
    {
      title: "状态",
      key: "billingStatus",
      minWidth: 150,
      render(h, { row }) {
        return h("span", findO(row.billingStatus, billStatusList).label);
      },
    },
    {
      title: "当前处理人",
      key: "handler",
      minWidth: 120,
    }
  ];
};
export const detailTable1Detail = (_this) => {
  return [
    {
      title: "考核指标",
      key: "indexName",
    },
    {
      title: "实际达成",
      key: "completeRate",
    },
    {
      title: "奖励系数",
      key: "ratio",
    },
    {
      title: "权重",
      key: "weight",
    },
    {
      title: "得分",
      key: "score",
    },
  ];
};

export const detailTableBusinessDetail = (_this) => {
  return [
    {
      title: "考核指标",
      key: "indexName",
    },
    {
      title: "权重%",
      key: "weight",
    },
    {
      title: "得分",
      key: "score",
    },
    {
      title: "子指标",
      key: "subIndexName",
    },
    {
      title: "实际达成",
      key: "actualAchievement",
    },
    {
      title: "系数",
      key: "ratio",
    },
    {
      title: "操作",
      slot: "action",
    },
  ];
};
// 补发
export const reissueColumns = (_this) => {
  return [
    {
      title: "类目",
      key: "category",
      width: 160,
      render: (h, { row }) => {
        let r = [];
        reissueList.forEach(item => {
          r[Number(item.value)] = item.label
        })
        return (<span>{r[Number(row.category)]}</span>)
      }
    },
    {
      title: "金额",
      key: "amount",
      width: 160
    },
    {
      title: "说明",
      key: "remark",
    },
    {
      title: "操作人",
      key: "operName",
      width: 120
    }
  ];
};
// 补扣
export const reductColumns = (_this) => {
  return [
    {
      title: "类目",
      key: "category",
      width: 160,
      render: (h, { row }) => {
        let r = [];
        deductList.forEach(item => {
          r[Number(item.value)] = item.label
        })
        return (<span>{r[Number(row.category)]}</span>)
      }
    },
    {
      title: "金额",
      key: "amount",
      width: 160
    },
    {
      title: "说明",
      key: "remark",
    },
    {
      title: "操作人",
      key: "operName",
      width: 120
    }
  ];
};

export const columnProcess = [
  { title: "时间", key: "createTime" },
  { title: "节点名称", key: "nodeName" },
  { title: "节点处理人", key: "nodeHandler" },
  { title: "操作", key: "handle" },
  { title: "处理意见", key: "handleOpinion" },
];

export const columnsFile = (_this) => {
  return [
    {
      title: "附件名称",
      key: "attachName",
      render(h, params) {
        return h(
          "span",
          {
            class: {
              "f-f": true,
            },
            on: {
              click() {
                // let url = params.row.attachUrl;
                // url && window.open(url);
                _this.getUrlByUuid(params.row.attachUuid)
              },
            },
          },
          params.row.attachName
        );
      },
    },
    { title: "上传时间", key: "createTime", width: 200 },
    { title: "上传人员", key: "attachSubmitter", width: 200 },
  ];
}

// 日志数据
export const logColumns = {
  columns(_this) {
    return [
      //   {
      //   title: 'ID',
      //   width: 80,
      //   render(h, params) {
      //     return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      //   }
      // },
      {
        title: "节点名称",
        minWidth: 100,
        key: "nodeName",
      },
      {
        title: "操作",
        minWidth: 100,
        key: "handle",
      },
      {
        title: "操作时间",
        minWidth: 170,
        render: (h, params) => {
          return h(
            "div",
            `${_this
              .$moment(params.row.createTime)
              .format("YYYY-MM-DD HH:mm:ss")}`
          );
        },
      },
      {
        title: "节点处理人",
        minWidth: 80,
        key: "nodeHandler",
      },
      {
        title: "处理意见",
        minWidth: 130,
        key: "handleOpinion",
      },
    ];
  },
};


export const settleColumns = [
  { title: "账单编号", key: "billingNo", width: 120 },
  { title: "月份", key: "billingDate" },
  { title: "城市", key: "cityName" },
  { title: "运营商", key: "agentName", },
  {
    title: "运营模式", key: "operateType",
    minWidth: 100,
    render(h, { row }) {
      return (<span>{getOperateType(row.operateType)}</span>);
    },
  },
  {
    title: "产品线", key: "businessType",
    minWidth: 100,
    render(h, { row }) {
      return (<span>{getBusinessType(row.businessType)}</span>);
    },
  },
  { title: "分佣金额(元)", key: "totalAmount", minWidth: 80 },
]
