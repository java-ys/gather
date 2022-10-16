import { createAction } from 'redux-actions';
import {
  SET_ERROR_STACK,
  SET_LIMIT_MENU_DATA,
  SET_MICRO_MENU_ROUTE_LIST,
  SET_APPLICATION_ROUTERS,
  SET_SUB_ROUTE_DATA
} from "./application.type";

export const setErrorStack = createAction(SET_ERROR_STACK);
export const setMicroMenuRouteList = createAction(SET_MICRO_MENU_ROUTE_LIST);
export const setLimitMenuData = createAction(SET_LIMIT_MENU_DATA);
export const setSubRouteData = createAction(SET_SUB_ROUTE_DATA);
export const setApplicationRoutes = createAction(SET_APPLICATION_ROUTERS);
