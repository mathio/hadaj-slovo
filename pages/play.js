import { useState, useEffect, useCallback } from "react";
import { Guesses } from "../components/guesses";
import { Keyboard } from "../components/keyboard";
import { Help } from "../components/help";
import { LANG_SK, maxGuesses } from "../utils/constants";
import styles from "./index.module.css";
import { readGameCookie, saveGameCookie } from "../utils/cookie";

const fetchWords = async (words = [], id = "", lang, dia) => {
  const response = await fetch(
    `/api/game?id=${id}&words=${words.join(",")}&lang=${lang}&dia=${dia}`
  );
  return await response.json();
};

export default function PlayPage() {
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState(false);
  const [help, setHelp] = useState(false);
  const [results, setResults] = useState({});
  const [previousWords, setPreviousWords] = useState([]);
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState("");
  const [supportAccents, setSupportAccents] = useState(false);
  const [language, setLanguage] = useState("");

  const winner = results && Object.values(results).includes("22222");
  const looser = previousWords.length === maxGuesses || !!answer;
  const gameEnded = winner || looser;

  useEffect(() => {
    const { id, words = [], lang, dia } = readGameCookie();
    setGameId(id);
    setPreviousWords(words);
    setSupportAccents(dia);
    setLanguage(lang);
    loadGame(id, words);
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  }, [error]);

  const loadGame = async (gameId, words) => {
    const dia = window.location.search.includes("dia=true");
    const [_, lang] = window.location.search.match(/lang=([a-z]{2})/i) || [];
    setSupportAccents(dia);
    setLanguage(lang);

    const { results, answer, id } = await fetchWords(words, gameId, lang, dia);
    setGameId(id);
    setResults(results || {});
    setAnswer(answer || "");
    saveGameCookie({ id, words, lang, dia });
  };

  const changeGame = () => {
    window.location.href = "/";
  };

  const endGame = async () => {
    if (!confirm("Are you sure?")) {
      return;
    }

    const words = [...previousWords, "", "", "", "", "", ""].slice(
      0,
      maxGuesses
    );
    setPreviousWords(words);
    saveGameCookie({ id: gameId, words });
    const { answer } = await fetchWords(
      words,
      gameId,
      language,
      supportAccents
    );

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
    const allWords = [...previousWords, word];

    const {
      results: { [word]: result },
      answer,
    } = await fetchWords(allWords, gameId, language, supportAccents);

    if (result === "xxxxx") {
      setError(true);
      return;
    }

    setPreviousWords(allWords);
    setResults({ ...results, [word]: result });
    setWord("");
    setAnswer(answer);

    saveGameCookie({ words: allWords, id: gameId });
  };

  const openJulsSavba = () => {
    window.open(`https://slovnik.juls.savba.sk/?w=${answer}`);
  };

  const handleKeyClick = useCallback(
    (key) => {
      if (gameEnded) {
        if (key === "enter") {
          startNewGame();
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
    return <Help close={() => setHelp(false)} language={language} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {gameEnded ? (
          <a onClick={startNewGame} className={styles.newLink}>
            New game
          </a>
        ) : previousWords.length > 0 ? (
          <a onClick={endGame} className={styles.endLink}>
            End game
          </a>
        ) : (
          <a onClick={changeGame} className={styles.changeLink}>
            Change game
          </a>
        )}
        <h1>
          {gameEnded ? (
            language === LANG_SK ? (
              <span className={styles.message} onClick={openJulsSavba}>
                {winner ? "Výborne 🤘" : `😐 ${`${answer}`.toUpperCase()} 😐`}
                <span className={styles.tooltip}>
                  nepoznáš slovo? <u>pozri do slovníka</u>
                </span>
              </span>
            ) : (
              <span className={styles.message}>
                {winner ? "Noyce 🤘" : `😐 ${`${answer}`.toUpperCase()} 😐`}
              </span>
            )
          ) : (
            <span>
              Le Word{" "}
              <span style={{ color: "red" }}>
                {language.toUpperCase()}
                {supportAccents ? "+DIA" : ""}
              </span>
            </span>
          )}
        </h1>
        <a onClick={() => setHelp(true)} className={styles.helpLink}>
          How to play?
        </a>
      </div>
      <Guesses
        words={previousWords}
        results={results}
        current={word}
        error={error}
        gameEnded={gameEnded}
        supportAccents={supportAccents}
      />
      <Keyboard
        onClick={handleKeyClick}
        results={results}
        supportAccents={supportAccents}
      />
    </div>
  );
}
