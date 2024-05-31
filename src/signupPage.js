import './signupPage.css';
import googleLogo from './logos/google.png';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/guestLoginBackground.jpg';
import { IoArrowBack } from 'react-icons/io5';
import { supabase } from './supabase/supabaseClient';
import { useRef, useState } from 'react';
import { Circles } from 'react-loader-spinner';

export function SignupPage(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const formNavigation = useState({
    viewOne: true,
    viewTwo: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    emailInput: null,
  });

  const emailInputRef = useRef();

  async function handleSignupBtnClick(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailInputRef.current.value,
        password: 'rahul321',
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error.name);
      console.log(error.status);
      console.log(error.message);
      console.log(error);
    }
  }

  function handleBackIconClick() {
    navigate('/');
  }

  const loginPageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
  };

  return (
    <div style={loginPageStyle} className="signupPage">
      <div className="signupForm">
        <IoArrowBack
          onClick={handleBackIconClick}
          className="backIcon"
        ></IoArrowBack>
        <div className="emailSignup">
          <h3>Create your free account</h3>
          <div className="viewOneContainer">
            <input
              ref={emailInputRef}
              className="emailInput"
              type="textbox"
              placeholder="Enter your email"
            ></input>
            {errorMessages.emailInput && (
              <span>{errorMessages.emailInput}</span>
            )}
          </div>
          <div onClick={handleSignupBtnClick} className="signupButton">
            Continue
            <Circles
              height="30"
              width="80"
              color="#ad8260"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={isLoading}
            />
          </div>
        </div>

        <div className="separatorText">Or continue with:</div>

        <div className="socialSignup">
          <div className="googleLogin">
            <img src={googleLogo} alt="googleLogo"></img>
            <span>Google</span>
          </div>
        </div>
        <div
          onClick={() => {
            navigate('/');
          }}
          className="loginRedirect"
        >
          Already have an NoteKeeper's account? Login
        </div>
      </div>
    </div>
  );
}
