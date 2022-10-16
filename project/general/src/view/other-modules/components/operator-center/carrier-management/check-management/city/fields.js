import { tacticsEnum, productLineEnum, operateTypeEnum } from "@/config";
import { freeze } from "@/mixins/base";

export const inputList = [
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityUuidList"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "城市：",
    filterable: true,
    changeOnSelect: false,
    titleWidth: 80,
  },
  {
    name: "drop-input",
    title: "运营模式",
    titleWidth: 80,
    value: "",
    bind_key: "operateType",
    dropList: operateTypeEnum,
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "title", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "模板名称：",
    titleWidth: 80,
  },
  {
    name: "drop-input",
    title: "策略类型",
    titleWidth: 80,
    value: "",
    bind_key: "strategyType",
    dropList: tacticsEnum,
  },
  {
    name: "drop-input",
    title: "产品线",
    titleWidth: 80,
    value: "",
    bind_key: "businessType",
    dropList: productLineEnum,
  },
];

export const tableColumns = (_this) => {
  return [
    {
      title: "策略类型",
      key: "strategyType",
      tooltip: true,
      minWidth: 100,
      render: (h, { row }) => {
        let f = tacticsEnum.find(
          (it) => `${it.value}` === `${row.strategyType}`
        );
        return <span>{f ? f.label : ""}</span>;
      },
    },
    {
      title: "产品线",
      key: "businessType",
      tooltip: true,
      minWidth: 100,
      render: (h, { row }) => {
        let tList = `${row.businessType}`.split(",");
        return (
          <span>
            {tList
              .map((v) => {
                let f = [...productLineEnum, { label: "不限", value: -1 }].find(
                  (t) => `${t.value}` === `${v}`
                );
                return f ? f.label : "";
              })
              .filter(Boolean)
              .join(", ")}
          </span>
        );
      },
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 100,
    },
    {
      title: "运营模式",
      key: "operateTypeDesc",
      minWidth: 100,
    },
    {
      title: "模板标题",
      key: "title",
      minWidth: 160,
    },
    {
      title: "操作时间",
      key: "updateTime",
      minWidth: 140,
    },
    {
      title: "操作人",
      key: "updaterName",
      minWidth: 80,
    },
    {
      title: "操作",
      fixed: "right",
      width: 400,
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
                size: "small",
              },
              class: {
                tableBtn: true,
              },
              // directives: [{
              //   name: 'hasAuth',
              //   value: 'agent-recruit-detail'
              // }],
              // check-management-city-open
              on: {
                click() {
                  _this.detail(row);
                },
              },
            },
            "查看"
          ),
          h(
            "Button",
            {
              props: {
                type: "success",
                ghost: true,
                size: "small",
              },

              class: {
                tableBtn: true,
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "check-management-city-edit",
                },
              ],
              on: {
                click() {
                  _this.edit(row);
                },
              },
            },
            "编辑"
          ),
          h(
            "Button",
            {
              props: {
                type: "success",
                ghost: true,
                size: "small",
              },

              class: {
                tableBtn: true,
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "check-management-city-delete",
                },
              ],
              on: {
                click() {
                  _this.delete(row);
                },
              },
            },
            "删除"
          ),

          h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small",
              },
              class: {
                tableBtn: true,
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "check-management-city-copy",
                },
              ],
              on: {
                click() {
                  _this.copy(row);
                },
              },
            },
            "复制"
          ),
          h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small",
              },
              class: {
                tableBtn: true,
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "check-management-city-create",
                },
              ],
              on: {
                click() {
                  _this.$Modal.confirm({
                    title: "提示",
                    content: "是否确认生成运营商考核模板？",
                    onOk: () => {
                      _this.create(row);
                    },
                  });
                },
              },
            },
            "生成运营商考核模板"
          ),
        ]);
      },
      minWidth: 150,
    },
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
    inputWidth: 200,
  },
];
// 指标列
export const indicatorColumn = [
  {
    type: "selection",
    width: 60,
    align: "center",
    minWidth: 100,
  },
  // {
  //   type: "index",
  //   title: "序号",
  //   align: "center",
  //   width: 80
  // },
  {
    title: "所属分类",
    key: "classifyEx",
    width: 100,
    tooltip: true,
    align: "center",
  },
  {
    title: "名称",
    key: "name",
    minWidth: 160,
    tooltip: true,
    align: "center",
  },
  {
    title: "说明",
    key: "remark",
    minWidth: 160,
    tooltip: true,
    align: "center",
  },
  {
    title: "类型",
    key: "typeEx",
    width: 100,
    tooltip: true,
    align: "center",
  },
];

// 指标列
export const indicatorColumnSingle = (that) => {
  return [
    {
      title: " ",
      align: "center",
      width: 80,
      render: (h, { row }) => {
        let t = {
          props: {
            value: that.currentId === row.uuid,
          },
          on: {
            "on-change": () => {
              that.selectRow(row);
            },
          },
        };
        return <Radio {...t} />;
      },
    },
    // {
    //   type: "index",
    //   title: "序号",
    //   align: "center",
    //   width: 80
    // },
    {
      title: "所属分类",
      key: "classifyEx",
      minWidth: 100,
      tooltip: true,
      align: "center",
    },
    {
      title: "名称",
      key: "name",
      minWidth: 160,
      tooltip: true,
      align: "center",
    },
    {
      title: "说明",
      key: "remark",
      minWidth: 160,
      tooltip: true,
      align: "center",
    },
    {
      title: "类型",
      key: "typeEx",
      tooltip: true,
      width: 100,
      align: "center",
    },
    {
      title: "是否父指标",
      key: "parentFlagEx",
      align: "center",
      width: 100
    },
  ];
};

// 条例搜索项
export const regulationInputList = [
  {
    name: "text-input",
    bind_key: "title",
    placeholder: "请输入",
    value: "",
    title: "模板名称：",
    titleWidth: 60,
    inputWidth: 200,
  },
];

export const regulationColumn = (_this) => {
  return [
    {
      title: "运营模式",
      key: "operationModeEx",
      minWidth: 60,
      tooltip: true,
      align: "center",
    },
    {
      title: "模板名称",
      key: "title",
      minWidth: 160,
      tooltip: true,
      align: "center",
    },
    {
      title: "创建时间",
      key: "updateTime",
      minWidth: 180,
      tooltip: true,
      align: "center",
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
                size: "small",
              },
              class: {
                tableBtn: true,
              },
              on: {
                click() {
                  _this.selectRow(row);
                },
              },
            },
            "选择"
          ),
        ]);
      },
    },
  ];
};

export const formAddRule = freeze({
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "change",
    },
  ],
  assessTime: [
    {
      required: true,
      message: "请选择日期",
      trigger: "change",
      type: "array",
    },
  ],
  cityUuidList: [
    {
      required: true,
      message: "请选择城市",
      trigger: "change",
      type: "array",
    },
  ],
  agentUuidList: [
    {
      required: true,
      message: "请选择运营商",
      trigger: "change",
      type: "array",
    },
  ],
  operateType: [
    {
      required: true,
      message: "请选择运营模式",
      trigger: "change",
      type: "array",
    },
  ],
  businessType: [
    {
      required: true,
      message: "请选择产品线",
      trigger: "change",
      type: "array",
    },
  ],
  pushDimension: [
    {
      required: true,
      message: "请选择审批流程",
    },
  ],
  strategyType: [
    {
      required: true,
      message: "请选择薪酬策略",
    },
  ],
});

const standard = {
  coefficient: "", // 系数
  max: "", // 范围大值
  maxSign: "", // 范围结束条件符号
  min: "", // 范围小值
  minSign: "", // 范围开始条件符号
};

export const default_standard = {
  definition: [{...standard}],
  way: 0,
}
