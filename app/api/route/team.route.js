const {getTeamInfo, getTeamTournaments, getTeamNextMatches, getTeamRecentMatches, getTeamSquads, getRanking} = require("../controller/team.controller");

const router = require("express").Router();

router.get("/details/:id", getTeamInfo);

router.get("/tournaments/:id", getTeamTournaments);
router.get("/recent/matches/:id", getTeamRecentMatches);
router.get("/next/matches/:id", getTeamNextMatches);
router.get("/squads/:id", getTeamSquads);
router.get("/rankings", getRanking);


module.exports = router;
