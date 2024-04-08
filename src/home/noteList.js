import { Note } from './note';
import './noteList.css';

export function NoteList(props) {
  const { notes } = props;

  return (
    <div className="noteListContainer">
      {notes.map((note) => {
        return (
          <Note
            heightClass={note.heightClass}
            title={note.title}
            content={note.content}
          ></Note>
        );
      })}
    </div>
  );
}
