import { maxGuesses } from "../../utils/constants";

// https://github.com/BramboraSK/slovnik-slovenskeho-jazyka
const database = require("./words.json");

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const validateWord = (word, answer) => {
  if (!Object.values(database).includes(word)) {
    return "xxxxx";
  }

  return word
    .split("")
    .map((letter, index) => {
      if (letter === answer[index]) {
        return "2";
      }
      if (answer.includes(letter)) {
        return "1";
      }
      return "0";
    })
    .join("");
};

const gameRoute = (req, res) => {
  const { id, words = "" } = req.query || {};

  if (!id) {
    return res.json({
      id: Object.keys(database)[getRandom(0, Object.keys(database).length - 1)]
    });
  }

  const answer = database[id];

  if (!answer) {
    return res.status(404).json({});
  }

  const results = {};

  const wordsArray = words.toLowerCase().split(",");

  wordsArray.forEach((word) => {
    results[word] = validateWord(word, answer);
  });

  res.json({
    id,
    results,
    answer: wordsArray.length === maxGuesses ? answer : undefined
  });
};

export default gameRoute;
