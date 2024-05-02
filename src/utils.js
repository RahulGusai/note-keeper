const heightCorrectionAsPerScaledHeight = {
  200: 150,
  250: 100,
  300: 100,
  350: 50,
  400: 50,
};

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

function isCharacterKey(event) {
  const charCode = event.keyCode;
  console.log(charCode);

  if (
    charCode === 8 || // Allow backspace as well.
    (charCode >= 48 && charCode <= 57) ||
    (charCode >= 65 && charCode <= 90) ||
    (charCode >= 97 && charCode <= 122) ||
    (charCode >= 32 && charCode <= 36) ||
    (charCode >= 41 && charCode <= 47) ||
    (charCode >= 58 && charCode <= 64) ||
    (charCode >= 91 && charCode <= 96) ||
    (charCode >= 123 && charCode <= 126)
  ) {
    return true;
  }
  return false;
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

  let totalHeight = 0;
  if (numberOfLines <= 2) totalHeight += 150;
  else if (numberOfLines > 2 && numberOfLines <= 5) totalHeight += 200;
  else if (numberOfLines > 5 && numberOfLines <= 8) totalHeight += 250;
  else totalHeight += 300;

  if (image) {
    const scaledHeight = scaleHeightToValues(image.height);
    console.log(scaledHeight);
    console.log(heightCorrectionAsPerScaledHeight[scaledHeight]);
    totalHeight =
      totalHeight +
      scaledHeight -
      heightCorrectionAsPerScaledHeight[scaledHeight];
  }

  const heightClass = `span-${Math.floor(totalHeight / 50)}`;
  return heightClass;
}

export {
  isCharacterKey,
  scaleHeightToValues,
  getHeightClass,
  heightCorrectionAsPerScaledHeight,
};
