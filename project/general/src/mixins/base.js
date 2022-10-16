import {
  tool as baseTool,
  extend as _extend,
  omit,
  pick as _pick,
  num,
  ymd,
  ymdFull,
  countDaysInMonth,
  isPlainObject as _isPlainObject,
  isFunction,
  isString,
  isArray as _isArray,
  zeroFill,
  // compose,
  map,
  getObjKeys as _getObjKeys,
  deepGet,
  filterObj,
  ErrorResult,
} from 'm2-base';

export const isArray = _isArray;
export const isFunc = isFunction;
export const isPlainObject = _isPlainObject;
export const pick = _pick;
export const getObjKeys = _getObjKeys;
export const isStr = isString;


export const freeze = (o = {}) => {
  return Object.freeze(o);
}

export const getDirectives = (value, directivesList = []) => {
  if (!value) return {};
  return {
    directives: [...directivesList, { name: "hasAuth", value }]
  };
}

export const deepCopy = baseTool.deepCopy;

export const undef = v => v === null || v === undefined

// 正数
export const positiveNumber = v => v > 0;

// 最多几位小数位
export const getMostDecimal = (v, len = 2) => {
  if (!v || isNaN(+v) || Array.isArray(v)) {
    return v
  }
    let vArr = `${v}`.split(".");
    if (vArr.length > len) {
      v = vArr.slice(0, len).join(".");
    }
    if (vArr[1] && vArr[1].length > len) {
      v = Number(v).toFixed(len);
    }
    return v
}

export const tool = {
  methods: {
    falsy (key) {
      if (isArray (key)) {
        key.forEach (k => {
          this[k] = false;
        });
      } else {
        this[key] = false;
      }
      return this;
    },
    truy (key) {
      if (isArray (key)) {
        key.forEach (k => {
          this[k] = true;
        });
      } else {
        this[key] = true;
      }
      return this;
    },
    ...baseTool,
  },
};

export const compose = (...fns) => {
  if (!fns.length) {
    return arg => arg;
  } else if (fns.length - 1 === 0) {
    return fns[0];
  }
  return fns.reduce ((a, b) => {
    return (...args) => {
      console.log(a, b, args, '---');
      return a (b (...args));
    };
  });
};
function compose2 (...fns) {
  return function composed (result) {
    // 拷贝一份保存函数的数组
    let list = fns.slice ();

    while (list.length > 0) {
      // 将最后一个函数从列表尾部拿出
      // 并执行它
      result = list.pop () (result);
    }

    return result;
  };
}

export const composePromise = function (...args) {
  const init = args.pop ();
  return function (...arg) {
    return args.reverse ().reduce (function (sequence, func) {
      return sequence.then (function (result) {
        return func.call (null, result);
      });
    }, Promise.resolve (init.apply (null, arg)));
  };
};

// function add (a, b=100) {
//   return a + b;
// }
// function xx (a, b = 10) {
//   return a * b;
// }
// let r = compose (add, xx)(1, 3, 4);
// console.log (r);


// export class ErrorResult extends Error {
//   constructor(data) {
//     super();
//     this.code = data.code;
//     this.msg = data.msg;
//   }
// }

export const toResult = p => {
  return p
    .then(v => {
      if (v.data.success && v.data.code === 200) {
        return Promise.resolve([null, v.data.data]);
      } else {
        return Promise.reject(new ErrorResult(v.data));
      }
    })
    .catch(e => Promise.resolve([e, null]));
};

export const findO = (v, listKey, list) => {
  if(!list) {
    list = listKey
    listKey = 'value'
  }
  return list?.find(it => `${it[listKey]}` === `${v}`) || {}
}

export const findI = (v, listKey, list) => {
  if(!list) {
    list = listKey
    return list?.findIndex(it => `${it}` === `${v}`)
  }
  return list?.findIndex(it => `${it[listKey]}` === `${v}`)
}
