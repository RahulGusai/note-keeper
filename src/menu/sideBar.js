import './sideBar.css';
import { FaRegNoteSticky } from 'react-icons/fa6';

export function SideBar(props) {
  const { expanded } = props;

  return (
    <div className="sideBarContainer">
      <FaRegNoteSticky></FaRegNoteSticky>
    </div>
  );
}
