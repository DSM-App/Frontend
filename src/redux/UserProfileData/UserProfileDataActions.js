import {
  SET_USERNAME,
  SET_PROFILE_PIC_URL,
  CLEAR_PROFILE_DATA,
} from './UserProfileDataTypes';

export const setUsername = (username) => {
  return {
    type: SET_USERNAME,
    payload: username,
  };
};

export const setProfilePicUrl = (profile_pic_url) => {
  return {
    type: SET_PROFILE_PIC_URL,
    payload: profile_pic_url,
  };
};

export const clearProfileData = () => {
  return {
    type: CLEAR_PROFILE_DATA,
  };
};
