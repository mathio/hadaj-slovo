import { getAll, update } from "../../../utils/mongodb";
import { getApiCookie } from "../../../utils/cookie";
import { ObjectId } from "mongodb";

const waitFor = (ms) => new Promise((res) => setTimeout(res, ms));

export default async function updateGameRoute(req, res) {
  const { id: gameId, word = "", submit = false } = req.query;
  const playerId = getApiCookie(req, "playerId");

  const getGame = async () => {
    const [game] = await getAll("game", {
      _id: ObjectId(gameId),
      "players.id": playerId,
    });
    return game;
  };

  const game = await getGame();
  if (!game) {
    return res.status(404).json({ error: "game not found" });
  }

  const updateWords = (words) => [
    ...words,
    {
      word,
      result: validateWord(database, word, answer, supportAccents), // TODO: validateWord;
    },
  ];

  await update("game", game._id, {
    players: game.players.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          lastActive: Date.now(),
          state: {
            word,
            words: submit ? updateWords(player.words) : player.words,
          },
        };
      }
      return player;
    }),
  });

  return res.json({});
}
