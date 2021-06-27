import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clearAllInformation } from '../../redux';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../axios';
import LoadingOverlay from 'react-loading-overlay';

function Logout() {
  // Logout needs to be done in three steps
  // 1. Send a request to logout endpoint in backend to blacklist the refresh token
  // 2. Clear the redux store to avoid its persistance in localStorage
  // 3. Clear the localStorage

  //  To keep it simple we directly use axios here instance of defining a redux action

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // 1.  Sending request to backend -
  // Need to run only once during re-renders so added in useEffect with empty dependency array

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .post('auth/logout/', { refresh: localStorage.getItem('refresh_token') })
      .then(() => {
        setSuccess(true);
        setLoading(false);

        // 2. Clear the redux store
        dispatch(clearAllInformation());

        // 3. Clear the Local Storage
        localStorage.clear();
      })
      .catch(() => {
        setSuccess(false);
        setLoading(false);
      });
  }, []);

  // TODO: We need to dedicate an app to clear actions in each redux state. It is saving back to localStorage from memory.

  if (loading) {
    return <h3>Loading</h3>;
  }
  return (
    <>
      {success ? (
        <div>
          <h3>You have been logged out</h3>
          <h5>Click here to login again</h5>
          <Link to={'/login'}>login</Link>
        </div>
      ) : (
        <h3>Logout Failed server error</h3>
      )}
    </>
  );
}

export default Logout;
