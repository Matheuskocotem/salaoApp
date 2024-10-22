
import React from 'react';
import { Route, Navigate } from 'react-router-dom';


const PrivateRoute = ({ element, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('token'); 

  return (
    <Route 
      {...rest}
      element={isLoggedIn ? element : <Navigate to="/login" />} 
    />
  );
};

export default PrivateRoute;
