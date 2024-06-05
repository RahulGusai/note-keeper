import './newNote.css';
import { forwardRef, useEffect, useState } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { GiPlainCircle } from 'react-icons/gi';
import { MdInvertColorsOff } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { useRef } from 'react';
import {
  handleUndoBtnClick,
  handleRedoBtnClick,
  updateNoteImageSource,
} from '../utils';
import { supabase } from '../supabase/supabaseClient';

function ComponentHandler(props, ref) {
  const { titleRef, contentRef } = ref;

  const {
    isExpanded,
    setIsExpanded,
    isDefaultTextLoaded,
    setisDefaultTextLoaded,
    setErrorMessage,
    newNoteData,
    setNewNoteData,
    newNoteFooterOptions,
    setNewNoteFooterOptions,
    createNote,
    notes,
    setNotes,
  } = props;

  const newNoteContainerRef = useRef();
  const imageUploadRef = useRef();

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [lastKeyStrokeTimestamp, setLastKeyStrokeTimestamp] = useState(null);

  const { newNoteId, backgroundColor, image } = newNoteData;

  useEffect(() => {
    newNoteContainerRef.current.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  useEffect(() => {
    if (isExpanded) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      titleRef.current.innerText = 'Title';
      contentRef.current.innerText = 'Take a note...';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, content: true, title: true };
      });
    }
  }, [contentRef, isExpanded, setisDefaultTextLoaded, titleRef]);

  function handleNewNoteClick(e) {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }

  const handleKeyPressedOnContent = (e) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }

    if (
      !isDefaultTextLoaded.content &&
      contentRef.current.innerText.length === 0
    ) {
      contentRef.current.innerText = 'Take a note...';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, content: true };
      });
    }
  };

  const handleKeyPressedOnTitle = (e) => {
    if (!isDefaultTextLoaded.title && titleRef.current.innerText.length === 0) {
      titleRef.current.innerText = 'Title';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, title: true };
      });
    }
  };

  const handleTitleClick = (e) => {
    if (isDefaultTextLoaded.title) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(titleRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    titleRef.current.focus();
  };

  const handleContentClick = (e) => {
    if (isDefaultTextLoaded.content) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    contentRef.current.focus();
  };

  function clearDefaultInputTitle() {
    if (isDefaultTextLoaded.title) {
      titleRef.current.innerText = '';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, title: false };
      });
    }
  }

  function processContentInput() {
    if (lastKeyStrokeTimestamp) {
      if (Date.now() - lastKeyStrokeTimestamp > 500) {
        setUndoStack((undoStack) => {
          return [...undoStack, contentRef.current.innerText];
        });
      }
    } else {
      setUndoStack((undoStack) => {
        return [...undoStack, contentRef.current.innerText];
      });
    }

    setLastKeyStrokeTimestamp(Date.now());
    if (isDefaultTextLoaded.content) {
      contentRef.current.innerText = '';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, content: false };
      });
    }
  }

  function toggleColorSelectorMenu() {
    setNewNoteFooterOptions((newNoteFooterOptions) => {
      return {
        ...newNoteFooterOptions,
        showColorSelector: !newNoteFooterOptions.showColorSelector,
        showMoreOptionsDialog: false,
      };
    });
  }

  function handleColorSelectorClick(color) {
    setNewNoteData((newNoteData) => {
      return {
        ...newNoteData,
        backgroundColor: color,
      };
    });
  }

  function handleArchiveIconClick() {
    createNote(true);
  }

  async function processImage(event) {
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
    let maxHeightForGridView, maxHeightForListView;
    img.onload = function () {
      const resolution = img.width * img.height;
      if (resolution > maxResolutionPixels) {
        setErrorMessage(
          'Can’t upload this file. We accept GIF, JPEG, JPG, PNG files less than 10MB and 25 megapixels.'
        );
        return;
      }

      const aspectRatio = img.width / img.height;
      maxHeightForGridView = Math.floor(250 / aspectRatio);
      maxHeightForListView = Math.floor(600 / aspectRatio);
    };

    const fileName = `${newNoteId}`;
    try {
      const { error } = await supabase.storage
        .from('note-images')
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { publicUrl } = supabase.storage
        .from('note-images')
        .getPublicUrl(fileName).data;

      setNewNoteData((newNoteData) => {
        return {
          ...newNoteData,
          image: {
            src: img.src,
            publicUrl: `${publicUrl}?t=${Date.now()}`,
            width: img.width,
            height: img.height,
            maxHeightForGridView,
            maxHeightForListView,
          },
        };
      });
    } catch (error) {
      console.log(`Failed to upload the image: ${error.message}`);
    }
  }

  function handleCloseBtnClick() {
    createNote();
  }

  function hideFooterOptions() {
    setNewNoteFooterOptions((newNoteFooterOptions) => {
      return {
        ...newNoteFooterOptions,
        showColorSelector: false,
      };
    });
  }

  const contentClassesName = `newNoteContent ${
    isExpanded ? 'expanded' : 'default'
  }`;
  const titleClassesname = `newNoteTitle ${isExpanded ? 'show' : 'hide'}`;
  const footerClassesName = `${!isExpanded ? 'hide' : 'newNoteFooter'}`;

  return (
    <div
      ref={newNoteContainerRef}
      className="newNoteOuterContainer"
      onClick={handleNewNoteClick}
    >
      <div onClick={hideFooterOptions} className="newNoteContainer">
        <input
          ref={imageUploadRef}
          type="file"
          style={{ display: 'none' }}
          onChange={processImage}
        />

        {image && (
          <>
            <MdDelete className="deleteImageIcon"></MdDelete>
            <img
              className="newNoteImage"
              src={image.publicUrl ? image.publicUrl : image.src}
              alt="noteImage"
            />
          </>
        )}

        <div
          contentEditable
          ref={titleRef}
          className={titleClassesname}
          onKeyUp={handleKeyPressedOnTitle}
          onClick={handleTitleClick}
          onBeforeInput={clearDefaultInputTitle}
        ></div>
        <div
          contentEditable
          ref={contentRef}
          className={contentClassesName}
          onKeyUp={handleKeyPressedOnContent}
          onClick={handleContentClick}
          onBeforeInput={processContentInput}
        ></div>
      </div>
      <div className={footerClassesName}>
        <div
          className={
            newNoteFooterOptions.showColorSelector
              ? 'newNoteColorSelector active'
              : 'newNoteColorSelector'
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
        <div className="newNoteFooterIcons">
          <div>
            <MdOutlineColorLens onClick={toggleColorSelectorMenu} />
          </div>
          <div>
            <BsImage
              onClick={() => {
                setNewNoteFooterOptions((newNoteFooterOptions) => {
                  return {
                    ...newNoteFooterOptions,
                    showColorSelector: false,
                  };
                });
                imageUploadRef.current.click();
              }}
            />
          </div>
          <div>
            <BiArchiveIn onClick={handleArchiveIconClick} />
          </div>
          <div
            onClick={() => {
              handleUndoBtnClick(
                contentRef,
                undoStack,
                setUndoStack,
                setRedoStack
              );
            }}
          >
            <BiUndo className={undoStack.length === 0 ? 'iconDisabled' : ''} />
          </div>
          <div
            onClick={() => {
              handleRedoBtnClick(
                contentRef,
                setUndoStack,
                redoStack,
                setRedoStack
              );
            }}
          >
            <BiRedo className={redoStack.length === 0 ? 'iconDisabled' : ''} />
          </div>
        </div>
        <div onClick={handleCloseBtnClick} className="noteCloseButton">
          Close
        </div>
      </div>
    </div>
  );
}

const NewNote = forwardRef(ComponentHandler);
export { NewNote };
