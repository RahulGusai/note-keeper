import classes from './navBar.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function NavBar(props) {
  return (
    <div className={classes.navBarContainer}>
      <div className={classes.leftContainer}>
        <MenuIcon className={classes.burgerMenuIcon}></MenuIcon>
        <h2>NoteKeeper</h2>
      </div>
      <div className={classes.rightContainer}>
        <ViewStreamIcon></ViewStreamIcon>
        <DarkModeIcon></DarkModeIcon>
        <AccountCircleIcon></AccountCircleIcon>
      </div>
    </div>
  );
}
