import './navBar.css';
import { CgMenu } from 'react-icons/cg';
import { IoRefreshSharp } from 'react-icons/io5';
import { MdOutlineViewAgenda } from 'react-icons/md';
import { RiSettings2Line } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

export function NavBar(props) {
  const {
    sidebarState,
    changeSidebarState,
    isSearchBarActive,
    setIsSearchBarActive,
  } = props;

  function handleSearchBarClick() {
    if (!isSearchBarActive) {
      setIsSearchBarActive(true);
    }
  }

  return (
    <div className="navBarContainer">
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
          style={{
            color: '#ffffff',
          }}
        />
      </div>
    </div>
  );
}
