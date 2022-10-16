// 月考勤规则
export const returnMonthFields = that => {
  return [
    {
      title: "运营区域",
      key: "cityName",
      tooltip: true,
      width: 200
    },
    {
      title: "适用年",
      key: "examineYear",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "适用月",
      key: "month",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const str = params.row.month ? `${params.row.month} 月` : "-"
        return h("span", str);
      }
    },
    {
      title: "休息天数",
      key: "day",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return h("span", `${params.row.day} 天`);
      }
    },
    {
      title: "有效出勤天数",
      key: "attendanceDays",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        const str = params.row.attendanceDays
          ? `${params.row.attendanceDays} 天`
          : "-";
        return h("span", str);
      }
    },
    {
      title: "日均在线时长",
      key: "onlineDuration",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return h("span", `${params.row.onlineDuration} 分钟`);
      }
    },
    {
      title: "日均高峰在线时长",
      key: "heightDuration",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h("span", `${params.row.heightDuration} 分钟`);
      }
    },
    {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "版本号",
      key: "version",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "操作",
      key: "action",
      slot: "action",
      fixed: "right",
      minWidth: 200
    }
  ];
};

export const allMonths = [
  {
    title: "全部",
    value: "0",
    parentId: "000",
    expand: true
  },
  {
    title: "1月",
    value: 1,
    parentId: "0"
  },
  {
    title: "2月",
    value: 2,
    parentId: "0"
  },
  {
    title: "3月",
    value: 3,
    parentId: "0"
  },
  {
    title: "4月",
    value: 4,
    parentId: "0"
  },
  {
    title: "5月",
    value: 5,
    parentId: "0"
  },
  {
    title: "6月",
    value: 6,
    parentId: "0"
  },
  {
    title: "7月",
    value: 7,
    parentId: "0"
  },
  {
    title: "8月",
    value: 8,
    parentId: "0"
  },
  {
    title: "9月",
    value: 9,
    parentId: "0"
  },
  {
    title: "10月",
    value: 10,
    parentId: "0"
  },
  {
    title: "11月",
    value: 11,
    parentId: "0"
  },
  {
    title: "12月",
    value: 12,
    parentId: "0"
  }
];

// 月考勤历史版本
export const mRevisionColumns = that => {
  return [
    {
      title: "休息天数",
      key: "day",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "有效出勤天数",
      key: "attendanceDays",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "日均在线时长",
      key: "onlineDuration",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "日均高峰在线时长",
      key: "heightDuration",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "创建时间",
      key: "createTime",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "版本号",
      key: "version",
      tooltip: true,
      minWidth: 120,
      fixed: "right"
    }
  ];
};

export const mInputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceId", "cityUuid"], // 返回数据的key名
    placeholder: "请选择省/市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "省 / 市：", // 展示的字段名
    changeOnSelect: true
  },
  {
    name: "year-input", // 年份选择
    bind_key: "examineYear",
    placeholder: "请选择年份",
    value: "",
    title: "适用年："
  }
];

let dList = Array.from({ length: 31 }, (_, k) => {
  let it = k + 1;
  return { value: it, label: it };
});

export const restDayList = dList;
