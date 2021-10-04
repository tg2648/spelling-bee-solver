import './style.css'

// const WORD_LIST_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
const WORD_LIST_URL = 'https://www.mit.edu/~ecprice/wordlist.10000'
// const WORD_LIST_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/README.md'

async function fetchWords(url) {
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
  // console.log('Storing words');
  const wordsStr = await fetchWords(WORD_LIST_URL);
  sessionStorage.setItem('words', wordsStr);
}

/**
 * Retrieves word string from localStorage and splits by newline
 */
function getWordsArray() {
  const wordsStr = sessionStorage.getItem('words');
  return wordsStr.split('\r\n');
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

await storeWords();

const required = 'i';
const optional = ['m', 'd', 'e', 'c', 'a', 'y'];

// let word = 'dimmerd';
// console.log(stringContainsOnly(word, optional));
const matches = search(required, optional);
console.log(matches);

let result = '<b>Yes<b/>'
document.querySelector('#results').innerHTML = `
  <h1>Hello Vite!</h1>
  ${result}
  ${result}
  ${result}
`
