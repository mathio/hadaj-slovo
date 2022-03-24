import styles from "./guesses.module.css";
import { highlightStyles, maxGuesses } from "../utils/constants";

const GuessRow = ({ word = "", results = {}, error, gameEnded }) => {
  const placeholder = [0, 1, 2, 3, 4];
  const getStyle = (word, index) => {
    if (word[index] === undefined) {
      return { opacity: 0.25 };
    }
    const styleIndex = parseInt(
      (results[word] && results[word][index]) || -1,
      10
    );
    return highlightStyles[styleIndex];
  };

  return (
    <div className={styles.row}>
      <ul className={styles.word}>
        {placeholder.map((index) => (
          <li key={index} style={getStyle(word, index)}>
            {word[index] || ""}
          </li>
        ))}
      </ul>
      {error && (
        <div className={styles.error}>
          <span>Toto slovo nemáme v databáze.</span>
        </div>
      )}
    </div>
  );
};

export const Guesses = ({
  words,
  results = {},
  current,
  error,
  gameEnded,
  supportAccents = false,
}) => {
  const emptyRows = ["", "", "", "", ""].slice(
    0,
    Math.max(0, maxGuesses - 1 - words.length)
  );

  return (
    <div className={supportAccents ? styles.wrapperSmall : styles.wrapper}>
      {words.map((word, index) => (
        <GuessRow key={index} word={word} results={results} />
      ))}
      {words.length < maxGuesses && (
        <GuessRow word={current} error={error} gameEnded={gameEnded} />
      )}
      {emptyRows.map((_, index) => (
        <GuessRow key={index} gameEnded={gameEnded} />
      ))}
    </div>
  );
};
