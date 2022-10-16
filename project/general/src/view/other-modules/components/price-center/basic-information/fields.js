import { mapToList } from "@/libs/util.js";
import { getBusinessLine, orderTypeMap } from "_g/config/status-map";

// 涉及产品线枚举值-快享/专
export const BusinessArr = [4, 2];
export const businessInfo = getBusinessLine(BusinessArr);
businessInfo.list.forEach(item => {
  item.value = Number(item.value)
})
export const operateMode = {
  2: "UP模式",
}
export const statusMap = {
  1: "待生效",
  2: "生效中",
  3: "已停用"
};
export const configTypeMap = {
  1: "固定金额",
  2: "流水比例"
}

export const statusList = mapToList(statusMap);
export const operateModeList = mapToList(operateMode);
export const orderTypeList = mapToList(orderTypeMap);

export const inputList = [
  {
    name: "drop-input",
    bind_key: "city",
    value: "",
    dropList: [],
    title: "城市",
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "operateMode",
    value: "",
    dropList: operateModeList,
    title: "运营模式"
  },
  {
    name: "drop-input",
    bind_key: "driverSalaryCategory",
    value: "",
    dropList: [],
    title: "司机工资类别",
    titleWidth: 90,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "productLine",
    value: "",
    dropList: [],
    title: "产品线"
  },
  // {
  //     name: "drop-input",
  //     bind_key: "carLevel",
  //     value: "",
  //     dropList: carTypeList,
  //     title: "车型等级"
  // },
  // {
  //     name: "drop-input",
  //     bind_key: "typeTime",
  //     value: "",
  //     dropList: orderTypeList,
  //     title: "订单类型"
  // },
  {
    name: "text-input",
    bind_key: "configName",
    value: "",
    title: "策略名称"
  },
  {
    name: "drop-input",
    bind_key: "configStatus",
    value: "",
    dropList: statusList,
    title: "状态"
  },
  {
    name: "text-input",
    bind_key: "updater",
    value: "",
    title: "更新人"
  }
];

export const parColumns = that => {
  return [
    {
      title: "策略id",
      key: "configId",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "策略名称",
      key: "configName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "城市",
      key: "city",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "运营模式",
      key: "operateMode",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "司机工资类别",
      key: "driverSalaryCategory",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "产品线",
      key: "productLine",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    // {
    //     title: "车型等级",
    //     key: "carLevel",
    //     tooltip: true,
    //     ellipsis: true,
    //     minWidth: 150
    // },
    // {
    //     title: "订单类型",
    //     key: "typeTime",
    //     tooltip: true,
    //     ellipsis: true,
    //     minWidth: 90
    // },
    {
      title: "生效时间",
      key: "startTime",
      width: 300,
      render: (h, { row }) => {
        let start = row.startTime ? row.startTime : ""; let end = row.endTime ? row.endTime : ""; let
          time = "";
        time = start && end ? start + "—" + end : "";
        return h("div", `${time}`);
      }
    },
    {
      title: "状态",
      key: "configStatus",
      tooltip: true,
      ellipsis: true,
      minWidth: 90,
      render: (h, params) => {
        return h("div", statusMap[params.row.configStatus]);
      }
    },
    {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "更新人",
      key: "updater",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 200,
      slot: "action"
    }
  ];
};

// 校验生效时间大于当前时间
const validNowTime = (rule, value, callback) => {
  let date = value || null;
  if (date === null) { callback(new Error("请选择生效时间")); }
  else {
    let timestamp = new Date(date).getTime();
    if (timestamp < Date.now()) {
      callback(new Error("生效时间不得小于当前时间"));
    } else { callback(); }
  }
};

const validNumber = (rule, val, callback) => {
  let reg = /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;
  if (!reg.test(val)) {
    callback(new Error("请输入正确得数字,并最多保留两位小数"));
  } else if (!val || val >= 1000000) {
    callback(new Error("只能输入100万以内的金额数"));
  } else {
    callback();
  }
}

export const rules = {
  configName: [{ required: true, type: "string", message: "请输入策略名称", trigger: "blur" }],
  cityList: [{ required: true, type: "array", message: "请选择城市", trigger: "change" }],
  operateMode: [{ required: true, type: "number", message: "请选择运营模式", trigger: "change" }],
  driverSalaryCategoryList: [{ required: true, type: "array", message: "请选择司机工资类别", trigger: "change" }],
  productLineList: [{ required: true, type: "array", message: "请选择产品线", trigger: "change" }],
  // carLevel: [{ required: true, message: "请选择车型等级", trigger: "change" }],
  // typeTime: [{ required: true, message: "请选择订单类型", trigger: "change" }],
  startTime: [{ required: true, trigger: "change", validator: validNowTime }],
  configType: [{ required: true, type: "number", message: "请选择计费方式", trigger: "change" }],
  baseFare: [{ required: true, type: "string", message: "请输入基础信息费", trigger: "blur" }, { trigger: "change", validator: validNumber }],
}

// 日志数据
// export const logColumns = {
//     columns(_this) {
//       return [{
//           title: '序号',
//           width: 80,
//           render(h, params) {
//             return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
//           }
//         },
//         {
//           title: '操作',
//           minWidth: 100,
//           key: 'operationContent'
//         },
//         {
//           title: '操作时间',
//           minWidth: 150,
//           key: 'operateTime'
//         }, {
//           title: '操作人',
//           minWidth: 100,
//           key: 'operatorName'
//         },
//       ];
//     }
//   }

const PAGE_SIZE = 10;
export const PAGE_PARAMS = {
  current: 1,
  pageSize: PAGE_SIZE,
  total: 0
}