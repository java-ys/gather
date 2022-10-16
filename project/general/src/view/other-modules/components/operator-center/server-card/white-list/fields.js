
export const inputList = [
  {
    name: "text-input",
    bind_key: "driverId",
    placeholder: "请输入",
    value: "",
    title: "司机ID：",
    titleWidth: 50
  },
  {
    name: "text-input",
    bind_key: "driverName",
    placeholder: "请输入",
    value: "",
    title: "姓名：",
    titleWidth: 50
  },
  {
    name: "text-input",
    bind_key: "driverPhone",
    placeholder: "请输入",
    value: "",
    title: "手机号：",
    titleWidth: 50
  },
  {
    name: "text-input",
    bind_key: "agentName",
    placeholder: "请输入",
    value: "",
    title: "所属运营商：",
    titleWidth: 90
  }
];
export const parColumns = that => {
  return [
    {
      type: "selection",
      width: 70,
      align: "center"
    },
    {
      title: "司机ID",
      key: "driverId",
      minWidth: 180,
    },
    {
      title: "姓名",
      key: "driverName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "手机号",
      key: "driverPhone",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "所属城市",
      key: "cityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "所属运营商",
      key: "agentName",
      minWidth: 120,
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 120,
      slot: "action"
    }
  ];
};
