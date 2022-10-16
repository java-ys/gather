import configureStore from './redux/store'
import { setUserInfo, setToken } from "./redux/user/user.action";
import { setMicroMenuRouteList, setLimitMenuData, setApplicationRoutes, setSubRouteData, setErrorStack } from "./redux/application/application.action"
import router from '@/router'
import mainAppRoutes from '@/router/routers'
import store from "@/store";
import Router from 'vue-router'
import _set from 'lodash.set'
import _get from 'lodash.get'
import { sortMenusForPathLen } from "./appUtils";
import Cookies from "js-cookie";
import config from "@/config/config";

const { TOKEN_KEY, microMenuRouteStorageKey, limitMenuDataStorageKey, microSubRouteStorageKey } = config;

function getStorageData(key, defaultData = {}) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultData
  } catch(e) {
    return defaultData
  }
}

const initState = {
  user: {
    token: Cookies.get(TOKEN_KEY) || '',
    userInfo: {},
  },
  application: {
    errorStack: [],
    microMenuRouteList: getStorageData(microMenuRouteStorageKey, []), // 子应用 fetch all menu.json
    limitMenuData: getStorageData(limitMenuDataStorageKey, {}), // 权限中心配置
    subRouteData: getStorageData(microSubRouteStorageKey, {}), // 子应用子路由缓存
    routes: [...mainAppRoutes]
  }
};

let sharedLocked = false

class MainAppShared {
  loadedMicroApps = []

  constructor(preloadedState = {}) {
    this.store = configureStore(preloadedState)
    sharedLocked = true
  }

  getMainAppRouter() {
    return router
  }

  getMainAppStore() {
    return store
  }

  getStore() {
    return this.store
  }

  getState() {
    return this.store.getState()
  }

  setMicroMenuRouteList(list) {
    const { dispatch } = this.store
    dispatch(setMicroMenuRouteList(JSON.parse(JSON.stringify(list)))) // Observer => 普通对象
  }

  setLimitMenuData(data) {
    const { dispatch } = this.store
    dispatch(setLimitMenuData(JSON.parse(JSON.stringify(data))))
  }


  setSubRouteData(patchList, microName) {
    const { dispatch, getState } = this.store
    const { application: { subRouteData } } = getState()
    const data = { ...subRouteData, ...{ [microName]: patchList }}
    dispatch(setSubRouteData(data))
    localStorage.setItem(config.microSubRouteStorageKey, JSON.stringify(data))
  }

  setErrorStack(error) {

  }

  logout() {
    const { dispatch } = this.store
    dispatch(setUserInfo({}))
    dispatch(setToken(''))
    dispatch(setMicroMenuRouteList([]))
    dispatch(setLimitMenuData({}))
    dispatch(setApplicationRoutes([]))
    dispatch(setSubRouteData({}))
  }

  getToken() {
    const { user } = this.store.getState()
    return user.token || ''
  }

  setToken(token) {
    const { dispatch } = this.store
    dispatch(setToken(token))
  }

  getUserInfo() {
    const { user } = this.store.getState()
    return user.userInfo || {}
  }

  async setUserInfo(data) {
    const { dispatch } = this.store
    // const data = await getUserInfo()
    dispatch(setUserInfo(data))
  }

  // todo patchRoutes({ routes }) https://umijs.org/zh-CN/docs/runtime-config#patchroutes-routes-
  /**
   *
   * @param names string[], name: string, 只能加到 children 下  ["opCenter", "vueApp"]
   * @param routes router[]
   * @param microName string // todo 支持传入数组
   */
  addRoutes(patchList, microName) {
    const { dispatch } = this.store
    if (~this.loadedMicroApps.indexOf(microName) || !microName) return

    this.setSubRouteData(patchList, microName)
    patchList.forEach(({ path, routes }) => {
      const { mountPath, searchRoutes } = MainAppShared._findRoute(path, mainAppRoutes)
      _set(mainAppRoutes, mountPath, [...searchRoutes, ...routes])
    })

    dispatch(setApplicationRoutes(mainAppRoutes))
    MainAppShared.patchRoutes({ routes: mainAppRoutes })
    this.loadedMicroApps.push(microName)
  }

  static _findRoute(path, routes) {
    let mountPath = []
    let searchRoutes = routes
    for (let i = 0; i < path.length; i++) {
      const idx = searchRoutes.findIndex(item => item.name === path[i])

      if (idx === -1) {
        console.error(`${path} 注册路径未找到`)
        return { path: [], list: [] }
      }

      mountPath.push(idx);
      if (searchRoutes[idx].children) {
        mountPath.push('children');
        searchRoutes = searchRoutes[idx].children
      }
    }

    return { mountPath, searchRoutes }

  }

  addMenuRoutes(patchList) {
    const { dispatch } = this.store

    let list = [ ...mainAppRoutes ]
    for (let i = 0; i < patchList.length; i++) {
      const path = MainAppShared._findMountPathForPatchRoute(patchList[i])
      const tmpList = _get(list, path) || []; // fix tmpList 为undefined
      _set(list, path, [ ...tmpList, ...patchList[i].routes ])
    }

    dispatch(setApplicationRoutes(list))
    MainAppShared.patchRoutes({ routes: list })

    return list
  }

  /**
   * @title 刷新时加载缓存路由
   * @param microNames Array<String>
   */
  addMemoRoutes({ menuRouteList, subRouteMap }) {
    const microNames = Object.keys(subRouteMap)
    this.loadedMicroApps = microNames // 记录已加载的子应用名
    const subRouteList = microNames.reduce((ret, name) => [...ret, ...subRouteMap[name]], []) // 构建子路由 List
    const patchList = sortMenusForPathLen([...menuRouteList, ...subRouteList]) // 合并菜单路由和子路由，进行排序

    this.addMenuRoutes(patchList)
  }

  static _findMountPathForPatchRoute(route) {
    const { path } = route

    let n = path.length
    let routePath = []
    let list = [ ...mainAppRoutes ]

    while (n > 0) {
      const name = path.shift()
      const idx = list.findIndex(item => item.name === name)
      if (idx === -1) { // todo 路径搜索断。
        console.log('break');
        break
      }
      routePath.push(idx, 'children')
      list = [ ...list[idx].children ]
      n--
    }

    return routePath.slice(0);
  }

  static patchRoutes({ routes }) {
    router.matcher = new Router({}).matcher; // https://blog.csdn.net/weixin_47783830/article/details/110232268
    console.log('@patchRoutes: ', routes);
    router.addRoutes(routes)
  }
}

const mainAppShared = new MainAppShared(initState)


export default mainAppShared
