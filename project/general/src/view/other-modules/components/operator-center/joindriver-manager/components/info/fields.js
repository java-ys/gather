export const tableTitle = that => {
  return [
    {
      title: "提交报名时间",
      key: "applyTime",
      ellipsis: true,
      width: 200
    },
    {
      title: "操作",
      key: "handle",
      ellipsis: true,
      width: 140
    },
    {
      title: "车牌号",
      key: "newVehiclePlateNum",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "操作时间",
      key: "handleTime",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "操作人",
      key: "handler",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "备注",
      key: "remark",
      tooltip: true,
      minWidth: 120
    },
  ];
};
