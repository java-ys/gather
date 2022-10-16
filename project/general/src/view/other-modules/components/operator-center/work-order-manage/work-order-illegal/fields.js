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
    label: "三方申诉处理",
    value: "SJ_SF_SSZ"
  },
  {
    label: "三方申诉处理-结束",
    value: "SJ_SF_SSF"
  },
];

// 司机类型
export const driverTypeMap = {
  "10": "自营司机",
  "20": "自营-主司机",
  "30": "自营-副司机",
  "40": "自营-顶班司机",
  "50": "UP司机",
  "60": "UP-主司机",
  "70": "UP-副司机",
  "80": "UP-顶班司机",
  "90": "UP-带车加盟"
};

const woTypeMap = [
  {
    label: "监控大屏",
    value: "DP"
  },
  {
    label: "风控",
    value: "FK"
  },
  {
    label: "客诉",
    value: "KS"
  },
  {
    label: "三方",
    value: "SF"
  },
  {
    label: "司机服务违规",
    value: "HJ"
  },
];

export const workOrderClassMap = [
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
      }
    ]
  }
];

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

export const inputList = _this => [
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
  {
    name: "text-input",
    bind_key: "woCode",
    title: "工单编号",
    titleWidth: 90,
    value: ""
  },
  // {
  //   name: "drop-input",
  //   title: "工单类型",
  //   bind_key: "woType",
  //   dropList: woTypeMap,
  //   titleWidth: 90,
  //   value: "",
  //   filterable: true
  // },
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
    multiple: true,
    filterable: true,
    titleWidth: 90,
    dropList: [],
    value: ""
  },
  {
    name: "cascader-input",
    title: "工单分类",
    bind_key: ["categoryFirst", "categorySecond","categoryThird","categoryFourth"], // 返回数据的key名
    placeholder: "请选择工单分类",
    value: [], // 绑定返回数据
    cascaderList: workOrderClassMap,
    titleWidth: 90,
    changeOnSelect: true,
    filterable: true
  },
  {
    name: "cascader-input",
    title: "判责类型",
    bind_key: ["judgeType0", "judgeType1", "judgeType2", "judgeType3"], // 返回数据的key名
    placeholder: "请选择判责类型",
    value: [], // 绑定返回数据
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
    name: "drop-input",
    bind_key: "woSource",
    value: "",
    dropList: woSourceMap,
    title: "创建方式",
    titleWidth: 90
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
    title: "创建时间",
    bind_key: ["startTime", "endTime"],
    placeholder: "请选择创建时间",
    titleWidth: 90,
    inputWidth: 260,
    value: (() => {
      const e = new Date();
      const s = new Date();
      e.setHours(e.getHours());
      s.setHours(s.getHours());
      s.setDate(e.getDate() - 3);
      return [s, e];
    })(),
  }
];

export const tableColumn = _this => [
  {
    type: "selection",
    width: 60,
    align: "center",
    fixed: "left",
  },
  {
    key: "woCode",
    title: "工单编号",
    minWidth: 250,
    fixed: "left",
  },
  {
    key: "driverId",
    title: "司机ID",
    minWidth: 265
  },
  {
    key: "driverNo",
    title: "司机Code",
    minWidth: 200
  },
  {
    title: "司机姓名",
    key: "driverName",
    minWidth: 100
  },
  {
    title: "司机手机号",
    key: "driverPhone",
    minWidth: 120,
  },
  {
    title: "司机类型",
    key: "driverType",
    minWidth: 120,
    render: (h, { row: { driverType }}) => {
      return driverType ? h("span", driverTypeMap[driverType]) : null;
    }
  },
  {
    key: "carNumber",
    title: "车牌号",
    ellipsis: true,
    tooltip: true,
    minWidth: 128
  },
  {
    key: "agentName",
    title: "所属运营商",
    minWidth: 200
  },
  {
    key: "cityName",
    title: "所属城市",
    minWidth: 90
  },
  {
    key: "routePlanNo",
    title: "订单号",
    minWidth: 180
  },
  {
    key: "woType",
    title: "工单类型",
    minWidth: 112,
    // render: (h, { row: { woType }}) => {
    //   const has = woTypeMap.find(item => item.value === woType);
    //   return has ? h("span", has.label) : null;
    // }
  },
  {
    key: "tailPiece",
    title: "判责类型",
    minWidth: 300,
    render: (h, { row: { tailPiece }}) => {
      let arr = tailPiece.map(item => h("div", {}, item.judgeType.length>0?item.judgeType.split('/')[0]:""));
    //   const arr = tailPiece.map(item => h("div", {}, item.judgeType));
      return arr.length ? h("span", arr) : null;
    }
  },
  {
    key: "judgeResult",
    title: "判责结果",
    ellipsis: true,
    tooltip: true,
    minWidth: 90,
    render: (h, { row: { tailPiece }}) => {
      const arr = tailPiece.map(item => h(
        "div",
        {},
        item.judgeResult === 1 ? "有责" : item.judgeResult === 2 ? "无责" : ""
      ));
      return arr.length ? h("span", arr) : null;
    }
  },
  {
    key: "woCode",
    title: "违规等级",
    minWidth: 90,
    render: (h, { row: { tailPiece }}) => {
      const arr = tailPiece.map(item => h("div", {}, item.illegalLevel));
      return arr.length ? h("span", arr) : null;
    }
  },
  {
    key: "woCode",
    title: "处罚金额",
    minWidth: 90,
    render: (h, { row: { tailPiece }}) => {
      const arr = tailPiece.map(item => h("div", {}, item.forfeit));
      return arr.length ? h("span", arr) : null;
    }
  },
  {
    key: "bizState",
    title: "处理状态",
    minWidth: 168,
    // render(create, { row }) {
    //   let { bizState } = row;
    //   // console.log(bizState)
    //   return <span>{ bizState ? bizState : "/" }</span>
    // }
    render:(h, { row }) =>{
      let { bizState } = row;
      //  const text = that.runStateLabelMapList[bizState] ||""
       const text = _this.runStateLabelMapList[bizState] ||""
      return h("span", text);
    }
  },
  {
    key: "orderSourceName",
    title: "工单来源",
    minWidth: 90,
    render(create, { row }) {
      let { orderSourceName } = row;
      return <span>{ orderSourceName ? orderSourceName : "/" }</span>
    }
  },
  {
    key: "createTime",
    title: "工单创建时间",
    minWidth: 160
  },
  {
    title: "操作",
    key: "actions",
    minWidth: 100,
    fixed: "right",
    render(h, { row }) {
      const { woCode } = row;
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
                type: "info",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "work-illegalOrder-query"
                }
              ],
              on: {
                click() {
                  _this.$router.push({
                    name: "illegal-order-detail",
                    query: {
                      woCode
                    }
                  });
                }
              }
            },
            "查看"
          ),
        ]
      );
    }
  }
];
