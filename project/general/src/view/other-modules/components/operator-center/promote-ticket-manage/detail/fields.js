export const statusList = [
  { label: "全部", value: "-1" },
  // { label: "初始", value: "0" },
  { label: "生效", value: "1" },
  { label: "停用", value: "2" }
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
    name: "text-input", // 文本输入框名
    bind_key: "driverNo", // 返回数据的key名
    placeholder: "请输入司机ID",
    value: "", // 用于数据绑定
    title: "司机ID：",
    titleWidth: 100
  },
  {
    name: "drop-input",
    bind_key: "status",
    value: "",
    titleWidth: 60,
    title: "状态",
    inputWidth: 165,
    dropList: statusList
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
      // type: "index",
      width: 80,
      align: "center",
      render: (h, params) => {
        return h("div", that.pageSize * (that.current - 1) + params.index + 1);
      }
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "司机ID",
      key: "driverNo",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "申请时间",
      key: "applicationTime",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "优惠码",
      key: "discountCode",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "券码状态",
      key: "status",
      tooltip: true,
      minWidth: 60,
      render: (h, params) => {
        let f = statusList.find(it => it.value - params.row.status === 0);
        return h("span", f ? f.label : "");
      }
    }
  ];
};
