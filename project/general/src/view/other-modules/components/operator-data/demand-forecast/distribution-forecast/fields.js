import moment from "moment";

export const inputList = [
  {
    name: "drop-input",
    bind_key: "modelType",
    dropList: [],
    title: "模型",
    placeholder: "请选择模型",
    hiddenLabel: true,
  },
  {
    name: "drop-input",
    bind_key: "cityCode",
    dropList: [],
    title: "城市",
    placeholder: "请选择城市",
    hiddenLabel: true,
  },
  {
    name: "drop-input",
    bind_key: "businessType",
    dropList: [],
    title: "业务线",
    placeholder: "请选择业务线",
    hiddenLabel: true,
  },
  {
    name: "drop-input",
    bind_key: "dataOrigin",
    dropList: [],
    title: "来源",
    placeholder: "请选择来源",
    hiddenLabel: true,
  },
  {
    name: "drop-input",
    bind_key: "car-group",
    // value: 0,
    dropList: [],
    title: "车型组",
    placeholder: "请选择车型组",
    hiddenLabel: true,
  },
  {
    name: "drop-input",
    bind_key: "carType",
    // value: 0,
    dropList: [],
    title: "产品线/车型",
    placeholder: "请选择产品线/车型",
    hiddenLabel: true,
  },
  // {
  //   name: "drop-input",
  //   bind_key: "carType",
  //   // value: 0,
  //   dropList: [
  //     { label: "未来0-15分钟", value: 0 },
  //     { label: "15-30分钟", value: 1 },
  //   ],
  //   title: "时间",
  //   placeholder: "请选择时间",
  //   hiddenLabel: true,
  // },
  // {
  //   name: "extendInput", // 文本输入框名
  //   bind_key: ['startTime','endTime'], // 返回数据的key名
  //   placeholder: "请选择时间范围",
  //   value: "", // 用于数据绑定
  //   title: "时间段：", // 展示的字段名
  //   inputWidth: 300, // input框的宽度
  // }
];
export const dataOptions = {
  placeholder: "请选择时间范围",
  value: "", // 用于数据绑定
  title: "时间段：", // 展示的字段名
  inputWidth: 300, // input框的宽度
  options: {
    disabledDate:(d)=>{
      if(moment(d).isAfter(moment().subtract(15,"day"),'minute') && moment(d).isBefore(moment(),'minute')){
        return false
      }
      return true
    },
  },
  format:'yyyy-MM-dd HH:mm',
}