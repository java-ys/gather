// searchList bind_key
const inputListKey = [
  "",
  "driverNo",
  "driverName",
  "phone",
  "agentUuid",
  "completeStatus"
];
// table列key值
const tableKey = [
  "",
  "driverNo",
  "driverName",
  "phone",
  "cityName",
  "agentName",
  "completeStatus"
];

export const statusList = [
  { label: "全部", value: "-1" },
  { label: "待学习", value: "1" },
  { label: "已学习", value: "2" },
  { label: "学习中", value: "3" }
];
export const inputList = [
  {
    name: "text-input",
    bind_key: inputListKey[1],
    placeholder: "请输入司机code",
    value: "",
    title: "司机code",
    titleWidth: 80
  },
  {
    name: "text-input",
    bind_key: inputListKey[2],
    placeholder: "请输入司机姓名",
    value: "",
    title: "姓名",
    titleWidth: 80
  },
  {
    name: "text-input",
    bind_key: inputListKey[3],
    placeholder: "请输入司机手机号",
    value: "",
    title: "手机号",
    titleWidth: 80
  },
  {
    name: "drop-input",
    bind_key: inputListKey[4],
    value: "",
    titleWidth: 80,
    title: "所属运营商",
    placeholder: "请选择运营商",
    // inputWidth: 165,
    dropList: [],
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: inputListKey[5],
    value: "",
    titleWidth: 80,
    placeholder: "请选择状态",
    title: "状态",
    // inputWidth: 165,
    dropList: statusList
  }
];

export const tableTitle = that => {
  return [
    {
      title: "司机code",
      key: tableKey[1],
      tooltip: true,
      minWidth: 100
    },
    {
      title: "姓名",
      key: tableKey[2],
      tooltip: true,
      minWidth: 130
    },
    {
      title: "手机号",
      key: tableKey[3],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "所属城市",
      key: tableKey[4],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "所属运营商",
      key: tableKey[5],
      tooltip: true,
      minWidth: 140
    },
    {
      title: "状态",
      key: tableKey[6],
      tooltip: true,
      minWidth: 140,
      render: (h, params) => {
        let f = statusList.find(it => it.value - params.row[tableKey[6]] === 0);
        return h("span", f ? f.label : "");
      }
    }
  ];
};
