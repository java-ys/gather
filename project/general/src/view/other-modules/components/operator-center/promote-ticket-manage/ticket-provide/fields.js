import { timeFormat } from "@/libs/util";

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "driverName", // 返回数据的key名
    placeholder: "请输入司机姓名",
    value: "", // 用于数据绑定
    title: "司机姓名", // 展示的字段名
    titleWidth: 75
  },
  {
    name: "text-input",
    bind_key: "driverId",
    placeholder: "请输入司机ID",
    value: "",
    title: "司机ID"
  },
  {
    name: "month-input",
    bind_key: "grantEndMonth",
    placeholder: "请选择月份",
    clearable: false,
    value: "",
    title: "发放月份",
    options: {
      // 只能选择小于当前月
      disabledDate: date => {
        const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
        return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
      }
    }
  },
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "省/市",
    changeOnSelect: false,
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    title: "运营商",
    dropList: [],
    bind_key: "agentUuid",
    value: "",
    titleWidth: 60,
    inputWidth: 165
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
      title: "发放金额",
      key: "grantCash",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "发放月份",
      key: "grantMonth",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "省/市",
      key: "provinceName",
      tooltip: true,
      minWidth: 180,
      render: (h, params) => {
        const { provinceName, cityName } = params.row;
        const sym = provinceName && cityName ? "/" : "";
        return h("span", `${provinceName}${sym}${cityName}`);
      }
    },
    {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      minWidth: 130
    }
  ];
};
