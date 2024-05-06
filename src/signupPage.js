import './signupPage.css';
import googleLogo from './logos/google.png';
import { useNavigate } from 'react-router-dom';

export function SignupPage(props) {
  const navigate = useNavigate();

  function handleSignupBtnClick() {
    navigate('/home');
  }

  return (
    <div className="signupPage">
      <div className="signupForm">
        <div className="emailSignup">
          <h3>Sign up to continue</h3>
          <input
            className="emailInput"
            type="textbox"
            placeholder="Enter your email"
          ></input>
          <div onClick={handleSignupBtnClick} className="signupButton">
            Sign up
          </div>
        </div>
        <div>Or continue with:</div>

        <div className="socialSignup">
          <div className="googleLogin">
            <img src={googleLogo} alt="googleLogo"></img>
            <span>Google</span>
          </div>
        </div>
        <div className="loginRedirect">
          Already have an NoteKeeper's account? Login
        </div>
      </div>
    </div>
  );
}
