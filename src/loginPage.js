import { useRef, useState } from 'react';
import './loginPage.css';
import googleLogo from './logos/google.png';
import { PiDotOutlineFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/guestLoginBackground.jpg';
import { supabase } from './supabase/supabaseClient';
import { Circles } from 'react-loader-spinner';

export function LoginPage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    setIsLoading(true);
    const user = await signInUser();
    console.log(user);
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

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  function handleCreateAccountClick() {
    navigate('./signup');
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
          <input
            ref={formInputs.emailInputRef}
            className="emailInput"
            type="textbox"
            placeholder="Enter your email"
          ></input>
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
        </div>

        <div className="separatorText">Or continue with:</div>

        <div className="socialSignup">
          <div className="googleLogin">
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
