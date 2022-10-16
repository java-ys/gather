// searchList bind_key
const inputListKey = ["questions", "categoryId"];
// table列key值
const tableKey = ["", "categoryName", "questions"];

export const inputList = that => {
  return [
    {
      name: "text-input",
      bind_key: inputListKey[0],
      placeholder: "请输入",
      value: "",
      title: "题目标题",
      titleWidth: 65,
      inputWidth: 200
    },
    {
      name: "drop-input",
      bind_key: inputListKey[1],
      placeholder: "请选择",
      value: "",
      dropList: [],
      title: "题目类别",
      titleWidth: 65,
      inputWidth: 200
    }
  ];
};

export const getTableColumns = that => {
  return [
    {
      // type: "index",
      title: "序号",
      align: "center",
      width: 80,
      render: (h, params) => {
        return h("span", that.pageSize * (that.current - 1) + params.index + 1);
      }
    },
    {
      title: "题目类别",
      key: tableKey[1],
      width: 240,
      tooltip: true,
      align: "center"
    },
    {
      title: "题目标题",
      key: tableKey[2],
      minWidth: 120,
      tooltip: true,
      align: "center"
    },
    {
      title: "操作",
      type: "action",
      width: 120,
      render: (h, params) => {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "info",
                ghost: true
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "exam-topic-edit"
                }
              ],
              on: {
                click: () => {
                  that.toEdit(params.row);
                }
              }
            },
            "编辑"
          )
        ]);
      }
    }
  ];
};

export const demoColumn = [
  {
    type: "index",
    title: "序号",
    align: "center"
  },
  {
    title: "题目标题",
    key: "topicName",
    width: 120,
    tooltip: true,
    align: "center"
  },
  {
    title: "正确答案",
    key: "correctAnswer",
    width: 100,
    tooltip: true,
    align: "center"
  },
  {
    title: "答案1",
    key: "answer1",
    winWidth: 120,
    tooltip: true,
    align: "center"
  },
  {
    title: "答案2",
    key: "answer2",
    winWidth: 120,
    tooltip: true,
    align: "center"
  },
  {
    title: "答案3",
    key: "answer3",
    winWidth: 120,
    tooltip: true,
    align: "center"
  }
];
