export const categoryMap = [
  {
    label: "风控",
    value: "FK"
  },
  {
    label: "客诉",
    value: "KF"
  },
  {
    label: "司机服务违规",
    value: "DP"
  }
];

export const inputList = _this => [
  {
    name: "text-input",
    title: "姓名",
    bind_key: "userName",
    titleWidth: 90,
    value: ""
  },
  {
    name: "drop-input",
    title: "所属类别",
    bind_key: "categoryCode",
    dropList: [],
    titleWidth: 90,
    value: "",
    filterable: true
  }
];

export const tableColumn = _this => [
  {
    title: "姓名",
    key: "userName",
    minWidth: 60
  },
  {
    title: "手机号",
    key: "userPhone",
    minWidth: 120
  },
  {
    title: "城市",
    key: "cityName",
    width: 120
  },
  {
    title: "角色组",
    key: "groupName",
    minWidth: 100
  },
  {
    title: "所属类别",
    key: "categoryName",
    minWidth: 88
  },
  {
    title: "操作人",
    key: "updaterName",
    minWidth: 88
  },
  {
    key: "updateTime",
    title: "操作时间",
    minWidth: 200
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
              onClick={() => _this.updateData(row)}
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

export const PATTERN_PHONE = /^1[0123456789]\d{9}$/;
export const formRule = _this => {
  return {
    category: [
      { required: true, type: "string", message: "请选择", trigger: "change" }
    ],
    group: [
      { required: true, type: "string", message: "请输入", trigger: "change" }
    ],
    cityCode: [
      { required: true, type: "array", message: "请选择", trigger: "change" }
    ],
    phone: [
      {
        required: true,
        type: "string",
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error("手机号不能为空"));
          } else if (!PATTERN_PHONE.test(value)) {
            callback(new Error("手机号格式不正确"));
          } else {
            callback();
          }
        }
      }
    ]
  };
};
