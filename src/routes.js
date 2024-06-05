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
import { fetchUserNotes } from './utils';

const AppRoutes = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [notes, setNotes] = useState(null);

  async function checkIfUserIsLoggedIn() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      const { user } = data;
      const notes = await fetchUserNotes(user);
      if (user && notes) {
        setUserDetails({
          id: user.id,
          fullName: user.user_metadata.full_name,
          isAnonymous: user.is_anonymous,
        });
        setNotes(notes);
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
