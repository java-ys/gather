import base from "./base";

function pf(url) {
  return params => {
    return base.mainRequest(url, params);
  };
}
const util = {
  firstUpperCase(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  },
  getUrlName(url = "") {
    let ar = url.split("/");
    let len = ar.length;
    return len > 1 ? `${ar[len - 2]}${this.firstUpperCase(ar[len - 1])}` : "";
  }
};

const _urlList = [
  "/api/v1/driver/nocheckWarn/configList", //    背调预警配置列表
  "/api/v1/driver/nocheckWarn/configInsert", //    新增配置
  "/api/v1/driver/nocheckWarn/configEdit", //  修改配置
  "/api/v1/driver/nocheckWarn/nocheckWarnList", //   背调预警列表
  "/api/v1/driver/nocheckWarn/queryLog" // 预警配置日志
];
let _interface = {};

_urlList.forEach(it => {
  let t = util.getUrlName(it);
  t && (_interface[t] = pf(it));
});

export default _interface;
