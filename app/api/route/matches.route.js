const {getLiveMatches, getScheduleMatches} = require("../controller/matches.controller");
const router = require("express").Router();

// LIST
router.get("/live", getLiveMatches);
router.get("/schedule", getScheduleMatches);


module.exports = router;