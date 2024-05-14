function countLines(htmlString) {
  const divs = htmlString.split('</div>');

  let totalLines = 0;
  for (const divStr of divs) {
    if (divStr.length > 0) {
      const stringWithNoTags = cleanDivString(divStr);
      totalLines += Math.ceil(Math.max(1, stringWithNoTags.length) / 30);
    }
  }
  return totalLines;
}

function cleanDivString(divStr) {
  let resultStr = '';
  let isTagOpen = false;
  for (let i = 0; i < divStr.length; i++) {
    if (isTagOpen) {
      if (divStr[i] === '>') {
        isTagOpen = false;
      }
      continue;
    }

    if (divStr[i] === '<') {
      isTagOpen = true;
      continue;
    }
    resultStr += divStr[i];
  }
  return resultStr;
}

function scaleHeightToValues(originalHeight) {
  const values = [200, 250, 300, 350, 400];

  if (originalHeight <= 250) {
    return values[0];
  } else if (originalHeight > 250 && originalHeight <= 2000) {
    return values[1];
  } else if (originalHeight > 2000 && originalHeight <= 4000) {
    return values[2];
  } else if (originalHeight > 4000 && originalHeight <= 6000) {
    return values[3];
  } else {
    return values[4];
  }
}

function getHeightClass(contentRef, image) {
  const numberOfLines = countLines(contentRef.current.innerHTML);

  const initialValue = 150;
  const multiplier = 50;
  const totalHeight = initialValue + Math.floor(numberOfLines / 3) * multiplier;
  console.log(totalHeight);

  if (image) {
    const aspectRatio = image.width / image.height;
    console.log(`Aspect Ratio - ${aspectRatio}`);

    const imgHeightForGridView = 250 / aspectRatio;
    const imgHeightForListView = 600 / aspectRatio;

    const heightForGridView =
      imgHeightForGridView >= 250
        ? totalHeight + imgHeightForGridView - 100
        : totalHeight + imgHeightForGridView;
    const heightForListView =
      imgHeightForListView >= 600
        ? totalHeight + imgHeightForListView - 200
        : totalHeight + imgHeightForListView - 50;

    const heightClassForGridView = `span-${Math.floor(heightForGridView / 50)}`;
    const heightClassForListView = `span-${Math.floor(heightForListView / 50)}`;

    return [heightClassForGridView, heightClassForListView];
  }

  const heightClass = `span-${Math.floor(totalHeight / 50)}`;
  console.log(heightClass);
  return [heightClass, heightClass];
}

function archiveNote(id, notes, setNotes) {
  let updatedOthers, updatedPinned;

  const { others, pinned, archives } = notes;
  let note;
  if (others.hasOwnProperty(id)) {
    note = others[id];
    updatedOthers = { ...others };
    delete updatedOthers[id];
    updatedPinned = { ...updatedPinned };
    console.log('DEBUG');
    console.log(note);
    console.log(updatedOthers);
  } else {
    note = pinned[id];
    updatedPinned = { ...pinned };
    delete updatedPinned[id];
    updatedOthers = { ...updatedOthers };
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
  const updatedOthers = { ...others, [id]: archives[id] };
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

export {
  scaleHeightToValues,
  getHeightClass,
  archiveNote,
  unArchiveNote,
  updateBackgroundColor,
};
