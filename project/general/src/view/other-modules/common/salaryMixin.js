/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-29 17:39:46
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-25 14:30:41
 */

class ErrorResult extends Error {
  constructor(data) {
    super();
    this.code = data.code;
    this.message = data.msg;
  }
}

// 接口请求统一方法
export const toResult = p => {
  return p
    .then(v => {
      if (!v.data.success) return Promise.reject(new ErrorResult(v.data));
      return Promise.resolve([null, v.data.data || v.data || []]);
    })
    .catch(e => Promise.resolve([e, null]));
};

// 日期克隆方法
const dateClone = date => {
  return new Date(date.valueOf());
};

// 深克隆
export const deepClone = obj => {
  if (obj === null) return null;
  if (typeof obj !== "object") return obj;

  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);

  // obj.constructor 获取当前值的构造器（Array/Object）
  let cloneObj = new obj.constructor();
  for (let key in obj) {
    // 循环原始数据中的每一项，把每一项赋值给新的对象
    if (!obj.hasOwnProperty(key)) break;
    cloneObj[key] = deepClone(obj[key]);
  }
  return cloneObj;
};

//判断是否为空对象
export const isEmptyObject = val => {
  return JSON.stringify(val) === "{}" || JSON.stringify(val) === "null"
    ? true
    : false;
};

//判断对象中是否存在空对象
export const isEmptyFieldExist = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!obj[key]) return true;
    }
  }
};

//判断是否为数组
export const isArray = val => {
  return Object.prototype.toString.call(val) === "[object Array]"
    ? true
    : false;
};

export const falsy = key => {
  if (isArray(key)) {
    key.forEach(k => {
      console.log(k);
      this[k] = false;
    });
  } else {
    this[key] = false;
  }
  return this;
};

//判断是否为空数组
export const isEmptyArray = val => {
  return JSON.stringify(val) === "[]" && val.length > 0 ? true : false;
};

// 两位小数金额校验
export const validateAmount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("必填字段"));
  }
  //  else if (value == 0 || (value && !/^\d+(\.\d+)?$/.test(value))) {
  //   return callback(new Error("金额必须是大于0的数字"));
  // } 
  else if (
    value &&
    value != 0 &&
    !/^(\-?([1-9][0-9]*)|(\-?([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)
  ) {
    return callback(new Error("保留两位小数"));
  } else if (value && value > 99999.99) {
    return callback(new Error("只能输入99999.99以内的金额"));
  }
  return callback();
};

// 正整数金额校验
export const validateIntAmount = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error("必填字段"));
  } else if (value == 0 || value >= 100000 || !/^\d+$/.test(value)) {
    return callback(new Error("请输入大于0的数,最大5位整数"));
  }
  // else if (value && value >= 10000) {
  //   return callback(new Error("请输入大于0的整数,最大4位整数"));
  // }
  return callback();
};

// 整数金额校验（包括0）
export const validateZeroAmount = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error("必填字段"));
  } else if (value >= 100000 || !/^\d+$/.test(value)) {
    return callback(new Error("请输入大于0的数,最大5位整数"));
  }
  // else if (value && value >= 10000) {
  //   return callback(new Error("请输入大于0的整数,最大4位整数"));
  // }
  return callback();
};

// 四位整数金额校验
export const validateQuarter = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error("必填字段"));
  } else if (value && !/^\d+$/.test(value)) {
    return callback(new Error("请输入大于0的数"));
  } else if (value && value >= 10000) {
    return callback(new Error("最大四位整数"));
  }
  return callback();
};

// 百分比整数校验
export const validatePercent = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error("必填字段"));
  } else if ((value && !/^\d+$/.test(value)) || value == 0) {
    return callback(new Error("限制输入最大3位正整数"));
  } else if (value && value >= 1000) {
    return callback(new Error("限制输入最大3位正整数"));
  }
  return callback();
};

// 百分比两位小数校验
export const validatePercentDigit = (rule, value, callback) => {
  if (!value) return callback(new Error("必填字段"));
  if (value && !/^\d+(\.\d+)?$/.test(value))
    return callback(new Error("只能输入0-100之间的数，最多两位小数"));
  if (
    value &&
    !/^(([0])|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)
  )
    return callback("只能输入0-100之间的数，最多两位小数");
  if (value && value > 100)
    return callback(new Error("只能输入0-100之间的数，最多两位小数"));
  return callback();
};

// 非空星级校验 0.00-5.00
export const validateStar = (rule, value, callback) => {
  if (!value && value !== 0) return callback(new Error("必填字段"));
  if (value && /^-/g.test(value))
    return callback(new Error("请输入0-5之间的数，可保留2位小数"));
  if (
    value &&
    value != 0 &&
    !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)
  )
    return callback(new Error("请输入0-5之间的数，可保留2位小数"));
  if (value > 5) return callback(new Error("星级范围: 0.00-5.00"));
  return callback();
};

// 非空24小时数值校验
export const validateHour = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("必填字段"));
  } else if (!/^[0-9]*$/.test(value)) {
    return callback(new Error("时长须为正整数"));
  } else if (Number(value) > 0 && Number(value) < 24) {
    return callback();
  } else {
    return callback(new Error("请输入0-23之间的正整数"));
  }
};

// 非空12小时数值校验
export const validatePeakHour = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("必填字段"));
  } else if (!/^[0-9]*$/.test(value)) {
    return callback(new Error("时长须为正整数"));
  } else if (Number(value) > 0 && Number(value) <= 12) {
    return callback();
  } else {
    return callback(new Error("请输入0-12之间的正整数"));
  }
};

const getLastDay = (year, month) => {
  let new_year = year;
  let new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    //如果当前大于12月，则年份转到下一年
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  // 取当年当月对应的下个月的前一天，即当前月的最后一天
  let last_date = new Date(new_year, new_month, 0).getDate();
  return last_date;
};

// 获取当前月的第一天和最后一天
export const getFirstAndLastDay = date => {
  let strLink = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  let lastDay = getLastDay(year, month);
  let firstDate = year + strLink + month + strLink + "01";
  let lastDate = year + strLink + month + strLink + lastDay;
  let returnArr = [firstDate, lastDate]; //以数组形式返回
  return returnArr;
};

// 获取当前周 周一&&周末
export const getCurrSunday = () => {
  let date, sunday, Y, M, D;
  date = new Date();
  date.setDate(date.getDate() - date.getDay() + 7);
  Y = date.getFullYear();
  M = date.getMonth() + 1;
  D = date.getDate();
  M < 10 ? (M = "0" + M) : "";
  D < 10 ? (D = "0" + D) : "";
  sunday = Y + "-" + M + "-" + D;
  return sunday;
};

//计算本年的周数
export const getYearWeek = date => {
  let newDate = dateClone(date);
  console.log(date, "date");
  newDate.setFullYear(newDate.getFullYear() + 1);
  newDate.setMonth(0);
  newDate.setDate(0);
  let endWeek = newDate.getDay();
  if (endWeek < 4) {
    date.setFullYear(date.getFullYear() + 1);
  }
  let beginDate, endDate, beginWeek, currWeek, millisDiff, dayDiff;
  beginDate = new Date(date.getFullYear(), 0, 1);
  // endDate = new Date(date.getFullYear(), 0, 1);
  beginWeek = beginDate.getDay();
  //星期从0-6,0代表星期天，6代表星期六
  currWeek = date.getDay();
  if (beginWeek == 0) beginWeek = 7;
  if (currWeek == 0) currWeek = 7;
  //计算两个日期的天数差
  millisDiff = date.getTime() - beginDate.getTime();
  dayDiff = Math.ceil(
    (millisDiff + (beginWeek - currWeek) * (24 * 60 * 60 * 1000)) / 86400000
  );
  if (beginWeek > 3) return Math.ceil(dayDiff / 7);
  return Math.ceil(dayDiff / 7) + 1;
};

export const objAssignment = (srcObj, rootObj) => {
  for (let i in srcObj) {
    for (let j in rootObj) {
      if (i == j) {
        rootObj[j] = srcObj[i];
      }
    }
  }
  return rootObj;
};
