import './sideBar.css';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { IoArchiveOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

export function SideBar(props) {
  const {
    isSidebarExpanded,
    setNotesListOptions,
    setIsSidebarExpanded,
    setSelectedNoteIds,
  } = props;

  function showArchives() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showArchives: true,
        showTrash: false,
      };
    });
    setSelectedNoteIds(new Set());
  }

  function showNotes() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showArchives: false,
        showTrash: false,
      };
    });
    setSelectedNoteIds(new Set());
  }

  function showTrash() {
    setNotesListOptions((notesListOptions) => {
      return {
        ...notesListOptions,
        showTrash: true,
        showArchives: false,
      };
    });
    setSelectedNoteIds(new Set());
  }

  return (
    <div
      className="sideBarContainer"
      onMouseOver={() => {
        setIsSidebarExpanded(true);
      }}
      onMouseOut={() => {
        setIsSidebarExpanded(false);
      }}
    >
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
