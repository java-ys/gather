export const tableColumns = (that) => {
  return [{
      title: '补偿对象',
      key: 'receiver',
      tooltip: true,
      minWidth: 150,
      // render(h, params) {
      //   return h("div", {}, params.row.receiver + ',' + params.row.description)

      // }
    },
    {
      title: '补偿时段',
      // key: 'startTime',
      tooltip: true,
      minWidth: 260,
      render(h, params) {
        let timeDuration = params.row.startTime + " " + " - " + " " + params.row.endTime;
        return h("div", {}, timeDuration)

      }
    },
    {
      title: '补偿时长(小时)',
      key: 'times',
      tooltip: true,
      minWidth: 85,
    },
    {
      title: '补偿说明',
      key: 'description',
      tooltip: true,
      minWidth: 150,
    },
    {
      title: '操作人',
      key: 'creatorName',
      tooltip: true,
      minWidth: 85,
    },
    {
      title: '操作时间',
      key: 'createdTime',
      tooltip: true,
      minWidth: 100,
    },
  ]
}

export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],

}
// 日志列表
// 日志表格
export const initTableColumns = that => {
  return [{
      type: "index",
      title: "序号",
      align: "left"
    },
    {
      title: "操作人",
      key: "operatorName",
      tooltip: true,
      align: "left"
    },
    {
      title: "UUID",
      key: "operatorUuid",
      tooltip: true,
      align: "left"
    },
    {
      title: "所属部门",
      key: "deptName",
      tooltip: true,
      align: "left"
    },
    {
      title: "IP",
      key: "operatorIp",
      tooltip: true,
      align: "left"
    },
    {
      title: "操作类型",
      key: "operateTypeDesc",
      tooltip: true,
      align: "left",
    },
    {
      title: "操作项",
      key: "operationItem",
      tooltip: true,
      align: "left",
    },
    {
      title: "操作后值",
      key: "operateResult",
      tooltip: true,
      align: "left",
      render(h, params) {
        let text = params.row.operateResult == true ? '成功' : '失败'
        return h('div', text)
      }
    },
    {
      title: "操作时间",
      key: "operateTime",
      tooltip: true,
      align: "left"
    }
  ];
};

export const changeBtn = [{
    value: 0,
    label: "城市",
    primary: "primary",
  },
  {
    value: 1,
    label: "运营商",
    primary: "default",
  },
  {
    value: 2,
    label: "司机",
    primary: "default",
  }
]


export const ruleValidate = {
  radioValue: [
    {
      required: true,
      message: "请选择补偿运营商对象"
    }
  ],
  cityCode: [
    {
      required: true,
      message: "请选择补偿的城市对象"
    }
  ],
  firstCategoryVal: [
    {
      required: true,
      message: "请选择补偿类型"
    }
  ],
  secondCategoryVal: [
    {
      required: true,
      message: "请选择补偿子类型"
    }
  ],
  startTime: [{
    required: true,
    message: "请选择补偿开始时间"
  }],
  endTime: [{
    required: true,
    message: "请选择补偿结束时间"
  }],
  desc: [
    {
      required: true,
      message: "请填写描述"
    }
  ]
};