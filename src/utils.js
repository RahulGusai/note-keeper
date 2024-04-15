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

export { countLines, isCharacterKey };
