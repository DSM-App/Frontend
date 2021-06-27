import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { sendOTPData, clearSignupData } from '../../redux';
import OtpInput from 'react-otp-input';
import LoadingOverlay from 'react-loading-overlay';
import { useSelector } from 'react-redux';

function VerifyEmail(props) {
  // Destructuring the props
  let { loading, userData, OTPErrors, OTPSuccess, signupSuccess, sendOTPData } =
    props;

  let history = useHistory();
  useEffect(() => {
    if (OTPSuccess) {
      // clear the signup data as OTP verification completed

      clearSignupData();

      // Timeout for displaying the success messgae
      let successTimeout = setTimeout(() => {
        history.push('/login');
      }, 3000);
      return () => {
        clearTimeout(successTimeout);
      };
    }
  }, [OTPSuccess]);

  // If user is already logged in send him to the page from where he came from
  // TODO: There seems to be an issue, goBack may send back but the path may still persist in browser history so
  // may be need to use replace

  const { isLoggedIn } = useSelector((state) => state.userLogin);
  if (isLoggedIn) {
    history.goBack();
  }

  // user must have successfully signed up to see this page
  // Otherwise redirect him to sign up page

  if (!signupSuccess) {
    history.push('/register');
  }

  // State to sotre OTP entered by user
  const [OTP, setOTP] = useState('');

  // function to handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = {
      token: OTP,
      email: userData.email,
    };
    sendOTPData(formData);
  };

  return (
    <LoadingOverlay active={loading} spinner text={'Authenticating your data'}>
      <div className='verify-email-container'>
        <h3>Enter the OTP sent to your email</h3>
        <h6>OTP will expire in 5 minutes</h6>
        {OTPSuccess && (
          <p className='otp-success'>Email successfully verified</p>
        )}
        {OTPErrors && <p className='otp-error'>{OTPErrors}</p>}

        <form onSubmit={handleSubmit}>
          <OtpInput
            value={OTP}
            onChange={setOTP}
            numInputs={6}
            separator={<span>-</span>}
            containerStyle={'otp-container'}
            inputStyle={'otp-box'}
            isInputNum={true}
            shouldAutoFocus={true}
          />
          <button type='submit' className='submit-btn'>
            Submit
          </button>
        </form>
      </div>
    </LoadingOverlay>
  );
}

const mapStateToProps = (state) => {
  console.log('redux state = ');
  console.log(state);
  return {
    loading: state.userSignup.loading,
    userData: state.userSignup.userData,
    OTPErrors: state.userSignup.OTPErrors,
    OTPSuccess: state.userSignup.OTPSuccess,
    signupSuccess: state.userSignup.signupSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendOTPData: (formData) => dispatch(sendOTPData(formData)),
    clearSignupData: () => dispatch(clearSignupData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
