import { supabase } from './supabase/supabaseClient';

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
  const { others, pinned, archives } = notes;
  let updatedOthers = { ...others };
  let updatedPinned = { ...pinned };
  let updatedArchives = { ...archives };

  if (updatedOthers.hasOwnProperty(id)) {
    const note = updatedOthers[id];
    delete updatedOthers[id];
    updatedArchives = { ...archives, [id]: note };
  } else {
    const note = updatedPinned[id];
    delete updatedPinned[id];
    updatedArchives = { ...archives, [id]: note };
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

  if (updatedOthers.hasOwnProperty(noteId)) {
    const updatedNote = {
      ...updatedOthers[noteId],
      metaData: {
        ...updatedOthers[noteId].metaData,
        backgroundColor: color,
      },
    };
    updatedOthers = { ...updatedOthers, [noteId]: updatedNote };
  } else if (updatedPinned.hasOwnProperty(noteId)) {
    const updatedNote = {
      ...updatedPinned[noteId],
      metaData: {
        ...updatedPinned[noteId].metaData,
        backgroundColor: color,
      },
    };
    updatedPinned = { ...updatedPinned, [noteId]: updatedNote };
  } else {
    const updatedNote = {
      ...updatedArchives[noteId],
      metaData: {
        ...updatedArchives[noteId].metaData,
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

async function deleteNoteFromTrash(id, setNotes) {
  setNotes((notes) => {
    const { trash } = notes;

    const updatedTrash = { ...trash };
    delete updatedTrash[id];

    return {
      ...notes,
      trash: updatedTrash,
    };
  });

  const fileName = `${id}`;
  await supabase.storage.from('note-images').remove([fileName]);
}

function handleUndoBtnClick(
  contentElem,
  undoStack,
  setUndoStack,
  setRedoStack
) {
  if (undoStack.length === 0) return;

  const textToPushToRedo = contentElem.current.innerText;
  contentElem.current.innerText = undoStack[undoStack.length - 1];
  const updatedUndoStack = [...undoStack];
  updatedUndoStack.pop();
  setUndoStack(updatedUndoStack);
  setRedoStack((redoStack) => {
    return [...redoStack, textToPushToRedo];
  });
}

function handleRedoBtnClick(
  contentElem,
  setUndoStack,
  redoStack,
  setRedoStack
) {
  if (redoStack.length === 0) return;

  const textToPushToUndo = contentElem.current.innerText;
  contentElem.current.innerText = redoStack[redoStack.length - 1];
  const updatedRedoStack = [...redoStack];
  updatedRedoStack.pop();
  setRedoStack(updatedRedoStack);
  setUndoStack((undoStack) => {
    return [...undoStack, textToPushToUndo];
  });
}

async function fetchUserNotes(user) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('notes')
      .eq('user_id', user.id)
      .limit(1)
      .single(1);
    if (error) {
      throw error;
    }
    return data.notes;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function updateNotesForUser(userId, updatedNotes) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({ notes: updatedNotes })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating notes:', error);
    return null;
  }
}

function updateNoteImageSource(id, notes, setNotes, publicUrl) {
  setNotes((notes) => {
    const { others, pinned, archives } = notes;
    let updatedOthers = { ...others };
    let updatedPinned = { ...pinned };
    let updatedArchives = { ...archives };

    if (others.hasOwnProperty(id)) {
      const updatedNote = {
        ...updatedOthers[id],
        image: {
          ...updatedOthers[id].image,
          publicUrl: publicUrl,
        },
      };
      updatedOthers = { ...updatedOthers, [id]: updatedNote };
    }

    if (pinned.hasOwnProperty(id)) {
      const updatedNote = {
        ...updatedPinned[id],
        image: {
          ...updatedPinned[id].image,
          publicUrl: publicUrl,
        },
      };
      updatedPinned = { ...updatedPinned, [id]: updatedNote };
    }

    if (archives.hasOwnProperty(id)) {
      const updatedNote = {
        ...updatedArchives[id],
        image: {
          ...updatedArchives[id].image,
          src: publicUrl,
        },
      };
      updatedArchives = { ...updatedArchives, [id]: updatedNote };
    }
    return {
      ...notes,
      others: updatedOthers,
      pinned: updatedPinned,
      archives: updatedArchives,
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
  handleUndoBtnClick,
  handleRedoBtnClick,
  fetchUserNotes,
  updateNotesForUser,
  updateNoteImageSource,
};
