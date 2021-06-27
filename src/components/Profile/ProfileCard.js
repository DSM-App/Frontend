import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProfileData } from '../../redux';
import { useSelector, useDispatch } from 'react-redux';
import './ProfileCard.css';
import default_profile_pic from './default_profile_pic.png';
import CreateIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';

function Profile() {
  const { username } = useParams();

  const dispatch = useDispatch();

  const { loading, profileData, success, errors } = useSelector(
    (state) => state.profile,
  );

  useEffect(() => {
    dispatch(fetchProfileData(username));
  }, []);

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <div className='profile-container'>
      <div className='profile-card-container'>
        {/* Profile picture */}
        <div className='profile-pic-container'>
          {/* Icon to edit profile */}
          <div className='edit-profile-icon'>
            <Link to={'/edit-profile'}>
              <CreateIcon />
            </Link>
          </div>
          {profileData.profile_pic ? (
            <img
              src={profileData.profile_pic}
              alt='profile picture'
              className='profile-pic'
            />
          ) : (
            <img
              src={default_profile_pic}
              alt='profile picture'
              className='profile-pic'
            />
          )}
        </div>

        {/* Username and full name */}
        <div className='username-container'>
          <div className='username'>{profileData.user.username}</div>
          <div className='fullname'>
            {profileData.first_name} {profileData.last_name}
          </div>
        </div>

        <div className='bio-container'>
          <p className='bio-text'>{profileData.bio}</p>
        </div>

        {/* Count of followers and Posts */}
        <div className='follow-post-count-container'>
          <div className='follow-post-count-item'>
            <div className='count'>0</div>
            <div className='count-label'>posts</div>
          </div>
          <div className='follow-post-count-item'>
            <div className='count'>{profileData.number_of_followers}</div>
            <div className='count-label'>followers</div>
          </div>
          <div className='follow-post-count-item'>
            <div className='count'>{profileData.number_of_followings}</div>
            <div className='count-label'>following</div>
          </div>
        </div>
      </div>

      {/* Posts on profile page */}
      <div className='profile-posts'>Posts</div>
    </div>
  );
}

export default Profile;
