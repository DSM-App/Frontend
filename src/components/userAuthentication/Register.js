import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { sendUserSignupData } from '../../redux';
import { clearAllInformation } from '../../redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './Register.css';
import LoadingOverlay from 'react-loading-overlay';

import { Link } from 'react-router-dom';

function Register(props) {
  // Destructuring the props object
  const { loading, signupErrors, signupSuccess, sendUserSignupData } = props;

  let history = useHistory();

  // If the user is already logged in we don't him to access this page so we will redirect him back to home page

  // If user is logged in send him back to page where he came from

  const { isLoggedIn } = useSelector((state) => state.userLogin);
  if (isLoggedIn) {
    history.goBack();
  }

  // when signup is successful we will redirect user to the email verification page
  // But if user presses back button and comes back to signup page then we should not
  // redirect him again to email verification page. Because user may want to change some data

  // This is a big problem becuase we can't read previous path and we cannot naturally persist states between states
  // This might not be the best solution

  // We will clear the signup data from any previous attempts to be on safer side
  // We will do it only during page refreshes not during every component re-render

  useEffect(() => {
    clearAllInformation();
  }, []);

  // State to hold form data
  const initialFormData = Object.freeze({
    email: '',
    username: '',
    password: '',
    password2: '',
  });

  const [formData, updateFormData] = useState(initialFormData);

  // function to update the form state on user input
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  // function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // calling the wrapper function which dispatches the sendUserSignupData action
    sendUserSignupData(formData);
  };

  return (
    <LoadingOverlay active={loading} spinner text={'Authenticating your data'}>
      <div className='register-form register-container'>
        <h3 className='form-heading'>Sign up</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className='form-group'>
            <input
              type='text'
              name='username'
              className={`form-control ${
                signupErrors && signupErrors.username ? 'error-input' : null
              }`}
              value={formData['username']}
              onChange={handleChange}
              placeholder='Username'
            />
            {signupErrors && signupErrors.username ? (
              <p className='error-message'>{signupErrors.username}</p>
            ) : null}
          </div>
          <div className='form-group'>
            <input
              type='email'
              name='email'
              className={`form-control ${
                signupErrors && signupErrors.email ? 'error-input' : null
              }`}
              value={formData['email']}
              onChange={handleChange}
              placeholder='Email'
            />
            {signupErrors && signupErrors.email ? (
              <p className='error-message'>{signupErrors.email}</p>
            ) : null}
          </div>
          <div className='form-group'>
            <input
              type='password'
              name='password'
              className={`form-control ${
                signupErrors && signupErrors.password ? 'error-input' : null
              }`}
              value={formData['password']}
              onChange={handleChange}
              placeholder='Password'
            />
            {signupErrors && signupErrors.password ? (
              <p className='error-message'>{signupErrors.password}</p>
            ) : null}
          </div>
          <div className='form-group'>
            <input
              type='password'
              name='password2'
              className={`form-control ${
                signupErrors && signupErrors['non_field_errors']
                  ? 'error-input'
                  : null
              }`}
              value={formData['password2']}
              onChange={handleChange}
              placeholder='Re-enter password'
            />
            {signupErrors && signupErrors['non_field_errors'] ? (
              <p className='error-message'>
                {signupErrors['non_field_errors']}
              </p>
            ) : null}
          </div>
          <button type='submit' className='submit-btn'>
            submit
          </button>
        </form>
        <div className='register-message'>
          Already have an account{' '}
          <Link to='/login' className='link-text'>
            login
          </Link>
        </div>
      </div>
    </LoadingOverlay>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.userSignup.loading,
    signupErrors: state.userSignup.signupErrors,
    signupSuccess: state.userSignup.signupSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendUserSignupData: (formData) => dispatch(sendUserSignupData(formData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
