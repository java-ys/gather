// searchList bind_key
const inputListKey = [
  "driverNo",
  "driverName",
  "phoneNumber",
  "agentUuid",
  "resultStatus",
  "submitStartTime",
  "submitEndTime"
];
// table列key值
const tableKey = [
  "driverNo",
  "driverName",
  "phoneNumber",
  "cityName",
  "agentName",
  "resultStatus",
  "submitTime"
];

// 单个司机答案详情列表列
const detailKey = ["title", "types", "answerResultLog"];

export const statusList = [
  { label: "全部", value: "-1" },
  { label: "未考试", value: "1" },
  { label: "已考试", value: "2" },
];

export const testScoreList = [
  { label: "全部", value: "-1" },
  { label: "未通过", value: "1" },
  { label: "通过", value: "2" },
  { label: "暂无", value: "3" },
];
export const inputList = [
  {
    name: "text-input",
    bind_key: inputListKey[0],
    placeholder: "请输入司机code",
    value: "",
    title: "司机code",
    titleWidth: 80
  },
  {
    name: "text-input",
    bind_key: inputListKey[1],
    placeholder: "请输入司机姓名",
    value: "",
    title: "姓名",
    titleWidth: 80
  },
  {
    name: "text-input",
    bind_key: inputListKey[2],
    placeholder: "请输入司机手机号",
    value: "",
    title: "手机号",
    titleWidth: 80
  },
  {
    name: "drop-input",
    bind_key: inputListKey[3],
    value: "",
    titleWidth: 80,
    title: "所属运营商",
    placeholder: "请选择运营商",
    // inputWidth: 165,
    dropList: [],
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: inputListKey[4],
    value: "",
    titleWidth: 80,
    placeholder: "请选择状态",
    title: "状态",
    // inputWidth: 165,
    dropList: statusList
  },
  {
    name: "drop-input",
    bind_key: "completeStatus",
    value: "",
    titleWidth: 80,
    placeholder: "请选择成绩",
    title: "考试成绩",
    // inputWidth: 165,
    dropList: [
      { label: "全部", value: "-1" },
      { label: "未通过", value: "1" },
      { label: "通过", value: "2" },
      { label: "暂无", value: "9" },
    ]
  },
  {
    name: "date-time-input",
    bind_key: [inputListKey[5], inputListKey[6]],
    placeholder: "请选择输入时间",
    value: "",
    titleWidth: 80,
    title: "提交时间",
    format: "yyyy-MM-dd HH:mm:ss",
    inputWidth: 320
  }
];

export const tableTitle = that => {
  return [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "司机code",
      key: tableKey[0],
      tooltip: true,
      minWidth: 100
    },
    {
      title: "姓名",
      key: tableKey[1],
      tooltip: true,
      minWidth: 130
    },
    {
      title: "手机号",
      key: tableKey[2],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "所属城市",
      key: tableKey[3],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "所属运营商",
      key: tableKey[4],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "考试次数",
      key: "submitCnt",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "状态",
      key: tableKey[5],
      tooltip: true,
      minWidth: 140,
      render: (h, params) => {
        let f = statusList.find(it => it.value - params.row[tableKey[5]] === 0);
        return h("span", f ? f.label : "");
      }
    },
    {
      title: "考试成绩",
      key: "completeStatus",
      tooltip: true,
      minWidth: 140,
      render: (h, params) => {
        const status = params.row["completeStatus"]
        return (
          <span>
            { status === 1 && "未通过" }
            { status === 2 && "通过" }
            { status === 9 && "暂无" }
          </span>
        )
      }
    },
    {
      title: "提交时间",
      key: tableKey[6],
      tooltip: true,
      minWidth: 160
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 140,
      render: (h, params) => {
        const row = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              style: {
                "margin-right": "10px"
              },
              attrs: {
                ghost: "ghost"
              },
              // directives: [
              //   {
              //     name: "hasAuth",
              //     value: "exam-list-detail"
              //   }
              // ],
              on: {
                click: () => {
                  console.log('toPaperList: ', row)
                  // that.toPaperDetail(row);
                  that.toPaperList(row);
                }
              }
            },
            "查看答卷"
          )
        ]);
      }
    }
  ];
};

export const detailTableTitle = that => {
  return [
    {
      title: "序号",
      width: 80,
      align: "center",
      render: (h, params) => {
        return h("div", that.pageSize * (that.current - 1) + params.index + 1);
      }
    },
    {
      title: "标题",
      key: detailKey[0],
      tooltip: true,
      minWidth: 150
    },
    {
      title: "类型",
      key: detailKey[1],
      tooltip: true,
      render: (h, params) => {
        const { row } = params;
        const t = row.questionType;
        return h("span", t - 1 === 0 ? "单选" : t - 2 === 0 ? "多选" : "");
      }
    },
    {
      title: "答案",
      key: detailKey[2],
      tooltip: true,
      minWidth: 150
    }
  ];
}

export const testPageListTableTitle = that => {
  return [
    {
      title: "姓名",
      width: 150,
      align: "center",
      key: "driverName"
    },
    {
      title: "考试成绩",
      key: "recStatus",
      tooltip: true,
      width: 150,
      render: (h, params) => {
        
        return (
           <span>
             { params.row['recStatus'] === 0 && '不通过' }
             { params.row['recStatus'] === 1 && '通过' }
           </span>
        )
      }
    },
    {
      title: "提交时间",
      key: "createTime",
      tooltip: true,
    },
    {
      title: "操作",
      key: detailKey[2],
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        const row = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              style: {
                "margin-right": "10px"
              },
              attrs: {
                ghost: "ghost"
              },
              // directives: [
              //   {
              //     name: "hasAuth",
              //     value: "exam-list-detail"
              //   }
              // ],
              on: {
                click: () => {
                  console.log('openDetail: ', row) // todo 处理 row
                  that.openDetail(row);
                }
              }
            },
            "查看本次考试详情"
          )
        ]);
      }
    }
  ];
};
