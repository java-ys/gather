/**
 * 节流函数
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function throttle(fn, delay = 1000) {
  let prev = 0;
  return function throttled() {
    const now = Date.now();
    if (now - prev < delay) return;
    prev = now;
    return fn.apply(this, arguments);
  }
}

export function createRule(message, type = "number", trigger = "change") {
  return { type, required: true, message, trigger };
}

export function getDateRange(isFormat) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 3);
  return isFormat ? [format(start), format(end)] : [start, end];
}

/**
 * 格式化
 * @param {Date} date
 * @returns {string}
 */
function format(date) {
  const pad = n => n < 10 ? "0" + n : n;
  return date.getFullYear() + "-" + pad(1 + date.getMonth()) + "-" + pad(date.getDate());
}


export function formatSearchDataTimeField(data, startKey, endKey) {
  if (data[startKey] && data[endKey]) {
    data[startKey] = format(new Date(data[startKey])) + " 00:00:00";
    data[endKey] = format(new Date(data[endKey])) + " 23:59:59";
  }
  return data;
}