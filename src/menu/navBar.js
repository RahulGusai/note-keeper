import './navBar.css';
import { CgMenu } from 'react-icons/cg';
import { IoRefreshSharp } from 'react-icons/io5';
import { MdOutlineViewAgenda } from 'react-icons/md';
import { RiSettings2Line } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';

export function NavBar(props) {
  const { sidebarState, changeSidebarState } = props;

  function onMenuIconClick() {
    changeSidebarState(!sidebarState);
  }

  return (
    <div className="navBarContainer">
      <div className="leftContainer">
        <CgMenu
          className="burgerMenuIcon"
          style={{
            color: '#ffffff',
          }}
        ></CgMenu>
        <div className="productName">NoteKeeper</div>
      </div>
      <div className="searchBar">
        <AiOutlineSearch
          className="searchIcon"
          style={{
            color: '#ffffff',
          }}
        />
        <input className="searchInput" placeholder="Search"></input>
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
