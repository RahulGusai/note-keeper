import './guestLogin.css';

export function GuestLogin() {
  return (
    <div className="guestLoginPage">
      <div className="loginForm">
        <div className="nameLogin">
          <h3>Enter your name to continue</h3>
          <input type="textbox" placeholder="Name"></input>
          <div className="loginButton">Login</div>
        </div>
      </div>
    </div>
  );
}
