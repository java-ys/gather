import config from "@/config/config"; // 为引入的配置文件
import { appEntryMap } from "./registerApp/appEntry"
// import axios from 'axios'
import { needAdaptRouters } from "./adaptRoutes";

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro

export const driverSubAppPath = (name, path) => `/driver-operation-admin`
  + `${name
    ? `/${name}`
    : name}`
  + `${path
    ? `/${path}`
    : path}`

export const excludeMenuList = ["configManage", "marketing", "fsManagement", "pay-platform", "website", "chargeCenter", "safe", "companyCenter", "boardCenter", "VIP-center", "hitch-center", "epidemic", "app-agreement", "three-platform", "automatic-drive", "revenue-settlement", "cash-desk"]

export const limitMenu = (limitMenuData) => {
  try {
    const list = limitMenuData.children || []
    const filterList = list.length ? list.filter(item => !~excludeMenuList.indexOf(item.identificationId)) : []
    return filterList
  } catch {
    return []
  }
}

export function list_to_tree(list) {
  let map = {};
  let node;
  let roots = [];
  let
    i;
  let
    hasXinchou = false;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
    delete list[i].childrenResourceList // 不要这个字段
    list[i].title = list[i].name
    list[i].name = list[i].route
    list[i].children = [];
    if (list[i].parentId === "22000" && String(list[i].id) === "56000") {
      hasXinchou = true
    }
  }
  if (hasXinchou) {
    // 营运管理的权限，如果有子菜单，父节点还不存在，就主动添加一个，
    // 薪酬从司管迁移过来做的特殊处理。
    if (!map["22000"]) {
      let permission = {
        "children": [],
        "systemId": "5",
        "code": "",
        "name": "opCenter",
        "route": "opCenter",
        "iconName": "",
        "title": "营运管理",
        "id": "22000",
        "sort": 22000,
        "type": 1,
        "parentId": "20000",
        "identificationId": "opCenter"
      }
      list.push(permission)
      map["22000"] = list.length - 1
    }
    if (!map["20000"]) {
      let p = {
        "children": [],
        "systemId": "5",
        "childrenResourceList": [],
        "code": "",
        "name": "",
        "route": "",
        "iconName": "",
        "title": "运营平台",
        "id": "20000",
        "sort": 20000,
        "type": 1,
        "parentId": "0",
        "identificationId": ""
      }
      list.push(p)
      map["20000"] = list.length - 1
    }
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.type === 2) continue // 过滤按钮
    if (node.parentId !== "0") {
      // 处理只有子菜单没有父级的时候
      // if (!list[map[node.parentId]]) continue
      if (!list[map[node.parentId]]) {
        continue
      }
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function sortMenusForPathLen(menus) {
  const arr = menus.map(menu => ({ data: menu, len: menu.path.length }))
    .sort((a, b) => a.len - b.len)
    .map(i => i.data)
  return arr
}


export const entryMenuList = Object.keys(appEntryMap).map(key => {
  const entry = appEntryMap[key]
  return entry ? `${entry}menu.json` : ""
}).filter(Boolean)

// export const entryMenuAsyncList = Object.keys(appEntryMap)
//   .map(key => {
//     const entry = appEntryMap[key]
//     return {
//       entry: entry ? `${entry}menu.json` : '',
//       name: key,
//     }
//   })
//   .filter(item => !!item.entry)
//   .map(item => {
//       return axios(item.entry)
//         .then(res => {
//           return {
//             res: res.data,
//             ...item,
//           }
//         })
//         .catch(e => {
//           console.error(item, e);
//           return {
//             res: [],
//             ...item,
//           }
//         });
//     }
//   )
export const genActiveRule = routerPrefix => location => location.hash.startsWith("#" + routerPrefix)

export const trackRoute = (to) => {
  if (to.meta.isMicroApp) trackMicroAppVisit(to)
}

const trackMicroAppVisit = (to) => {
  const { fullPath, path, meta, name } = to

  const microAppName = path.split("/").filter(Boolean)[0] || ""
  const trackParams = {
    fullPath,
    name,
    microAppName,
    ...meta,
  }

  console.log("@trackParams: ", trackParams);
}

export const adaptMicroAppGuards = (to, from, next, track = null) => {
  const { path, query, params } = to
  const route = needAdaptRouters.find(route => route.path === path)
  if (!route) {
    track && track(to)
    return next()
  }
  next({ name: route.name, query, params })
}
