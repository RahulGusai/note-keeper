import { useEffect } from 'react';
import './errorDialog.css';

export function ErrorDialog(props) {
  const { errorMessage, setErrorMessage } = props;

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  }, [setErrorMessage]);

  return <div className="errorDialog">{errorMessage}</div>;
}
