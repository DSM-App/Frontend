import React, { useContext } from 'react';
import { connect } from 'react-redux';

// This file contains all state store variables that will be useful throughout the application.
// Thuis component wraps the whole component tree and provides a context to use these varaibles

const AppContext = React.createContext();

const AppProvider = (WrappedComponent) => {
  return class HOC extends React.Component {
    render() {
      console.log('props = ', this.props);
      return (
        <AppContext.Provider value={{ isLoggedIn: 'hehe' }}>
          {/* <WrappedComponent /> */}
        </AppContext.Provider>
      );
    }
  };
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

// export default connect(mapStateToProps, null)(AppProvider);

export default AppProvider;
