import React from 'react';
import './Navbar.css';
// import { FaHome } from 'react-icons/fa';
// import { FaUserCircle } from 'react-icons/fa';
// import { FaEnvelope } from 'react-icons/fa';
// import { FaUsers } from 'react-icons/fa';
// import { FaHeart } from 'react-icons/fa';

// Filled Icons import
import HomeIcon from '@material-ui/icons/Home';
import GroupIcon from '@material-ui/icons/Group';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';

import SearchIcon from '@material-ui/icons/Search';

//  Outline icons import
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';

import { FaSearch } from 'react-icons/fa';
import { FaChevronCircleDown } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { FaBirthdayCake } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from '../../config';

// Profile picture to display in nav links
function ProfilePicture({ path, profile_path, profile_pic_url }) {
  if (profile_pic_url) {
    return (
      <img
        src={`${BACKEND_URL}${profile_pic_url}`}
        className='nav-profile-pic'
      />
    );
  }
  if (path === profile_path) {
    return <AccountCircleIcon className='nav-icon' />;
  }
  return <AccountCircleOutlinedIcon className='nav-icon' />;
}

function Navbar() {
  const [searchBarFocussed, setSearchBarFoucssed] = useState(false); // State to track search bar focussed in Desktop
  const [searchBarMobileActive, setSearchBarMobileActive] = useState(false); // State to track search bar active in mobile
  const [displayLogo, setDisplayLogo] = useState(true); // State to add delay to display logo during search bar close animation in mobike
  const [searchInputValue, setSearchInputValue] = useState(''); // State to track search-bar input - same for desktop and mobile
  const [dropDownOpen, setDropDownOpen] = useState(false); // State to toggle the open and close of dropdown

  const searchRef = useRef(null); // Used to foces the search bar in laptop case when user clicks on placeholder div instead of search bar

  // We need to set a timeout before displaying the logo text when search bar is closed because the user
  // parent container was earlier displaying logo icon and it takes some time to for it to regain its original size
  // It avoids the immediate popping up of logo text when the parent container is not yet ready to accumulate it

  const { isLoggedIn } = useSelector((state) => state.userLogin);

  const { username, profile_pic_url } = useSelector(
    (state) => state.profileData,
  );

  let history = useHistory();

  console.log(isLoggedIn, username, profile_pic_url);

  useEffect(() => {
    if (searchBarMobileActive === false) {
      setDisplayLogo(false);
      let animationTime = 100;
      let animationTimeOut = setTimeout(() => {
        setDisplayLogo(true);
      }, animationTime);
      return () => {
        clearTimeout(animationTimeOut);
      };
    }
  }, [searchBarMobileActive]);

  // UseEffect to foces the searchbar when searchBarFocussed state is true
  // Because if the user clicks on placeholder div it is true but search input is not focuessed

  useEffect(() => {
    if (searchBarFocussed === true) {
      searchRef.current.focus();
    }
  }, [searchBarFocussed]);

  // We don't want to display Navbar on some pages let's check that condition here

  const location = useLocation();
  const path = location.pathname;

  if (
    path === '/login' ||
    path === '/register' ||
    path === '/verify-email' ||
    path === '/logout'
  ) {
    return <></>;
  }

  // If the user is not logged in redirect him to login page
  // It is important to write this code after the first return statement
  // Since the navbar is always rendered it will continuously redirect to '/login leading to
  // maximum recursion depth exceeded.

  if (typeof isLoggedIn == 'undefined' || !isLoggedIn) {
    history.push('/login');
  }
  return (
    <>
      <nav>
        {/* Navbar container */}
        <div className='nav-container'>
          {/* logo */}
          <div className={`logo ${searchBarMobileActive ? 'logo-icon' : ''}`}>
            <h4>
              {displayLogo &&
                (searchBarMobileActive ? <FaBirthdayCake /> : 'The Navbar')}
            </h4>
          </div>

          {/* Search bar for laptops and tablets */}
          <div className='search-bar'>
            <form className='search-form'>
              <input
                type='text'
                className='search-input'
                onFocus={() => setSearchBarFoucssed(true)}
                onBlur={() => {
                  setSearchBarFoucssed(false);
                  setSearchInputValue(''); // clear the search input field when it is blurred
                }}
                ref={searchRef}
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
              {/* placeholder icon and text for animation */}

              {/* When we click on placeholder div, search input is not focussed by 
                  default it just sets the searchBarFocussed state to be true. So we need to focus it using ref in this case   */}

              <div
                className={`search-placeholder-container ${
                  searchBarFocussed ? 'search-placeholder-active' : ''
                }`}
                onClick={() => setSearchBarFoucssed(true)}
              >
                <FaSearch className='search-icon' />
                <span
                  className={`placeholder-text ${
                    searchBarFocussed ? 'placeholder-text-active' : ''
                  }`}
                >
                  Search
                </span>
              </div>
              <button type='submit' className='search-submit-button'></button>
            </form>
          </div>

          {/* Navigation links mobile - separate flexbox for searchbar and dropdown in mobile view */}
          <ul className='nav-links-mobile'>
            <li
              className={`nav-icon-container ${
                searchBarMobileActive ? 'search-container-mobile' : ''
              }`}
            >
              <Link to='/' className='nav-link'>
                <div
                  className={`search-bar-mobile ${
                    searchBarMobileActive ? 'search-bar-mobile-active' : ''
                  }`}
                >
                  <form className='search-form-mobile'>
                    <FaSearch
                      className={`nav-icon search-icon-mobile  ${
                        searchBarMobileActive ? 'search-icon-mobile-active' : ''
                      }`}
                      onClick={() => setSearchBarMobileActive(true)}
                    />

                    <FaTimesCircle
                      className={`search-close-button-mobile ${
                        searchBarMobileActive
                          ? 'search-close-button-mobile-active'
                          : ''
                      }`}
                      onClick={() => setSearchBarMobileActive(false)}
                    />
                    <input
                      type='text'
                      className={`search-input-mobile ${
                        searchBarMobileActive
                          ? 'search-input-mobile-active'
                          : ''
                      }`}
                      onBlur={() => {
                        setSearchBarMobileActive(false); // When the user clicks somewhere else ayay from search bar
                        setSearchInputValue(''); // we need to close the search bar and empty the input
                      }}
                      value={searchInputValue}
                      onChange={(e) => setSearchInputValue(e.target.value)}
                    />

                    <button
                      type='submit'
                      className='search-submit-button-mobile'
                    ></button>
                  </form>
                </div>
              </Link>
            </li>
            <li className='nav-icon-container'>
              <Link to='/' className='nav-link'>
                <FaChevronCircleDown className='nav-icon' />
              </Link>
            </li>
          </ul>

          {/* Navigation links  - Same for both laptop and mobike*/}
          {/* We need to keep track of the active icon to display it as filled */}
          {/* User may navigate directly by changing URL's instead of clicking buttons. */}
          {/* So we need to keep track of current path. Instead of adding event listeners to icons */}
          {/* Except for dropdown we add an event listener. Since it is not a page */}

          <ul className='nav-links'>
            <li className='nav-icon-container'>
              <Link to='/' className='nav-link'>
                {path === '/' ? (
                  <HomeIcon className='nav-icon' />
                ) : (
                  <HomeOutlinedIcon className='nav-icon' />
                )}
              </Link>
            </li>
            <li className='nav-icon-container'>
              <Link to='/messages' className='nav-link'>
                {path === '/messages' ? (
                  <EmailIcon className='nav-icon' />
                ) : (
                  <EmailOutlinedIcon className='nav-icon' />
                )}
              </Link>
            </li>
            <li className='nav-icon-container'>
              <Link to='/groups' className='nav-link'>
                {path === '/groups' ? (
                  <GroupIcon className='nav-icon' />
                ) : (
                  <GroupOutlinedIcon className='nav-icon' />
                )}
              </Link>
            </li>
            <li className='nav-icon-container'>
              <Link to='/activity' className='nav-link'>
                {path === '/activity' ? (
                  <FavoriteIcon className='nav-icon' />
                ) : (
                  <FavoriteBorderOutlinedIcon className='nav-icon' />
                )}
              </Link>
            </li>

            <li className='nav-icon-container'>
              <Link to={`/profile/${username}`} className='nav-link'>
                <ProfilePicture
                  path={path}
                  profile_path={`/profile/${username}`}
                  profile_pic_url={profile_pic_url}
                />
              </Link>
            </li>
            <li className='nav-icon-container drop-down'>
              <Link href='#' className='nav-link'>
                {dropDownOpen ? (
                  <ArrowDropDownCircleIcon
                    className='nav-icon'
                    onClick={() => setDropDownOpen(false)}
                  />
                ) : (
                  <ArrowDropDownCircleOutlinedIcon
                    className='nav-icon'
                    onClick={() => setDropDownOpen(true)}
                  />
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
