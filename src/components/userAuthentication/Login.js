import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { sendLoginData } from '../../redux';
import { Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function Login(props) {
  // Destructuring the props
  const { loading, isLoggedIn, loginErrors, sendLoginData } = props;

  // Object to hold form data
  const initialData = Object.freeze({
    username: '',
    password: '',
  });

  // Defining the state to hold form data
  const [formData, setFormData] = useState(initialData);

  let history = useHistory();

  // Function to handle state change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendLoginData(formData);
  };

  //  If user is already logged in send him back to page he came from

  if (isLoggedIn) {
    history.goBack();
  }

  return (
    <LoadingOverlay
      active={loading}
      spinner
      text={'Authenticating your data'}
      className='loading-ovverlay'
    >
      <div className='register-form register-container' onSubmit={handleSubmit}>
        <h3>Log in</h3>
        <form>
          <div className='form-group'>
            <input
              type='text'
              name='username'
              className={`form-control ${
                loginErrors && loginErrors.username ? 'error-input' : null
              }`}
              value={formData.username}
              onChange={handleChange}
              placeholder={'Username'}
            />
          </div>
          {loginErrors && loginErrors.username ? (
            <p className='error-message'>{loginErrors.username}</p>
          ) : null}

          <div className='form-group'>
            <input
              type='password'
              name='password'
              className='form-control'
              value={formData.password}
              onChange={handleChange}
              placeholder={'Password'}
              className={`form-control ${
                loginErrors && loginErrors.password ? 'error-input' : null
              }`}
            />
          </div>
          {loginErrors && loginErrors.password ? (
            <p className='error-message'>{loginErrors.password}</p>
          ) : null}

          <button type='submit' className='submit-btn'>
            Submit
          </button>
        </form>
        <div className='register-message'>
          Don't have an account{' '}
          <Link to='/register' className='link-text'>
            sign up
          </Link>
        </div>
      </div>
    </LoadingOverlay>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.userLogin.loading,
    isloggedIn: state.userLogin.isLoggedIn,
    loginErrors: state.userLogin.loginErrors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendLoginData: (formData) => dispatch(sendLoginData(formData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
