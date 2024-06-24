require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const AppError = require("./app/utils/appError");
const errorController = require("./app/utils/errorController");
const logger = require("./app/config/logger");
//const mongodb = require("./app/config/mongodb");

const newsRoute = require("./app/api/route/news.route");
const matchesRoute = require("./app/api/route/matches.route");
const matchDetailsRoute = require("./app/api/route/match_details.route");
const competitionsRoute = require("./app/api/route/competitions.route");
const playerRoute = require("./app/api/route/player.route");
const teamRoute = require("./app/api/route/team.route");
const managerRoute = require("./app/api/route/manager.route");
const globalRoute = require("./app/api/route/global.route");

var parseString = require('xml2js').parseString;

const PORT = process.env.PORT || 5001

app.use(cors());
app.use(express.json());

//mongodb

app.use(function(req, res, next)  {
    //logger.info(req.body);
    let oldSend = res.send;
    res.send = function (data) {
        //   logger.info(JSON.parse(data));
        oldSend.apply(res, arguments);
    }
  //  req.parseString = parseString;
    next();
});



app.get("/", (req, res) => {
    res.status(404).json({
        success:1,
        message: "success"
    })
});

app.get("/api", (req, res) => {
    res.status(404).json({
        success:1,
        message: "success"
    })
});

app.use("/api/football/v1/news", newsRoute)
app.use("/api/football/v1/match", matchesRoute)
app.use("/api/football/v1/match", matchDetailsRoute)
app.use("/api/football/v1/competitions", competitionsRoute)
app.use("/api/football/v1/player", playerRoute)
app.use("/api/football/v1/team", teamRoute)
app.use("/api/football/v1/manager", managerRoute)
app.use("/api/football/v1/global", globalRoute)


app.all('*', (req, res, next) => {
    throw new AppError(`Requested URL ${req.path} not found!`, 404);
})

app.use(errorController)

app.listen(PORT, () => {

    console.log("server up and running on PORT :", PORT);
});