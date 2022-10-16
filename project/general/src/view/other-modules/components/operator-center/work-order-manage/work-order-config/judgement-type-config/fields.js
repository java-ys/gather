export const categoryMap = [
  {
    label: "风控",
    value: "FK"
  },
  {
    label: "客诉",
    value: "KS"
  },
  {
    label: "大屏",
    value: "DP"
  },
  {
    label: "高德",
    value: "SFGD"
  }
];

export const violationLevelList = [
  {
    label: "特大",
    value: 1
  },
  {
    label: "重大",
    value: 2
  },
  {
    label: "较大",
    value: 3
  },
  {
    label: "一般",
    value: 4
  },
  {
    label: "轻微",
    value: 5
  },
  {
    label: "警告教育",
    value: 6
  }
];
export const levelList = [
  {
    label: "一级",
    value: 0
  },
  {
    label: "一级",
    value: 1
  },
  {
    label: "二级",
    value: 2
  },
  {
    label: "三级",
    value: 3
  },
  {
    label: "四级",
    value: 4
  },
  {
    label: "五级",
    value: 5
  }
];
export const inputList = _this => [
  {
    name: "drop-input",
    title: "所属工单类型",
    bind_key: "woType",
    dropList: categoryMap,
    titleWidth: 90,
    value: "",
    filterable: true
  },
//   {
//     name: "text-input",
//     title: "判责名称",
//     bind_key: "judgeName",
//     titleWidth: 90,
//     value: ""
//   }
  //   {
  //     name: "drop-input",
  //     title: "适用司机类型",
  //     bind_key: "driverTypes",
  //     filterable: true,
  //     multiple: true,
  //     dropList: [],
  //     titleWidth: 90,
  //     value: ""
  //   },
];

export const tableColumn = _this => [
  {
    title: "判责名称",
    key: "judgeName",
    minWidth: 200,
    slot:"judgeName"
  },
  {
    title: "级别",
    key: "judgeLevel",
    minWidth: 80,
    render: (h, { row }) => {
      return h(
        "div",
        {},
        (levelList.find(it => it.value === row.judgeLevel) || {}).label || ""
      );
    }
  },
  {
    title: "违规等级",
    key: "violationLevel",
    minWidth: 100,
    render: (h, { row }) => {
      return h(
        "div",
        {},
        (violationLevelList.find(it => it.value === row.violationLevel) || {})
          .label || ""
      );
    }
  },
  {
    title: "判罚金额",
    key: "forfeit",
    minWidth: 100
  },
  {
    title: "扣除订单流水",
    key: "deductOrderFlow",
    minWidth: 100,
    render: (h, { row }) => {
      return h(
        "div",
        {},
        row.deductOrderFlow === true ? "是":"否"
      );
    }
  },
//   {
//     title: "适用司机类型",
//     key: "driverType",
//     minWidth: 160,
//     tooltip: true,
//     render: (h, { row }) => {
//       const driverTypeList = JSON.parse((row.driverType||'[]'))
//       let driverTypeTextArr = _this.driverTypeList.filter(it=>driverTypeList.indexOf(it.value) > -1).map(it=>{
//         return it.label
//     })
//       let driverTypeText = driverTypeTextArr.join(',')||""
//       return h(
//         "div",
//         {},
//         driverTypeText
//       );
//     }
//   },
  {
    title: "所属工单类型",
    key: "woType",
    minWidth: 100,
    tooltip: true,
    render: (h, { row }) => {
      return h(
        "div",
        {},
        (categoryMap.find(it => it.value === row.woType) || {})
          .label || ""
      );
    }
  },
  {
    title: "操作人",
    key: "updater",
    minWidth: 120,
    tooltip: true
  },
  {
    key: "updateTime",
    title: "操作时间",
    minWidth: 180
  },
  {
    title: "操作",
    key: "actions",
    minWidth: 180,
    fixed: "right",
    render: (h, { row }) => {
      return (
        <Row type="flex">
          <Col>
            <Button
              type="primary"
              ghost
              size="small"
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
              onClick={() => _this.delData(row)}
            >
              删除
            </Button>
          </Col>
          <Col offset="1">
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => _this.addSubData(row)}
            >
              添加子类
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
    woType: [{ required: true, message: "请选择工单分类", trigger: "change" }],
    driverType: [{ required: true, message: "请输入" }],
    judgeName: [
      {
        required: true,
        type: "string",
        trigger: "blur",
        message: "请输入判责分类"
      }
    ],
    deductOrderFlow:[{ required: true, message: "请选择" }],
  };
};

// 违规等级
export const punishTypeList = [
  {label: "金额", value: 1},
  {label: "服务分", value: 2},
  {label: "课程学习", value: 3},
  {label: "警告", value: 4},
]

export const courseTypeList = [
  {label: "学习", value: 1},
  {label: "考试", value: 2}
]
