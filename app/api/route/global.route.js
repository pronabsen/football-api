const {getSearch} = require("../controller/global.controller");

const router = require("express").Router();

router.get("/search", getSearch);


module.exports = router;