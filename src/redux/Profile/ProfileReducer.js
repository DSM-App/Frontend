import {
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  FETCH_PROFILE_DATA_SUCCESS,
  FETCH_PROFILE_DATA_FAILED,
  CLEAR_PROFILE_DATA,
} from './ProfileTypes';

const initialState = {
  loading: true,
  profileData: {},
  errors: '',
  success: false,
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
    case FETCH_PROFILE_DATA_SUCCESS:
      return {
        ...state,
        profileData: action.payload,
        success: true,
        errors: '',
      };
    case FETCH_PROFILE_DATA_FAILED:
      return {
        ...state,
        success: false,
        errors: action.payload,
      };
    case CLEAR_PROFILE_DATA:
      return {
        loading: false,
        profileData: {},
        errors: '',
        success: false,
      };
    default:
      return state;
  }
};

export default reducer;
