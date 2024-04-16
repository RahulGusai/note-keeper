import { Note } from './note';
import './noteList.css';

export function NoteList(props) {
  const {
    notes,
    setEditingNote,
    latestNoteId,
    selectedNoteIds,
    setSelectedNoteIds,
  } = props;

  return (
    <div className="noteListContainer">
      {latestNoteId && (
        <Note
          setEditingNote={setEditingNote}
          note={notes[latestNoteId]}
          selectedNoteIds={selectedNoteIds}
          setSelectedNoteIds={setSelectedNoteIds}
        ></Note>
      )}
      {Object.values(notes).map((note) => {
        if (note.id === latestNoteId) {
          return <></>;
        }
        return (
          <Note
            setEditingNote={setEditingNote}
            note={note}
            selectedNoteIds={selectedNoteIds}
            setSelectedNoteIds={setSelectedNoteIds}
          ></Note>
        );
      })}
    </div>
  );
}
