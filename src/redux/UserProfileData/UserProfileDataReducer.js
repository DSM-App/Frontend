import {
  SET_USERNAME,
  SET_PROFILE_PIC_URL,
  CLEAR_PROFILE_DATA,
} from './UserProfileDataTypes';

const initialState = {
  username: '',
  profile_pic_url: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_PROFILE_PIC_URL:
      return { ...state, profile_pic_url: action.payload };
    case CLEAR_PROFILE_DATA:
      return {
        username: '',
        profile_pic_url: '',
      };
    default:
      return state;
  }
};

export default reducer;
