import { getAll, update } from "../../../utils/mongodb";
import { getApiCookie } from "../../../utils/cookie";
import { ObjectId } from "mongodb";

const waitFor = (ms) => new Promise((res) => setTimeout(res, ms));

export default async function getGameRoute(req, res) {
  const { id: gameId, updated: lastUpdated } = req.query;
  const playerId = getApiCookie(req, "playerId");
  let pollingInProgress = true;

  req.on("close", () => {
    pollingInProgress = false;
  });

  const getGame = async () => {
    const [game] = await getAll("game", {
      _id: ObjectId(gameId),
      "players.id": playerId,
      updated: { $gt: lastUpdated ? parseInt(lastUpdated, 10) : 0 },
    });
    return game;
  };

  let game = await getGame();
  while (lastUpdated && pollingInProgress && !game) {
    console.log("foo");
    await waitFor(2000);
    game = await getGame();
  }

  if (!pollingInProgress) {
    return res.end();
  }

  if (!game) {
    return res.status(404).json({ error: "game not found" });
  }

  // const updatedGame = await update("game", game._id, {
  //   players: game.players.map((player) => {
  //     if (player.id === playerId) {
  //       return {
  //         ...player,
  //         lastActive: Date.now(),
  //       };
  //     }
  //     return player;
  //   }),
  // });

  return res.json({
    game: {
      ...game,
      players: game.players.map(({ id, name, owner, lastActive }) => ({
        id,
        name,
        owner,
        lastActive,
        you: id === playerId || undefined,
      })),
    },
  });
}
