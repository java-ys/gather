import {ossUrlGet} from '_o/api/common';
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
  ErrorResult,
} from 'm2-base';

export default {
  methods: {
    // 根据文件uuid 获取链接; ori 是否返回所有参数
    getOssFile (p, ori = false) {
      return ossUrlGet (p)
        .then (v => {
          if (!v.data.success) {
            return Promise.reject ([new ErrorResult (v.data), null]);
          }
          return Promise.resolve ([null, ori ? v : v.data.data]);
        })
        .catch (e => {
          return Promise.resolve ([ori ? e : e.data, null])
        });
    },
  },
};
