import { Note } from './note';
import './noteList.css';

export function NoteList(props) {
  const { notes, setEditingNote } = props;

  return (
    <div className="noteListContainer">
      {Object.values(notes).map((note) => {
        return <Note setEditingNote={setEditingNote} note={note}></Note>;
      })}
    </div>
  );
}
