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

export default function IndexPage() {
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState(false);
  const [help, setHelp] = useState(false);
  const [results, setResults] = useState([]);
  const [previousWords, setPreviousWords] = useState([]);
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState("");

  const winner = results && Object.values(results).includes("22222");
  const looser = previousWords.length === maxGuesses;
  const gameEnded = winner || looser;

  useEffect(() => {
    const savedGame = window.localStorage.getItem("game");

    let words;
    let id;
    try {
      const savedData = JSON.parse(savedGame);
      id = savedData.id;
      words = savedData.words;
      setGameId(id);
      setPreviousWords(words);
    } catch (e) {}

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
      window.localStorage.setItem("game", JSON.stringify({ id, words }));
    } else {
      const { id } = await fetchWords();
      setGameId(id);
    }
  };

  const resetGame = () => {
    window.localStorage.removeItem("game");
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

    window.localStorage.setItem(
      "game",
      JSON.stringify({ words: allWords, id: gameId })
    );
  };

  const handleKeyClick = useCallback(
    (key) => {
      if (gameEnded) {
        if (key === "enter") {
          resetGame();
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
        <a onClick={resetGame} className={styles.resetLink}>
          Nová hra
        </a>
        <h1>
          {winner ? (
            <span className={styles.message}>Výborne 🤘</span>
          ) : looser ? (
            <span className={styles.message}>
              😐 {`${answer}`.toUpperCase()} 😐
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
      />

      <Keyboard onClick={handleKeyClick} results={results} />
    </div>
  );
}
