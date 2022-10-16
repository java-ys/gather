import { handleActions } from 'redux-actions'
import * as types from './application.type'

const initState = {
  errorStack: [],
  microMenuRouteList: [], // 子应用 fetch all menu.json
  limitMenuData: {}, // 权限中心配置
  subRouteData: {}, // 子路由缓存
  routes: []
}

export const application = handleActions(
  {
    [types.SET_ERROR_STACK]: (state, action) => ({...state, ...{ errorStack: action.payload } }),
    [types.SET_MICRO_MENU_ROUTE_LIST]: (state, action) => ({...state, ...{ microMenuRouteList: action.payload } }),
    [types.SET_LIMIT_MENU_DATA]: (state, action) => ({ ...state, ...{ limitMenuData: action.payload } }),
    [types.SET_SUB_ROUTE_DATA]: (state, action) => ({...state, ...{ subRouteData: action.payload } }),
    [types.SET_APPLICATION_ROUTERS]: (state, action) => ({...state, ...{ routes: action.payload } }),
},
  initState
)
