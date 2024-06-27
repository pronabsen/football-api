const {
    getPlayerInfo, getPlayerNationalTeamStatistics, getAttributeOverViews, getPlayerRecentMatches,
    getPlayerRecentSummary, getPlayerSeasonStatistics, getPlayerCharacteristics, getPlayerSeasonStatisticsDetails
} = require("../controller/player.controller");

const router = require("express").Router();

router.get("/:id", getPlayerInfo);
router.get("/national-team-statistics/:id", getPlayerNationalTeamStatistics);
router.get("/attribute/:id", getAttributeOverViews);
router.get("/recent/matches/:id", getPlayerRecentMatches);
router.get("/recent/summary/:id", getPlayerRecentSummary);
router.get("/season/statistics/:id", getPlayerSeasonStatistics);
router.get("/:id/tournament/:tid/season/:sid/statistics", getPlayerSeasonStatisticsDetails);

//router.get("/characteristics/:id", getPlayerCharacteristics);


module.exports = router;
