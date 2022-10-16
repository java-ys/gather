import { createAction } from 'redux-actions';
import { SET_TOKEN, SET_USER_INFO } from "./user.type";

export const setToken = createAction(SET_TOKEN);
export const setUserInfo = createAction(SET_USER_INFO);
