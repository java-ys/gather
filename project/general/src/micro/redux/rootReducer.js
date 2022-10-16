import { combineReducers } from 'redux';
import { user } from './user/user.reducer';
import { application } from './application/application.reducer';

const rootReducer = () => combineReducers({ user, application });

export default rootReducer;
