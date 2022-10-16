import { validHour, validTime } from "_o/components/config-center/strategy-control/components/fields";

/**
 * @Desc: restMap
 * @Author: zhangke
 * @CreateTime: 2020/5/24 10:09
 */
export const REST_STATUS_MAP = {
  0: "未生效",
  1: "生效中",
  "-2": "已失效",
};
// cityUuid   是   String   城市uuid
// effectiveTime   是   Date   生效时间
// reserveThreVal   是   Integer   预约单阈值（分钟）
// ruleName   是   String   规则名称
// servOfflineQuota   是   Double   累计服务时长累计满下线
// servOfflineDura   是   Integer   累计服务时长强制下线分钟
// servAlarmQuota   是   Double   累计服务时长提醒累计满下线
// servAlarmInterval   是   Integer   累计服务时长提醒 每隔分钟
// servAlarmTimes   是   Integer   累计服务时长提醒 推送次数
// servResetQuota   是   Integer   累计服务时长 重新计算
// chargeOfflineQuota   是   Double   累计计费时长 满
// chargeOfflineDura   是   Double   累计计费时长 下线小时
// chargeResetQuota   是   Double   累计计费时长 重新计算
// weekOfflineQuota   是   Double   周 满小时
// weekOfflineDura   是   Integer   周 下线分钟

export const REST_DETAIL_DEFAULT = {
  cityUuid: [],
  effectiveTime: "",
  reserveThreVal: "",
  ruleName: "",
  servOfflineQuota: "",
  servOfflineDura: "",
  servAlarmQuota: "",
  servAlarmInterval: "",
  servAlarmTimes: "",
  servResetQuota: "",
  chargeOfflineQuota: "",
  chargeOfflineDura: "",
  chargeResetQuota: "",
  weekOfflineQuota: "",
  weekOfflineDura: ""
};
// 搜索框配置
export const inputDataList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "ruleName", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "策略名称"
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择省/市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "城市", // 展示的字段名
    changeOnSelect: true,
    filterable: true
  },
  {
    name: "drop-input", // 下拉选择
    bind_key: "status", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "状态", // 展示的字段名
    dropList: [
      {
        label: "未生效",
        value: "0"
      },
      {
        label: "生效中",
        value: "1"
      },
      {
        label: "已失效",
        value: "-2"
      }
    ]
  },
  {
    name: "date-input", // 日期选择
    bind_key: ["beginTime", "endTime"], // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "生效时间", // 展示的字段名
  }
];

// 数据校验规则
export const restRules =  {
  ruleName: [{
    required: true,
    message: "请输入策略名称"
  }, {
    // // trigger: "blur"
    validator: (rule, value, callback) => {
      if (value && value.length > 20) {
        callback(new Error("策略名称限制20字符"))
        return false;
      }
      callback();
      return true;
    }
  }],
  cityUuid: [{
    required: true,
    message: "请选择城市"
  }],
  effectiveTime: [{
    required: true,
    message: "请选择生效时间"
  }, {
    // trigger: "blur"
    validator: (rule, value, callback) => {
      if (value && new Date(value).getTime() < Date.now()) {
        callback(new Error("生效时间必须大于当前时间"))
        return false;
      }
      callback();
      return true;
    }
  }],
  reserveThreVal: [{
    required: true,
    message: "请输入整数"
  }, {
    // trigger: "blur"
    validator: validTime
  }],
  servOfflineDura: [{
    required: true,
    message: "请输入整数分钟数"
  }, {
    // trigger: "blur"
    validator: validTime
  }],
  servAlarmTimes: [{
    required: true,
    message: "请输入整数"
  }, {
    // trigger: "blur"
    validator: validTime
  }],
  servAlarmInterval: [{
    required: true,
    message: "请输入整数分钟数"
  }, {
    // trigger: "blur"
    validator: validTime
  }],
  servResetQuota: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validTime
  }],
  chargeOfflineQuota: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validHour
  }],
  chargeOfflineDura: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validHour
  }],
  chargeResetQuota: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validHour
  }],
  weekOfflineQuota: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validHour
  }],
  weekOfflineDura: [{
    required: true,
    message: "请输入整数"
  }, {
    // trigger: "blur"
    validator: validTime
  }],
  servOfflineQuota: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validHour
  }],
  servAlarmQuota: [{
    required: true,
    message: "请输入小时，支持小数点后一位"
  }, {
    // trigger: "blur"
    validator: validHour
  }],
};
