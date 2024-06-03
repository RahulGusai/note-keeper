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
import { supabase } from './supabase/supabaseClient';

const AppRoutes = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [notes, setNotes] = useState(null);

  async function checkIfUserIsLoggedIn() {
    const authData = JSON.parse(
      localStorage.getItem('sb-xspfwwjrlszbhzewlxrr-auth-token')
    );
    if (!authData) return;

    const { access_token: accessToken } = authData;
    if (!accessToken) return;

    try {
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error) {
        throw error;
      }

      if (data) {
        const { user } = data;
        setUserDetails({ fullName: user.user_metadata.full_name });
        // TODO fetch the notes from the backend fo this user if non anonymous. Setting it to the default for now.
        setNotes({ others: {}, pinned: {}, archives: {}, trash: {} });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  return (
    <Router>
      {userDetails && <Navigate to="/home" />}
      <Routes>
        <Route
          path="/home"
          element={
            userDetails ? (
              <App
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                notes={notes}
                setNotes={setNotes}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              setUserDetails={setUserDetails}
              setNotes={setNotes}
            ></SignupPage>
          }
        />
        <Route
          path="/guest"
          element={
            <GuestLogin
              setUserDetails={setUserDetails}
              setNotes={setNotes}
            ></GuestLogin>
          }
        />
        <Route
          path="/"
          element={
            <LoginPage
              setUserDetails={setUserDetails}
              setNotes={setNotes}
            ></LoginPage>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
