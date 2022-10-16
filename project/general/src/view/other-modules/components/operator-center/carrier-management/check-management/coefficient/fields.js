import { timeFormat } from "@/libs/util";

export const statusList = [
  { label: "启用", value: 1 },
  { label: "停用", value: 2 },
  { label: "待生效", value: 0 }
];
export const cityLevelList = [
  { label: "一线", value: 1 },
  { label: "二线", value: 2 },
  { label: "三线", value: 3 },
  { label: "卫星线V1", value: 4 },
  { label: "卫星线V2", value: 5 },
  { label: "卫星线V3", value: 6 }
]
export const inputList = [
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "城市：",
    filterable: true,
    changeOnSelect: false,
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityLevel", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "城市级别：",
    dropList: cityLevelList
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "coefficient", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "城市系数："
  },
  {
    name: "drop-input",
    title: "状态",
    titleWidth: 50,
    value: "",
    bind_key: "configStatus",
    dropList: statusList
  }
];

export const tableColumns = _this => {
  return [
    {
      title: "序号",
      key: "num",
      tooltip: true,
      width: 70,
      render: (h, params) => {
        return h(
          "div",
          _this.pageSize * (_this.current - 1) + params.index + 1
        );
      }
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "城市级别",
      key: "cityLevel",
      minWidth: 120,
      render: (h, {row}) => {
        let f = cityLevelList.find(it => it.value - row.cityLevel === 0)
        return (
          <span>
            {f ? f.label: ""}
          </span>
        );
      }
      },
    {
      title: "城市订单规模",
      key: "orderScale",
      minWidth: 120
    },
    {
      title: "城市系数",
      key: "coefficient",
      minWidth: 120
    },
    {
      title: "生效时间",
      key: "coefficient",
      minWidth: 280,
      render: (h, {row}) => {
        const { startDate, endDate} = row
        if(startDate && endDate) {
          return (
            <span>
            {startDate} - {endDate}
          </span>
          );
        } else {
          return ""
        }
      }
    },
    {
      title: "状态",
      key: "configStatus",
      minWidth: 90,
      render: (h, {row}) => {
        let f = statusList.find(k => k.value - row.configStatus === 0)
        return (
          <span>
            {f ? f.label : ""}
          </span>
        );
      }
    },
    {
      title: "操作时间",
      key: "updateTime",
      minWidth: 180
    },
    {
      title: "操作人",
      key: "creator",
      minWidth: 120
    },
    {
      title: "操作",
      fixed: "right",
      width: 260,
      key: "operation",
      render(h, { row }) {
        let { endDate, configStatus } = row
        // 查看：不限
        // 编辑：仅初始状态
        // 启用：仅初始状态(停用后不可再次启用) & 生效时间 >=当前时间
        // 停用：仅启用状态 & (若生效时间>=当前时间，则设置状态为停用，否则设置生效截至时间为当月 )
        // 删除：仅初始状态(启用后不支持删除)

        let isStart = configStatus - 1 === 0;
        let isInit = `${configStatus}` === '0';
        const [year, month] = timeFormat(Date.now(), "yyyy-mm-dd").split("-")
        const [endYear, endMonth] = endDate?.split("-") || [];
        const beyondDate = endYear > year || (endYear - year === 0 && endMonth >= month)
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
              directives: [{
                name: 'hasAuth',
                value: 'coefficient-open'
              }],
              on: {
                click() {
                  _this.open(row)
                }
              }
            },
            "查看"
          ),
          isInit ? h(
            "Button",
            {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: 'hasAuth',
                value: 'coefficient-edit'
              }],
              on: {
                click() {
                  _this.editRow(row);
                }
              }
            },
            "编辑"
          ) : null,
          // 启用: 初始状态 且 生效日期 大于 当前日期的 年月
          isInit && beyondDate ? h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [
                {
                  name: 'hasAuth',
                  value: 'coefficient-active'
                }
              ],
              on: {
                click() {
                  _this.block(row);
                }
              }
            },
            "启用"
          ): null,
          // 停用: 启用状态 且 生效日期 大于 当前日期的 年月
          isStart && beyondDate ? h(
            "Button",
            {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              class: {
                // tableBtn: true
              },
              directives: [
                {
                  name: 'hasAuth',
                  value: 'coefficient-active'
                }
              ],
              on: {
                click() {
                  _this.block(row);
                }
              }
            },
            "停用"
          ): null,
          isInit ? h(
            "Button",
            {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'coefficient-delete'
              }],
              on: {
                click() {
                  _this.delete(row);
                }
              }
            },
            "删除"
          ) : null
        ]);
      },
      minWidth: 150
    }
  ];
};
