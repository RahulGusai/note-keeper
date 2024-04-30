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
  const { id, title, content, heightClass } = note;

  const noteContainerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageUploadRef = useRef(null);
  const [footerOptions, setFooterOptions] = useState({
    bgColorSelector: false,
  });

  const rowSpanToHeight = {
    short: 'short-height',
    tall: 'tall-height',
    taller: 'taller-height',
    tallest: 'tallest-height',
  };
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

      addImageUrlToNote(img.src);
    };
  };

  function addImageUrlToNote(imgSrc) {
    let updatedOthers, updatedPinned;
    const { others, pinned } = notes;
    if (others.hasOwnProperty(id)) {
      const updatedNote = { ...others[id], imgSrc: imgSrc };
      updatedOthers = { ...others, [id]: updatedNote };
      updatedPinned = { ...updatedPinned };
    } else {
      const updatedNote = { ...pinned[id], imgSrc: imgSrc };
      updatedPinned = { ...pinned, [id]: updatedNote };
      updatedOthers = { ...updatedOthers };
    }

    setNotes((notes) => {
      return { ...notes, others: updatedOthers, pinned: updatedPinned };
    });
  }

  return (
    <div className={`outerContainer ${heightClass}`}>
      <div
        ref={noteContainerRef}
        className={isSelected ? 'noteContainer selected' : 'noteContainer'}
      >
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
        <div className="title-bar" onClick={handleNoteClick}>
          <div ref={titleRef} className="note-title"></div>
          <div
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
          className={`note-content ${rowSpanToHeight[heightClass]}`}
          onClick={handleNoteClick}
        ></div>
        <div className={isSelected ? 'noteFooter' : 'noteFooter show'}>
          <div
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
          <div onClick={openImageUploadDialog}>
            <BsImage
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div>
            <BiArchiveIn
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div>
            <CgMoreVerticalAlt
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div>
            <BiUndo
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div>
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
