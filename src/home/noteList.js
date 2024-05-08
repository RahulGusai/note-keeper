import { Note } from './note';
import { TrashNote } from './trashNote';
import { RiDeleteBin5Line } from 'react-icons/ri';
import './noteList.css';

export function NoteList(props) {
  const {
    notes,
    setNotes,
    setEditingNote,
    latestNoteId,
    selectedNoteIds,
    setSelectedNoteIds,
    defaultFooter,
    setDefaultFooter,
    setErrorMessage,
    notesListOptions,
    gridView,
  } = props;

  const { pinned, others, archives, trash } = notes;
  const notesClass = gridView ? 'notes gridView' : 'notes listView';
  const pinnedClass = gridView ? 'pinned' : 'pinned listView';
  const othersClass = gridView ? 'others' : 'others listView';

  if (notesListOptions.showArchives) {
    return (
      <div className="noteListContainer">
        <div className={notesClass}>
          {Object.values(archives).map((archive) => {
            return (
              <Note
                setEditingNote={setEditingNote}
                note={archive}
                selectedNoteIds={selectedNoteIds}
                setSelectedNoteIds={setSelectedNoteIds}
                notes={notes}
                setNotes={setNotes}
                defaultFooter={defaultFooter}
                setDefaultFooter={setDefaultFooter}
                setErrorMessage={setErrorMessage}
              ></Note>
            );
          })}
        </div>
      </div>
    );
  }

  if (notesListOptions.showTrash) {
    if (Object.keys(trash).length === 0) {
      return (
        <div className="emptyNotesContainer">
          <RiDeleteBin5Line className="emptyTrashIcon"></RiDeleteBin5Line>
          <div className="emptyTrashText">No notes in Trash</div>
        </div>
      );
    }

    return (
      <div className="noteListContainer">
        <div className={notesClass}>
          {Object.values(trash).map((trash) => {
            return (
              <TrashNote
                note={trash}
                selectedNoteIds={selectedNoteIds}
                setSelectedNoteIds={setSelectedNoteIds}
                notes={notes}
                setNotes={setNotes}
                defaultFooter={defaultFooter}
                setDefaultFooter={setDefaultFooter}
                setErrorMessage={setErrorMessage}
              ></TrashNote>
            );
          })}
        </div>
      </div>
    );
  }

  if (!others && !pinned) {
    return <></>;
  }

  return (
    <div className="noteListContainer">
      {Object.keys(pinned).length > 0 && (
        <div className={pinnedClass}>
          <div className="heading">PINNED</div>
          <div className={notesClass}>
            {Object.values(pinned).map((pinned) => {
              if (pinned.id === latestNoteId) {
                return <></>;
              }
              return (
                <Note
                  setEditingNote={setEditingNote}
                  note={pinned}
                  selectedNoteIds={selectedNoteIds}
                  setSelectedNoteIds={setSelectedNoteIds}
                  notes={notes}
                  setNotes={setNotes}
                  defaultFooter={defaultFooter}
                  setDefaultFooter={setDefaultFooter}
                  setErrorMessage={setErrorMessage}
                ></Note>
              );
            })}
          </div>
        </div>
      )}
      <div className={othersClass}>
        {Object.keys(pinned).length > 0 && (
          <div className="heading">OTHERS</div>
        )}
        <div className={notesClass}>
          {latestNoteId && (
            <Note
              setEditingNote={setEditingNote}
              note={others[latestNoteId]}
              selectedNoteIds={selectedNoteIds}
              setSelectedNoteIds={setSelectedNoteIds}
              notes={notes}
              setNotes={setNotes}
              defaultFooter={defaultFooter}
              setDefaultFooter={setDefaultFooter}
              setErrorMessage={setErrorMessage}
            ></Note>
          )}
          {Object.values(others).map((other) => {
            if (other.id === latestNoteId) {
              return <></>;
            }
            return (
              <Note
                setEditingNote={setEditingNote}
                note={other}
                selectedNoteIds={selectedNoteIds}
                setSelectedNoteIds={setSelectedNoteIds}
                notes={notes}
                setNotes={setNotes}
                defaultFooter={defaultFooter}
                setDefaultFooter={setDefaultFooter}
                setErrorMessage={setErrorMessage}
              ></Note>
            );
          })}
        </div>
      </div>
    </div>
  );
}
