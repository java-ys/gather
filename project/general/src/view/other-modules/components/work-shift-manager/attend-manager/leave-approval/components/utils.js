let isType = type => {
  return function (value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
};

let isObject = isType('Object');
let isArray = isType('Array');

// 深度克隆方法
export let deepClone = (target, origin) => {
  if (!origin) {
    throw new Error('misssing value [origin]');
  }
  if (!target) {
    target = isObject(origin) ? {} : [];
  }
  for (let key in origin) {
    if (isObject(origin[key]) || isArray(origin[key])) {
      target[key] = deepClone(target[key], origin[key]);
    } else {
      target[key] = origin[key];
    }
  }
  return target;
}

// 时间戳转化成时间格式
export const timeFormat = (timestamp, style) => {
  if (!timestamp) {
    return ''
  }
  var len = timestamp.toString().split('').length
  var date = len == 10 ? new Date(timestamp * 1000) : new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
  var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  var DD = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  if (style === 'yyyy-MM-dd') {
    return Y + M + DD
  }
  if (style === 'endTime') {
    return Y + M + DD + ' 23:59:59'
  }
  if (style === 'yyyy-mm-dd') {
    return Y + M + DD + ' ' + h + m + s
  }
  return Y + M + D + h + m + s
}



