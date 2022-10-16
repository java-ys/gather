/*
 * @Author: Evil Cheng
 * @Date: 2021-11-16 10:03:40
 * @LastEditTime: 2021-11-18 11:06:12
 * @Description:
 */
export const validNumber = (rule, val, callback) => {
  let reg = /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;
  if (!val && val !== 0) {
    callback(new Error("请输入正确得数字,并最多保留两位小数"));
  }
  if (!reg.test(val)) {
    callback(new Error("请输入正确得数字,并最多保留两位小数"));
  } else {
    callback();
  }
}

export const effectiveTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请选择生效时间"));
  } else {
    const timestamp = new Date(value).getTime();
    if (timestamp < Date.now()) {
      callback(new Error("生效时间不得小于当前时间"));
    } else {
      callback();
    }
  }
};