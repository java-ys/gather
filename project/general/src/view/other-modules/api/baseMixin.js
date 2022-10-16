import {
  tool as baseTool,
  extend,
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
  compose,
  map,
  getObjKeys as _getObjKeys,
  deepGet,
  filterObj,
  ErrorResult
} from "m2-base";

export const isArray = _isArray;
export const isFunc = isFunction;
export const isPlainObject = _isPlainObject;
export const pick = _pick;
export const getObjKeys = _getObjKeys

export const tool = {
  methods: {
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
    ...baseTool
  }
};
