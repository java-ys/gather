import { mapToList } from "@/libs/util.js";
export const statusMap = {
  1: "生效中",
  2: "已失效",
  0: "未申请"
};
export const statusList = mapToList(statusMap);

export const inputList = [
  {
    name: "text-input",
    bind_key: "driverId",
    placeholder: "请输入",
    value: "",
    title: "司机ID："
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
    title: "手机号："
  },
  {
    name: "text-input",
    bind_key: "agentName",
    placeholder: "请输入",
    value: "",
    title: "所属运营商：",
    titleWidth: 90
  },
  {
    name: 'date-time-input',
    bind_key: ['startApplyTime' ,'endApplyTime'],
    placeholder: '请选择首次申请时间',
    value: '',
    title: '首次申请时间：',
    titleWidth: 90,
    inputWidth:300,
    format:'yyyy-MM-dd HH:mm:ss'
  },
];
export const parColumns = that => {
  return [
    {
      title: "司机ID",
      key: "driverId",
      tooltip: true,
      ellipsis: true,
      minWidth: 140,
    },
    {
      title: "姓名",
      key: "driverName",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
    },
    {
      title: "手机号",
      key: "driverPhone",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
    },
    {
      title: "服务卡名称",
      key: "scName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: "服务卡状态",
      key: "serviceCardStatus",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, { row }) => {
        return h("div", statusMap[row.serviceCardStatus]);
      }
    },
    {
      title: "首次申请时间",
      key: "firstApplyTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160,
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
