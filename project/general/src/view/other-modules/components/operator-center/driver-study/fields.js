import { Switch } from "iview";

// 上下线状态
const statusList = [
  { label: "全部", value: "-1" },
  { label: "未上线", value: "1" },
  { label: "已上线", value: "2" },
  { label: "已下线", value: "3" }
];
const studyList = [
  { label: "全部", value: "-1" },
  { label: "是", value: "1" },
  { label: "否", value: "0" }
];

//---------------------------------------------------------------
//---------------------------------------------------------------
// searchList bind_key
export const inputListKey = [
  "",
  "learningTaskName",
  "publishStatus",
  "publishTime",
  "offTime",
  "cataId",
  "isMust"
];
//--------------------------------------------------------------
//--------------------------------------------------------------

export const inputList = [
  {
    name: "text-input",
    bind_key: inputListKey[1],
    placeholder: "请输入学习任务名称",
    value: "",
    title: "学习任务名称",
    titleWidth: 100
  },
  {
    name: "drop-input",
    bind_key: inputListKey[2],
    placeholder: "请选择状态",
    value: "",
    titleWidth: 100,
    title: "状态",
    // inputWidth: 165,
    dropList: statusList
  },
  {
    name: "time-input",
    bind_key: inputListKey[3],
    placeholder: "请选择上线时间",
    value: "",
    title: "上线时间",
    format: "yyyy-MM-dd HH:mm:ss"
    // inputWidth: 180
  },
  {
    name: "time-input",
    bind_key: inputListKey[4],
    placeholder: "请选择下线时间",
    value: "",
    title: "下线时间",
    format: "yyyy-MM-dd HH:mm:ss"
    // inputWidth: 180
  },
  {
    name: "drop-input",
    bind_key: inputListKey[5],
    placeholder: "请选择",
    value: "",
    titleWidth: 100,
    title: "学习分类",
    // inputWidth: 165,
    dropList: [],
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: inputListKey[6],
    placeholder: "请选择",
    value: "",
    titleWidth: 100,
    title: "是否必学",
    // inputWidth: 165,
    dropList: studyList
  }
];

//---------------------------------------------------------------
//---------------------------------------------------------------
// table列key值
export const tableKey = [
  "",
  "learningTaskName",
  "cataName",
  "isMust",
  "publishStatus",
  "notStudyCount",
  "studyInCount",
  "studyPassCount",
  "updateTime",
  "operator",
  "publishTime",
  "onlineStatus"
];
//---------------------------------------------------------------
//---------------------------------------------------------------

export const tableTitle = that => {
  return [
    {
      title: "学习任务名称",
      key: tableKey[1],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "学习分类",
      key: tableKey[2],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "是否必学",
      key: tableKey[3],
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let f = params.row[tableKey[3]];
        let resArr = ["否", "是"];
        //  0 非必学 ，1 必学
        return <span>{resArr[+f]}</span>;
      }
    },
    {
      title: "状态",
      key: tableKey[4],
      tooltip: true,
      minWidth: 80,
      render: (h, params) => {
        let f = statusList.find(it => it.value - params.row[tableKey[4]] === 0);
        return <span>{f ? f.label : ""}</span>;
      }
    },
    {
      title: "待学习司机",
      key: tableKey[5],
      tooltip: true,
      minWidth: 100
    },
    {
      title: "学习中司机",
      key: tableKey[6],
      tooltip: true,
      minWidth: 100
    },
    {
      title: "已学习司机",
      key: tableKey[7],
      tooltip: true,
      minWidth: 100
    },
    {
      title: "更新时间",
      key: tableKey[8],
      tooltip: true,
      minWidth: 160
    },
    {
      title: "操作人",
      key: tableKey[9],
      tooltip: true,
      minWidth: 100
    },
    {
      title: "上线时间",
      key: tableKey[10],
      tooltip: true,
      minWidth: 160
    },
    {
      title: "关联上线",
      key: tableKey[11],
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let s = params.row[tableKey[11]];
        let status = params.row["publishStatus"];
        let b = s && s - 1 === 0;
        // 关联上线：1 是 2 否
        return (
          <Switch
            value={b}
            disabled={status - 3 === 0}
            onOn-change={val => that.switch(params, val)}
          />
        );
      }
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 220,
      render: (h, params) => {
        const row = params.row;
        const publishStatus = row[tableKey[4]];
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
                  value: "driver-study-detail"
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
          // 未上线
          publishStatus - 1 === 0
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
                      value: "driver-study-edit"
                    }
                  ],
                  on: {
                    click: () => {
                      that.toEdit(row);
                    }
                  }
                },
                "编辑"
              )
            : null,
          // 学习任务已上线/已下线展示该按钮
          publishStatus - 2 === 0 || publishStatus - 3 === 0
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
                      value: "driver-study-view"
                    }
                  ],
                  on: {
                    click: () => {
                      that.viewDetail(row);
                    }
                  }
                },
                "查看数据"
              )
            : null
        ]);
      }
    }
  ];
};

export const addValidate = {
  learningTaskName: [{ required: true, message: "学习任务名称不能为空" }],
  publishTime: [{ required: true, message: "请选择上线时间" }],
  offTime: [{ required: true, message: "请选择下线时间" }],
  cataId: [{ required: true, message: "请选择学习分类" }],
  person: [{ required: true, message: "请指定司机", trigger: "blur" }],
  agentUuid: [{ required: true, message: "请指定运营商" }],
  isMust: [{ required: true, message: "请设置是否必学" }],
  contentType: [{ required: true, message: "请设置学习内容" }],
  types: [{ required: true, message: "请设置学习对象" }],
  pageTimeLimit: [
    {
      // required: true,
      message: "请输入整数",
      pattern: /(^[0-9]{1}[0-9]*$)/,
      trigger: "change"
    }
  ],
  videoTipTime: [
    {
      // required: true,
      message: "请输入整数",
      pattern: /(^[0-9]{1}[0-9]*$)/,
      trigger: "change"
    }
  ],
  imageUrl: [
    {
      required: true,
      message: "请上传主题图",
      trigger: "change"
    }
  ],
  fileUrl: [
    {
      required: true,
      message: "请上传图文",
      trigger: "change"
    }
  ],
  videoUrl: [
    {
      required: true,
      message: "请上传视频",
      trigger: "change"
    }
  ]
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
