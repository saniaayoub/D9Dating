import {combineReducers} from 'redux';
import AppReducer from './AppReducer';

const rootReducer = combineReducers({
  reducer: AppReducer,
});

export default rootReducer;
