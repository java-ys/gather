// 深度克隆
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
  