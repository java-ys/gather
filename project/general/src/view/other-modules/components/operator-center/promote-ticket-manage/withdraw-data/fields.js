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
  { name: "extendInput", title: "" }
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
      title: "司机ID",
      key: "driverId",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "提现时间",
      key: "withdrawTime",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "提现金额",
      key: "withdrawCash",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "冻结金额",
      key: "freezeCash",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "剩余可提现金额",
      key: "remainderWithdrawCash",
      tooltip: true,
      minWidth: 130
    }
  ];
};
