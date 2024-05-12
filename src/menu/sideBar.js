import './sideBar.css';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { IoArchiveOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

export function SideBar(props) {
  const { isSidebarExpanded, setNotesListOptions } = props;

  function showArchives() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showArchives: true,
        showTrash: false,
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
        showArchives: false,
      };
    });
  }

  return (
    <div className="sideBarContainer">
      <div className="tab" onClick={showNotes}>
        <FaRegNoteSticky className="tabIcon"></FaRegNoteSticky>
        <div className={isSidebarExpanded ? 'tabText active' : 'tabText'}>
          Notes
        </div>
      </div>
      <div className="tab" onClick={showArchives}>
        <IoArchiveOutline className="tabIcon"></IoArchiveOutline>
        <div className={isSidebarExpanded ? 'tabText active' : 'tabText'}>
          Archive
        </div>
      </div>
      <div className="tab" onClick={showTrash}>
        <FaRegTrashAlt className="tabIcon"></FaRegTrashAlt>
        <div className={isSidebarExpanded ? 'tabText active' : 'tabText'}>
          Trash
        </div>
      </div>
    </div>
  );
}
