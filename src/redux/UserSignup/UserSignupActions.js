import {
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILED,
  USER_OTP_VERIFICATION_FAILED,
  USER_OTP_VERIFICATION_SUCCESS,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  CLEAR_SIGNUP_DATA,
} from './UserSignupTypes';
import axiosInstance from '../../axios';
import history from '../../history';

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

// when user successfully signs up we store his username and email
// because we will require this data during OTP verification

export const userSignupSuccess = (userData) => {
  return {
    type: USER_SIGNUP_SUCCESS,
    payload: userData,
  };
};

export const userSignupFailed = (error) => {
  return {
    type: USER_SIGNUP_FAILED,
    payload: error,
  };
};

export const sendUserSignupData = (signupData) => {
  return (dispatch) => {
    // set the loading to true
    dispatch(setLoadingTrue());

    // send the user ddata to server
    axiosInstance
      .post('auth/register/', signupData)
      .then((response) => {
        // user registration was successful save username and email for OTP verification

        const userDataSimplified = (({ username, email }) => ({
          username,
          email,
        }))(signupData);

        // The above line is a cool trick which picks only required properties from an object
        // and returns a new object with picked properties.

        // Dispatch the userSignupSuccess action

        dispatch(userSignupSuccess(userDataSimplified));

        // set loading to false - we need to do it here not outside because it is async process

        dispatch(setLoadingFalse());

        // Redirect the user to verify email page

        history.push('/verify-email');
        window.location.reload();
      })
      .catch((error) => {
        // If any error occurs we need to retrieve error message in a formatted way to later reflect it in the UI
        // error messages are present as key value pairs in error.response.data object

        if (error.response) {
          // Dispatch the userSignupFailed action with the error message received

          dispatch(userSignupFailed(error.response.data));
        } else {
          // Dispatch the userSignupFailed event with custom error message

          var errorMessage = { otherField: 'Some error occured' };
          dispatch(userSignupFailed(errorMessage));
        }

        // set loading to false

        dispatch(setLoadingFalse());
      });
  };
};

export const OTPVerificationSuccess = () => {
  return {
    type: USER_OTP_VERIFICATION_SUCCESS,
  };
};

export const OTPVerificationFailed = (error) => {
  return {
    type: USER_OTP_VERIFICATION_FAILED,
    payload: error,
  };
};

export const sendOTPData = (otpData) => {
  return (dispatch) => {
    // set the loading to true
    dispatch(setLoadingTrue());

    axiosInstance
      .post('auth/verify-email/', otpData)
      .then((data) => {
        console.log(data);
        history.push('/login');

        // Verification success
        dispatch(OTPVerificationSuccess());

        //Set the loading to false
        dispatch(setLoadingFalse());
      })
      .catch((error) => {
        if (error.response.data) {
          // Verification failed
          dispatch(OTPVerificationFailed(error.response.data));

          // set the loading to false
          dispatch(setLoadingFalse());
        } else {
          // set custom error message
          var errorMessage = 'Some error occured';

          // Dispatch the OTPVerification failed action
          dispatch(OTPVerificationFailed(errorMessage));

          // Set Loading to False
          dispatch(setLoadingFalse());
        }
      });
  };
};

// Signup data is useful only for OTP verification, So we need to clear it after successful
// OTP Verification or before a new signup attempt

export const clearSignupData = () => {
  return { type: CLEAR_SIGNUP_DATA };
};
