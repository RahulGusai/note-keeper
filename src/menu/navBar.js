import './navBar.css';
import { CgMenu } from 'react-icons/cg';
import { IoRefreshSharp } from 'react-icons/io5';
import { MdOutlineViewAgenda } from 'react-icons/md';
import { RiSettings2Line } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { CiGrid41 } from 'react-icons/ci';

export function NavBar(props) {
  const { setIsLoggedIn } = props;

  const {
    sidebarState,
    changeSidebarState,
    isSearchBarActive,
    setIsSearchBarActive,
    gridView,
    setGridView,
    setDefaultFooter,
    navBarOptions,
    setNavBarOptions,
  } = props;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  function handleNavBarContainerClick() {
    setDefaultFooter(true);
  }

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
        showSettingsDialog: false,
      };
    });
  }

  function toggleSettingsDialog() {
    setNavBarOptions((navBarOptions) => {
      return {
        ...navBarOptions,
        showUserProfileDialog: false,
        showSettingsDialog: !navBarOptions.showSettingsDialog,
      };
    });
  }

  function removeUserinfoAndNotes() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('notes');
  }
  function signOutUser() {
    // For guest login
    removeUserinfoAndNotes();
    setIsLoggedIn(false);
  }

  function switchView() {
    setGridView(!gridView);
  }

  return (
    <div onClick={handleNavBarContainerClick} className="navBarContainer">
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

      <div
        className={`${
          navBarOptions.showSettingsDialog
            ? 'settingsDialog show'
            : 'settingsDialog'
        }`}
      >
        <div>Disable Dark Theme</div>
        <div>Settings</div>
      </div>

      <div className="leftContainer">
        <div className="burgerMenuIcon">
          <CgMenu
            style={{
              color: '#ffffff',
            }}
            onClick={() => changeSidebarState(!sidebarState)}
          ></CgMenu>
        </div>
        <div className="productName">NoteKeeper</div>
      </div>
      <div
        className={isSearchBarActive ? 'searchBar active' : 'searchBar'}
        onClick={handleSearchBarClick}
      >
        <AiOutlineSearch
          className={isSearchBarActive ? 'searchIcon active' : 'searchIcon'}
        />
        <input disabled className="searchInput" placeholder="Search"></input>
        <IoMdClose
          className={isSearchBarActive ? 'closeIcon active' : 'closeIcon'}
          onClick={() => setIsSearchBarActive(!isSearchBarActive)}
        ></IoMdClose>
      </div>

      <div className="rightContainer">
        <div>
          <IoRefreshSharp
            className="reloadIcon"
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        {gridView && (
          <div>
            <MdOutlineViewAgenda
              onClick={switchView}
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        )}

        {!gridView && (
          <div>
            <CiGrid41
              onClick={switchView}
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        )}
        <div>
          <RiSettings2Line
            onClick={toggleSettingsDialog}
            style={{
              color: 'grey',
            }}
          />
        </div>
        <div>
          <CgProfile
            onClick={toggleUserProfileDialog}
            style={{
              color: '#ffffff',
            }}
          ></CgProfile>
        </div>
      </div>
    </div>
  );
}
