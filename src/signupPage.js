import './signupPage.css';
import googleLogo from './logos/google.png';

export function SignupPage(props) {
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
          <div className="signupButton">Sign up</div>
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
