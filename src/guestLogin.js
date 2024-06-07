import './guestLogin.css';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import backgroundImage from './images/guestLoginBackground.jpg';
import { IoArrowBack } from 'react-icons/io5';
import { supabase } from './supabase/supabaseClient';

export function GuestLogin(props) {
  const { setUserDetails, setNotes } = props;
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({
    nameInput: null,
    login: null,
  });

  function handleBackIconClick() {
    navigate('/');
  }

  async function createAnonymousUser() {
    try {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            full_name: nameInputRef.current.value,
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
          login: error.message,
          nameInput: null,
        };
      });
      return null;
    }
  }

  async function handleLoginBtnClick() {
    if (nameInputRef.current.value.trim() === '') {
      setErrorMessages((errorMessages) => {
        return {
          ...errorMessages,
          nameInput: 'Enter the name to continue',
          login: null,
        };
      });
      nameInputRef.current.style.border = '2px solid black';
      return;
    }

    const user = await createAnonymousUser();
    if (user) {
      const notes = { others: {}, pinned: {}, archives: {}, trash: {} };
      await supabase.from('notes').insert({ user_id: user.id, notes });
      setUserDetails({
        id: user.id,
        fullName: user.user_metadata.full_name,
        isAnonymous: user.is_anonymous,
      });
      setNotes(notes);
      setErrorMessages({ emailInput: null, login: null });
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
    <div style={loginPageStyle} className="guestLoginPage">
      <div className="guestLoginForm">
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
