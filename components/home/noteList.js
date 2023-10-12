import { Note } from './note';
import classes from './noteList.module.css';

export function NoteList() {
  return (
    <div className={classes.noteListContainer}>
      <Note height="300"></Note>
      <Note height="150"></Note>
      <Note height="150"></Note>
      <Note height="200"></Note>
      <Note height="250"></Note>
      <Note height="200"></Note>
      <Note height="150"></Note>
    </div>
  );
}
