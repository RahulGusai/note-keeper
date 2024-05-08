import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { SignupPage } from './signupPage';
import { LoginPage } from './loginPage';
import { GuestLogin } from './guestLogin';
import App from './App';

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo != null) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      {isLoggedIn && <Navigate to="/home" />}
      <Routes>
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <App setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/signup" element={<SignupPage></SignupPage>} />
        <Route
          path="/guest"
          element={<GuestLogin setIsLoggedIn={setIsLoggedIn}></GuestLogin>}
        />
        <Route path="/" element={<LoginPage></LoginPage>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;