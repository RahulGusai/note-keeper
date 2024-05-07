import './navBar.css';
import { CgMenu } from 'react-icons/cg';
import { IoRefreshSharp } from 'react-icons/io5';
import { MdOutlineViewAgenda } from 'react-icons/md';
import { RiSettings2Line } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export function NavBar(props) {
  const { setIsLoggedIn } = props;
  const navigate = useNavigate();

  const {
    sidebarState,
    changeSidebarState,
    isSearchBarActive,
    setIsSearchBarActive,
  } = props;

  const [navBarOptions, setNavBarOptions] = useState({
    showUserProfileDialog: false,
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  function handleSearchBarClick() {
    if (!isSearchBarActive) {
      setIsSearchBarActive(true);
    }
  }

  function toggleUserProfileDialog() {
    setNavBarOptions((navBarOptions) => {
      return {
        ...navBarOptions,
        showUserProfileDialog: !navBarOptions.showUserProfileDialog,
      };
    });
  }

  function signOutUser() {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
  }

  return (
    <div className="navBarContainer">
      <div
        className={`${
          navBarOptions.showUserProfileDialog
            ? 'userProfileDialog show'
            : 'userProfileDialog'
        }`}
      >
        <div className="imageSection">
          <div className="image">
            <CgProfile
              className="profileIcon"
              style={{
                color: '#ffffff',
              }}
            />
            <MdEdit className="editIcon"></MdEdit>
          </div>

          <div className="name">{`Hi, ${userInfo.name}!`}</div>
        </div>
        <div className="userProfileOptions">
          <div onClick={signOutUser} className="signout">
            <IoLogOutOutline className="logo"></IoLogOutOutline>
            <span>Sign out</span>
          </div>
        </div>
      </div>
      <div className="leftContainer">
        <CgMenu
          className="burgerMenuIcon"
          style={{
            color: '#ffffff',
          }}
          onClick={() => changeSidebarState(!sidebarState)}
        ></CgMenu>
        <div className="productName">NoteKeeper</div>
      </div>
      <div
        className={isSearchBarActive ? 'searchBar active' : 'searchBar'}
        onClick={handleSearchBarClick}
      >
        <AiOutlineSearch
          className={isSearchBarActive ? 'searchIcon active' : 'searchIcon'}
        />
        <input className="searchInput" placeholder="Search"></input>
        <IoMdClose
          className={isSearchBarActive ? 'closeIcon active' : 'closeIcon'}
          onClick={() => setIsSearchBarActive(!isSearchBarActive)}
        ></IoMdClose>
      </div>

      <div className="rightContainer">
        <IoRefreshSharp
          className="reloadIcon"
          style={{
            color: '#ffffff',
          }}
        />
        <MdOutlineViewAgenda
          style={{
            color: '#ffffff',
          }}
        />
        <RiSettings2Line
          style={{
            color: '#ffffff',
          }}
        />
        <CgProfile
          onClick={toggleUserProfileDialog}
          style={{
            color: '#ffffff',
          }}
        ></CgProfile>
      </div>
    </div>
  );
}
