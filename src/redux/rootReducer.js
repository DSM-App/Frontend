import { combineReducers } from 'redux';
import userSignupReducer from './UserSignup/UserSignupReducer';
import userLoginReducer from './UserLogin/UserLoginReducer';
import ProfileReducer from './Profile/ProfileReducer';
import UserProfileDataReducer from './UserProfileData/UserProfileDataReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createFilter } from 'redux-persist-transform-filter';

const rootReducer = combineReducers({
  userSignup: userSignupReducer,
  userLogin: userLoginReducer,
  profile: ProfileReducer,
  profileData: UserProfileDataReducer,
});

// Filter for saving userLogin
const saveUserLoginSubsetFilter = createFilter('userLogin', [
  'isLoggedIn',
  'username',
  'profile_pic',
]);

// Filter for saving userReducer
const saveUserSignupSubsetFilter = createFilter('userSignup', [
  'userData',
  'signupSuccess',
]);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSignup', 'userLogin', 'profileData'],
  transforms: [saveUserSignupSubsetFilter, saveUserLoginSubsetFilter],
};

export default persistReducer(persistConfig, rootReducer);
