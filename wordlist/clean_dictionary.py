with open('wordlist/webster-dictionary.txt', 'r') as f:
    words = f.readlines()

clean_words = []
for word in words:
    word_trim = word.strip()

    length_flag = len(word_trim) < 4
    bad_char_flag = ' ' in word_trim or '-' in word_trim
    capital_flag = any(c.isupper() for c in word_trim)

    # false false true

    if not (length_flag or bad_char_flag or capital_flag):
        clean_words.append(word)

with open('wordlist/spelling-bee-dictionary.txt', 'w') as f:
    f.writelines(clean_words)

print('Done')
