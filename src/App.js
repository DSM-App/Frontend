import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Register from './components/userAuthentication/Register';
import Login from './components/userAuthentication/Login';
import Logout from './components/userAuthentication/Logout';
import VerifyEmail from './components/userAuthentication/VerifyEmail';
import Home from './components/Home/Home';
import Profile from './components/Profile/ProfileCard';
import EditProfile from './components/Profile/EditProfile';
import AppProvider from './context';
import axiosInstance from './axios';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/profile/:username' component={Profile} />
        <Route path='/logout' component={Logout} />
        <Route path='/verify-email' component={VerifyEmail} />
        <Route path='/edit-profile' component={EditProfile} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
