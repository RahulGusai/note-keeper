import classes from './note.module.css';

export function Note(props) {
  const { height } = props;
  console.log('Height received by props');
  console.log(height);
  return (
    <div
      style={{ '--custom-height': `${height}px` }}
      className={classes.noteContainer}
    ></div>
  );
}
