export const statusMap = {
  1: "生效中",
  2: "已失效",
  0: "未申请"
};
export const parColumns = that => {
  return [
    {
      title: "序号",
      type: "index",
      width: 70,
    },
    {
      title: "司机",
      key: "driverName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: "时间",
      key: "applyTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: "服务卡",
      key: "scName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    },
    {
      title: "行为",
      key: "scStatus",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
      render: (h, { row }) => {
        return h("div", statusMap[row.scStatus]);
      }
    },
    {
      title: "原因",
      key: "applyResult",
      tooltip: true,
      ellipsis: true,
      minWidth: 120,
    }
  ];
};
