import { freeze } from "@/mixins/base";
import { listToMap } from "@/libs/util";

export const driverArrivedList = freeze([
  { label: "司机到达上车点", value: 1 },
  { label: "司机未到达上车点", value: 0 },
]);

export const driverArrivedMap = listToMap(driverArrivedList);

// -1 [1,999] X
function isInNumberRange(value) {
  return value - -1 === 0 || (value >= 1 && value <= 999) || value === "X";
}

export const rules = freeze({
  left: [
    {
      required: true,
      // message: "请设置时间",
      validator: function (rule, value, callback) {
        if (value === "") {
          callback(new Error("请设置时间"));
          return;
        }
        if (!isInNumberRange(value)) {
          callback(new Error("只能设为-1、X或1-999"));
          return;
        }
        callback();
      },
    },
  ],
  right: [
    {
      required: true,
      // message: "请设置时间",
      validator: function (rule, value, callback) {
        if (value === "") {
          callback(new Error("请设置时间"));
          return;
        }
        if (!isInNumberRange(value)) {
          callback(new Error("只能设为-1、X或1-999"));
          return;
        }
        callback();
      },
    },
  ],
  cancelFee: [
    {
      required: true,
      message: "请设置取消费",
    },
  ],
  freeCancleMinute: [
    {
      required: true,
      message: "请填写取消条件",
    },
  ],
  driverLaterMinute: [
    {
      required: true,
      message: "请填写司机迟到时间",
    },
  ],
});
