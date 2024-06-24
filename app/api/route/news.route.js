const {getNews, getNewsDetails} = require("../controller/news.controller");
const router = require("express").Router();

router.get("/", getNews);
router.get("/details", getNewsDetails);


module.exports = router;