<<<<<<< HEAD
import {SET_USER_TOKEN, SET_THEME, ADD_USERS, LOCATION, DATE} from './Constants';
=======
import {SET_USER_TOKEN, SET_THEME, ADD_USERS, SET_USER_DATA} from './Constants';
>>>>>>> a059102709fb9d24252df62ac22b855fe8909d85

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
}
export const setDate = value => {
  return {
    type: DATE,
    payload: value,
  };
}

export const setUserData = value => {
  return {
    type: SET_USER_DATA,
    payload: value,
  };
};
