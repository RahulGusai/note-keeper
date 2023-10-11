import classes from './login.module.css';

export default function Login() {
  return (
    <div className={classes.outerContainer}>
      <div className={classes.loginContainer}>
        <h1>
          <strong>NoteKeeper</strong>
        </h1>
        <h4>Log in to continue</h4>
        <div className={classes.formContainer}>
          <input defaultValue=" Enter the email or mobile number" />
          <button>Continue</button>
        </div>
        <p>Or</p>
        <div className={classes.socialLoginContainer}>
          <button>Login with Gmail</button>
          <button>Login with Apple</button>
        </div>
        <div className={classes.loginHelpContainer}>
          <a>{`Can't log in?`}</a>
          <p>•</p>
          <a>Create an account</a>
        </div>
        <hr className={classes.lineBreak}></hr>
        <h2 className={classes.footerLogo}>LOGO</h2>
        <div className={classes.footerContainer}>
          <p>Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}
