import './style.css'

// TODO: sanitize input (only accept letters)
// TODO: logic for when to fire search needs to be improved
// TODO: handle upper-case letters

const WORD_LIST_URL = 'https://raw.githubusercontent.com/tg2648/spelling-bee-solver/main/wordlist/spelling-bee-dictionary.txt'

/**
 * Event listener for keyup to
 * automatically move between <input> elements
 * when maxlength value is reached
 */
function moveToNext(e) {
  let target = e.srcElement || e.target;
  let maxLength = target.maxLength;
  let myLength = target.value.length;
  if (myLength >= maxLength) {
    let next = target;
    while (next = next.nextElementSibling) {
      if (next == null)
        break;
      if (next.tagName.toLowerCase() === "input") {
        next.focus();
        break;
      }
    }
  } else if (myLength === 0) {
    // Move to previous field if empty (user pressed backspace)
    let previous = target;
    while (previous = previous.previousElementSibling) {
      if (previous == null)
        break;
      if (previous.tagName.toLowerCase() === "input") {
        previous.focus();
        break;
      }
    }
  }
}

/**
 * Event listener for keyup to
 * record user inputs and launch search
 * when all inputs are entered
 */
let required;
let optional = ['', '', '', '', '', ''];
let charCount = 0;

function recordInput(e) {
  let target = e.srcElement || e.target;
  let name = target.attributes['name'].value;
  let value = target.value;

  if (name === 'required') {
    required = value;
  } else if (name === 'optional') {
    let idx = target.attributes['optionalnum']?.value
    optional[idx] = target.value;
  }

  if (value === '') {
    charCount--;
  } else {
    charCount++;
  }

  if (charCount == 7) {
    displayMatches(required, optional);
  }
}

let inputContainer = document.getElementById('input-container');
inputContainer.addEventListener('keyup', moveToNext);
inputContainer.addEventListener('keyup', recordInput);

/**
 * Fetches data as text from URL
 */
async function fetchText(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Stores word string in local storage
 */
async function storeWords() {
  const wordsStr = await fetchText(WORD_LIST_URL);
  sessionStorage.setItem('words', wordsStr);
}

/**
 * Retrieves word string from localStorage and splits by newline
 */
function getWordsArray() {
  const wordsStr = sessionStorage.getItem('words');
  return wordsStr.split('\n');
}

/**
 * Returns True if only `characters` are in `word`.
 */
function stringContainsOnly(word, characters) {
  for (let i = 0; i < word.length; i++) {
    const c = word.charAt(i);
    if (characters.indexOf(c) == -1) {
      return false;
    }
  }

  return true;
}

/**
 * Searches dictionary for matching words
 * @param required required character
 * @param optional list of optional characters
 * @returns list of matches
 */
function search(required, optional) {
  let words = getWordsArray();
  let matches = [];
  words.forEach(word => {
    if (word.length > 3) {
      if (word.indexOf(required) != -1) {
        if (stringContainsOnly(word, optional.concat(required))) {
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
function getMatchesHTML(matches) {
  let matchesHTML = [];
  matches.forEach(match => {
    let matchHTML = []

    for (let i = 0; i < match.length; i++) {
      const letter = match.charAt(i);
      if (letter === required) {
        matchHTML.push(`<span class="result required">${letter}</span>`);
      } else {
        matchHTML.push(`<span class="result">${letter}</span>`);
      }
    }

    matchesHTML.push(`<p>${matchHTML.join('')}</p>`);
  });

  return matchesHTML.join('');
}


function displayMatches(requied, optional) {
  let matches = search(required, optional);
  let html = getMatchesHTML(matches);

  document.querySelector('#results').innerHTML = `
    <h2 class="title" >Results:</h2>
    ${html}
    `
}

if (sessionStorage.length == 0) {
  console.log('Loading words');
  (async function() {
    await storeWords();
  }());
} else {
  console.log('Words already loaded');
}
