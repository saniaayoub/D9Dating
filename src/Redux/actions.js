import {SET_USER_TOKEN, SET_THEME, ADD_USERS} from './Constants';

export const setUserToken = value => {
  return {
    type: SET_USER_TOKEN,
    payload: value,
  };
};

export const setTheme = value => {
  return {
    type: SET_THEME,
    payload: value,
  };
};

export const addUsers = value => {
  return {
    type: ADD_USERS,
    payload: value,
  };
};
