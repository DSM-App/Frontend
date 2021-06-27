import {
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
} from './UserLoginTypes';
import history from '../../history';
import axiosInstance from '../../axios';

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

export const userLoginSuccess = (username) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: username,
  };
};

export const userLoginFailed = (errors) => {
  return {
    type: USER_LOGIN_FAILED,
    payload: errors,
  };
};

export const sendLoginData = (loginData) => {
  return (dispatch) => {
    dispatch(setLoadingTrue());
    console.log('dispatched set loading true');
    // send the data to server
    axiosInstance
      .post('auth/login/', loginData)
      .then((res) => {
        console.log('LOGIN SUCCESSFUL');
        // Login was successful - set the access and refresh tokens in localstorage
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        // Change the token in header of axiosInstance
        axiosInstance.defaults.headers['Authorization'] =
          'Bearer ' + localStorage.getItem('access_token');
        console.log('dispatching USER_LOGIN_SUCCESS');
        // Dispatch the login successful action
        dispatch(userLoginSuccess(loginData.username));
        // Redirect to the home page
        history.push('/');
        console.log('dispatching SET_LOADING_FALSE');
        // set the loading to false
        dispatch(setLoadingFalse());
      })
      .catch((error) => {
        console.log('ERROR Login = ', error.response);
        if (error.response) {
          console.log('DISPATCHING USER_LOGIN_FAILED with error message sent');
          // Dispatch the userSignupFailed action with the error message received
          dispatch(userLoginFailed(error.response.data));
        } else {
          console.log(
            'DISPATCHING USER_LOGIN_FAILED with custom error message',
          );
          // Dispatch the userSignupFailed event with custom error message
          var errorMessage = { otherField: 'Some error occured' };
          dispatch(userLoginFailed(errorMessage));
        }
        // Set the loading to false
        dispatch(setLoadingFalse());
      });
  };
};
