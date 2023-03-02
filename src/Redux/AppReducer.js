import {SET_USER_TOKEN, SET_THEME, ADD_USERS} from './Constants';

const initialState = {
  userToken: null,
  theme: 'dark',
  users: [],
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TOKEN:
      return {
        ...state,
        userToken: action.payload,
      };
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case ADD_USERS:
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};

export default AppReducer;
