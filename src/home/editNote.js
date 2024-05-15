import './editNote.css';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { archiveNote, updateBackgroundColor } from '../utils';
import { GiPlainCircle } from 'react-icons/gi';
import { MdInvertColorsOff } from 'react-icons/md';

function FunctionComponent(props, ref) {
  const {
    editingNote,
    setEditingNote,
    editNoteDefaultText,
    setEditNoteDefaultText,
    saveEditedNote,
    saveEditedNoteAsCopy,
    notes,
    setNotes,
    setErrorMessage,
    setLatestNoteId,
    gridView,
  } = props;

  const { titleElem, contentElem } = ref;

  const [backspaceStack, setBackspaceStack] = useState([]);
  const [backspaceText, setBackspaceText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [lastKeyPressTimestamp, setLastKeyPressTimestamp] = useState(null);
  const [footerOptions, setFooterOptions] = useState({
    showColorSelector: false,
    showMoreOptionsDialog: false,
  });

  const editNoteContainerRef = useRef(null);
  const imageUploadRef = useRef(null);
  const editingNoteImageRef = useRef(null);
  const { image, metaData } = editingNote;

  useEffect(() => {
    if (image) {
      if (gridView)
        editingNoteImageRef.current.style.maxHeight = `${image.maxHeightForGridView}px`;
      else
        editingNoteImageRef.current.style.maxHeight = `${image.maxHeightForListView}px`;
    }
  }, [gridView, image]);

  useEffect(() => {
    if (metaData.backgroundColor !== 'transparent') {
      editNoteContainerRef.current.style.border = 'none';
    } else {
      editNoteContainerRef.current.style.border = '1px solid grey';
    }
  }, [metaData]);

  useEffect(() => {
    editNoteContainerRef.current.style.backgroundColor =
      metaData.backgroundColor;
  }, [metaData]);

  useEffect(() => {
    if (editingNote) {
      const { title, content } = editingNote;

      if (content.length > 0) {
        contentElem.current.innerText = content;
      } else {
        contentElem.current.innerText = 'Note';
        setEditNoteDefaultText((editNoteDefaultText) => {
          return { ...editNoteDefaultText, content: true };
        });
      }

      if (title.length > 0) {
        titleElem.current.innerText = title;
      } else {
        titleElem.current.innerText = 'Title';
        setEditNoteDefaultText((editNoteDefaultText) => {
          return { ...editNoteDefaultText, title: true };
        });
      }
    }
  }, [contentElem, editingNote, setEditNoteDefaultText, titleElem]);

  function handleKeyPressedTitle(e) {
    if (
      !editNoteDefaultText.title &&
      titleElem.current.innerText.length === 0
    ) {
      titleElem.current.innerText = 'Title';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, title: true };
      });
    }
  }

  function handleKeyPressedContent(e) {
    if (lastKeyPressTimestamp && Date.now() - lastKeyPressTimestamp > 500) {
      setUndoStack((undoStack) => {
        return [...undoStack, currentText];
      });
      const updatedCurrentText =
        contentElem.current.innerText[contentElem.current.innerText.length - 1];
      setCurrentText(updatedCurrentText);
    } else {
      const updatedCurrentText =
        currentText +
        contentElem.current.innerText[contentElem.current.innerText.length - 1];
      setCurrentText(updatedCurrentText);
    }

    setLastKeyPressTimestamp(Date.now());

    if (
      !editNoteDefaultText.content &&
      contentElem.current.innerText.length === 0
    ) {
      contentElem.current.innerText = 'Note';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, content: true };
      });
    }
  }

  function clearDefaultInputTitle() {
    if (editNoteDefaultText.title) {
      titleElem.current.innerText = '';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, title: false };
      });
    }
  }

  function clearDefaultInputContent() {
    if (editNoteDefaultText.content) {
      contentElem.current.innerText = '';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, content: false };
      });
    }
  }

  function deleteImage() {
    setEditingNote((editingNote) => {
      return { ...editingNote, image: null };
    });
  }

  function undoText() {
    let updatedText;

    if (backspaceText.length > 0) {
      contentElem.current.innerText += backspaceText;
      setBackspaceText('');
      return;
    }

    if (backspaceStack.length > 0) {
      contentElem.current.innerText +=
        backspaceStack[backspaceStack.length - 1];
      setBackspaceStack((backspaceStack) => {
        const updatedBackspaceStack = [...backspaceStack];
        updatedBackspaceStack.pop();
        setBackspaceStack(updatedBackspaceStack);
      });
      return;
    }

    if (undoStack.length === 0) {
      contentElem.current.innerText = editingNote.content;
      return;
    }

    updatedText = editingNote.content;
    for (const text of undoStack) {
      updatedText += text;
    }
    contentElem.current.innerText = updatedText;

    setUndoStack((undoStack) => {
      const updatedUndoStack = [...undoStack];
      updatedUndoStack.pop();
      return updatedUndoStack;
    });
    setLastKeyPressTimestamp(null);
    setCurrentText('');
  }

  function redoText() {}

  function handleKeyDown(e) {
    if (e.key === 'Backspace') {
      if (lastKeyPressTimestamp && Date.now() - lastKeyPressTimestamp > 500) {
        setBackspaceStack((backspaceStack) => {
          return [...backspaceStack, backspaceText];
        });
        setBackspaceText(
          contentElem.current.innerText[
            contentElem.current.innerText.length - 1
          ]
        );
      } else {
        const updatedBackspaceText =
          contentElem.current.innerText[
            contentElem.current.innerText.length - 1
          ] + backspaceText;
        setBackspaceText(updatedBackspaceText);
      }
      setLastKeyPressTimestamp(Date.now());
    }
  }

  function processImage(event) {
    const file = event.target.files[0];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setErrorMessage(
        'Can’t upload this file. We accept GIF, JPEG, JPG, PNG files less than 10MB and 25 megapixels.'
      );
      return;
    }

    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(
        'Can’t upload this file. We accept GIF, JPEG, JPG, PNG files less than 10MB and 25 megapixels.'
      );
      return;
    }

    const maxResolutionMP = 25;
    const maxResolutionPixels = maxResolutionMP * 1000000;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      const resolution = img.width * img.height;
      if (resolution > maxResolutionPixels) {
        setErrorMessage(
          'Can’t upload this file. We accept GIF, JPEG, JPG, PNG files less than 10MB and 25 megapixels.'
        );
        return;
      }

      updateNotes(img);
      setEditingNote((editingNote) => {
        return {
          ...editingNote,
          image: img,
        };
      });
    };
  }

  function updateNotes(img) {
    const { id } = editingNote;
    let updatedOthers, updatedPinned;
    const { others, pinned } = notes;
    if (others.hasOwnProperty(id)) {
      const updatedNote = {
        ...others[id],
        image: { src: img.src, width: img.width, height: img.height },
      };
      updatedOthers = { ...others, [id]: updatedNote };
      updatedPinned = { ...updatedPinned };
    } else {
      const updatedNote = {
        ...pinned[id],
        image: { src: img.src, width: img.width, height: img.height },
      };
      updatedPinned = { ...pinned, [id]: updatedNote };
      updatedOthers = { ...updatedOthers };
    }

    setNotes((notes) => {
      return { ...notes, others: updatedOthers, pinned: updatedPinned };
    });
  }

  function handleArchiveButtonClick() {
    const { id } = editingNote;
    archiveNote(id, notes, setNotes);
    if (notes.others.hasOwnProperty(id)) {
      setLatestNoteId(null);
    }
    setEditingNote(null);
    setFooterOptions((footerOptions) => {
      return {
        ...footerOptions,
        showColorSelector: false,
      };
    });
  }

  function handleColorSelectorClick(color) {
    const { id } = editingNote;
    updateBackgroundColor(id, color, notes, setNotes);
    setEditingNote((editingNote) => {
      return {
        ...editingNote,
        metaData: {
          ...editingNote.metaData,
          backgroundColor: color,
        },
      };
    });
  }

  function toggleColorSelectorMenu() {
    setFooterOptions((footerOptions) => {
      return {
        ...footerOptions,
        showMoreOptionsDialog: false,
        showColorSelector: !footerOptions.showColorSelector,
      };
    });
  }

  function createNoteCopy() {
    saveEditedNoteAsCopy();
    setFooterOptions((footerOptions) => {
      return {
        ...footerOptions,
        showMoreOptionsDialog: false,
      };
    });
  }

  function deleteNote() {
    const { id } = editingNote;
    const { others, pinned, archives, trash } = notes;

    let note;
    const updatedOthers = { ...others };
    const updatedPinned = { ...pinned };
    const updatedArchives = { ...archives };

    if (others.hasOwnProperty(id)) {
      note = others[id];
      delete updatedOthers[id];
      setLatestNoteId(null);
    } else if (pinned.hasOwnProperty(id)) {
      note = pinned[id];
      delete updatedPinned[id];
    } else {
      note = archives[id];

      delete updatedArchives[id];
    }
    const updatedTrash = { ...trash, [id]: note };

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
        archives: updatedArchives,
        trash: updatedTrash,
      };
    });
    setEditingNote(null);
    setFooterOptions(() => {
      return {
        ...footerOptions,
        showMoreOptionsDialog: false,
      };
    });
  }

  function toggleMoreOptionsDialog() {
    setFooterOptions(() => {
      return {
        ...footerOptions,
        showColorSelector: false,
        showMoreOptionsDialog: !footerOptions.showMoreOptionsDialog,
      };
    });
  }

  function hideFooterOptions() {
    setFooterOptions(() => {
      return {
        ...footerOptions,
        showMoreOptionsDialog: false,
        showColorSelector: false,
      };
    });
  }

  function handleEditNoteContainerClick() {}

  return (
    <div
      onClick={handleEditNoteContainerClick}
      ref={editNoteContainerRef}
      className="editNoteOuterContainer"
    >
      <div className="editNoteContainer">
        <input
          ref={imageUploadRef}
          type="file"
          style={{ display: 'none' }}
          onChange={processImage}
        />

        {editingNote && editingNote.image && (
          <div className="imageContainer">
            <MdDelete
              onClick={deleteImage}
              className="deleteImageIcon"
            ></MdDelete>
            <img
              ref={editingNoteImageRef}
              className="image"
              src={editingNote.image.src}
              alt="noteImage"
            />
          </div>
        )}

        <div
          onClick={hideFooterOptions}
          contentEditable
          ref={titleElem}
          className="note-title"
          onKeyUp={handleKeyPressedTitle}
          onBeforeInput={clearDefaultInputTitle}
        ></div>
        <div
          onClick={hideFooterOptions}
          contentEditable
          ref={contentElem}
          className="note-content"
          onKeyUp={handleKeyPressedContent}
          onBeforeInput={clearDefaultInputContent}
          onKeyDown={handleKeyDown}
        ></div>
      </div>
      <div className="note-footer">
        <div
          className={
            footerOptions.showColorSelector
              ? 'colorSelector active'
              : 'colorSelector'
          }
        >
          <MdInvertColorsOff
            onClick={() => handleColorSelectorClick('transparent')}
          ></MdInvertColorsOff>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#77172e')}
            style={{ color: '#77172e' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#692b17')}
            style={{ color: '#692b17' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#7c4a03')}
            style={{ color: '#7c4a03' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => {
              handleColorSelectorClick('#7c4a03');
            }}
            style={{ color: '#7c4a03' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#0c625d')}
            style={{ color: '#0c625d' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#256377')}
            style={{ color: '#256377' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#284255')}
            style={{ color: '#284255' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#472e5b')}
            style={{ color: '#472e5b' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorSelectorClick('#6c394f')}
            style={{ color: '#6c394f' }}
          ></GiPlainCircle>
        </div>
        <div
          className={`${
            footerOptions.showMoreOptionsDialog
              ? 'editNoteMoreOptions show'
              : 'editNoteMoreOptions'
          }`}
        >
          <div onClick={deleteNote}>Delete note</div>
          <div onClick={createNoteCopy}>Make a copy</div>
        </div>
        <div className="footerIcons">
          <div>
            <MdOutlineColorLens onClick={toggleColorSelectorMenu} />
          </div>
          <div>
            <BsImage
              onClick={() => {
                imageUploadRef.current.click();
              }}
            />
          </div>
          <div>
            <BiArchiveIn onClick={handleArchiveButtonClick} />
          </div>
          <div>
            <CgMoreVerticalAlt onClick={toggleMoreOptionsDialog} />
          </div>
          <div>
            <BiUndo onClick={undoText} />
          </div>
          <div>
            <BiRedo onClick={redoText} />
          </div>
        </div>
        <div
          onClick={() => {
            saveEditedNote();
          }}
          className="closeButton"
        >
          Close
        </div>
      </div>
    </div>
  );
}

const EditNote = forwardRef(FunctionComponent);
export { EditNote };
