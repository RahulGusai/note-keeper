import { IoArrowBack } from 'react-icons/io5';

import './guestLogin.css';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export function GuestLogin(props) {
  const { setIsLoggedIn } = props;
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({
    nameInput: null,
  });

  function handleBackIconClick() {
    navigate('/');
  }

  function setUserinfoAndNotes() {
    localStorage.setItem(
      'userInfo',
      JSON.stringify({ isGuest: true, name: nameInputRef.current.value.trim() })
    );

    localStorage.setItem(
      'notes',
      JSON.stringify({ others: {}, pinned: {}, archives: {}, trash: {} })
    );
  }

  function handleLoginBtnClick() {
    if (nameInputRef.current.value.trim() === '') {
      setErrorMessages((errorMessages) => {
        return {
          ...errorMessages,
          nameInput: 'Enter the name to continue',
        };
      });
      nameInputRef.current.style.border = '2px solid red';
      return;
    }

    setUserinfoAndNotes();
    setIsLoggedIn(true);
  }

  return (
    <div className="guestLoginPage">
      <div className="loginForm">
        <IoArrowBack
          onClick={handleBackIconClick}
          className="backIcon"
        ></IoArrowBack>
        <div className="nameLogin">
          <h3>Enter your name to continue</h3>
          <div className="nameInput">
            <input ref={nameInputRef} type="textbox" placeholder="Name"></input>
            {errorMessages.nameInput && <span>{errorMessages.nameInput}</span>}
          </div>
          <div onClick={handleLoginBtnClick} className="loginButton">
            Login
          </div>
        </div>
      </div>
    </div>
  );
}
