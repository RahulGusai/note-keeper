import { useEffect, useRef, useState } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { TbPinned } from 'react-icons/tb';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { GiPlainCircle } from 'react-icons/gi';
import { MdInvertColorsOff } from 'react-icons/md';
import { MdOutlineUnarchive } from 'react-icons/md';
import { TbPinnedFilled } from 'react-icons/tb';
import {
  getHeightClass,
  archiveNote,
  unArchiveNote,
  updateBackgroundColor,
  getContentToBeDisplayed,
} from '../utils';

import './note.css';

export function Note(props) {
  const {
    note,
    setEditingNote,
    selectedNoteIds,
    setSelectedNoteIds,
    notes,
    setNotes,
    defaultFooter,
    setDefaultFooter,
    setErrorMessage,
    gridView,
    setLatestNoteId,
  } = props;
  const { id, title, content, image, metaData, heightClass } = note;

  const outerContainerRef = useRef(null);
  const noteContainerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageUploadRef = useRef(null);
  const noteImageRef = useRef(null);
  const pinIconRef = useRef(null);
  const pinIconOnImageRef = useRef(null);
  const footerRefs = {
    bgColorSelectorRef: useRef(null),
    addImageRef: useRef(null),
    archiveNoteRef: useRef(null),
    moreOptionsRef: useRef(null),
  };
  const [footerOptions, setFooterOptions] = useState({
    bgColorSelector: false,
    moreOptionsDialog: false,
  });

  const isSelected = selectedNoteIds.has(note.id);

  useEffect(() => {
    if (isSelected) {
      noteContainerRef.current.style.border = '2px solid white';
    } else {
      if (metaData.backgroundColor !== 'transparent') {
        noteContainerRef.current.style.border = 'none';
      } else {
        noteContainerRef.current.style.border = '1px solid grey';
      }
    }
  }, [isSelected, metaData]);

  useEffect(() => {
    noteContainerRef.current.style.backgroundColor = metaData.backgroundColor;
  }, [metaData]);

  useEffect(() => {
    titleRef.current.innerText = '';
    contentRef.current.innerText = '';

    if (title.length === 0 && content.length === 0) {
      titleRef.current.innerText = 'Empty Note';
      titleRef.current.style.color = 'grey';
      titleRef.current.style.fontSize = '20px';
      return;
    }

    titleRef.current.style.color = 'white';
    titleRef.current.style.fontSize = '14px';

    if (title.length > 0 && content.length > 0) {
      titleRef.current.innerText = title;
      contentRef.current.innerText = getContentToBeDisplayed(content);
      return;
    }

    if (title.length > 0) {
      titleRef.current.innerText = title;
      return;
    }

    titleRef.current.innerText = getContentToBeDisplayed(content);
  }, [content, id, title]);

  useEffect(() => {
    if (defaultFooter) {
      setFooterOptions((footerOptions) => {
        return {
          ...footerOptions,
          bgColorSelector: false,
          moreOptionsDialog: false,
        };
      });
    }
  }, [defaultFooter]);

  function handleNoteClick(e) {
    if (isSelected) {
      setSelectedNoteIds((selectedNoteIds) => {
        const updatedSelectedNoteIds = new Set(selectedNoteIds);
        updatedSelectedNoteIds.delete(note.id);
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

    setEditingNote((editingNote) => {
      return {
        ...editingNote,
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
  }

  function handleSelectIconClick() {
    setSelectedNoteIds((selectedNoteIds) => {
      const updatedSelectedNoteIds = new Set(selectedNoteIds);
      if (updatedSelectedNoteIds.has(note.id)) {
        updatedSelectedNoteIds.delete(note.id);
      } else {
        updatedSelectedNoteIds.add(note.id);
      }
      return updatedSelectedNoteIds;
    });
  }

  function handlePinIconClick(e) {
    const { others, pinned } = notes;
    let updatedOthers, updatedPinned;
    if (others.hasOwnProperty(id)) {
      updatedOthers = { ...others };
      const noteToPin = updatedOthers[id];
      updatedPinned = { ...pinned, [id]: noteToPin };
      delete updatedOthers[id];
      setLatestNoteId(null);
    } else {
      updatedPinned = { ...pinned };
      const pinnedNote = updatedPinned[id];
      updatedOthers = { ...others, [id]: pinnedNote };
      delete updatedPinned[id];
      setLatestNoteId(id);
    }

    console.log({
      ...notes,
      others: updatedOthers,
      pinned: updatedPinned,
    });

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
      };
    });

    e.stopPropagation();
  }

  const openImageUploadDialog = () => {
    imageUploadRef.current.click();
  };

  const handleImageUpload = (event) => {
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
    };
  };

  function updateNotes(img) {
    const [heightClassForGridView, heightClassForListView] = getHeightClass(
      contentRef,
      img
    );

    let updatedOthers, updatedPinned;
    const { others, pinned } = notes;
    if (others.hasOwnProperty(id)) {
      const updatedNote = {
        ...others[id],
        image: { src: img.src, width: img.width, height: img.height },
        heightClass: {
          gridView: heightClassForGridView,
          listView: heightClassForListView,
        },
      };
      updatedOthers = { ...others, [id]: updatedNote };
      updatedPinned = { ...pinned };
    } else {
      const updatedNote = {
        ...pinned[id],
        image: { src: img.src, width: img.width, height: img.height },
        heightClass: {
          gridView: heightClassForGridView,
          listView: heightClassForListView,
        },
      };
      updatedPinned = { ...pinned, [id]: updatedNote };
      updatedOthers = { ...others };
    }

    setNotes((notes) => {
      return { ...notes, others: updatedOthers, pinned: updatedPinned };
    });
  }

  function updateFooterOptions(updatedOptions) {
    setFooterOptions((footerOptions) => {
      if (defaultFooter) {
        setDefaultFooter(false);
      }
      return {
        ...footerOptions,
        ...updatedOptions,
      };
    });
  }

  function deleteNote() {
    const { others, pinned, archives, trash } = notes;

    let updatedOthers, updatedPinned, updatedArchives;
    updatedOthers = { ...others };
    updatedPinned = { ...pinned };
    updatedArchives = { ...archives };

    if (others.hasOwnProperty(id)) {
      delete updatedOthers[id];
    } else if (pinned.hasOwnProperty(id)) {
      delete updatedPinned[id];
    } else {
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

    updateFooterOptions({ moreOptionsDialog: false });
  }

  function createNoteCopy() {
    const { others } = notes;
    const newNoteId = Math.floor(Math.random() * 1000) + 1;
    const newNote = { ...note, id: newNoteId };
    const updatedOthers = { ...others, [newNoteId]: newNote };

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
      };
    });

    updateFooterOptions({ moreOptionsDialog: false });
  }

  const pinToolTipText = notes.pinned.hasOwnProperty(id)
    ? 'Unpin note'
    : 'Pin note';

  const isPinned = notes.pinned.hasOwnProperty(id) ? true : false;
  const isArchived = notes.archives.hasOwnProperty(id) ? true : false;

  return (
    <div
      ref={outerContainerRef}
      className={`outerContainer ${
        gridView ? heightClass.gridView : heightClass.listView
      }`}
    >
      <div
        ref={noteContainerRef}
        className={isSelected ? 'noteContainer  selected' : 'noteContainer'}
      >
        <div
          ref={pinIconRef}
          className="toolTip"
          style={{ top: '40px', right: '0px' }}
        >
          {pinToolTipText}
        </div>
        <div
          ref={pinIconOnImageRef}
          className="toolTip"
          style={{ top: '30px', right: '0px' }}
        >
          {pinToolTipText}
        </div>
        <div
          ref={footerRefs.addImageRef}
          className="toolTip"
          style={{ bottom: '-20px', left: '15%' }}
        >
          Add Image
        </div>
        <div
          ref={footerRefs.bgColorSelectorRef}
          className="toolTip"
          style={{ bottom: '-20px', left: '-5%' }}
        >
          Background options
        </div>
        <div
          ref={footerRefs.archiveNoteRef}
          className="toolTip"
          style={{ bottom: '-20px', left: '35%' }}
        >
          Archive
        </div>
        <div
          ref={footerRefs.moreOptionsRef}
          className="toolTip"
          style={{ bottom: '-20px', left: '85%' }}
        >
          More
        </div>
        <div
          className={isSelected ? 'selectIcon show' : 'selectIcon'}
          onClick={handleSelectIconClick}
        >
          <RiCheckboxCircleFill
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <input
          ref={imageUploadRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <div
          className={
            footerOptions.bgColorSelector
              ? 'bgColorSelector active'
              : 'bgColorSelector'
          }
        >
          <MdInvertColorsOff
            onClick={() =>
              updateBackgroundColor(id, 'transparent', notes, setNotes)
            }
          ></MdInvertColorsOff>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#77172e', notes, setNotes)
            }
            style={{ color: '#77172e' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#692b17', notes, setNotes)
            }
            style={{ color: '#692b17' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#7c4a03', notes, setNotes)
            }
            style={{ color: '#7c4a03' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => {
              updateBackgroundColor(id, '#7c4a03', notes, setNotes);
            }}
            style={{ color: '#7c4a03' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#0c625d', notes, setNotes)
            }
            style={{ color: '#0c625d' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#256377', notes, setNotes)
            }
            style={{ color: '#256377' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#284255', notes, setNotes)
            }
            style={{ color: '#284255' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#472e5b', notes, setNotes)
            }
            style={{ color: '#472e5b' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() =>
              updateBackgroundColor(id, '#6c394f', notes, setNotes)
            }
            style={{ color: '#6c394f' }}
          ></GiPlainCircle>
        </div>

        <div
          className={`${
            footerOptions.moreOptionsDialog
              ? 'moreOptionsDialog show'
              : 'moreOptionsDialog'
          }`}
        >
          <div onClick={deleteNote}>Delete note</div>
          <div onClick={createNoteCopy}>Make a copy</div>
        </div>

        {image && (
          <>
            <img
              class="image"
              ref={noteImageRef}
              src={image.src}
              alt="noteImage"
              onClick={handleNoteClick}
            ></img>
            <div
              className={isSelected ? 'pinIconOnImage' : 'pinIconOnImage show'}
              onClick={handlePinIconClick}
            >
              <div className="toolTip">{pinToolTipText}</div>
              {isPinned ? (
                <TbPinnedFilled className="icon" />
              ) : (
                <TbPinned className="icon" />
              )}
            </div>
          </>
        )}

        <div
          contentEditable="true"
          ref={titleRef}
          className="note-title"
          onClick={handleNoteClick}
        ></div>

        {!image && (
          <div
            onMouseOver={() => {
              pinIconRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              pinIconRef.current.style.visibility = 'hidden';
            }}
            className={isSelected ? 'pinIcon' : 'pinIcon show'}
            onClick={handlePinIconClick}
          >
            {isPinned ? <TbPinnedFilled /> : <TbPinned />}
          </div>
        )}
        <div
          contentEditable="true"
          ref={contentRef}
          className="note-content"
          onClick={handleNoteClick}
        ></div>
        <div className={isSelected ? 'noteFooter' : 'noteFooter show'}>
          <div
            className="bgSelectorIcon"
            onMouseOver={() => {
              footerRefs.bgColorSelectorRef.current.style.visibility =
                'visible';
            }}
            onMouseOut={() => {
              footerRefs.bgColorSelectorRef.current.style.visibility = 'hidden';
            }}
            onClick={() =>
              updateFooterOptions({
                bgColorSelector: !footerOptions.bgColorSelector,
                moreOptionsDialog: false,
              })
            }
          >
            <MdOutlineColorLens className="bgSelectorIconTest" />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.addImageRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.addImageRef.current.style.visibility = 'hidden';
            }}
            className="noteImageSelector"
            onClick={() => {
              updateFooterOptions({
                bgColorSelector: false,
                moreOptionsDialog: false,
              });
              openImageUploadDialog();
            }}
          >
            <BsImage />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.archiveNoteRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.archiveNoteRef.current.style.visibility = 'hidden';
            }}
            className="archiveNote"
          >
            {isArchived ? (
              <MdOutlineUnarchive
                onClick={() => {
                  updateFooterOptions({
                    bgColorSelector: false,
                    moreOptionsDialog: false,
                  });
                  unArchiveNote(id, notes, setNotes);
                }}
              ></MdOutlineUnarchive>
            ) : (
              <BiArchiveIn
                onClick={() => {
                  updateFooterOptions({
                    bgColorSelector: false,
                    moreOptionsDialog: false,
                  });
                  archiveNote(id, notes, setNotes);
                }}
              />
            )}
          </div>

          <div
            onMouseOver={() => {
              footerRefs.moreOptionsRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.moreOptionsRef.current.style.visibility = 'hidden';
            }}
            className="moreOptions"
            onClick={() => {
              updateFooterOptions({
                bgColorSelector: false,
                moreOptionsDialog: !footerOptions.moreOptionsDialog,
              });
            }}
          >
            <CgMoreVerticalAlt />
          </div>
        </div>
      </div>
    </div>
  );
}
