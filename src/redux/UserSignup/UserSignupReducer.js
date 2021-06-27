import {
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILED,
  USER_OTP_VERIFICATION_FAILED,
  USER_OTP_VERIFICATION_SUCCESS,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  CLEAR_SIGNUP_DATA,
} from './UserSignupTypes';

const initialState = {
  loading: false,
  userData: {},
  signupErrors: {},
  signupSuccess: false,
  OTPSuccess: false,
  OTPErrors: '',
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
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        signupSuccess: true,
        signupErrors: {},
        userData: action.payload,
        OTPErrors: '',
      };
    case USER_SIGNUP_FAILED:
      return {
        ...state,
        signupSuccess: false,
        signupErrors: action.payload,
      };
    case USER_OTP_VERIFICATION_SUCCESS:
      return {
        ...state,
        OTPSuccess: true,
        OTPErrors: '',
      };
    case USER_OTP_VERIFICATION_FAILED:
      return {
        ...state,
        OTPErrors: action.payload,
      };
    case CLEAR_SIGNUP_DATA:
      return {
        loading: false,
        userData: {},
        signupErrors: {},
        signupSuccess: false,
        OTPSuccess: false,
        OTPErrors: '',
      };
    default:
      return state;
  }
};

export default reducer;
