import { getAll, insert } from "../../../utils/mongodb";
import { getApiCookie, setApiCookie } from "../../../utils/cookie";
import { v4 as uuidv4 } from "uuid";
import { LANG_EN } from "../../../utils/constants";

export default async function newGameRoute(req, res) {
  const {
    name: playerName = "Player 1",
    lang: language = LANG_EN,
    dia: supportAccents = false,
  } = req.query;
  const playerId = uuidv4();
  setApiCookie(req, res, "playerId", playerId);

  // let code;
  // let gameWithCodeExists;
  // do {
  //   code = uuidv4().split("-")[0];
  //   gameWithCodeExists = getAll("game", { code }).length > 0;
  // } while (gameWithCodeExists);

  const { _id } = await insert("game", {
    // code,
    language,
    supportAccents,
    inProgress: false,
    players: [
      { id: playerId, name: playerName, owner: true, lastActive: null },
    ],
  });

  res.json({
    gameId: _id,
  });
}
