import { clearLoginInfo } from '../UserLogin/UserLoginActions';
import { clearSignupData } from '../UserSignup/UserSignupActions';

export const clearAllInformation = () => {
  return (dispatch) => {
    dispatch(clearSignupData());
    dispatch(clearLoginInfo());
  };
};
