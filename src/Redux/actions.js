import {
  SET_USER_TOKEN,
  SET_THEME,
  ADD_USERS,
  LOCATION,
  DATE,
  SET_USER_DATA,
  SET_GROUP,
  POST_LOCATION
} from './Constants';

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
export const setLocation = value => {
  return {
    type: LOCATION,
    payload: value,
  };
};
export const setDate = value => {
  return {
    type: DATE,
    payload: value,
  };
};

export const setUserData = value => {
  return {
    type: SET_USER_DATA,
    payload: value,
  };
};

export const setGroup = value => {
  return {
    type: SET_GROUP,
    payload: value,
  };
};

export const setPostLocation = value => {
  return {
    type: POST_LOCATION,
    payload: value,
  };
};
