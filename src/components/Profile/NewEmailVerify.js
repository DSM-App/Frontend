import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import { FaTimesCircle } from 'react-icons/fa';
import axiosInstance from '../../axios';

function NewEmailVerify(props) {
  const { display, closeDisplay } = props;

  const [OTP, setOTP] = useState('');
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    if (success === true) {
      const closeOTPTimeout = setTimeout(() => {
        closeDisplay(false);
      }, 3000);
      return () => {
        clearTimeout(closeOTPTimeout);
      };
    }
  }, [success]);

  // function to handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .put('/users/profile/change-email-verify/', { token: OTP })
      .then((res) => {
        setSuccess(true);
        console.log(res);
      })
      .catch((err) => {
        setFailure(true);
        console.log(err);
      });
  };

  if (!display) {
    return <></>;
  }

  return (
    <div className='email-verify-overlay'>
      <div className='verify-email-container verify-container-center'>
        <FaTimesCircle
          className='verify-email-close-btn'
          onClick={() => closeDisplay(false)}
        />
        <h3>Enter the OTP sent to your email</h3>
        <h6>OTP will expire in 5 minutes</h6>
        {success && <p className='otp-success'>Email successfully verified</p>}
        {failure && <p className='otp-error'>Token not found</p>}
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
    </div>
  );
}

export default NewEmailVerify;
