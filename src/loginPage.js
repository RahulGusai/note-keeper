import { useState } from 'react';
import './loginPage.css';
import googleLogo from './logos/google.png';
import { PiDotOutlineFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/guestLoginBackground.jpg';

const loginBtnText = 'Continue';
export function LoginPage(props) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleLoginBtnClick() {
    setShowPassword(!showPassword);
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
            className="emailInput"
            type="textbox"
            placeholder="Enter your email"
          ></input>
          <input
            className={showPassword ? 'passwordInput show' : 'passwordInput'}
            type="textbox"
            placeholder="Password"
          ></input>
          <div onClick={handleLoginBtnClick} className="loginButton">
            {loginBtnText}
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
