import { Message } from "iview";
import MD5 from "js-md5";
import { isCustomer } from '@/libs/util'
// 用户模块
import { login, getUserInfo, getNavList, aesAuth } from "../api/user";
import {
  getProvinceCityList,
  getCityOperatorTree,
  getWholeRegion
} from "../api/common";
import { cpTranslate, cppTranslate, encryptECB } from "@/libs/tools";
import { list_to_tree, sortMenusForPathLen, entryMenuList /* , entryMenuAsyncList */ } from "@/micro/appUtils"
import defaultAvator from "../images/avatar.png";
import config from "@/config/config"; // 为引入的配置文件
import { getGradeList } from "../../api/common";


const headersObject = config.headers; // 取出headers对象
const { TOKEN_KEY } = config;
// 菜单模块
import {
  setTagNavListInLocalstorage,
  getToken,
  setCookie,
  deleteCookie,
  getHomeRoute,
  localRead,
  checkMenuHide,
} from "@/libs/util";
import HttpRequest from "@/libs/axios";
import routers from "@/router/routers";
import mainAppShared from "@/micro/shared"

const $Message = Message;
const { homeName } = config;
export default {
  name: "user",
  state: {
    // 用户模块
    userAccount: "",
    userName: "",
    userId: "",
    avatorImgPath: "",
    token: getToken(),
    access: "",
    accessList: {},
    hasGetInfo: false,
    // app 模块
    breadCrumbList: [],
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead("local"),
    errorList: [],
    hasReadErrorPage: false,
    routers: routers,
    encryptedKey: "",
    encryptedRandom: "",
    workNumber: "",
    microMenuRouteList: JSON.parse(localStorage.getItem(config.microMenuRouteStorageKey)) || [], // 子应用 fetch all menu.json
    limitMenuData: JSON.parse(localStorage.getItem(config.limitMenuDataStorageKey)) || {} // 权限中心配置
  },
  getters: {
    menuList: (state, getters, rootState) => checkMenuHide(state.routers, rootState.user.accessList),
    errorCount: state => state.errorList.length,
    userAccount: state => state.userAccount,
    userId: state => state.userId,
    getUserName: state => state.userName,
    limitMenuData: state => state.limitMenuData,
    microMenuRouteList: state => state.microMenuRouteList,
    getEncryptedKey: state => state.encryptedKey,
    getEncryptedRandom: state => state.encryptedRandom,
  },
  mutations: {
    setWorkNumber(state, num) {
      state.workNumber = num;
    },
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    userAccount(state, account) {
      state.userAccount = account;
    },
    setToken(state, token, seconds) {
      state.token = token;
      setCookie(token, seconds);
    },
    // 菜单module
    changeRouters(state, list) {
      state.routers = list;
    },
    setAccessList(state, list) {
      state.accessList = list;
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
    setMicroMenuRouteList(state, list) {
      state.microMenuRouteList = list
      mainAppShared.setMicroMenuRouteList(list)
    },
    setLimitMenuData(state, data) {
      state.limitMenuData = data
      mainAppShared.setLimitMenuData(data)
    },
    setEncryptedKey(state, encryptedKey) {
      state.encryptedKey = encryptedKey;
    },
    setEncryptedRandom(state, encryptedRandom) {
      state.encryptedRandom = encryptedRandom;
    },
  },
  actions: {
    // 获取加密秘钥
    handleAesAuth({ commit }) {
      return new Promise((resolve, reject) => {
        aesAuth().then(res => {
          if (res.data.code === 200) {
            // 获取秘钥成功
            commit("setEncryptedKey", res.data.data.encryptedKey);
            commit("setEncryptedRandom", res.data.data.random);
          }
          resolve(res);
        });
      });
    },
    // 登录
    handleLogin({ state, commit, rootState, dispatch }, { userName, password, encryptedKey, random }) {
      // eslint-disable-next-line no-param-reassign
      userName = userName.trim();
      return new Promise((resolve, reject) => {
        let params = {
          userName,
          password: encryptECB(encryptedKey, password),
          random: random
          // password: MD5(MD5(password).toUpperCase()).toUpperCase()
        };
        login(params).then(res => {
          if (res.data.data && res.data.success) {
            // 登录成功
            const userData = res.data.data
            mainAppShared.setToken(userData.access_token)
            commit("userAccount", userName);
            commit("setToken", userData.access_token, userData.expires_in);
            commit("setUserId", userData.userId);
            setTagNavListInLocalstorage([]);
            // 登录时，产品线不存在则请求产品线
            if (!rootState.common.bizTypeMap.length) {
              dispatch("getBizTypeMap")
            }
          }
          resolve(res);
        });
      });
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        mainAppShared.logout()
        deleteCookie(TOKEN_KEY);
        localStorage.clear();
        commit("setHasGetInfo", false);
        commit("setUserId", "");
        resolve();
      });
    },
    getNavList({ state, commit }) {
      return new Promise((resolve, reject) => {
        getNavList().then(res => {
          let menuList = {};
          let btnList = {};
          let data = res.data.data || [];
          const limitMenuData = list_to_tree(data)[0]
          data.forEach(item => {
            if (item.route && item.type === 1) {
              menuList[item.route] = item;
            } else {
              btnList[item.identificationId] = item;
            }
          });
          if (!data.length) $Message.warning("暂无菜单权限，请联系管理员");

          commit("setAccessList", menuList); // 第一次登录请求的时候使用
          commit("setLimitMenuData", limitMenuData)
          localStorage.setItem(config.menuStorageKey, JSON.stringify(menuList)); // 后续使用无需请求
          localStorage.setItem(config.btnStorageKey, JSON.stringify(btnList));
          localStorage.setItem(config.limitMenuDataStorageKey, JSON.stringify(limitMenuData)); // 层级关系
          resolve(res);
        });
      });
    },
    async getMicroMenuRouteList({ state, commit }) {
      // const json = require('../../../../micro/menu.json') // 本地开发

      const fetchList = entryMenuList
        .map(url => window.fetch(url)
          .then(res => res.json())
          .catch(e => {
            console.error(url, e);
            return []
          }))

      // const arr = await Promise.all(entryMenuAsyncList)
      // console.log('@entryMenuAsyncList: ', arr);
      const list = await Promise.all(fetchList)
      console.log("@entryMenuList: ", list);

      // const menuListJson = arr.map(({ res })=> res).flat(Infinity)
      const menuListJson = list.flat(Infinity)
      const sortedMenuList = sortMenusForPathLen(menuListJson)

      localStorage.setItem(config.microMenuRouteStorageKey, JSON.stringify(sortedMenuList));
      commit("setMicroMenuRouteList", sortedMenuList)
      console.log("@setMicroMenuRouteList: ", sortedMenuList);
      mainAppShared.addMenuRoutes(sortedMenuList)
    },
    // 获取用户相关信息（刷新页面时调用，router/index.js）
    getUserInfo({ state, commit }) {
      if (isCustomer()) return
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(res => {
            // commit("userAccount", res.data.data.accountName);
            commit("setAvator", defaultAvator);
            commit("setUserName", res.data.data.name);
            commit("setHasGetInfo", true);
            commit("setWorkNumber", res.data.data.empNo);
            mainAppShared.setUserInfo(res.data.data)
            resolve(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // 获取公共信息
    getCommonData() {
      getWholeRegion().then(response => {
        // 获取所有省、市级联列表
        let list = JSON.stringify(cpTranslate(response.data.data, "", "", "citys"));
        localStorage.setItem("wholeProCityList", list);
      });
      getProvinceCityList().then(response => {
        // 获取已开通省、市级联列表
        let transformData = JSON.stringify(cpTranslate(response.data.data));
        localStorage.setItem("provinceCityList", transformData);
      });
      getCityOperatorTree().then(response => {
        // 获取省、市、运营商级联列表
        let transformData = JSON.stringify(cppTranslate(response.data.data));
        localStorage.setItem("pcOperatorList", transformData);
      });
      getGradeList().then(response => {
        // 获取车型等级配置
        let transformData = JSON.stringify(cppTranslate(response.data.data.businessTypeList));
        localStorage.setItem("gradeList", transformData);
      });
    },
    // app.js module  //错误日志
    // addErrorLog ({ commit, rootState }, info) {
    //   if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
    //   const { user: { token, userId, userName } } = rootState
    //   let data = {
    //     ...info,
    //     time: Date.parse(new Date()),
    //     token,
    //     userId,
    //     userName
    //   }
    //   saveErrorLogger(info).then(() => {
    //     commit('addError', data)
    //   })
    // },
    // 修改密码
    handleChangePwd({ commit }, parameter) {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      const axios = new HttpRequest(baseUrl);
      for (let i in parameter) {
        if (parameter.hasOwnProperty(i)) {
          parameter[i] = parameter[i].trim();
        }
      }
      return axios.request({
        url: "/auth-api/api/v1/account/updateUserPassword",
        data: {
          oldPassword: MD5(MD5(parameter.oldPwd).toUpperCase()).toUpperCase(),
          password: MD5(MD5(parameter.newPwd).toUpperCase()).toUpperCase()
        },
        method: "post",
        headers: {
          Authorization: parameter.authorization,
          ...headersObject
        }
      });
    }
  }
};
