import Cookies from "js-cookie"
// cookie保存的天数
import config from "@/config/config"
import router from "../router/index"
import store from "@/store";
import HttpRequest from "@/libs/axios"
import { forEach, hasOneOf, objEqual } from "@/libs/tools"
import Vue from "vue";
import qs from "qs";
const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro

export const queryToObj = (queryString = "") => qs.parse(queryString ? queryString : location.hash.split("?")[1], { ignoreQueryPrefix: true });

export const isCustomer = () => {
  const prefixed = queryToObj()
  if (prefixed["client"] === "__customer") { return true }
  return false
}

export const messageMap = { // 所有响应返回的信息
  // 4100: '用户不存在',
  // 4101: '该手机号未注册',
  // 4102: '参数不正确',
  // 4103: '没有权限',
  // 4104: '验证码已超时',
  // 4105: '验证码不正确',
  // 4106: '该账号已冻结',
  // 4107: '账号无效',
  // 4108: '密码不正确',
  4012: true, // 过期
  4117: true, // 认证过期
  4018: true, // 在其他终端登录
  // 9999: '登录过期，请重新登录',
  // 9998: '人员信息不存在',
  // 4016: '未授权'
}

const { TOKEN_KEY } = config

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

const HALF_DAY_OF_SECONDS = 0.5 * 24 * 60 * 60;
export const setCookie = (value, expireSeconds = HALF_DAY_OF_SECONDS) => {
  const DAYS_OF_SECONDS = 24 * 60 * 60
  Cookies.set(TOKEN_KEY, value, { sameSite: "lax", expires: expireSeconds / DAYS_OF_SECONDS, path: "/" })
}

// 删除cookie
export const deleteCookie = (name = TOKEN_KEY) => {
  Cookies.remove(name)
}

export const redirectToHome = () => {
  if (isDev) {
    router.push({ name: "login" })
  } else {
    // window.open(config.dashboardUrl, "_blank");
    window.location.href = config.dashboardUrl
  }
}

/**
 * @description 获取必要的存储内容
 */
export const fetchNecessaryData = () => {
  if (!localRead(config.menuStorageKey) || !localRead(config.btnStorageKey)) {
    store.dispatch("getNavList")
  }
  if (!localRead(config.microMenuRouteStorageKey)) {
    store.dispatch("getMicroMenuRouteList")
  }
  if (!localRead("wholeProCityList") || !localRead("provinceCityList") || !localRead("pcOperatorList") || !localRead("gradeList")) {
    store.dispatch("getCommonData")
  }
  if (!localRead("dataDict")) {
    store.dispatch("getDataDict")
  }
  if (!localRead("mallDict")) {
    store.dispatch("getMallDict")
  }
  if (!store.state.user.hasGetInfo) { // 还未获取信息
    store.dispatch("getUserInfo")
  }
  if (!store.state.common.businessGradeList.length) { // 还未获取信息
    store.dispatch("getBusinessGradeProductList")
  }
}

/**
 * @description 跨应用跳转其他模块
 * @param {String} rootPathString 跨应用根路径，例如 "/m2-web-marketing"
 * @param {Object} targetRouteObject 路由对象，包括 path 和 query
 */
export const pushToAnotherModule = (rootPathString, targetRouteObject) => {
  const { path, query } = targetRouteObject
  const secondPathString = path
  let params = "?isCross=true"
  if (query) {
    params = `?${new URLSearchParams({
      ...query,
      isCross: true
    })}`;
  }
  window.open(`${rootPathString}/#${secondPathString}${params}`);
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}
const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else { return true }
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = [...route.matched]
  let lastRoutes = JSON.parse(localStorage.getItem("lastRoutes")) || ""
  if (lastRoutes) {
    [...routeMetched].forEach((item, j) => {
      // eslint-disable-next-line array-callback-return
      lastRoutes.some(data => { // wtf
        if (item.meta.parentName === data.name) {
          routeMetched.splice(j, 0, data)
        }
      })
    })
  }
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === "function") meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || "",
      name: item.name,
      meta: meta
    }
    return obj
  })
  // res = res.filter(item => {
  //   return !item.meta.hideInMenu
  // })
  localStorage.setItem("lastRoutes", JSON.stringify(res))
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = route => {
  let router = { ...route }
  let meta = { ...route.meta }
  if (meta.title && typeof meta.title === "function") meta.title = meta.title(router)
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  return ((item.meta && item.meta.title) || item.name)
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localSave(config.tagStorageKey, JSON.stringify(list))
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localRead(config.tagStorageKey)
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = "home") => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    // eslint-disable-next-line array-callback-return
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split("?")[1].split("&")
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split("=")
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    // console.log(route, index, list.length)
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split(".")
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split("\t")
      }).map(item => {
        return item[0].split(",")
      })
      if (format === "csv") resolve(arr)
      else reject(new Error("[Format Error]:你上传的不是Csv文件"))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const formatAmount = (num) => {
  if (Number.isNaN(Number(num))) return null;
  return (Number(num)).toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ",");
};

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ""
}
export const shortSave = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}
export const shortRead = (key) => {
  return JSON.parse(sessionStorage.getItem(key)) || {}
}
window.shortSave = shortSave
window.shortRead = shortRead
// 判断输入密码的类型
export const CharMode = iN => {
  if (iN >= 48 && iN <= 57) return 1 // 数字
  if (iN >= 65 && iN <= 90) return 2 // 大写
  if (iN >= 97 && iN <= 122) return 4 // 小写
  else return 8
}
// 计算密码模式
export const bitTotal = _num => {
  let num = _num;
  let modes = 0
  for (let i = 0; i < 4; i++) {
    if (num & 1) modes++
    num >>>= 1
  }
  return modes
}
// 返回强度级别 :纯字母或者纯数字强度为1，数字与字母，'.'号三种其二强度为2，三种类型都有强度为3
export const checkStrong = sPW => {
  if (sPW.length < 6) return 0 // 密码太短，不检测级别
  let Modes = 0
  for (let i = 0; i < sPW.length; i++) {
    Modes |= CharMode(sPW.charCodeAt(i))
  }
  return bitTotal(Modes)
}
// 时间戳转化成时间格式
export const timeFormat = (timestamp, style) => {
  if (!timestamp) {
    return ""
  }
  let len = timestamp.toString().split("").length
  let date = len === 10 ? new Date(timestamp * 1000) : new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + "-"
  let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
  let D = date.getDate() + " "
  let h = (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":"
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes() + ":"
  let s =  (date.getSeconds() < 10 ? "0" + (date.getSeconds()) : date.getSeconds())
  let DD = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " "
  if (style === "yyyy-MM-dd") {
    return Y + M + DD;
  }
  if (style === "yyyy-mm-dd") {
    return Y + M + DD + h + m + s
  }
  return Y + M + D + h + m + s
}

/**
 * @param {routers} list
 * @param {权限列表} accessList
 * @description 检查返回的权限资源id中是否包含routers中对应的name, 并且处理开发时需要在菜单中显示的菜单
 */
export const checkMenuHide = (list, accessData = {}) => {
  let res = [];
  let accessList = {
    ...accessData
  };
  let token = getToken();
  if (token && localRead(config.menuStorageKey)) { // 如果已经获取到token，则说明登录成功。
    accessList = JSON.parse(localRead(config.menuStorageKey)) || {};
  }
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways))) {
        obj.children = checkMenuHide(item.children, accessList)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (res.find(item => item.name === obj.name)) { return }
      if (accessList.hasOwnProperty(obj.name)) {
        res.push(obj)
      } else if (isDev && item.meta.isMicroApp && (item.meta.isMenu)) { // 子应用且是菜单
        res.push(obj)
      } else {
        if (isDev && item.meta && item.meta.showWhenDev) {
          res.push(obj)
        }
      }
    }
  })
  return res
}

/**
 * @param {*} name
 * @description 检查返回的资源对象中是否含有页面中按钮的权限
 */
export const checkHasBtn = (name) => {
  let token = getToken();
  if (!token) return false;
  let accessList = JSON.parse(localStorage.getItem(config.btnStorageKey)) || {};
  if (accessList.hasOwnProperty(name)) return true;
  if (isDev) return true
  return false;
}

/**
 * @description 小数点后位数多于当前数字位数时，格式化数字为对应showWhenDev的小数点后几位，格式化小数不会四舍五入
 * @param {*} number 格式化的数字
 * @param {*} digit  位数
 * @return {*} 格式化后的数字
 */
export const formatNumber = (_number, digit) => {
  let number = _number;
  // 数字正则
  let numberReg = /^\d+(\.\d*)?$/;
  if (!numberReg.test(number)) {
    throw new Error(number + ": 请输入正确数字!");
  }
  // 正整数正则
  let integerReg = /^[1-9]+\d$|^[1-9]$/
  if (typeof (digit) !== "number" || integerReg.test(digit) === false) {
    throw new Error(digit + " 必须为正整数!");
  }

  let result = number - 0;
  // 转换为string格式
  if (typeof (number) !== "string") {
    number = String(number);
  }

  // 判断时候需要格式化正则
  let needReg = new RegExp(`^\\d+\\.\\d{${digit + 1},}$`);
  // 正则匹配小数部分
  let regInteger = /\.\d*/;
  // 正则匹配正确位数部分
  let regDecimals = new RegExp(`\\.\\d{${digit}}`);

  if (needReg.test(number)) {
    result = number.replace(regInteger.exec(number)[0], regDecimals.exec(number)[0]) - 0;
  }
  return result;
}

/**
 * 处理quill-editor富文本 添加样式
 */
export const getNewDetails = (data) => {
  let detailData = `<style>.ql-vdetails img{width:100%} .ql-vdetails{padding: 12px 15px;}</style><div class="ql-snow ql-editor ql-vdetails">${data}</div>`;
  return detailData;
}

/**
 * map转list
 * {1：启用，2：停用}
 * 转换为
 * [
 *  {value:1,label:'启用’}
 *  {value:2,label:'停用’}
 * ]
 */
export const mapToList = (map, type = "number", isSort = false) => {
  let list = []
  let keyArr = Object.keys(map).sort((a, b) => a - b)
  keyArr.forEach(key => {
    list.push({
      value: type === "number" ? Number(key) : key,
      label: map[key]
    })
  })
  return list
}
/**
 * list转map
 * [
 *  {value:1,label:'启用’}
 *  {value:2,label:'停用’}
 * ]
 * 转换为
 * {1：启用，2：停用}
 */
export const listToMap = (list) => {
  let map = {}
  list.forEach(item => {
    map[item.value] = item.label
  })
  return map
}
/**
 * @description 根据网关路径的不同返回请求
 * @param {*} gatePath 网关路径 默认无
 */
export const axiosHttpRequest = (gatePath = "/") => {
  let path = baseUrl + gatePath;
  return new HttpRequest(path);
}

let isType = type => {
  return function (value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
};

let isObject = isType("Object");
let isArray = isType("Array");

// 深度克隆方法
export let deepClone = (target, origin) => {
  if (!origin) {
    throw new Error("misssing value [origin]");
  }
  if (!target) {
    // eslint-disable-next-line no-param-reassign
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

const isServer = Vue.prototype.$isServer;
/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();
/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();


// 删除提交的查询表单空值属性
export const deleteEmptyProps = (form, excludeList) => {
  for (let paramName in form) {
    if (form.hasOwnProperty(paramName)) {
      if ((!form[paramName]) && (!excludeList || excludeList && excludeList.indexOf(paramName) < 0)) {
        delete form[paramName];
      }
    }
  }
  return form;
};

// 可空手机号码校验-可模糊
export const validatePhoneQuery = (rule, value, callback) => {
  if (!value || /^\d+(\.\d+)?$/.test(value)) { // 判断为非负数字即可通过
    return callback();
  } else {
    return callback(new Error("手机号格式不正确"));
  }
};

// 可空身份证校验
export const validateIdCardQuery = (rule, value, callback) => {
  if (!value || /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[xX])$)|(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)/.test(value)) {
    return callback();
  } else {
    return callback(new Error("身份证号格式不正确"));
  }
};

// 根据传入的格式进行时间格式化
export function dateTimeFormat(dateStr, fmt, isDate) {
  let date = isDate ? dateStr : new Date(dateStr);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (String(date.getFullYear())).substr(4 - RegExp.$1.length));
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = String(o[k]);
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}"
  let date
  if (typeof time === "object") {
    date = time
  } else {
    if ((String(time)).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === "a") return ["一", "二", "三", "四", "五", "六", "日"][value - 1]
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @description 文件流方式导出excel
 * @param {*} data 文件流
 * @param {*} fileName 文件名
 */
export const excelDownload = (data, fileName, postfix = ".xls") => {
  let blob = new Blob([data], { type: "application/vnd.ms-excel;charset=utf-8" }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  let downloadElement = document.createElement("a");
  let href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = fileName + `${postfix}`; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}
export function htmlToElement(html) {
  let template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return html ? template.content.firstChild : template.content;
}

export const isNil = val => (val === null || val === undefined)

export const toUpperFirstCase = str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()

export const microAppName = name => name.split("-").map(str => toUpperFirstCase(str)).join("")

export const groupBy = (collection, iteratee) => collection.reduce((r, v, i, a, k = (typeof iteratee === "string" ? v[iteratee] : iteratee(v))) => ((r[k] || (r[k] = [])).push(v), r), {})

export const getEnv = (ev) => {
  let env = "";
  if (ev) {
    env = ev;
    return env;
  }
  if (window.location.host === "172.16.19.201:8080") {
    // local环境
    env = "dev";
  } else if (window.location.host === "172.16.1.33") {
    // 开发环境
    env = "dev";
  } else if (window.location.host === "10.3.64.188") {
    // 重庆开发环境
    env = "dev";
  } else if (window.location.host === "172.16.24.44") {
    // 测试环境
    env = "test";
  } else if (window.location.host === "10.3.97.249") {
    // 重庆测试环境
    env = "test";
  } else if (window.location.host === "172.16.28.115") {
    env = "test";
  } else if (window.location.host === "172.16.32.84") {
    env = "test";
  } else if (window.location.host === "172.16.19.87:8080") {
    // 安全测试环境
    env = "test";
  } else if (window.location.host === "172.16.2.209") {
    // 热修复环境
    env = "test";
  } else if (window.location.host === "172.16.107.45:8080") {
    env = "test";
  } else if (window.location.host === "172.16.27.129") {
    // KAE环境
    env = "test";
  } else if (window.location.host === "172.16.4.252") {
    // UAT环境
    env = "test";
  } else if (window.location.host === "172.16.50.130") {
    // 压测环境
    env = "test";
  } else if (window.location.host === "10.3.192.189") {
    // 重庆压测环境
    env = "test";
  } else if (window.location.host === "172.16.0.211") {
    // 等保环境
    env = "test";
  } else if (window.location.host === "10.0.2.149") {
    // 生产环境
    env = "prod";
  } else if (window.location.host === "static.m2cn.cn") {
    // 公网环境地址
    env = "prod";
  } else if (window.location.host === "10.4.50.174") {
    // 生产环境-华为云
    env = "prod";
  } else {
    env = "prod";
  }
  return env
}

export const listToMapFnGenerator = (valueKey, textKey) => list => {
  const obj = {}
  list.forEach(item => {
    obj[item[valueKey]] = item[textKey]
  })

  return obj;
}