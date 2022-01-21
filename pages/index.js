import { useState, useEffect, useCallback } from "react";
import { Guesses } from "../components/guesses";
import { Keyboard } from "../components/keyboard";
import { Help } from "../components/help";
import { maxGuesses } from "../utils/constants";
import styles from "./index.module.css";

const fetchWords = async (words = [], id = "") => {
  const cf = window.location.search.substring(1);
  const response = await fetch(
    `/api/game?id=${id}&words=${words.join(",")}&${cf}`
  );
  const data = await response.json();
  return data;
};

const saveGameCookie = (value) => {
  document.cookie = `game=${JSON.stringify(value)};`;
};

const readGameCookie = () => {
  const match = document.cookie.match(/game=([^;]+)/);
  let data = {};
  try {
    data = JSON.parse(match && match[1]);
  } catch (e) {}
  return data || {};
};

export default function IndexPage() {
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState(false);
  const [help, setHelp] = useState(false);
  const [results, setResults] = useState([]);
  const [previousWords, setPreviousWords] = useState([]);
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState("");

  const winner = results && Object.values(results).includes("22222");
  const looser = previousWords.length === maxGuesses || !!answer;
  const gameEnded = winner || looser;

  useEffect(() => {
    const { id, words = [] } = readGameCookie();
    setGameId(id);
    setPreviousWords(words);
    loadGame(id, words);
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  }, [error]);

  const loadGame = async (id, words) => {
    if (id && words.length > 0) {
      const { results, answer } = await fetchWords(words, id);
      setResults(results);
      setAnswer(answer);
      saveGameCookie({ id, words });
    } else {
      const { id } = await fetchWords();
      setGameId(id);
    }
  };

  const endGame = async () => {
    if (!confirm("Naozaj?")) {
      return;
    }

    const words = [...previousWords, "", "", "", "", "", ""].slice(
      0,
      maxGuesses
    );
    setPreviousWords(words);
    saveGameCookie({ id: gameId, words });
    const { answer } = await fetchWords(words, gameId);

    setAnswer(answer);
  };

  const startNewGame = () => {
    saveGameCookie({});
    setAnswer("");
    setResults({});
    setPreviousWords([]);
    setWord("");
    setGameId(null);
    loadGame();
  };

  const submitWord = async () => {
    const {
      results: { [word]: result },
    } = await fetchWords([word], gameId);

    if (result === "xxxxx") {
      setError(true);
      return;
    }

    const allWords = [...previousWords, word];
    setPreviousWords(allWords);
    setResults({ ...results, [word]: result });
    setWord("");

    if (allWords.length === maxGuesses) {
      await loadGame(gameId, allWords);
    }

    saveGameCookie({ words: allWords, id: gameId });
  };

  const openJulsSavba = () => {
    window.open(`https://slovnik.juls.savba.sk/?w=${answer}`);
  };

  const handleKeyClick = useCallback(
    (key) => {
      if (gameEnded) {
        if (key === "enter") {
          endGame();
        }
        return;
      }
      if (key === "enter") {
        if (word.length === 5 && previousWords.length < maxGuesses) {
          submitWord();
        }
      } else if (key === "backspace") {
        setWord(word.substring(0, word.length - 1));
      } else if (word.length < 5 && previousWords.length < maxGuesses) {
        setWord(`${word}${key}`);
      }
    },
    [gameEnded, previousWords, word]
  );

  if (help) {
    return <Help close={() => setHelp(false)} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {gameEnded ? (
          <a onClick={startNewGame} className={styles.newLink}>
            Nová hra
          </a>
        ) : previousWords.length > 0 ? (
          <a onClick={endGame} className={styles.endLink}>
            Ukončiť hru
          </a>
        ) : null}
        <h1>
          {gameEnded ? (
            <span className={styles.message} onClick={openJulsSavba}>
              {winner ? "Výborne 🤘" : `😐 ${`${answer}`.toUpperCase()} 😐`}
              <span className={styles.tooltip}>
                nepoznáš slovo? <u>pozri do slovníka</u>
              </span>
            </span>
          ) : (
            "Hádaj slovo"
          )}
        </h1>
        <a onClick={() => setHelp(true)} className={styles.helpLink}>
          Ako hrať?
        </a>
      </div>
      <Guesses
        words={previousWords}
        results={results}
        current={word}
        error={error}
        gameEnded={gameEnded}
      />

      <Keyboard onClick={handleKeyClick} results={results} />
    </div>
  );
}
