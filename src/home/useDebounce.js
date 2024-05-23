import { useEffect, useCallback } from 'react';

export default function useDebounce(
  searchInput,
  delay,
  notes,
  setFilteredNotes
) {
  const filterNotesCallback = useCallback(() => {
    if (searchInput.length > 0) {
      const { others, archives } = notes;
      let filteredNotes = {};

      Object.keys(others).forEach((id) => {
        const note = others[id];
        if (note.content.includes(searchInput)) {
          filteredNotes = { ...filteredNotes, [id]: note };
        }
      });

      Object.keys(archives).forEach((id) => {
        const note = archives[id];
        if (note.content.includes(searchInput)) {
          filteredNotes = { ...filteredNotes, [id]: note };
        }
      });

      setFilteredNotes(filteredNotes);
    } else {
      setFilteredNotes({});
    }
  }, [searchInput, notes, setFilteredNotes]);

  useEffect(() => {
    const timeout = setTimeout(filterNotesCallback, delay);
    return () => clearTimeout(timeout);
  }, [filterNotesCallback, delay]);
}
