import { getBusinessLine } from  "_g/config/status-map";
export const businessLineList = getBusinessLine([4, 2, 5, 6, 11]).list

let typeList = [
  {
    value: "1",
    label: "折扣券"
  },
  {
    value: "2",
    label: "抵扣券"
  }
];
let inputList = [
  {
    name: "text-input",
    bind_key: "activityName",
    placeholder: "请输入名称",
    value: "",
    title: "活动名称：",
    titleWidth: 60,
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "activityCode",
    placeholder: "请输入名称",
    value: "",
    title: "活动编码：",
    titleWidth: 60,
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "templateName",
    placeholder: "请输入名称",
    value: "",
    title: "优惠券名称：",
    titleWidth: 80,
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "templateCode",
    placeholder: "请输入编码",
    value: "",
    title: "优惠券模板编码：",
    titleWidth: 120,
    inputWidth: 150
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "templateType", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "优惠券类型：", // 展示的字段名
    dropList: typeList,
    titleWidth: 80, // 展示的字段名的宽度
    inputWidth: 120
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "businessTypeList", // 返回数据的key名
    value: "", // 用于数据绑定
    title: "产品线：", // 展示的字段名
    dropList: businessLineList,
    clearable: true,
    inputWidth: 120
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "userLimitList", // 返回数据的key名
    value: "", // 用于数据绑定
    title: "订单类型：", // 展示的字段名
    dropList: [
      {
        value: "1",
        label: "实时"
      },
      {
        value: "2",
        label: "预约"
      }
    ],
    clearable: true,
    inputWidth: 120
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "useCityId", // 返回数据的key名
    value: "", // 用于数据绑定
    title: "城市：", // 展示的字段名
    dropList: [

    ],
    clearable: true,
    inputWidth: 120
  },
];

// tableb表头信息
let parColumns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "活动名称",
    key: "activityName",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "活动编码",
    key: "activityCode",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "优惠券名称",
    key: "couponName",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "优惠券模板编码",
    key: "templateCode",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "优惠券类型",
    key: "templateType",
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
    render: (h, params) => {
      return h("div", params.row.templateType === 1 ? "折扣券" : "抵扣券");
    }
  },
  {
    title: "优惠券面值",
    key: "highestMoney",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let text = params.row.templateType === 1 ? `最高抵扣${params.row.highestMoney}元` : params.row.couponMoney + "元"
      return h("div", text);
    }
  },
  {
    title: "用券规则",
    key: "conditionMoney",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let text = params.row.templateType === 1 ? params.row.discount + "折" : params.row.needCondition == 0 ? "不限门槛" : `满${params.row.conditionMoney}元使用`;
      return h("div", text);
    }
  },
  {
    title: "产品线",
    key: "businessTypeList",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let text = ""
      if (params.row.businessTypeList.length) {
        text = params.row.businessTypeList.join(",")
      }
      return h("div", text);
    }
  },
  {
    title: "订单类型",
    key: "userLimitList",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let text = ""
      if (params.row.userLimitList.length) {
        text = params.row.userLimitList.join(",")
      }
      return h("div", text);
    }
  },
  {
    title: "车型类型",
    key: "carTypeList",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let text = ""
      if (params.row.carTypeList.length) {
        text = params.row.carTypeList.join(",")
      }
      return h("div", text);
    }
  },
  {
    title: "用券城市",
    key: "useCityName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "券有效期",
    key: "validityBeginTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 180,
    render: (h, params) => {
      let text = "";
      if (params.row.validityType == "1") {
        text = params.row.validityBeginTime + "至" + params.row.validityEndTime
      } else {
        text = params.row.effectiveDays + "天"
      }
      return h("div", {
        domProps: { // 原生的属性
          title: text
        },
        style: {
          display: "inline-block",
          width: "140" + "px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: 30 + "px",
          height: 30 + "px",
        }
      }, text);
    }
  },
  {
    title: "用券时段",
    key: "templateCode",
    minWidth: 150,
    render: (h, params) => {
      let text = "";
      if (params.row.freeShardLimitTime == 1) {
        text = `${params.row.useLimitBeginTime} - ${params.row.useLimitEndTime}`
      } else {
        text = "不限时段"
      }
      return h("div", text);
    }
  }
];


export const cacheData = {
  inputList,
  pageObj: {
    total: 0,
    current: 1,
    pageSize: 10
  },
  searchData: {},
  parColumns,
  tableData: [],
  selectedList: []
};
