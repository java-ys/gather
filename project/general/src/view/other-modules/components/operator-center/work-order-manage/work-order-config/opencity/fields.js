export const categoryMap = [
  {
    label: "风控工单",
    value: "FK"
  },
  {
    label: "客诉工单",
    value: "KS"
  },
  {
    label: "大屏工单",
    value: "DP"
  }
];
export const categoryFmtMap = {
  "FK": "风控工单",
  "DP": "大屏工单",
  "KS": "客诉工单",
}
export const orderTypeMap = [
  {
    label: "大屏工单",
    value: "DP"
  },
  {
    label: "风控工单",
    value: "FK"
  },
  {
    label: "客诉工单",
    value: "KS"
  }
]
export const inputList = _this => [
  {
    name: "drop-input",
    title: "工单类型",
    bind_key: "woType",
    dropList: orderTypeMap,
    titleWidth: 90,
    value: "",
    filterable: true
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
];

export const tableColumn = _this => [
  {
    title: "工单类型",
    key: "woType",
    minWidth: 60,
    render(h, { row }) {
      return h(
        "div",
        {},
        categoryFmtMap[row.woType]
      );
    }
  },
  {
    title: "城市",
    key: "cityNames",
    minWidth: 60
  },
  {
    title: "A模式",
    key: "driverATypes",
    minWidth: 120
  },
  {
    title: "UP模式",
    key: "driverUpTypes",
    minWidth: 100
  },
  {
    title: "操作",
    key: "actions",
    minWidth: 200,
    fixed: "right",
    render: (h, { row }) => {
      return (
        <Row type="flex">
          <Col>
            <Button
              type="primary"
              ghost
              size="small"
              v-hasAuth="work-order-config-crew-update"
              onClick={() => _this.showDetail(row)}
            >
              查看
            </Button>
          </Col>
          <Col offset="1">
            <Button
              type="primary"
              ghost
              size="small"
              v-hasAuth="work-order-config-crew-update"
              onClick={() => _this.openEdit(row)}
            >
              编辑
            </Button>
          </Col>
          <Col offset="1">
            <Button
              type="primary"
              ghost
              size="small"
              v-hasAuth="work-order-config-crew-remove"
              onClick={() => _this.delData(row)}
            >
              删除
            </Button>
          </Col>
        </Row>
      );
    }
  }
];

export const PATTERN_PHONE = /^1[0123456789]\d{9}$/
export const formRule = _this => {
  return {
    woType: [{ required: true, type: "string", message: "请选择", trigger: "change" }],
    cityJson: [{ required: true, type: "array", message: "请选择", trigger: "change" }]
  };
};
// 类型
/**
* H0010 -- 打电话
* H0012 -- 抽烟
* H0022 -- 玩手机
* H0025 -- 遮挡DVR摄像头
* H0026 -- 遮挡DMS摄像头
* H0028 -- 未戴口罩
* [H0009 -- 有计费无乘客 -- 忽略]
* H0008 -- 有乘客无订单
*/
export const driverMap = [
  {
    "illegalCode": "H0010",
    "illegalType": "打电话",
  },
  {
    "illegalCode": "H0012",
    "illegalType": "抽烟",
  }, {
    "illegalCode": "H0022",
    "illegalType": "玩手机",
  },
  {
    "illegalCode": "H0025",
    "illegalType": "遮挡DVR摄像头",
  }, {
    "illegalCode": "H0026",
    "illegalType": "遮挡DMS摄像头",
  },
  {
    "illegalCode": "H0028",
    "illegalType": "未戴口罩",
  }, {
    "illegalCode": "H0008",
    "illegalType": "有乘客无订单",
  }
]

export const serviceStatusOptions = [
  {
    label: "巡游",
    value: 1
  },
  {
    label: "接乘中",
    value: 2
  },
  {
    label: "行程中",
    value: 3
  },
  {
    label: "下线",
    value: 4
  }
]