import { useState } from 'react';
import './loginPage.css';
import googleLogo from './logos/google.png';
import { PiDotOutlineFill } from 'react-icons/pi';

const loginBtnText = 'Continue';
export function LoginPage(props) {
  const [showPassword, setShowPassword] = useState(false);

  function handleLoginBtnClick() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="loginPage">
      <div className="loginForm">
        <div className="emailLogin">
          <h3>Login to continue</h3>
          <input type="textbox" placeholder="Enter your email"></input>
          <input
            className={showPassword ? 'passwordInput show' : 'passwordInput'}
            type="textbox"
            placeholder="Password"
          ></input>
          <div onClick={handleLoginBtnClick} className="loginButton">
            {loginBtnText}
          </div>
        </div>

        <div>Or continue with:</div>

        <div className="socialSignup">
          <div className="googleLogin">
            <img src={googleLogo} alt="googleLogo"></img>
            <span>Google</span>
          </div>
        </div>
        <div className="options">
          <span>Can’t login ?</span>
          <PiDotOutlineFill></PiDotOutlineFill>
          <span>Create a account </span>
        </div>
        <span className="guestAccount">Create a guest account </span>
        {/* <hr className="lineBreak"></hr> */}
      </div>
    </div>
  );
}
