import {
  LANG_EN,
  LANG_SK,
  maxGuesses,
  supportedLanguages,
} from "../../utils/constants";
import { removeAccents } from "../../utils/remove-accents";

const languageDatabase = {
  [LANG_SK]: {
    possibleAnswers: require("../../resources/sk/answers.json"), // https://github.com/BramboraSK/slovnik-slovenskeho-jazyka
    otherKnownWords: {},
  },
  [LANG_EN]: {
    possibleAnswers: require("../../resources/en/answers.json"),
    otherKnownWords: require("../../resources/en/other.json"),
  },
};

const getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const getRandomId = ({ possibleAnswers }) =>
  Object.keys(possibleAnswers)[
    getRandom(0, Object.keys(possibleAnswers).length - 1)
  ];

const validateWord = (
  { possibleAnswers, otherKnownWords },
  word,
  answer,
  supportAccents = false
) => {
  const databaseArray = [...Object.values(possibleAnswers), otherKnownWords];
  const sanitizedWord = supportAccents ? word : removeAccents(word);
  const sanitizedAnswer = supportAccents ? answer : removeAccents(answer);

  if (
    !databaseArray
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
  const {
    id,
    words = "",
    dia: supportAccents = false,
    lang: language = "sk",
  } = req.query || {};

  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({ error: "language not supported" });
  }

  const database = languageDatabase[language];

  if (!id) {
    return res.json({
      id: getRandomId(database),
    });
  }

  const answer = database.possibleAnswers[id];

  if (!answer) {
    return res.status(404).json({ error: "invalid id" });
  }

  const results = {};

  const wordsArray = words.toLowerCase().split(",");

  wordsArray.forEach((word) => {
    results[word] = validateWord(database, word, answer, supportAccents);
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
