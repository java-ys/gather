import { operateTypeEnum, productLineEnum } from "@/config";
import { getDirectives } from "@/mixins/base";

export const inputList = [

  {
    name: "drop-input",
    bind_key: "cityCodeList",
    placeholder: "请选择城市",
    value: "",
    dropList: [],
    multiple: true,
    filterable: true,
    title: "城市：",
    titleWidth: 100,
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuidList",
    value: "",
    multiple: true,
    filterable: true,
    titleWidth: 100,
  },
  {
    name: "drop-input",
    title: "考核指标：",
    titleWidth: 100,
    filterable: true,
    multiple: true,
    value: [],
    bind_key: "indexUuidList",
    dropList: []
  },
  {
    name: "month-input",
    bind_key: "assessTimeList",
    placeholder: "请选择月份",
    value: "",
    multiple: true,
    title: "考核月份：",
    titleWidth: 100,
    // options: {
    //   // 只能选择小于当前月
    //   disabledDate: date => {
    //     const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
    //     return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
    //   }
    // }
  },
  {
    name: "drop-input",
    title: "运营模式：",
    titleWidth: 100,
    filterable: true,
    multiple: true,
    value: "",
    bind_key: "operateTypeList",
    dropList: operateTypeEnum
  },
  {
    name: "drop-input",
    title: "产品线：",
    titleWidth: 100,
    multiple: true,
    filterable: true,
    value: "",
    bind_key: "businessTypeList",
    dropList: productLineEnum
  },
];

export const tableColumns = _this => {
  return [
    // {
    //   type: "selection",
    //   align: "center",
    //   width: 80
    // },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 200
    },
    {
      title: "考核指标",
      key: "indexName",
      minWidth: 140
    },
    {
      title: "考核月份",
      key: "assessTime",
      minWidth: 200
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 100,
      render: (h, { row }) => {
        let tList = row.operateType.split(",");
        return (<span>{tList.map(v => {
          let f = operateTypeEnum.find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "产品线",
      key: "businessType",
      minWidth: 160,
      render: (h, { row }) => {
        let tList = (`${row.businessType}`).split(",");
        return (<span>{tList.map(v => {
          let f = productLineEnum.find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "考核分",
      key: "assessScore",
      minWidth: 120
    },
    {
      title: "操作",
      key: "action",
      minWidth: 180,
      fixed: "right",
      render: (h, { row }) => {
        let types = row.taskStatus - 1 === 0 ? "error" : "success"
        let t = { props: { type: types }}
        return (
          <Row type="flex">
            <Col>
              <Button
                type="info"
                ghost
                size="small"
                onClick={() => _this.openView(row)}
              >
                查看
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="info"
                ghost
                size="small"
                {...getDirectives("custom-target-edit")}
                onClick={() => _this.openEdit(row)}
              >
                编辑
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="error"
                ghost
                size="small"
                {...getDirectives("custom-target-delete")}
                onClick={() => _this.deleteRow(row)}
              >
                删除
              </Button>
            </Col>
          </Row>
        );
      },
    }
  ];
};

// 指标搜索项
export const indicatorInputList = [
  {
    name: "text-input",
    bind_key: "name",
    placeholder: "请输入",
    value: "",
    title: "指标名称：",
    titleWidth: 60,
    inputWidth: 200
  }
];
// 指标列
export const indicatorColumn = [
  {
    type: "selection",
    width: 60,
    align: "center",
    minWidth: 100
  },
  {
    title: "所属分类",
    key: "classifyEx",
    width: 120,
    tooltip: true,
    align: "center"
  },
  {
    title: "名称",
    key: "name",
    minWidth: 180,
    tooltip: true,
    align: "center"
  },
  {
    title: "说明",
    key: "remark",
    minWidth: 180,
    tooltip: true,
    align: "center"
  },
  {
    title: "类型",
    key: "typeEx",
    width: 120,
    tooltip: true,
    align: "center"
  }
];

// 条例搜索项
export const regulationInputList = [
  {
    name: "text-input",
    bind_key: "title",
    placeholder: "请输入",
    value: "",
    title: "模板名称：",
    titleWidth: 60,
    inputWidth: 200
  }
];

export const regulationColumn = _this => {
  return [
    {
      title: "运营模式",
      key: "operationModeEx",
      minWidth: 60,
      tooltip: true,
      align: "center"
    },
    {
      title: "模板名称",
      key: "title",
      width: 120,
      tooltip: true,
      align: "center"
    },
    {
      title: "创建时间",
      key: "updateTime",
      width: 120,
      tooltip: true,
      align: "center"
    },
    {
      title: "操作",
      fixed: "right",
      width: 80,
      key: "operation",
      render(h, params) {
        let row = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              on: {
                click() {
                  _this.selectRow(row);
                }
              }
            },
            "选择"
          )
        ]);
      }
    }
  ];
};


export const addFormRule = {
  cityCodeList: [{ required: true, message: "请选择城市", type: "array" }],
  operateType: [{ required: true, message: "请选择运营模式" }],
  agentUuid: [{ required: true, message: "请选择运营商" }],
  businessType: [{ required: true, message: "请选择产品线" }],
  indexUuid: [{ required: true, message: "请选择指标名称" }],
  assessTime: [{ required: true, message: "请选择考核月份" }],
  assessScore: [{ required: true, message: "请输入考核得分" }],
}


export const importFormRule = {
  indexUuid: [{ required: true, message: "请选择指标名称" }],
  assessTime: [{ required: true, message: "请选择考核月份" }],
  operateType: [{ required: true, message: "请选择运营模式" }],
  businessType: [{ required: true, message: "请选择产品线" }],
}


export const importColumn = [
  {
    title: "序号",
    key: "rowNum",
    width: 80
  },
  {
    title: "运营商名称",
    key: "agentName",
    minWidth: 160
  },
  {
    title: "目标值",
    key: "assessScore",
    minWidth: 100
  }
]
