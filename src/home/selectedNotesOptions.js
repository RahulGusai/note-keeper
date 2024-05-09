import { IoCloseSharp } from 'react-icons/io5';
import { TbPinned } from 'react-icons/tb';
import { MdOutlineColorLens } from 'react-icons/md';
import { BiArchiveIn } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';

import './selectedNotesOptions.css';

export function SelectedNotesOptions(props) {
  const { selectedNoteIds, setSelectedNoteIds } = props;

  return (
    <div
      className={`${
        selectedNoteIds.size === 0
          ? 'selectedNotesOptions'
          : 'selectedNotesOptions active'
      }`}
    >
      <IoCloseSharp className="closeBarIcon"></IoCloseSharp>
      <div className="info">{`${selectedNoteIds.size} selected`}</div>
      <div className="noteOptions">
        <TbPinned></TbPinned>
        <MdOutlineColorLens></MdOutlineColorLens>
        <BiArchiveIn></BiArchiveIn>
        <CgMoreVerticalAlt></CgMoreVerticalAlt>
      </div>
    </div>
  );
}
