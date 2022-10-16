export const announceStatusMap = {
  1: "待发布",
  2: "在线中",
  3: "已过期",
  4: "已撤销"
};
export const statusList = [
  {
    value: "1",
    label: "待发布"
  },
  {
    value: "2",
    label: "在线中"
  },
  {
    value: "3",
    label: "已过期"
  },
  {
    value: "4",
    label: "已撤销"
  },
];

export  const noticeTypeList = [
  {label: "订阅消息", value: 11},
  {label: "新闻动态", value: 12}
]
export const inputList = [
  {
    name: "drop-input",
    title: "公告类型：",
    titleWidth: 60,
    value: "",
    filterable: true,
    bind_key: "noticeType",
    dropList: noticeTypeList
  },
  {
    name: "drop-input",
    title: "状态：",
    titleWidth: 60,
    value: "",
    bind_key: "status",
    filterable: true,
    dropList: statusList
  },
  {
    name: "date-time-input",
    bind_key: ["createdOnStart", "createdOnEnd"],
    placeholder: "请选择",
    value: "",
    title: "创建时间：",
    inputWidth: 250
  },
  {
    name: 'text-input',
    bind_key: 'noticeTitle',
    placeholder: '请输入',
    value: '',
    title: '公告标题：',
  },
  {
    name: "date-time-input",
    bind_key: ["upTime", "downTime"],
    placeholder: "请选择",
    value: "",
    title: "有效期："
  },
  {
    name: "drop-input",
    title: "发布类目：",
    titleWidth: 60,
    value: "",
    filterable: true,
    bind_key: "publishMenuCode",
    dropList: []
  },
  {
    name: "drop-input",
    title: "banner：",
    titleWidth: 60,
    value: "",
    bind_key: "banner",
    filterable: true,
    dropList: [
      {label: "有", value: 1},
      {label: "无", value: 0},
    ]
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'noticeCode', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '公告编码：',
  },
];

export const tableColumns = _this => {
  return [
    {
      title: "公告标题",
      key: "noticeTitle",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "公告编码",
      key: "noticeCode",
      minWidth: 200
    },
    {
      title: "公告类型",
      key: "noticeType",
      minWidth: 120,
      render: (h, {row}) => {
        let f = noticeTypeList.find(it => it.value - row.noticeType === 0)
        return (<span>{f ? f.label: ""}</span>)
      }
    },
    {
      title: "公告副标题",
      key: "noticeSubTitle",
      minWidth: 160
    },
    {
      title: "banner",
      key: "noticeBanner",
      minWidth: 80,
      render: (h, { row }) => {
        return (<span>{row.noticeBanner ? "有" : "无"}</span>)
      }
    },
    {
      title: "链接",
      key: "noticeLink",
      minWidth: 240
    },
    {
      title: "有效期",
      minWidth: 340,
      render: (h, { row }) => {
        return (<span>{row.upTime} - {row.downTime}</span>)
      }
    },
    {
      title: "发布类目",
      key: "publishMenuName",
      minWidth: 120
    },
    {
      title: "创建人",
      key: "creator",
      minWidth: 180
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 180
    },
    {
      title: "已读人数",
      key: "haveRead",
      minWidth: 180
    },
    {
      title: "状态",
      key: "status",
      minWidth: 180,
      render: (h, { row }) => {
        return <span>{announceStatusMap[row.status]}</span>;
      }
    },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      key: "operation",
      render: (h, { row }) => {
        let isShowRepeal = ![3, 4].find(it => it - row.status === 0)
        return (
          <Row type="flex">
            <Col offset="1">
              <Button
                type="primary"
                ghost
                {...getDirectives("passenger-info-detail")}
                size="small"
                onClick={() => _this.openRow(row)}
              >
                详情
              </Button>
            </Col>
            {isShowRepeal ? <Col offset="1">
              <Button
                type="error"
                ghost
                {...getDirectives("passenger-info-repeal")}
                size="small"
                onClick={() => _this.repeal(row)}
              >
                撤销
              </Button>
            </Col> : null }
          </Row>
        );
      }
    }
  ];
};

function getDirectives(value, directivesList = []) {
  if (!value) return {};
  return {
    directives: [...directivesList, { name: "hasAuth", value }]
  };
}

export const arrValidator = (msg) => {
  return (rules, value, callback) => {
    let v = value.filter(Boolean)
    if (!v.length) {
      callback(new Error(msg));
    } else {
      callback();
    }
  }
}
