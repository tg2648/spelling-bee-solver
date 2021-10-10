import './style.css'

// TODO: sanitize input (only accept letters)
// TODO: logic for when to fire search needs to be improved
// TODO: generate input fields dynamically

const WORD_LIST_URL = 'https://raw.githubusercontent.com/tg2648/spelling-bee-solver/main/wordlist/spelling-bee-dictionary.txt';
const MIN_LENGTH = 3;
const OPTIONAL_LENGTH = 6;
const REQUIRED_LENGTH = 1;

let wordsString;

/**
 * Fetches data as text from URL
 */
 async function fetchText(url) {
  try {
    const response = await fetch(url);
    wordsString = await response.text();
  } catch (error) {
    console.error(error);
  }
}

(async function() {
  await fetchText(WORD_LIST_URL);
}());


function createEmptyArray(len) {
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push('');
  }

  return arr.concat();
}

let inputs = document.querySelectorAll('#input-container > input');

let required = createEmptyArray(REQUIRED_LENGTH);
let optional = createEmptyArray(OPTIONAL_LENGTH);
let charCount = 0;

for (let i = 0; i< inputs.length; i++) {
  inputs[i].addEventListener('keyup', function(e) {
    /**
     * Event listener in input.
     * If backspace - move focus backwards and decrement input count
     * If left arrow - move focus forwards
     * If right arrow - move focus forwards
     * If none of the above - increment input count and
     *                        move focus forwards (user typed something)
     */

    if (e.key === 'Backspace') {
      if (inputs[i].value == '') {
        if (charCount) {
          charCount--;
        }
        if (i != 0) {
          inputs[i - 1].focus();
        }
      } else {
        inputs[i].value = '';
      }
    } else if (e.key === 'ArrowLeft' && i != 0) {
      inputs[i - 1].focus();

    } else if (e.key === 'ArrowRight' && i != inputs.length - 1) {
      inputs[i + 1].focus();

    } else if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      if (charCount < REQUIRED_LENGTH + OPTIONAL_LENGTH) {
        charCount++;
      }
      if (i !== inputs.length - 1) {
        inputs[i + 1].focus();
      }
    }

  })
}

for (let i = 0; i< inputs.length; i++) {
  inputs[i].addEventListener('keyup', function(e) {
    /**
     * Event listener to record inputs.
     */

    let target = e.target;
    let name = target.attributes['name'].value;
    let value = target.value.toLowerCase();

    if (name === 'required') {
      let idx = target.attributes['requiredIdx']?.value;
      required[idx] = value;
    } else if (name === 'optional') {
      let idx = target.attributes['optionalIdx']?.value;
      optional[idx] = value;
    }

    if (charCount == REQUIRED_LENGTH + OPTIONAL_LENGTH) {
      displayMatches(required, optional);
    }

  })
}

/**
 * Retrieves word string from localStorage and splits by newline
 */
 function getWordsArray() {
  // const wordsStr = sessionStorage.getItem('words');
  return wordsString.split('\n');
}

/**
 * Returns True if only `characters` are in `word`.
 */
function wordContainsOnly(word, characters) {
  for (let i = 0; i < word.length; i++) {
    const c = word.charAt(i);
    if (characters.indexOf(c) == -1) {
      return false;
    }
  }

  return true;
}

/**
 * Returns True if `word` contains all `characters`
 */
function wordContainsAll(word, characters) {
  return characters.every((c) => word.indexOf(c) != -1);
}

/**
 * Searches dictionary for matching words
 * @param required list of required characters
 * @param optional list of optional characters
 * @returns list of matches
 */
function search(required, optional) {
  let words = getWordsArray();
  let matches = [];
  words.forEach(word => {
    if (word.length > MIN_LENGTH) {
      if (wordContainsAll(word, required)) {
        if (wordContainsOnly(word, optional.concat(required))) {
          matches.push(word);
        }
      }
    }
  });

  return matches;
}

/**
 * Gets HTML to display list of matches
 * @param matches list of matches
 */
function generateMatchesHTML(matches) {
  let matchesHTML = [];
  matches.forEach(match => {
    let matchHTML = []

    for (let i = 0; i < match.length; i++) {
      const letter = match.charAt(i);
      if (required.indexOf(letter) != -1) {
        matchHTML.push(`<span class="result required">${letter}</span>`);
      } else {
        matchHTML.push(`<span class="result">${letter}</span>`);
      }
    }

    matchesHTML.push(`<p>${matchHTML.join('')}</p>`);
  });

  return matchesHTML.join('');
}

function displayMatches(required, optional) {
  let matches = search(required, optional);
  let html = generateMatchesHTML(matches);

  document.querySelector('#results').innerHTML = `
    <h2 class="title" >Results:</h2>
    ${html}
    `
}

