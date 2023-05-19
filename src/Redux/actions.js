import {
  SET_USER_TOKEN,
  SET_THEME,
  ADD_USERS,
  ADD_SOCKET_USERS,
  LOCATION,
  DATE,
  SET_USER_DATA,
  SET_ORGANIZATION,
  POST_LOCATION,
  SET_STORIES,
  SET_EXIST,
  SET_STORYID,
  SET_STORY_COLOR,
  SET_FTOKEN,
} from './Constants';

export const setUserToken = value => {
  return {
    type: SET_USER_TOKEN,
    payload: value,
  };
};
export const setFToken = value => {
  return {
    type: SET_FTOKEN,
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

export const addSocketUsers = value => {
  return {
    type: ADD_SOCKET_USERS,
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

export const setOrganization = value => {
  return {
    type: SET_ORGANIZATION,
    payload: value,
  };
};

export const setPostLocation = value => {
  return {
    type: POST_LOCATION,
    payload: value,
  };
};
export const setStories = value => {
  return {
    type: SET_STORIES,
    payload: value,
  };
};

export const setExist = value => {
  return {
    type: SET_EXIST,
    payload: value,
  };
};

export const setStoryID = value => {
  return {
    type: SET_STORYID,
    payload: value,
  };
};

export const setStoryColor = value => {
  return {
    type: SET_STORY_COLOR,
    payload: value,
  };
};
