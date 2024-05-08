import { useEffect, useRef, useState } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { TbPinned } from 'react-icons/tb';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { GiPlainCircle } from 'react-icons/gi';
import { MdInvertColorsOff } from 'react-icons/md';
import { getHeightClass, scaleHeightToValues } from '../utils';

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
  } = props;
  const { id, title, content, heightClass, image } = note;

  const outerContainerRef = useRef(null);
  const noteContainerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageUploadRef = useRef(null);
  const noteImageRef = useRef(null);
  const pinIconRef = useRef(null);
  const footerRefs = {
    bgColorSelectorRef: useRef(null),
    addImageRef: useRef(null),
    archiveNoteRef: useRef(null),
    moreOptionsRef: useRef(null),
    undoRef: useRef(null),
    redoRef: useRef(null),
  };
  const [footerOptions, setFooterOptions] = useState({
    bgColorSelector: false,
  });

  const isSelected = selectedNoteIds.has(note.id);

  useEffect(() => {
    titleRef.current.innerHTML = '';
    contentRef.current.innerHTML = '';

    if (title.length === 0 && content.length === 0) {
      titleRef.current.innerHTML = 'Empty Note';
      titleRef.current.style.color = 'grey';
      titleRef.current.style.fontSize = '20px';
      return;
    }

    titleRef.current.style.color = 'white';
    titleRef.current.style.fontSize = '14px';

    if (title.length > 0 && content.length > 0) {
      titleRef.current.innerHTML = title;
      contentRef.current.innerHTML = content;
      return;
    }

    if (title.length > 0) {
      titleRef.current.innerHTML = title;
      return;
    }

    titleRef.current.innerHTML = content;
  }, [content, id, title]);

  useEffect(() => {
    if (defaultFooter) {
      setFooterOptions((footerOptions) => {
        return { ...footerOptions, bgColorSelector: false };
      });
    }
  }, [defaultFooter]);

  useEffect(() => {
    if (image) {
      const scaledheight = scaleHeightToValues(image.height);
      noteImageRef.current.style.height = `${scaledheight}px`;
      noteImageRef.current.style.width = '250px';
    }
  }, [image]);

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
        id: id,
        title: title,
        content: content,
        image: image,
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
    if (others.hasOwnProperty(id)) {
      const pinnedNote = others[id];
      const updatedOthers = { ...others };
      const updatedPinned = { ...pinned };
      delete updatedOthers[id];
      updatedPinned[id] = pinnedNote;
      setNotes({ others: updatedOthers, pinned: updatedPinned });
    } else {
      const otherNote = pinned[id];
      const updatedOthers = { ...others };
      const updatedPinned = { ...pinned };
      delete updatedPinned[id];
      updatedOthers[id] = otherNote;
      setNotes({ others: updatedOthers, pinned: updatedPinned });
    }
    e.stopPropagation();
  }

  function handleColorPickerClick(color) {
    noteContainerRef.current.style.backgroundColor = color;
    noteContainerRef.current.style.border = 'none';
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

      const scaledheight = scaleHeightToValues(img.height);
      updateNotes(scaledheight, img);
    };
  };

  function updateNotes(scaledheight, img) {
    const updatedHeightClass = getHeightClass(contentRef, img);

    let updatedOthers, updatedPinned;
    const { others, pinned } = notes;
    if (others.hasOwnProperty(id)) {
      const updatedNote = {
        ...others[id],
        image: { src: img.src, width: img.width, height: img.height },
        heightClass: updatedHeightClass,
      };
      updatedOthers = { ...others, [id]: updatedNote };
      updatedPinned = { ...updatedPinned };
    } else {
      const updatedNote = {
        ...pinned[id],
        image: { src: img.src, width: img.width, height: img.height },
        heightClass: updatedHeightClass,
      };
      updatedPinned = { ...pinned, [id]: updatedNote };
      updatedOthers = { ...updatedOthers };
    }

    setNotes((notes) => {
      return { ...notes, others: updatedOthers, pinned: updatedPinned };
    });
  }

  function archiveNote() {
    let updatedOthers, updatedPinned;

    const { others, pinned, archives } = notes;
    if (others.hasOwnProperty(id)) {
      updatedOthers = { ...others };
      delete updatedOthers[id];
      updatedPinned = { ...updatedPinned };
    } else {
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

  const pinToolTipText = notes.pinned.hasOwnProperty(id)
    ? 'Unpin note'
    : 'Pin note';
  return (
    <div ref={outerContainerRef} className={`outerContainer ${heightClass}`}>
      <div
        ref={noteContainerRef}
        className={isSelected ? 'noteContainer selected' : 'noteContainer'}
      >
        <div
          ref={pinIconRef}
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
          style={{ bottom: '-20px', left: '55%' }}
        >
          More
        </div>
        <div
          ref={footerRefs.undoRef}
          className="toolTip"
          style={{ bottom: '-20px', left: '70%' }}
        >
          Undo
        </div>
        <div
          ref={footerRefs.redoRef}
          className="toolTip"
          style={{ bottom: '-20px', left: '85%' }}
        >
          Redo
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
          <MdInvertColorsOff></MdInvertColorsOff>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('coral')}
            style={{ color: 'coral' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('white')}
            style={{ color: 'white' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('red')}
            style={{ color: 'red' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => {
              handleColorPickerClick('brown');
            }}
            style={{ color: 'brown' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('teal')}
            style={{ color: 'teal' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('purple')}
            style={{ color: 'purple' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('pink')}
            style={{ color: 'pink' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('blue')}
            style={{ color: 'blue' }}
          ></GiPlainCircle>
          <GiPlainCircle
            onClick={() => handleColorPickerClick('skyblue')}
            style={{ color: 'skyblue' }}
          ></GiPlainCircle>
        </div>
        {image && (
          <img
            class="image"
            ref={noteImageRef}
            src={image.src}
            alt="noteImage"
          />
        )}

        <div className="title-bar" onClick={handleNoteClick}>
          <div ref={titleRef} className="note-title"></div>
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
            <TbPinned
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        </div>
        <div
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
              setFooterOptions((footerOptions) => {
                if (defaultFooter) {
                  setDefaultFooter(false);
                }
                return {
                  ...footerOptions,
                  bgColorSelector: !footerOptions.bgColorSelector,
                };
              })
            }
          >
            <MdOutlineColorLens
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.addImageRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.addImageRef.current.style.visibility = 'hidden';
            }}
            className="noteImageSelector"
            onClick={openImageUploadDialog}
          >
            <BsImage
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.archiveNoteRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.archiveNoteRef.current.style.visibility = 'hidden';
            }}
            className="archiveNote"
            onClick={archiveNote}
          >
            <BiArchiveIn
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.moreOptionsRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.moreOptionsRef.current.style.visibility = 'hidden';
            }}
            className="moreOptions"
          >
            <CgMoreVerticalAlt
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.undoRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.undoRef.current.style.visibility = 'hidden';
            }}
            className="undoAction"
          >
            <BiUndo
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            onMouseOver={() => {
              footerRefs.redoRef.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.redoRef.current.style.visibility = 'hidden';
            }}
            className="redoAction"
          >
            <BiRedo
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
