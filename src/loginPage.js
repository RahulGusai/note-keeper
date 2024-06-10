import { useRef, useState } from 'react';
import './loginPage.css';
import googleLogo from './logos/google.png';
import { PiDotOutlineFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/guestLoginBackground.jpg';
import { supabase } from './supabase/supabaseClient';
import { Circles } from 'react-loader-spinner';
import { fetchUserNotes } from './utils';

export function LoginPage(props) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const { setUserDetails, setNotes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    emailInput: null,
    login: null,
  });
  const navigate = useNavigate();
  const formInputs = {
    emailInputRef: useRef(),
    pwdInputRef: useRef(),
  };

  async function handleContinueBtnClick() {
    if (!showPassword) {
      setShowPassword(!showPassword);
      return;
    }

    if (!emailRegex.test(formInputs.emailInputRef.current.value)) {
      setErrorMessages((errorMessages) => {
        return {
          ...errorMessages,
          emailInput: 'Please enter a valid email address',
          login: null,
        };
      });
      return;
    }

    setIsLoading(true);
    const user = await signInUser();
    const notes = await fetchUserNotes(user);
    if (user && notes) {
      setUserDetails({
        id: user.id,
        fullName: user.user_metadata.full_name,
        isAnonymous: user.is_anonymous,
      });
      setNotes(notes);
      setErrorMessages({ emailInput: null, login: null });
    }
    setIsLoading(false);
  }

  async function signInUser() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formInputs.emailInputRef.current.value,
        password: formInputs.pwdInputRef.current.value,
      });

      if (error) {
        throw error;
      }
      const { user } = data;
      return user;
    } catch (error) {
      setErrorMessages((errorMessage) => {
        return {
          ...errorMessage,
          login: error.message,
          emailInput: null,
        };
      });
      return null;
    }
  }

  function handleCreateAccountClick() {
    navigate('./signup');
  }

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log('error occured');
    }
  }

  const loginPageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
  };

  return (
    <div style={loginPageStyle} className="loginPage">
      <div className="loginForm">
        <div className="emailLogin">
          <h3>Login to continue</h3>
          <div className="inputWrapper">
            <input
              ref={formInputs.emailInputRef}
              className="emailInput"
              type="textbox"
              placeholder="Enter your email"
            ></input>
            {errorMessages.emailInput && (
              <span>{errorMessages.emailInput}</span>
            )}
          </div>
          <input
            ref={formInputs.pwdInputRef}
            className={showPassword ? 'passwordInput show' : 'passwordInput'}
            type="password"
            placeholder="Password"
          ></input>
          <div onClick={handleContinueBtnClick} className="continueButton">
            {!isLoading && <span>Continue</span>}
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
          {errorMessages.login && <span>{errorMessages.login}</span>}
        </div>

        <div className="separatorText">Or continue with:</div>

        <div className="socialSignup">
          <div onClick={signInWithGoogle} className="googleLogin">
            <img src={googleLogo} alt="googleLogo"></img>
            <span>Google</span>
          </div>
        </div>
        <div className="options">
          <span>Can’t login ?</span>
          <PiDotOutlineFill></PiDotOutlineFill>
          <span onClick={handleCreateAccountClick}>Create a account </span>
        </div>
        <span
          onClick={() => {
            navigate('./guest');
          }}
          className="guestAccount"
        >
          Create a guest account{' '}
        </span>
        {/* <hr className="lineBreak"></hr> */}
      </div>
    </div>
  );
}
