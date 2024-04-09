import { Note } from './note';
import './noteList.css';

export function NoteList(props) {
  const { notes, setEditingNote } = props;

  return (
    <div className="noteListContainer">
      {notes.map((note) => {
        return (
          <Note
            setEditingNote={setEditingNote}
            heightClass={note.heightClass}
            title={note.title}
            content={note.content}
          ></Note>
        );
      })}
    </div>
  );
}
