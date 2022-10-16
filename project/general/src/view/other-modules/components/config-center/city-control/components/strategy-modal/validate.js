/*
 * @Description:
 * @Author: sunqianqian
 * @Date: 2022-05-05 09:06:32
 * @LastEditors: sunqianqian
 * @LastEditTime: 2022-05-05 20:39:58
 */

export function useValidateRules(distanceCompensateFare) {
  const validateStartDistance = (rule, value, callback) => {
    let end = distanceCompensateFare[rule.field.split(".")[1]].endDistance;
    if ((!value && value !== 0) || value.length === 0) {
      callback(new Error("请输入计费里程区间"));
    } else if (end && value >= end) {
      callback(new Error("起始要小于结束区间"));
    } else {
      callback();
    }
  };

  const validateEndDistance = (rule, value, callback) => {
    let start = distanceCompensateFare[rule.field.split(".")[1]].startDistance;
    if ((!value && value !== 0) || value.length === 0) {
      callback(new Error("请输入计费里程区间"));
    } else if (value <= start) {
      callback(new Error("结束要大于起始区间"));
    } else {
      callback();
    }
  };
  const validateStartRatio = (rule, value, callback) => {
    let end = distanceCompensateFare[rule.field.split(".")[1]].distanceRatioList[rule.field.split(".")[3]].endRatio;
    if ((!value && value !== 0) || value.length === 0) {
      callback(new Error("请输入计乘比区间"));
    } else if (end && value >= end) {
      callback(new Error("起始要小于结束区间"));
    } else {
      callback();
    }
  };
  const validateEndRatio = (rule, value, callback) => {
    let start = distanceCompensateFare[rule.field.split(".")[1]].distanceRatioList[rule.field.split(".")[3]].startRatio;
    if ((!value && value !== 0) || value.length === 0) {
      callback(new Error("请输入计乘比区间"));
    } else if (value <= start) {
      callback(new Error("结束要大于起始区间"));
    } else {
      callback();
    }
  };

  const validateCompensateFare = (rule, value, callback) => {
    if ((!value && value !== 0) || value.length === 0) {
      callback(new Error("请输入补偿金额"));
    } else if (value > 100 || value < -100) {
      callback(new Error("请输入大于-100，小于100补偿金额"));
    } else {
      callback();
    }
  };
  return {
    startDistance: [ // 计乘比补偿 计费里程区间
      { required: true, validator: validateStartDistance },
    ],
    endDistance: [ // 计乘比补偿 计费里程区间
      { required: true, validator: validateEndDistance },
    ],
    startRatio: [ // 计乘比补偿 计乘比区间
      { required: true, validator: validateStartRatio },
    ],
    endRatio: [ // 计乘比补偿 计乘比区间
      { required: true, validator: validateEndRatio },
    ],
    compensateFare: [ // 计乘比补偿 补偿金额
      { required: true, validator: validateCompensateFare },
    ],
  }
}
