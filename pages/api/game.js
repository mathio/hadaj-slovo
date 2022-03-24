import { maxGuesses } from "../../utils/constants";
import { removeAccents } from "../../utils/remove-accents";

// https://github.com/BramboraSK/slovnik-slovenskeho-jazyka
const database = require("./words.json");

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const validateWord = (word, answer, supportAccents = false) => {
  const sanitizedWord = supportAccents ? word : removeAccents(word);
  const sanitizedAnswer = supportAccents ? answer : removeAccents(answer);

  if (
    !Object.values(database)
      .map((value) => (supportAccents ? value : removeAccents(value)))
      .includes(sanitizedWord)
  ) {
    return "xxxxx";
  }

  return sanitizedWord
    .split("")
    .map((letter, index) => {
      if (letter === sanitizedAnswer[index]) {
        return "2";
      }
      if (sanitizedAnswer.includes(letter)) {
        return "1";
      }
      return "0";
    })
    .join("");
};

const gameRoute = (req, res) => {
  const { id, words = "", dia: supportAccents = false } = req.query || {};

  if (!id) {
    return res.json({
      id: Object.keys(database)[getRandom(0, Object.keys(database).length - 1)],
    });
  }

  const answer = database[id];

  if (!answer) {
    return res.status(404).json({});
  }

  const results = {};

  const wordsArray = words.toLowerCase().split(",");

  wordsArray.forEach((word) => {
    results[word] = validateWord(word, answer, supportAccents);
  });

  res.json({
    id,
    results,
    answer:
      Object.values(results).includes("22222") ||
      wordsArray.length >= maxGuesses
        ? answer
        : undefined,
  });
};

export default gameRoute;
