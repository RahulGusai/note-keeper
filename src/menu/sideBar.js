import './sideBar.css';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { IoArchiveOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

export function SideBar(props) {
  const { expanded, setNotesListOptions } = props;

  function showArchives() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showArchives: true,
      };
    });
  }

  function showNotes() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showArchives: false,
        showTrash: false,
      };
    });
  }

  function showTrash() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showTrash: true,
      };
    });
  }

  return (
    <div className="sideBarContainer">
      <div className="tab" onClick={showNotes}>
        <FaRegNoteSticky className="tabIcon"></FaRegNoteSticky>
        <div className={expanded ? 'tabText active' : 'tabText'}>Notes</div>
      </div>
      <div className="tab" onClick={showArchives}>
        <IoArchiveOutline className="tabIcon"></IoArchiveOutline>
        <div className={expanded ? 'tabText active' : 'tabText'}>Archive</div>
      </div>
      <div className="tab" onClick={showTrash}>
        <FaRegTrashAlt className="tabIcon"></FaRegTrashAlt>
        <div className={expanded ? 'tabText active' : 'tabText'}>Trash</div>
      </div>
    </div>
  );
}
