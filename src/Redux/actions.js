import {SET_USER_TOKEN, SET_THEME, ADD_USERS, SET_USER_DATA} from './Constants';

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

export const setUserData = value => {
  return {
    type: SET_USER_DATA,
    payload: value,
  };
};
