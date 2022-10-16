export const statusList = [
  { label: "全部", value: "-1" },
  { label: "未上线", value: "1" },
  { label: "已上线", value: "2" },
  { label: "已下线", value: "3" },
];

// searchList bind_key
const inputListKey = [
  "examTaskName",
  "publishStatus",
  "publishStartTime",
  "publishEndTime",
  "offStartTime",
  "offEndTime",
];
// table列key值
const tableKey = [
  "examTaskName",
  "publishStatus",
  "updateTime",
  "operator",
  "publishTime",
];

const topicKey = ["", "categoryName", "questions"];

export const inputList = [
  {
    name: "text-input",
    bind_key: inputListKey[0],
    placeholder: "请输入考试任务名称",
    value: "",
    title: "考试任务名称",
    titleWidth: 100
  },
  {
    name: "drop-input",
    bind_key: inputListKey[1],
    value: "",
    titleWidth: 60,
    title: "状态",
    placeholder: "请选择状态",
    inputWidth: 165,
    dropList: statusList
  },
  // {
  //   name: "date-time-input",
  //   bind_key: [inputListKey[2], inputListKey[3]],
  //   placeholder: "请选择发布时间",
  //   value: "",
  //   format: "yyyy-MM-dd HH:mm:ss",
  //   title: "发布时间",
  //   inputWidth: 320
  // }
  // {
  //   name: "date-time-input",
  //   bind_key: [inputListKey[2], inputListKey[3]],
  //   placeholder: "请选择上线时间",
  //   value: "",
  //   title: "上线时间",
  //   format: "yyyy-MM-dd HH:mm:ss",
  //   inputWidth: 180
  // },
  // {
  //   name: "date-time-input",
  //   bind_key: [inputListKey[4], inputListKey[5]],
  //   placeholder: "请选择下线时间",
  //   value: "",
  //   title: "下线时间",
  //   format: "yyyy-MM-dd HH:mm:ss",
  //   inputWidth: 180
  // },
  {
    name: "time-input",
    bind_key: "publishTime",
    placeholder: "请选择上线时间",
    value: "",
    title: "上线时间",
    format: "yyyy-MM-dd HH:mm:ss"
    // inputWidth: 180
  },
  {
    name: "time-input",
    bind_key: "offTime",
    placeholder: "请选择下线时间",
    value: "",
    title: "下线时间",
    format: "yyyy-MM-dd HH:mm:ss"
    // inputWidth: 180
  },
];

export const tableTitle = that => {
  return [
    {
      title: "考试任务名称",
      key: tableKey[0],
      tooltip: true,
      minWidth: 120
    },
    {
      title: "状态",
      key: tableKey[1],
      tooltip: true,
      width: 100,
      render: (h, params) => {
        let f = statusList.find(it => it.value - params.row[tableKey[1]] === 0);
        return h("span", f ? f.label : "");
      }
    },
    {
      title: "题目数",
      key: "subjectTotal",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "及格条件",
      key: "passNum",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return <span>答对{params.row["passNum"]}题</span>
      }
    },
    {
      title: "是否关联上线",
      key: "onlineStatus",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return <span>{params.row["onlineStatus"] === 1 ? "是" : "否"}</span>
      }
    },
    {
      title: "待考试",
      key: "examNotSubmitCount",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "已考试",
      key: "examSubmitCount",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "考试通过",
      key: "examPassCount",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "考试未通过",
      key: "examNotPassCount",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "更新时间",
      key: tableKey[2],
      tooltip: true,
      minWidth: 160
    },
    {
      title: "操作人",
      key: tableKey[3],
      tooltip: true,
      minWidth: 80
    },
    {
      title: "上线时间",
      key: tableKey[4],
      tooltip: true,
      minWidth: 160
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 260,
      render: (h, params) => {
        const row = params.row;
        const status = row[tableKey[1]];
        const isOff = status - 1 === 0; // 未发布
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
              directives: [
                {
                  name: "hasAuth",
                  value: "driver-exam-detail"
                }
              ],
              on: {
                click: () => {
                  that.toDetail(row);
                }
              }
            },
            "详情"
          ),
          isOff
            ? h(
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
                  directives: [
                    {
                      name: "hasAuth",
                      value: "driver-exam-edit"
                    }
                  ],
                  on: {
                    // 未发布的可编辑
                    click: () => {
                      that.toEdit(row);
                    }
                  }
                },
                "编辑"
              )
            : null,
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
              directives: [
                {
                  name: "hasAuth",
                  value: "driver-exam-more"
                }
              ],
              on: {
                click: () => {
                  that.toExamList(row);
                }
              }
            },
            "查看答题数据"
          )
        ]);
      }
    }
  ];
};

function hR(h, params, index) {
  const { row } = params;
  const ll = row.questionAnswerDtoList && row.questionAnswerDtoList[index];
  return h("span", {}, ll ? ll.optionDescription : "");
}
const resultWord = ["A", "B", "C", "D", "E"];

export const selectTitle = that => {
  // _checked: true
  return [
    {
      type: "selection",
      width: 60,
      align: "center",
      minWidth: 100
    },
    {
      type: "index",
      title: "序号",
      align: "center",
      width: 80
    },
    {
      title: "题目标题",
      key: topicKey[2],
      minWidth: 240,
      tooltip: true,
      align: "center"
    },
    {
      title: "题目类别",
      key: topicKey[1],
      width: 120,
      tooltip: true,
      align: "center"
    },
    {
      title: "正确答案",
      key: topicKey[1],
      width: 120,
      tooltip: true,
      align: "center",
      render: (h, params) => {
        const { row } = params;
        const { questionAnswerDtoList } = row;
        let arr = [];
        questionAnswerDtoList && questionAnswerDtoList.forEach((it, index) => {
          if (it.optionStatus && it.optionStatus - 1 === 0) {
            arr[arr.length] = resultWord[index];
          }
        });
        return h("span", {}, arr.join(", "));
      }
    },
    {
      title: resultWord[0],
      key: topicKey[1],
      width: 200,
      tooltip: true,
      align: "center",
      render: (h, params) => {
        return hR(h, params, 0);
      }
    },
    {
      title: resultWord[1],
      key: topicKey[1],
      width: 200,
      tooltip: true,
      align: "center",
      render: (h, params) => {
        return hR(h, params, 1);
      }
    },
    {
      title: resultWord[2],
      key: topicKey[1],
      width: 200,
      tooltip: true,
      align: "center",
      render: (h, params) => {
        return hR(h, params, 2);
      }
    },
    {
      title: resultWord[3],
      key: topicKey[1],
      width: 200,
      tooltip: true,
      align: "center",
      render: (h, params) => {
        return hR(h, params, 3);
      }
    },
    {
      title: resultWord[4],
      key: topicKey[1],
      width: 200,
      tooltip: true,
      align: "center",
      render: (h, params) => {
        return hR(h, params, 4);
      }
    }
  ];
};


export const driverType = [
  { label: "主司机", value: "1" },
  { label: "副司机", value: "2" }
];

export const driverModel = [
  { label: "自营司机", value: "1" },
  { label: "UP司机", value: "2" },
  { label: "P司机", value: "3" }
];
