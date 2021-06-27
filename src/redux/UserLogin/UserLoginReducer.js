import {
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
} from './UserLoginTypes';

const initialState = {
  loading: false,
  isloggedIn: false,
  loginErrors: {},
  username: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING_TRUE:
      return {
        ...state,
        loading: true,
      };
    case SET_LOADING_FALSE:
      return {
        ...state,
        loading: false,
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        username: action.payload,
        loginErrors: {},
      };
    case USER_LOGIN_FAILED:
      return {
        ...state,
        isLoggedIn: false,
        loginErrors: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
