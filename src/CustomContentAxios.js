import axios from 'axios';
import { BACKEND_URL } from './config';
import { store } from './redux/store';
import { setLoginFalse } from './redux';

const baseURL = BACKEND_URL;

//  An axios instance  with no content-type in header. It will be set automatically by axios

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 360000,
  transformRequest: [
    function (data, headers) {
      const accessToken = window.localStorage.getItem('access_token');
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      } else {
        delete headers.Authorization;
      }

      return JSON.stringify(data);
    },
  ],
});

// handling the expiry of access tokens through response interceptors

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    console.log(
      'Caught the error response. Here is your request  ',
      originalRequest,
    );

    // case 1: No error specified Most likely to be server error

    if (typeof error.response === 'undefined') {
      //  Uncomment this later
      alert('Server error occured');

      return Promise.reject(error);
    }

    //  case 2: Tried to refresh the token but it is expired. So ask user to login again

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + 'auth/api/token/refresh/'
    ) {
      alert('token refresh failed');
      store.dispatch(setLoginFalse());
      return Promise.reject(error);
    }

    // Case 3: Got 401 Unauthorized error. There are different possiblities
    console.log('Error message in axios = ', error.response.data);
    if (
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = localStorage.getItem('refresh_token');
      console.log('Refresh token = ', refreshToken);

      // See if refresh token exists
      // Some times undefined gets written in place of refresh token.
      // To avoid that we check if refreshToken !== "undefined". This bug is still unknown need to do more research on this

      if (refreshToken !== undefined && refreshToken !== 'undefined') {
        console.log(typeof refreshToken == 'undefined');
        console.log('Refresh token is present = ', refreshToken);
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        console.log(tokenParts.exp);

        // Case 3.a Refresh token is present and it is not expired - use it to get new access token

        if (tokenParts.exp > now) {
          return axiosInstance
            .post('auth/api/token/refresh/', { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem('access_token', response.data.access);

              axiosInstance.defaults.headers['Authorization'] =
                'Bearer ' + response.data.access;
              originalRequest.headers['Authorization'] =
                'Bearer ' + response.data.access;

              console.log('access token updated');

              // After refreshing the token request again user's previous url
              // which was blocked due to unauthorized error

              // I am not sure by default axios performs get request
              // But since we are passing the entire config of previous request
              // It seems to perform same request method as previous

              return axiosInstance(originalRequest);
            })

            .catch((err) => {
              // If any error occurs at this point we cannot guess what it is
              // So just console log it

              console.log(err);
            });
        } else {
          // Refresh token is expired ask user to login again.

          console.log('Refresh token is expired', tokenParts.exp, now);
          store.dispatch(setLoginFalse());
        }
      } else {
        // refresh token is not present in local storage so ask user to login again

        console.log('Refresh token not available.');
        store.dispatch(setLoginFalse());
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  },
);

export default axiosInstance;
