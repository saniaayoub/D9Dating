import {SET_USER_TOKEN, SET_THEME} from './Constants';

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
