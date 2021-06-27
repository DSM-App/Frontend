import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import default_profile_pic from './default_profile_pic.png';
import { BACKEND_URL } from '../../config';
import axios from 'axios';
import NewEmailVerify from './NewEmailVerify';
import { setUsername, setProfilePicUrl } from '../../redux/index';
import { useSeletor, useDispatch, useSelector } from 'react-redux';

import './EditProfile.css';
import { AlternateEmailTwoTone } from '@material-ui/icons';

function ProfilePicUpload(props) {
  let { profile_pic } = props;

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();

  // We use the profile_pic from global redux store to show the new profile in update page
  // Otherwise new profile picture won't show up until we refresh the page

  let { profile_pic_url } = useSelector((state) => state.profileData);

  // if the profile picture exists we complete its relative URL by adding backend URL

  if (profile_pic_url) {
    profile_pic_url = `${BACKEND_URL}${profile_pic_url}`;
  }

  console.log('profile_pic_url = ', profile_pic_url);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(file);

    let formData = new FormData();
    formData.append('profile_pic', file, file.name);

    setLoading(true);
    axiosInstance
      .put('http://127.0.0.1:8000/users/profile-pic-upload/', formData)
      .then((res) => {
        console.log(res);
        // Update the global redux store for new profile URL to show new profile picture without refreshing the page
        dispatch(setProfilePicUrl(res.data.profile_pic));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(err);
      });
  };

  if (loading) {
    return <h3>Loading</h3>;
  }
  return (
    <div className='profile-info-update-container'>
      <form className='profile-info-update-form' onSubmit={handleSubmit}>
        <h4 className='form-heading'> Update your profile picture</h4>
        <div className='form-group'>
          <div className='form-label profile-pic-label'>
            <img
              src={profile_pic_url ? profile_pic_url : default_profile_pic}
              className='profile-pic-update-display'
            />
          </div>
          <div className='form-control profile-pic-upload-field'>
            <label className='custom-file-upload'>
              <input
                type='file'
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              Change your profile picture
            </label>
          </div>
        </div>
        <button type='submit' className='submit-btn'>
          Upload file
        </button>
      </form>
    </div>
  );
}

function ProfileInfoUpdate(props) {
  // This component holds form for updation of non-critical fields which does not require any validation

  const [loading, setLoading] = useState(false);

  const {
    first_name,
    last_name,
    bio,
    user: { username },
  } = props;

  console.log('username = ', username);

  const [formData, setFormData] = useState({
    first_name: first_name,
    last_name: last_name,
    bio: bio,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    console.log('submitting ', formData);
    axiosInstance
      .put(`/users/profile/${username}/`, formData)
      .then((res) => {
        setLoading(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert('error occured while submitting profile data');
      });
  };

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <div className='profile-info-update-container'>
      <form className='profile-info-update-form' onSubmit={handleSubmit}>
        <h4 className='form-heading'>Update your profile information</h4>
        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='first_name'>First Name</label>
          </div>
          <div className='form-control'>
            <input
              type='text'
              name='first_name'
              className='form-input'
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='last_name'>Last Name</label>
          </div>
          <div className='form-control'>
            <input
              type='text'
              name='last_name'
              className='form-input'
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='bio'>Bio</label>
          </div>
          <div className='form-control'>
            <textarea
              name='bio'
              className='form-input bio'
              rows={'2'}
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <button type='submit' className='submit-btn'>
          Submit
        </button>
      </form>
    </div>
  );
}

function UsernameUpdate(props) {
  //  We don't need to refresh the page to see the new user data in form
  // Because it is already stored in the state it directly gets displayed
  // Anyhow we have to update the redux store username to update username in profile links

  const dispatch = useDispatch();
  const {
    user: { username },
  } = props;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    new_username: username,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .put('/users/profile/change-username/', formData)
      .then((res) => {
        setLoading(false);
        //  response will not return the new username. So take it from the state itself.

        dispatch(setUsername(formData.new_username));
      })
      .catch((res) => {
        setLoading(false);
        alert('error occured while changing username');
      });
  };

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <div className='profile-info-update-container'>
      <form className='profile-info-update-form' onSubmit={handleSubmit}>
        <h4 className='form-heading'>Update your username</h4>
        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='username'>Username</label>
          </div>
          <div className='form-control'>
            <input
              type='text'
              name='new_username'
              className='form-input'
              value={formData.new_username}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type='submit' className='submit-btn'>
          Submit
        </button>
      </form>
    </div>
  );
}

function PasswordUpdate(props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.new_password != formData.new_password2) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);
    axiosInstance
      .put('/auth/change-password/', formData)
      .then((res) => {
        setLoading(false);
        console.log(res);
      })
      .catch((res) => {
        setLoading(false);
        alert('error occured while changing password');
      });

    setFormData({
      old_password: '',
      new_password: '',
      new_password2: '',
    });
  };

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <div className='profile-info-update-container'>
      <form className='profile-info-update-form' onSubmit={handleSubmit}>
        <h4 className='form-heading'>Update password</h4>
        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='username'>Old password</label>
          </div>
          <div className='form-control'>
            <input
              type='password'
              name='old_password'
              className='form-input'
              value={formData.old_password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='new_password'>New password</label>
          </div>
          <div className='form-control'>
            <input
              type='password'
              name='new_password'
              className='form-input'
              value={formData.new_password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-group'>
          <div className='form-label'>
            <label htmlFor='new_password2'>Confirm New Password</label>
          </div>
          <div className='form-control'>
            <input
              type='password'
              name='new_password2'
              className='form-input'
              value={formData.new_password2}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type='submit' className='submit-btn'>
          Submit
        </button>
      </form>
    </div>
  );
}

function EmailUpdate(props) {
  const {
    user: { email },
  } = props;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    new_email: email,
  });

  // success variable is to toggle the verify email modal

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .put('/users/profile/change-email-request/', formData)
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        console.log(res);
      })
      .catch((res) => {
        setLoading(false);
        setSuccess(false);
        alert('error occured while changing email');
      });
  };

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <>
      <NewEmailVerify display={success} closeDisplay={setSuccess} />
      <div className='profile-info-update-container'>
        <form className='profile-info-update-form' onSubmit={handleSubmit}>
          <h4 className='form-heading'>Update your email</h4>
          <div className='form-group'>
            <div className='form-label'>
              <label htmlFor='email'>Email</label>
            </div>
            <div className='form-control'>
              <input
                type='text'
                name='new_email'
                className='form-input'
                value={formData.new_email}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type='submit' className='submit-btn'>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

function EditProfile(props) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    setLoading(true);
    console.log("Making a new request to fetch user's data");
    axiosInstance
      .get('users/profile/detail-info/')
      .then((response) => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
        alert('error occured while fetching user data');
      });
  }, []);

  if (loading) {
    return <h3>Loading</h3>;
  }
  return (
    <div className='edit-profile-container'>
      <div className='form-heading'>
        <h4>Edit Profile</h4>
      </div>
      {/* Component for uploading profile picture */}
      <ProfilePicUpload
        profile_pic={
          profileData.profile_pic
            ? `${BACKEND_URL}${profileData.profile_pic}`
            : default_profile_pic
        }
      />
      <ProfileInfoUpdate {...profileData} />
      <UsernameUpdate {...profileData} />
      <PasswordUpdate />
      <EmailUpdate {...profileData} />
    </div>
  );
}

export default EditProfile;
