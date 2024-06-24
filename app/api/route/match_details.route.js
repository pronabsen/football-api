const {getMatchDetails, getMatchCommentary, getMatchStatistics, getMatchWinProbability, getMatchLineUps,
    getMatchIncidents, getBestPlayersSummery, getTeamForm, getTeamHead2Head, getTeamsManagers, getMatchGraphs,
    getMatchShotMap, getShotMapPlayer
} = require("../controller/match_details.controller");
const router = require("express").Router();

// LIST
router.get("/:id", getMatchDetails);
router.get("/commentary/:id", getMatchCommentary);
router.get("/statistics/:id", getMatchStatistics);
router.get("/lineups/:id", getMatchLineUps);
router.get("/incidents/:id", getMatchIncidents);
router.get("/graphs/:id", getMatchGraphs);
router.get("/shotmap/:id", getMatchShotMap);

//Team
router.get("/teams-head2head/:id", getTeamHead2Head);

//Player
router.get("/shotmap/:id/player/:player", getShotMapPlayer);

//ALREADY AVAILABLE
router.get("/win-probability/:id", getMatchWinProbability);
router.get("/teams-form/:id", getTeamForm);
router.get("/teams-managers/:id", getTeamsManagers);
router.get("/best-players/summary/:id", getBestPlayersSummery);
router.get("/featured-player/:id", getBestPlayersSummery);

module.exports = router;