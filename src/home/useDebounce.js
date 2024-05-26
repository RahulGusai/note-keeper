import { useEffect, useCallback } from 'react';
import { SelectedNotesOptions } from './selectedNotesOptions';

export default function useDebounce(
  searchInput,
  delay,
  notes,
  setFilteredNotes,
  setNotesListOptions
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
      setNotesListOptions((notesListOptions) => {
        return {
          ...notesListOptions,
          showFiltered: true,
        };
      });
    } else {
      setFilteredNotes({});
      setNotesListOptions((notesListOptions) => {
        return {
          ...notesListOptions,
          showFiltered: false,
        };
      });
    }
  }, [searchInput, notes, setFilteredNotes, setNotesListOptions]);

  useEffect(() => {
    const timeout = setTimeout(filterNotesCallback, delay);
    return () => clearTimeout(timeout);
  }, [filterNotesCallback, delay]);
}
