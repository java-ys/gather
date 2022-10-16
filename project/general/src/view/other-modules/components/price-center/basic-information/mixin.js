/**
 * 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先
 * 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用
 * 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对
 */
import { PAGE_PARAMS } from "./fields"

 class ErrorResult extends Error {
  constructor(data) {
    super();
    this.code = data.code;
    this.message = data.msg;
  }
}

const Noop = () => {};
const isFunc = v => typeof v === "function";

const isArray = v => {
  if (Array.isArray) {
    return Array.isArray(v);
  }
  return v instanceof Array;
};

const isDef = v => v !== null && v !== undefined;

const isNumber = v => typeof v === "number" && !isNaN(v);
const isStr = v => typeof v === "string";

const clearObjectFalsy = (v) => {
  if (!isDef(v) || typeof v !== "object") return v
  const keys = Object.keys(v)
  let r = {}
  keys.length && keys.forEach(key => {
    if(isDef(v[key]) && v[key] !== "") { // 过滤 null undefined 和 ""
      r[key] = v[key]
    }
  })
  return r
}

const baseFilterFalse = v => {
  if (isArray(v)) {
    return v.filter(Boolean);
  }
  return v;
};

const firstWordToUpper = (str) => {
  if(!isStr(str)) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getVInArray = (v, pathArray = [], defu = null) => {
  if (!pathArray.length) return defu;
  let tmp = baseFilterFalse(pathArray);
  if (tmp.length - 1 === 0) return v[tmp[0]] || defu;
  let nowV = v;
  while (tmp.length) {
    let nowK = tmp.shift();
    nowV = nowV[nowK];
    let isContinue = isDef(nowV) && typeof nowV === "object";
    if (!isContinue) {
      return nowV || defu;
    }
  }
  return nowV || defu;
};
// [ ] 符号替换为空 ''
const strReg = /(\[+|\]+)/gi;

/**
 * @param {*} v   object
 * @param {*} path string | Array   ('a[0].b[1].c' | ['a', '0', 'c'])
 * @param {*} defu 默认值
 */
const toV = (v, path, defu = null) => {
  if (isStr(path)) {
    let tmp = path.split("."),
      pathArr = [];
    tmp.forEach(it => {
      if (it.indexOf("[") > -1) {
        let ar = it.split("[");
        ar = ar.map(im => im.replace(strReg, ""));
        pathArr = [...pathArr, ...ar];
      } else {
        pathArr.push(it);
      }
    });
    return getVInArray(v, pathArr, defu);
  } else if (isArray(path)) {
    return getVInArray(v, path, defu);
  }
  return defu;
};

export default {
  data() {
    return {
      ...PAGE_PARAMS,
      loading: false
    };
  },
  created() {
    // this.log(this.$data, 'ddd')
    Object.keys(this.$data).forEach(it => {
      this[`set${it}`] = (v) => {
        this[it] = v
        return this
      }
    })
  },
  methods: {
    isDef,
    isNumber,
    clearObjectFalsy,
    _V: toV,
    toResult(p) {
      return p
        .then(v => {
          if (!v.data.success) return Promise.reject(new ErrorResult(v.data));
          return Promise.resolve([null, v.data.data]);
        })
        .catch(e => Promise.resolve([e, null]));
    },
    trimS(s) {
      return s.replace(/\s*/gi, "");
    },
    falsy(v) {
      if (isArray(v)) {
        v.forEach(t => {
          this[t] = false;
        });
      } else {
        this[v] = false;
      }
      return this;
    },
    truy(v) {
      if (isArray(v)) {
        v.forEach(t => {
          this[t] = true;
        });
      } else {
        this[v] = true;
      }
      return this;
    },
    async call(funcName, params = {}, successCb, errorCb) {
      let errorFunc = this.error || Noop;
      let successFunc = this.success || Noop;
      if (successCb && isFunc(successCb)) {
        successFunc = successCb;
      }
      if (errorCb && isFunc(errorCb)) {
        errorFunc = errorCb;
      }
      this.loading = true;
      const [err, data] = await this.toResult(funcName(params));
      this.loading = false;
      if (err) {
        errorFunc({ code: err.code, msg: err.message });
        return;
      }
      successFunc(data);
    },
    log(...rest) {
      if (process.env.NODE_ENV === "development") console.log(...rest);
    }
  }
};