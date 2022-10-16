const auditStateList = [
  // 1-待审核; 2-审核通过; 3-审核驳回;
  { 1: "待审核" },
  { 2: "审核通过" },
  { 3: "审核驳回" },
]
export const inputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityCode", // 返回数据的key名
    placeholder: "请选择城市",
    value: "", // 绑定返回数据
    title: "城市：",
    titleWidth: 90,
    filterable: true,
    dropList: []
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "agentUuid", // 返回数据的key名
    placeholder: "请选择运营商",
    value: "", // 用于数据绑定
    title: "运营商名称：",
    titleWidth: 80,
    filterable: true,
    dropList: []
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "driverName", // 返回数据的key名
    placeholder: "请输入姓名",
    value: "", // 用于数据绑定
    title: "姓名："
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "driverPhone", // 返回数据的key名
    placeholder: "请输入手机号",
    value: "", // 用于数据绑定
    title: "手机号：",
    titleWidth: 80
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "originalVehiclePlateNum", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "车牌号："
  },
  {
    name: "date-input", // 文本输入框名
    bind_key: ["applyChangeCarQueryStartTime", "applyChangeCarQueryEndTime"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    titleWidth: 90,
    title: "申请换车时间："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "changeCarOrderStatus", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "审核状态：", // 展示的字段名
    titleWidth: 80,
    dropList: auditStateList.map(it => {
      let k = Object.keys(it)[0];
      return {
        label: it[k],
        value: k
      };
    })
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "reviewer", // 返回数据的key名
    placeholder: "请输入审核人",
    value: "", // 用于数据绑定
    title: "审核人：",
  },
];
export const tableTitle = that => {
  return [
    {
      title: "城市",
      key: "cityName",
      ellipsis: true,
      width: 120
    },
    {
      title: "运营商名称",
      key: "agentName",
      ellipsis: true,
      width: 140
    },
    {
      title: "姓名",
      key: "driverName",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "手机号",
      key: "driverPhone",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "车牌号",
      key: "originalVehiclePlateNum",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "申请换车时间",
      key: "applyTime",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "审核状态",
      key: "changeCarOrderStatus",
      tooltip: true,
      minWidth: 140,
      render: (h, params) => {
        let k = {};
        auditStateList.forEach(it => {
          k = { ...k, ...it };
        });
        return h("span", k[Number(params.row.changeCarOrderStatus)]);
      }
    },
    {
      title: "审核人",
      key: "reviewer",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "审核时间",
      key: "reviewTime",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "操作",
      key: "version",
      tooltip: true,
      width: 150,
      render: (h, params) => {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              style: {
                marginRight: "10px",
                display: params.row.changeCarOrderStatus === 1 ? "" : "none"
              },
              on: {
                click: () => {
                  that.gotoAdut(params.row)
                }
              }
            },
            "去审核"
          ),
          h(
            "Button",
            {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              on: {
                click: () => {
                  that.gotoDetails(params.row)
                }
              }
            },
            "详情"
          )
        ]);
      }
    }
  ];
};

export const pageData = {
  queryAjaxPramas: {}, // 查询条件obj
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  // tableColumnsChecked: Object.keys(tableTitle)
};
