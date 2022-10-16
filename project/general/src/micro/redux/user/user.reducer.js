
import { handleActions } from 'redux-actions'
import * as types from './user.type'

const initState = {
  token: '',
  userInfo: {},
}

export const user = handleActions(
  {
    [types.SET_TOKEN]: (state, action) => ({...state, ...{ token: action.payload } }),
    [types.SET_USER_INFO]: (state, action) => ({...state, ...{ userInfo: action.payload } }),
  },
  initState
)
