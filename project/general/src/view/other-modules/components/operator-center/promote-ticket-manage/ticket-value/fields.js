const profitStatusList = [
  { label: "全部", value: "-1" },
  { label: "冻结中", value: "1" },
  { label: "已发放", value: "2" },
  { label: "已退款", value: "3" }
];

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "driverName", // 返回数据的key名
    placeholder: "请输入司机姓名",
    value: "", // 用于数据绑定
    title: "司机姓名：", // 展示的字段名
    titleWidth: 75
  },
  {
    name: "text-input",
    bind_key: "driverId",
    placeholder: "请输入司机ID",
    value: "",
    title: "司机ID："
  },
  {
    name: "text-input",
    bind_key: "orderCode",
    placeholder: "请输入订单编号",
    value: "",
    title: "订单编号："
  },
  { name: "extendInput", title: "" },
  {
    name: "drop-input",
    bind_key: "shareStatus",
    value: "",
    title: "分润状态",
    inputWidth: 200,
    dropList: profitStatusList
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
      title: "序号",
      width: 80,
      align: "center",
      render: (h, params) => {
        return h("div", that.pageSize * (that.current - 1) + params.index + 1);
      }
    },
    {
      title: "订单编号",
      key: "orderCode",
      tooltip: true,
      minWidth: 160,
      render: (h, params) => {
        let { orderCode } = params.row;
        return h(
          "span",
          {
            style: {
              color: "#2d8cf0",
              cursor: "pointer"
            },
            attrs: {
              ghost: "ghost"
            },
            on: {
              click: () => {
                that.orderDetail(params.row);
              }
            }
          },
          `${orderCode}`
        );
      }
    },
    {
      title: "商品ID",
      key: "productId",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "购买时间",
      key: "payTime",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "退款时间",
      key: "refundTime",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "分润金额",
      key: "shareCash",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "分润状态",
      key: "shareStatus",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let l = profitStatusList.find(
          it => it.value - params.row.shareStatus === 0
        );
        return h("div", l ? l.label : "");
      }
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "司机手机号",
      key: "driverMobile",
      tooltip: true,
      minWidth: 140
    }
  ];
};
