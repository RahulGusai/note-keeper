import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SignupPage } from './signupPage';
import { LoginPage } from './loginPage';
import App from './App';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<App></App>} />
        <Route path="/signup" element={<SignupPage></SignupPage>} />
        <Route path="/" element={<LoginPage></LoginPage>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
