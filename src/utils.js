function getContentToBeDisplayed(string) {
  const lines = string.split('\n');
  if (lines.length <= 24) {
    return string;
  }

  const truncatedString = lines.slice(0, 24).join('\n') + '...';
  return truncatedString;
}

function countLines(string) {
  return Math.min(24, string.split('\n').length);
}

function getHeightClass(contentRef, image) {
  const numberOfLines = Math.min(24, countLines(contentRef.current.innerText));

  let totalHeight = 0;
  const initialValue = 50;
  totalHeight = Math.max(101, initialValue + numberOfLines * 20);

  if (image) {
    const aspectRatio = image.width / image.height;

    const imgHeightForGridView = Math.floor(250 / aspectRatio);
    const imgHeightForListView = Math.floor(600 / aspectRatio);

    const heightForGridView =
      imgHeightForGridView >= 250
        ? totalHeight + imgHeightForGridView - 100
        : totalHeight + imgHeightForGridView;
    const heightForListView =
      imgHeightForListView >= 600
        ? totalHeight + imgHeightForListView - 200
        : totalHeight + imgHeightForListView - 200;

    const heightClassForGridView = `span-${Math.ceil(heightForGridView / 50)}`;
    const heightClassForListView = `span-${Math.ceil(heightForListView / 50)}`;

    return [heightClassForGridView, heightClassForListView];
  }

  const heightClass = `span-${Math.ceil(totalHeight / 50)}`;
  return [heightClass, heightClass];
}

function archiveNote(id, notes, setNotes) {
  let updatedOthers, updatedPinned;

  const { others, pinned, archives } = notes;
  let note;
  if (others.hasOwnProperty(id)) {
    updatedOthers = { ...others };
    note = updatedOthers[id];
    delete updatedOthers[id];
    updatedPinned = { ...pinned };
  } else {
    updatedPinned = { ...pinned };
    note = updatedPinned[id];
    delete updatedPinned[id];
    updatedOthers = { ...others };
  }
  const updatedArchives = { ...archives, [id]: note };

  setNotes((notes) => {
    return {
      ...notes,
      others: updatedOthers,
      pinned: updatedPinned,
      archives: updatedArchives,
    };
  });
}

function unArchiveNote(id, notes, setNotes) {
  const { others, archives } = notes;
  const updatedArchives = { ...archives };
  const updatedOthers = { ...others, [id]: updatedArchives[id] };
  delete updatedArchives[id];

  setNotes((notes) => {
    return {
      ...notes,
      others: updatedOthers,
      archives: updatedArchives,
    };
  });
}

function updateBackgroundColor(noteId, color, notes, setNotes) {
  const { others, pinned, archives } = notes;
  let updatedOthers = { ...others };
  let updatedPinned = { ...pinned };
  let updatedArchives = { ...archives };

  if (others.hasOwnProperty(noteId)) {
    const updatedNote = {
      ...others[noteId],
      metaData: {
        ...others[noteId].metaData,
        backgroundColor: color,
      },
    };
    updatedOthers = { ...updatedOthers, [noteId]: updatedNote };
  } else if (pinned.hasOwnProperty(noteId)) {
    const updatedNote = {
      ...pinned[noteId],
      metaData: {
        ...pinned[noteId].metaData,
        backgroundColor: color,
      },
    };
    updatedPinned = { ...updatedPinned, [noteId]: updatedNote };
  } else {
    const updatedNote = {
      ...archives[noteId],
      metaData: {
        ...archives[noteId].metaData,
        backgroundColor: color,
      },
    };
    updatedArchives = { ...updatedArchives, [noteId]: updatedNote };
  }

  setNotes((notes) => {
    return {
      ...notes,
      others: updatedOthers,
      pinned: updatedPinned,
      archives: updatedArchives,
    };
  });
}

function handleNoteClick(
  isSelected,
  selectedNoteIds,
  setSelectedNoteIds,
  setEditingNote,
  setTrashEditingNote,
  note,
  isTrash = false
) {
  const { id, title, content, image, metaData } = note;

  if (isSelected) {
    setSelectedNoteIds((selectedNoteIds) => {
      const updatedSelectedNoteIds = new Set(selectedNoteIds);
      updatedSelectedNoteIds.delete(id);
      return updatedSelectedNoteIds;
    });
    return;
  }

  if (selectedNoteIds.size > 0) {
    setSelectedNoteIds((selectedNoteIds) => {
      const updatedSelectedNoteIds = new Set(selectedNoteIds);
      updatedSelectedNoteIds.add(note.id);
      return updatedSelectedNoteIds;
    });
    return;
  }

  if (isTrash) {
    setTrashEditingNote((trashEditingNote) => {
      return {
        ...trashEditingNote,
        id,
        title,
        content,
        image: image,
        metaData,
        defaultText: {
          title: false,
          content: false,
        },
      };
    });
  } else {
    setEditingNote((editingNote) => {
      return {
        ...editingNote,
        id,
        title,
        content,
        image: image,
        metaData,
        initialLoad: true,
        defaultText: {
          title: false,
          content: false,
        },
      };
    });
  }
}

function restoreNoteFromTrash(id, notes, setNotes) {
  const { others, trash } = notes;

  const updatedTrash = { ...trash };
  const note = updatedTrash[id];
  delete updatedTrash[id];

  const updatedOthers = { ...others, [id]: note };

  setNotes((notes) => {
    return {
      ...notes,
      others: updatedOthers,
      trash: updatedTrash,
    };
  });
}

function deleteNoteFromTrash(id, notes, setNotes) {
  const { trash } = notes;

  const updatedTrash = { ...trash };
  delete updatedTrash[id];

  setNotes((notes) => {
    return {
      ...notes,
      trash: updatedTrash,
    };
  });
}

export {
  getHeightClass,
  archiveNote,
  unArchiveNote,
  updateBackgroundColor,
  getContentToBeDisplayed,
  handleNoteClick,
  deleteNoteFromTrash,
  restoreNoteFromTrash,
};
