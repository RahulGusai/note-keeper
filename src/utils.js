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

export { countLines };
