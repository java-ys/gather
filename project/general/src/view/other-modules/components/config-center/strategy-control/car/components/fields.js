import { freeze } from "@/mixins/base";

export const addRules = freeze({
  ruleName: [{ required: true, message: "请输入策略名称" }],
  cityCode: [{ required: true, message: "请选择城市" }],
  expandBizLine: [{ required: true, message: "请选择业务线" }],
  timeRange: [
    {
      required: true,
      // message: "请选择有效时间",
      type: "array",
      validator: function (rule, value, callback) {
        if (value.filter(Boolean).length < 2) {
          callback(new Error("请选择有效时间"));
        } else if (value[0]) {
          let start = +new Date(value[0]);
          if (start - +new Date() < 5 * 60 * 1000) {
            callback(new Error("开始时间不得早于当前时间+5min"));
          }
          callback()
        } else callback();
      },
    },
  ],
});

export const itemRules = freeze({
  showTime: [
    {
      required: true,
      type: "number",
      message: "请填写露出时间",
      trigger: "change",
    },
  ],
  remainTime: [
    {
      required: true,
      type: "number",
      message: "请填写剩余接驾时间",
      trigger: "change",
    },
  ],
  remainDistance: [
    {
      required: true,
      type: "number",
      message: "请填写剩余接驾里程",
      trigger: "change",
    },
  ],
  matchTime: [
    {
      required: true,
      message: "请填写二次派单时间",
      type: "number",
    }
  ],
  saveTime: [
    {
      required: true,
      type: "number",
      message: "请填写节省时间",
      trigger: "change",
    },
  ],
  waitMoney: [
    {
      required: true,
      type: "number",
      message: "请填写等待补偿金",
      trigger: "change",
    },
  ],
  carLevel: [
    {
      required: true,
      message: "请选择派单车型",
    },
  ],
});

export const default_item = {
  period: [],
  startTime: "", //时间段开始时间，必填
  endTime: "", //时间段结束时间，必填
  showTime: null, //露出时间，必填，接起后X秒内
  remainTime: null, //剩余接驾时长，和剩余接驾里程 二选一
  remainDistance: null, //剩余接驾里程，剩余接驾时长 二选一
  matchTime: undefined, //二次派单时间，必填，调度派单时限，页面倒计时
  saveTime: null, //节省时间，必填，当前订单剩余接驾时长-更近车预计接驾时长
  waitMoney: null, //等待补偿金，必填，二次派单时间内未找到更近车，给乘客的补偿
  carLevel: "", //派单车型，必填，1.接起车型,2.呼叫车型
};

export const add_params = {
  ruleName: '',
  cityCode: '',
  areaCodeList: [],
  expandBizLine: '',
  typeTime: 1,
  effectiveTime: '',
  failureTime: '',
  timeRange: [],
  freeCancelMinute: '',
  rules: []
}
export const numList = freeze([
  {label: '10', value: 10},
  {label: '30', value: 30},
  {label: '60', value: 60},
  {label: '90', value: 90},
  {label: '120', value: 120},
])
