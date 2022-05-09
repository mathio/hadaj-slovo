import { getOne, update } from "../../../utils/mongodb";
import { getApiCookie, setApiCookie } from "../../../utils/cookie";
import { v4 as uuidv4 } from "uuid";

export default async function joinGameRoute(req, res) {
  const { id: gameId } = req.query;
  let { name: playerName } = req.query;
  const playerId = uuidv4();
  setApiCookie(req, res, "playerId", playerId);

  const { players } = await getOne("game", gameId);

  if (!players) {
    return res.status(404).end({ error: "game not found" });
  }

  if (!playerName) {
    playerName = `Player ${players.length + 1}`;
  }

  const { _id } = await update("game", gameId, {
    players: [...players, { id: playerId, name: playerName, lastActive: null }],
  });

  res.json({
    gameId: _id,
  });
}
