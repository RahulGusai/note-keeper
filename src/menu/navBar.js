import './navBar.css';
import MenuIcon from '@mui/icons-material/Menu';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export function NavBar(props) {
  const { sidebarState, changeSidebarState } = props;

  function onMenuIconClick() {
    changeSidebarState(!sidebarState);
  }

  return (
    <div className="navBarContainer">
      <div className="leftContainer">
        <MenuIcon
          className="burgerMenuIcon"
          onClick={onMenuIconClick}
        ></MenuIcon>
        <h2>NoteKeeper</h2>
      </div>
      <div className="rightContainer">
        <ViewStreamOutlinedIcon></ViewStreamOutlinedIcon>
        <DarkModeOutlinedIcon></DarkModeOutlinedIcon>
        <AccountCircleOutlinedIcon></AccountCircleOutlinedIcon>
      </div>
    </div>
  );
}
