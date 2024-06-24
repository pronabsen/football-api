const {getManagerInfo, getManagerCareer} = require("../controller/manager.controller");

const router = require("express").Router();

router.get("/:id", getManagerInfo);
router.get("/career/:id", getManagerCareer);


module.exports = router;
