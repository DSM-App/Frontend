import axiosInstance from '../../axios';
import {
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  FETCH_PROFILE_DATA_SUCCESS,
  FETCH_PROFILE_DATA_FAILED,
  CLEAR_PROFILE_DATA,
} from './ProfileTypes';

export const setLoadingTrue = () => {
  return {
    type: SET_LOADING_TRUE,
  };
};

export const setLoadingFalse = () => {
  return {
    type: SET_LOADING_FALSE,
  };
};

export const fetchProfileDataSuccess = (profileData) => {
  return {
    type: FETCH_PROFILE_DATA_SUCCESS,
    payload: profileData,
  };
};

export const fetchProfileDataFailed = (error) => {
  return {
    type: FETCH_PROFILE_DATA_FAILED,
    payload: error,
  };
};

export const fetchProfileData = (username) => {
  return (dispatch) => {
    // Set loading true
    dispatch(setLoadingTrue());

    // Make the request
    axiosInstance
      .get(`/users/profile/${username}`)
      .then((response) => {
        dispatch(fetchProfileDataSuccess(response.data));
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(fetchProfileDataFailed(err.response));
        dispatch(setLoadingFalse());
      });
  };
};

export const clearProfileData = () => {
  return {
    type: CLEAR_PROFILE_DATA,
  };
};
