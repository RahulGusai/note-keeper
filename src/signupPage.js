import './signupPage.css';
import googleLogo from './logos/google.png';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/guestLoginBackground.jpg';
import { IoArrowBack } from 'react-icons/io5';
import { supabase } from './supabase/supabaseClient';
import { useRef, useState } from 'react';
import { Circles } from 'react-loader-spinner';

export function SignupPage(props) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formNavigation, setFormNavigation] = useState({
    viewOne: true,
    viewTwo: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    emailInput: null,
  });
  const [validEmailAddr, setValidEmailAddr] = useState(null);

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
      console.log(user);
      setIsLoading(false);
      // TODO Do required state changes here
    }
  }

  async function createNewUser() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: validEmailAddr,
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
              <input
                ref={formInputs.pwdInputRef}
                className="pwdInput"
                type="password"
                placeholder="Enter your password"
              ></input>
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
