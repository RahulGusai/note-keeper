import './signupPage.css';
import googleLogo from './logos/google.png';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/guestLoginBackground.jpg';
import { IoArrowBack } from 'react-icons/io5';
import { supabase } from './supabase/supabaseClient';
import { useRef, useState } from 'react';
import { Circles } from 'react-loader-spinner';
import PasswordStrengthBar from 'react-password-strength-bar';
import { fetchUserNotes } from './utils';

export function SignupPage(props) {
  const { setUserDetails, setNotes } = props;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formNavigation, setFormNavigation] = useState({
    viewOne: true,
    viewTwo: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    emailInput: null,
    signUp: null,
  });
  const [validEmailAddr, setValidEmailAddr] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState('');

  const formInputs = {
    emailInputRef: useRef(),
    fullNameInputRef: useRef(),
    pwdInputRef: useRef(),
  };

  async function handleContinueBtnClick(e) {
    e.preventDefault();

    if (formNavigation.viewOne) {
      if (!emailRegex.test(formInputs.emailInputRef.current.value)) {
        setErrorMessages((errorMessages) => {
          return {
            ...errorMessages,
            emailInput: 'Please enter a valid email address',
          };
        });
        return;
      }
      setFormNavigation((formNavigation) => {
        return {
          ...formNavigation,
          viewOne: false,
          viewTwo: true,
        };
      });
      setValidEmailAddr(formInputs.emailInputRef.current.value);

      return;
    }

    if (formNavigation.viewTwo) {
      setIsLoading(true);

      const user = await createNewUser();
      if (user) {
        const notes = await fetchUserNotes(user);
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
  }

  async function createNewUser() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: validEmailAddr,
        password: formInputs.pwdInputRef.current.value,
        options: {
          data: {
            full_name: formInputs.fullNameInputRef.current.value,
          },
        },
      });

      if (error) {
        throw error;
      }
      const { user } = data;
      return user;
    } catch (error) {
      setErrorMessages((errorMessages) => {
        return {
          ...errorMessages,
          signUp: error.message,
          emailInput: false,
        };
      });
      return null;
    }
  }

  function handleBackIconClick() {
    if (formNavigation.viewOne) navigate('/');
    if (formNavigation.viewTwo) {
      setErrorMessages((errorMessages) => {
        return {
          ...errorMessages,
          emailInput: null,
        };
      });
      setFormNavigation((formNavigation) => {
        return {
          ...formNavigation,
          viewOne: true,
          viewTwo: false,
        };
      });
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
    <div style={loginPageStyle} className="signupPage">
      <div className="signupForm">
        <IoArrowBack
          onClick={handleBackIconClick}
          className="backIcon"
        ></IoArrowBack>
        <div className="emailSignup">
          <h3>Create your free account</h3>
          {formNavigation.viewOne && (
            <div className="viewOneContainer">
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
          )}
          {formNavigation.viewTwo && (
            <div className="viewTwoContainer">
              <input
                ref={formInputs.fullNameInputRef}
                className="fullNameInput"
                type="textbox"
                placeholder="First and Last Name"
              ></input>

              <div className="passwordWrapper">
                <input
                  ref={formInputs.pwdInputRef}
                  className="pwdInput"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></input>
                <PasswordStrengthBar
                  password={password}
                  onChangeScore={setPasswordScore}
                  scoreWords={['weak', 'okay', 'good', 'strong']}
                  scoreWordStyle={{ color: '#fdf0e7' }}
                />
              </div>
            </div>
          )}
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
          {errorMessages.signUp && <span>{errorMessages.signUp}</span>}
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
