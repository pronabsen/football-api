const {getStandings, getInfo, getTopPlayers, getTopTeams, getRounds, getNextMatches, getFeaturedMatches,
    getDefaultTournaments, getTopTournaments, getTournamentsDetails, getMatches
} = require("../controller/competitions.controller");

const router = require("express").Router();

router.get("/default/:country", getDefaultTournaments);
router.get("/top/:country", getTopTournaments);

router.get("/:tid", getTournamentsDetails);
router.get("/:tid/season/:sid/info", getInfo);
router.get("/:tid/season/:sid/matches", getMatches);

router.get("/:tid/season/:sid/top-players", getTopPlayers);
router.get("/:tid/season/:sid/top-teams", getTopTeams);
router.get("/:tid/season/:sid/rounds", getRounds);
router.get("/:tid/season/:sid/next", getNextMatches);

router.get("/:tid/featured", getFeaturedMatches);
router.get("/:tid/season/:sid/standings", getStandings);

module.exports = router;
