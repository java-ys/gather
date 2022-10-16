import { MessageBox } from "element-ui";
// import $store from "@/utils/$store"
import Cookies from "js-cookie"
import { checkHasBtn } from "@/libs/util";
import WebStorageCache from "web-storage-cache"

export const isDCP = window.__POWERED_BY_QIANKUN__ // dcp平台
export const TOKEN_KEY = window.__POWERED_BY_QIANKUN__ ? "dcp_token" : "accessToken"
export const REFRESH_TOKEN_KEY = window.__POWERED_BY_QIANKUN__ ? "dcp_refresh_token" : "refreshToken"
export const getUserIdFromLocalStorage = () => {
  return (
    JSON.parse(localStorage.getItem("login-info-dash")) ||
    JSON.parse(localStorage.getItem("loginInfo")) ||
    {}
  ).userId
}
/**
 * @description 获取上月时间
 * @param {*} date 时间
 * @return {*} 返回的的时间
 */
export const getLastMonth = date => {
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month === 0) {
    year -= 1;
    month = 12;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return year.toString() + month.toString();
};

/**
 * @description 文件流方式导出excel
 * @param {*} data 文件流
 * @param {*} fileName 文件名
 */
export const excelDownload = (data, fileName, postfix = ".xls") => {
  const blob = new Blob([data], { type: "application/vnd.ms-excel;charset=utf-8" }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = `${fileName}${postfix}`; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};

/**
 * @param {Array} data 对象数组
 * @param {String} id 自身标识
 * @param {String} pid 父级标识
 * @return {Array} res 树形结构
 * @description 将同级结构的数据转化成树形结构
 */
export function treeDataTranslate(data, id = "id", pid = "parentId") {
  let res = [];
  const temp = {};
  for (let i = 0; i < data.length; i++) { // 创建id索引对象
    temp[data[i][id]] = data[i];
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) { // 若该项有父亲
      if (!temp[data[k][pid]].children) { // 为有子节点的项初始化children
        temp[data[k][pid]].children = [];
      }
      if (!temp[data[k][pid]]._level) { // 为有子节点的项初始化level
        temp[data[k][pid]]._level = 1;
      }
      data[k]._level = temp[data[k][pid]]._level + 1; // 该项level = 父亲level + 1
      temp[data[k][pid]].children.push(data[k]); // 将该项装入temp里该项父亲的children中
    } else { // 该项没有父亲
      if (data[k][id] === data[k][pid]) {
        res = res.filter(r => r.id !== data[k][id]);
      }
      res.push(data[k]);
    }
  }
  for (let j = 0; j < data.length; j++) { // 为无子节点的项初始化level
    if (!data[j]._level) {
      data[j]._level = 1;
    }
  }

  return res;
}

/**
   * @param {Array} arr 树
   * @param {String} key key名
   * @param {String} targetKey 目标key名
   * @description 为list更改字段
   */
export const changeListKey = (arr, key = "title", targetKey = "label") => {
  for (let i = 0; i < arr.length; i++) {
    arr[i][targetKey] = arr[i][key];
  }
};

const getKeys = (p = {}) => Object.keys(p);
const isArray = a => Array.isArray(a);
const isEmptyArray = a => JSON.stringify(a) === "[]" || (Array.isArray(a) && a.length === 0);

export const filters = {
  /**
     * 指定参数列表, 过滤掉 -1 的入参
     * filterNonsense({a: -1, b: -1, c: []}, ["a", "b"]) => {c:[]}
     * filterNonsense({a: -1, b: -1, c: []}, "a") => {b: -1, c:[]}
     */
  filterNonsense: (params = {}, excludeList = []) => {
    if (!isArray(excludeList)) excludeList = [excludeList];
    const r = {};
    getKeys(params).forEach(k => {
      const f = excludeList.includes(k.trim());
      if (f) {
        if (params[k] - -1 !== 0) r[k] = params[k];
      } else {
        r[k] = params[k];
      }
    });
    return r;
  },
  // 过滤参数为-1
  filterNegativeNumberOne: (params = {}) => {
    const r = {};
    getKeys(params).forEach(k => {
      if (params[k] - -1 !== 0) {
        r[k] = params[k];
      }
    });
    return r;
  },
  // 指定过滤规则, 默认: "" null []
  filterEmpty: (params, excludeList = ["", null, []]) => {
    const r = {};
    getKeys(params).forEach(k => {
      const v = params[k];
      if (v !== "" && v !== null && !isEmptyArray(v)) {
        r[k] = v;
      }
      // if(isArray(excludeList) && excludeList.length) {
      //   if(excludeList.includes(v)) {

      //   }
      // } else {

      // }
    });
    return r;
  },
};

/**
 * map转list
 * {1：启用，2：停用}
 * 转换为
 * [
 *  {value:1,label:'启用’}
 *  {value:2,label:'停用’}
 * ]
 */
export const mapToList = map => {
  const list = [];
  const keyArr = Object.keys(map).sort((a, b) => a - b);
  keyArr.forEach(key => {
    list.push({
      value: Number(key),
      label: map[key],
    });
  });
  return list;
};

export const getToken = (paramsKey) => {
  const token = Cookies.get(paramsKey || TOKEN_KEY)
  if (token) return token
  else return false
}
// 判断按钮级权限
export const hasPermission = elementId => {
  return checkHasBtn(elementId)
  // // 后期把放行去掉
  // let { buttons } = $store.state;
  // if (isDCP) {
  //   let accessList = JSON.parse(localStorage.getItem("accessListDcp")) || {};
  //   buttons = Object.keys(accessList)
  // }
  // return buttons ? buttons.includes(elementId) : true;
};

// 置灰按钮提示
export const grayButton = msg => {
  MessageBox.alert(msg || "当前功能不可用");
};

// 带非空手机号码校验
export const validatePhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入手机号"));
  } if (/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(value)) {
    return callback();
  }
  return callback(new Error("手机号格式不正确"));
};
// 身份证校验可以允许小写x
// 带非空身份证校验
export const validateIdCard = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入身份证号"));
  }
  if (/(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[X|x])$)|(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)/.test(value)) {
    return callback();
  }
  return callback(new Error("身份证号格式不正确"));
};

// 校验合法的生效月份时间段
export const validateValidTime = (rule, value, callback) => {
  const desc = rule.field === "beginTime" ? "起始" : "结束";
  const inputDate = new Date(value);
  const now = new Date();
  if (!value) {
    return callback(new Error(`请选择生效${desc}时间`));
  }
  if (inputDate.getFullYear() >= now.getFullYear() && inputDate.getMonth() >= now.getMonth()) {
    return callback();
  }
  return callback(new Error(`生效${desc}时间不能早于当前月份`));
};

// 可空手机号码校验-可模糊
export const validatePhoneQuery = (rule, value, callback) => {
  if (!value || /^\d+(\.\d+)?$/.test(value)) { // 判断为非负数字即可通过
    return callback();
  }
  return callback(new Error("手机号格式不正确"));
};

// 可空身份证校验
export const validateIdCardQuery = (rule, value, callback) => {
  if (!value || /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[xX])$)|(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)/.test(value)) {
    return callback();
  }
  return callback(new Error("身份证号格式不正确"));
};

// 可空年龄校验
export const validateAgeQuery = (rule, value, callback) => {
  if (!value || /^((1[0-5])|[1-9])?\d$/.test(value)) {
    return callback();
  }
  return callback(new Error("非法的年龄值"));
};

// 非空校验
export const validateEmpty = value => {
  const obj = { success: false, msg: "" };
  if (!value) {
    obj.msg = "该字段不能为空";
  } else {
    obj.success = true;
  }
  return obj;
};

// 百分比数字校验
export const validatePercent = (value, noNeedFlag) => {
  const obj = { success: false, msg: "" };
  if (!noNeedFlag && !value) {
    obj.msg = "必填字段";
  } else if (value && (!/^\d+(\.\d+)?$/.test(value) || value == 0)) {
    obj.msg = "百分比必须是正数";
  } else if (value && !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
    obj.msg = "百分比小数点后只保留两位";
  } else if (!value || (value > 0 && value <= 100)) {
    obj.success = true;
  } else {
    obj.msg = "只能输入100以内的值";
  }
  return obj;
};

// 百分比数字校验-兼容阶梯绩效奖励为0的情况
export const validateLadderPercent = (value, noNeedFlag) => {
  const obj = { success: false, msg: "" };
  if (!noNeedFlag && !value) {
    obj.msg = "必填字段";
  } else if (value && (!/^\d+(\.\d+)?$/.test(value))) {
    obj.msg = "百分比必须是正数";
  } else if (value && !/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
    obj.msg = "百分比小数点后只保留两位";
  } else if (!value || (value >= 0 && value <= 10000)) {
    obj.success = true;
  } else {
    obj.msg = "只能输入10000以内的值";
  }
  return obj;
};

// 非空小时数值校验(日/月)
export const validateHour = (value, isMonth) => {
  const obj = { success: false, msg: "" };
  if (!value) {
    obj.msg = "必填字段";
  } else if (!/^[0-9]*$/.test(value)) {
    obj.msg = "时长须为正整数";
  } else if ((!isMonth && Number(value) >= 0 && Number(value) <= 24) || (isMonth && Number(value) >= 0 && Number(value) <= 24 * 31)) {
    obj.success = true;
  } else {
    obj.msg = "时长不符合要求";
  }
  return obj;
};

// 非空金额数值校验
export const validateAmount = (value, noNeedFlag) => {
  const obj = { success: false, msg: "" };
  if (!noNeedFlag && !value) {
    obj.msg = "必填字段";
  } else if (value && !/^\d+(\.\d+)?$/.test(value)) {
    obj.msg = "金额必须是不小于0的数字";
  } else if (value && value != 0 && !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
    obj.msg = "金额小数点后只能保留两位";
  } else if (!value || (value >= 0 && value < 1000000)) {
    obj.success = true;
  } else {
    obj.msg = "只能输入100万以内的金额数";
  }
  return obj;
};

// 非空星级校验 0.00-5.00
export const validateStar = (value, noNeedFlag) => {
  const obj = { success: false, msg: "" };
  if (!noNeedFlag && !value) {
    obj.msg = "必填字段";
  } else if (value && /^-/g.test(value)) {
    obj.msg = "星级须为非负数，且小数点后只能保留两位";
  } else if (value && value != 0 && !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
    obj.msg = "星级须为非负数，且小数点后只能保留两位";
  } else if (!value || (value >= 0 && value <= 5)) {
    obj.success = true;
  } else {
    obj.msg = "星级范围: 0.00-5.00";
  }
  return obj;
};

// 删除提交的查询表单空值属性
export const deleteEmptyProps = (form, excludeList) => {
  for (const paramName in form) {
    if (form.hasOwnProperty(paramName)) {
      if ((!form[paramName]) && (!excludeList || excludeList && excludeList.indexOf(paramName) < 0)) {
        delete form[paramName];
      }
    }
  }
  return form;
};

// 根据传入的格式进行时间格式化
export function dateTimeFormat(dateStr, fmt, isDate) {
  const date = isDate ? dateStr : new Date(dateStr);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = `${o[k]}`;
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return (`00${str}`).substr(str.length);
}

// 转化utc时间为当地时间
export const convertUTCTimeToLocalTime = UTCDateString => {
  if (!UTCDateString) {
    return "-";
  }

  function formatFunc(str) { // 格式化显示
    return str > 9 ? str : `0${str}`;
  }

  const date2 = new Date(UTCDateString); // 这步是关键
  const year = date2.getFullYear();
  const mon = formatFunc(date2.getMonth() + 1);
  const day = formatFunc(date2.getDate());
  let hour = date2.getHours();
  const noon = hour >= 12 ? "下午" : "上午";
  hour = hour >= 12 ? hour - 12 : hour;
  hour = formatFunc(hour);
  const min = formatFunc(date2.getMinutes());
  return `${year}-${mon}-${day} ${noon} ${hour}:${min}`;
};

// 将日期转换成当年第几周
export const getYearWeek = src => {
  // 直接使用elementUI源码的周转换
  const date = new Date(src);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  const week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  return `${date.getFullYear()}年第${week}周`;
};

// 转换base64为file格式
export const convertBase64UrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// 对象数组根据传输的属性值排序
export const sortByProperty = (array, property, isAsc) => {
  const compare = property => function (a, b) {
    return isAsc ? (b[property] - a[property]) : (a[property] - b[property]);
  };
  return array.sort(compare(property));
};

// 根据传入的时间得到当月最后一天
export const getMonthLastDay = value => {
  const endTime = new Date(value);
  let endMonth = endTime.getMonth() + 1;
  let endYear = endTime.getFullYear();
  if (endMonth == 12) {
    endMonth = 1;
    endYear += 1;
  } else {
    endMonth += 1;
  }
  value = new Date(new Date(`${endYear}-${endMonth < 10 ? (`0${endMonth}`) : endMonth}-01`).getTime() - 1000 * 60 * 60 * 24);
  return value;
};

/**
 * 检查并压缩图片大小
 */
export const checkAndHandleCompression = file => new Promise((resolve, reject) => {
  imgBase64(file, (image, canvas) => {
    const maxSize = 1 * 512; // 512 (单位KB)
    const fileSize = file.size / 1024; // 图片大小 (单位KB)
    let uploadSrc; let
      uploadFile;
    if (fileSize > maxSize) { // 如果图片大小大于maxSize，进行压缩
      uploadSrc = canvas.toDataURL(file.type, maxSize / fileSize);
      uploadFile = convertBase64UrlToFile(uploadSrc, file.name); // 转成file文件
    } else {
      uploadSrc = image.src;
      uploadFile = file;
    }
    const compressedSize = uploadFile.size / 1024;// 压缩后图片大小 (单位KB)
    // 判断图片大小是否小于maxSize，如果大于则继续压缩至小于为止
    if (compressedSize.toFixed(2) > maxSize) {
      checkAndHandleCompression(uploadFile);
    } else {
      const fileOptions = { uploadSrc, uploadFile };
      resolve(fileOptions);
    }
  });
});

/**
 * 将图片转化为base64
 */
export const imgBase64 = (file, callback) => {
  // 看支持不支持FileReader
  if (!file || !window.FileReader) return;
  // 创建一个 Image 对象
  const image = new Image();
  // 绑定 load 事件处理器，加载完成后执行
  image.onload = function () {
    // 创建 canvas DOM 对象
    const canvas = document.createElement("canvas");
    // 返回一个用于在画布上绘图的环境, '2d' 指定了您想要在画布上绘制的类型
    const ctx = canvas.getContext("2d");
    // 如果高度超标 // 参数，最大高度
    const MAX_HEIGHT = 3000;
    if (image.height > MAX_HEIGHT) {
      // 宽度等比例缩放 *=
      image.width *= MAX_HEIGHT / image.height;
      image.height = MAX_HEIGHT;
    }
    // 获取 canvas的 2d 环境对象,
    // 可以理解Context是管理员，canvas是房子
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 重置canvas宽高
    canvas.width = image.width;
    canvas.height = image.height;
    // 将图像绘制到canvas上
    ctx.drawImage(image, 0, 0, image.width, image.height);
    callback(image, canvas);
  };
  if (/^image/.test(file.type)) {
    // 创建一个reader
    const reader = new FileReader();
    // 将图片将转成 base64 格式
    reader.readAsDataURL(file);
    // 读取成功后的回调
    reader.onload = function () {
      // 设置src属性，浏览器会自动加载。
      // 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
      image.src = this.result;
    };
  }
};

export const webStorageCache = new WebStorageCache();
