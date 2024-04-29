import './sideBar.css';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { IoArchiveOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

export function SideBar(props) {
  const { expanded } = props;

  return (
    <div className="sideBarContainer">
      <div className="tab">
        <FaRegNoteSticky className="tabIcon"></FaRegNoteSticky>
        <div className={expanded ? 'tabText active' : 'tabText'}>Notes</div>
      </div>
      <div className="tab">
        <IoArchiveOutline className="tabIcon"></IoArchiveOutline>
        <div className={expanded ? 'tabText active' : 'tabText'}>Archive</div>
      </div>
      <div className="tab">
        <FaRegTrashAlt className="tabIcon"></FaRegTrashAlt>
        <div className={expanded ? 'tabText active' : 'tabText'}>Trash</div>
      </div>
    </div>
  );
}
