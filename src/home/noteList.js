import { Note } from './note';
import './noteList.css';

export function NoteList(props) {
  const {
    notes,
    setNotes,
    setEditingNote,
    latestNoteId,
    selectedNoteIds,
    setSelectedNoteIds,
  } = props;

  const { pinned, others } = notes;

  if (!others && !pinned) {
    return <></>;
  }

  return (
    <div className="noteListContainer">
      {Object.keys(pinned).length > 0 && (
        <div className="pinned">
          <div className="heading">PINNED</div>
          <div className="notes">
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
                ></Note>
              );
            })}
          </div>
        </div>
      )}
      <div className="others">
        {Object.keys(pinned).length > 0 && (
          <div className="heading">OTHERS</div>
        )}
        <div className="notes">
          {latestNoteId && (
            <Note
              setEditingNote={setEditingNote}
              note={others[latestNoteId]}
              selectedNoteIds={selectedNoteIds}
              setSelectedNoteIds={setSelectedNoteIds}
              notes={notes}
              setNotes={setNotes}
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
              ></Note>
            );
          })}
        </div>
      </div>
    </div>
  );
}
