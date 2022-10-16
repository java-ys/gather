const toStr = Object.prototype.toString;
const unDef = void 0;
const isArray = p =>
  Array.isArray ? Array.isArray(p) : toStr.call(p) === "[object Array]";
const isString = s => typeof s === "string";
const isFunction = p => toStr.call(p) === "[object Function]";
const NOOP = function() {};

const serialize = data => JSON.stringify(data);
const unserialize = data => (data == null ? data : JSON.parse(data));

export const extend = (orig, target, deep = true) => {
  orig = orig || {};
  for (let i in target) {
    if (deep === true && target.hasOwnProperty(i)) {
      if (typeof target[i] === "object") {
        if (!orig[i]) {
          orig[i] = isArray(target[i]) ? [] : {};
        }
        extend(orig[i], target[i]);
      } else {
        orig[i] = target[i];
      }
    } else orig[i] = target[i];
  }
  return orig;
};

export const tips = {
  methods: {
    tips(title = "", option) {
      if (!title) return;
      const baseOption = {
        onOk: NOOP,
        onCancel: NOOP,
        type: "confirm"
      };
      option = Object.assign(baseOption, option);
      this.$Modal[option.type]({
        title,
        ...option
      });
    }
  }
};

class ErrorResult extends Error {
  constructor(data) {
    super();
    this.code = data.code;
    this.message = data.msg;
  }
}

export const tool = {
  methods: {
    /** adapter demo
     let response = { nickname: { a: { b: { c: ["c"] } } }, counts: 2 };
      let res = adapter(response, {
        name: "nickname.a.b.c",
        score: "counts"
      });
    */
    adapter(response, info) {
      return Object.keys(info).reduce((res, key) => {
        let keyArr = isString(info[key]) ? info[key].split(".") : [],
          len = keyArr.length;
        if (len > 1) {
          let i = -1,
            tmp = null;
          while (++i < len) {
            tmp = tmp ? tmp[keyArr[i]] : response[keyArr[i]];
            if (!tmp) break;
          }
          res[key] = tmp;
        } else {
          res[key] = isString(info[key]) ? response[info[key]] : unDef;
        }
        return res;
      }, {});
    },
    falsy(key) {
      if (isArray(key)) {
        key.forEach(k => {
          this[k] = false;
        });
      } else {
        this[key] = false;
      }
      return this;
    },
    truy(key) {
      if (isArray(key)) {
        key.forEach(k => {
          this[k] = true;
        });
      } else {
        this[key] = true;
      }
      return this;
    },
    toResult(p) {
      return p
        .then(v => {
          if (!v.data.success) return Promise.reject(new ErrorResult(v.data));
          return Promise.resolve([null, v.data.data]);
        })
        .catch(e => Promise.resolve([e, null]));
    },
    deepCopy(dist, target) {
      return extend(dist, target, true);
    },
    copy(dist, target) {
      return extend(dist, target, false);
    },
    isFunction,
    storeGet(k) {
      return unserialize(localStorage.getItem(k + ""));
    },
    storeSet(k, v) {
      localStorage.setItem(k + "", serialize(v));
    }
  }
};

export default {
  methods: {
    handleReset(formRef) {
      if (
        this.$refs[formRef] &&
        typeof this.$refs[formRef].resetFields === "function"
      ) {
        this.$refs[formRef].resetFields();
      }
    }
  }
};
