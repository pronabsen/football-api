const axios = require('axios')

//MATCH
exports.getMatchDetails = async (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www.sofascore.com/api/v1/event/' + req.params.id
    };
    let configManagers = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www.sofascore.com/api/v1/event/' + req.params.id + "/managers"
    };

    let configWinProbability = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/win-probability"
    };
    let configPregameForm = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/pregame-form"
    };
    let configFeaturedPlayer = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/featured-players"
    };
    let configBestPlayer = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/best-players/summary"
    };

    let homeManager = null;
    let awayManager = null;
    let winProbability = null;
    let teamForm = null;
    let featuredPlayer = null;
    let bestPlayerSummary = null;

    await axios.request(configManagers)
        .then((response) => {
            let dataHome = response.data.homeManager;
            let dataAway = response.data.awayManager;

            homeManager = {
                id: dataHome.id,
                name: dataHome.name,
                slug: dataHome.slug,
                shortName: dataHome.shortName
            };

            awayManager = {
                id: dataAway.id,
                name: dataAway.name,
                slug: dataAway.slug,
                shortName: dataAway.shortName
            };
        }).catch((e) => {
        });


    await axios.request(configWinProbability)
        .then((response) => {
            winProbability = response.data.winProbability ?? null;
        }).catch((e) => {
        });

    await axios.request(configPregameForm)
        .then((response) => {
            teamForm = response.data ?? null;
        }).catch((e) => {
        });

    await axios.request(configFeaturedPlayer)
        .then((response) => {
            featuredPlayer = response.data ?? null;
        }).catch((e) => {
        });

    await axios.request(configBestPlayer)
        .then((response) => {
            bestPlayerSummary = response.data ?? null;
        }).catch((e) => {
        });


    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            let data = response.data.event;

            let results = {
                id: data.id,
                slug: data.slug,
                startTimestamp: data.startTimestamp,
                currentPeriodStartTimestamp: data.currentPeriodStartTimestamp,
                detailId: data.detailId,
                season: data.season,
                roundInfo: data.roundInfo,
                winnerCode: data.winnerCode,
                status: data.status,
                statusTime: data.statusTime,
                homeTeam: data.homeTeam,
                homeManager: homeManager,
                homeScore: data.homeScore,
                awayTeam: data.awayTeam,
                awayManager: awayManager,
                awayScore: data.awayScore,
                winProbability: winProbability,
                teamForm: teamForm,
                featuredPlayer: featuredPlayer,
                bestPlayerSummary: bestPlayerSummary,
                time: data.time,
                tournament: {
                    id: data.tournament.id,
                    name: data.tournament.name,
                    slug: data.tournament.slug,
                    category: data.tournament.category,
                    priority: data.tournament.priority,
                    competitionType: data.tournament.competitionType,
                    details: data.tournament.uniqueTournament,
                },
                venue: data.venue,
                referee: data.referee,
                seasonStatisticsType: data.seasonStatisticsType,
            };

            return res.status(200).json(results ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchCommentary = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/comments"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.comments ?? []);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchStatistics = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/statistics"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.statistics[0] ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchWinProbability = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/win-probability"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.winProbability ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchLineUps = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/lineups"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchIncidents = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/incidents"
    };

    let incidents = [];

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            if (response.data.incidents != null) {

                const result = response.data.incidents;

                for (let i = 0; i < result.length; i++) {

                    let incident = {
                        'incidentType': result[i].incidentType,
                        'incidentClass': result[i].incidentClass ?? '',
                        'reason': result[i].reason ?? '',
                        'text': result[i].text ?? '',
                        'homeScore': result[i].homeScore ?? null,
                        'awayScore': result[i].awayScore ?? null,
                        'time': result[i].time ?? null,
                        'length': result[i].length ?? null,
                        'addedTime': result[i].addedTime ?? null,
                        'reversedPeriodTime': result[i].reversedPeriodTime ?? null,
                        'playerName': result[i].playerName ?? null,
                        'player': result[i].player ?? null,
                        'isHome': result[i].isHome ?? null,
                        'confirmed': result[i].confirmed ?? null,
                        'assist1': result[i].assist1 ?? null,
                        'assist2': result[i].assist2 ?? null,
                        'playerIn': result[i].playerIn ?? null,
                        'playerOut': result[i].playerOut ?? null,
                        'injury': result[i].injury ?? null,
                    };

                    incidents.push(incident);
                }
            }


            return res.status(200).json(incidents ?? []);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchGraphs = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/graph"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatchShotMap = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/shotmap"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.shotmap ?? []);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};


//TEAM
exports.getTeamForm = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/pregame-form"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getTeamHead2Head = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/h2h"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getTeamsManagers = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/managers"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};


//PLAYER
exports.getShotMapPlayer = (req, res) => {

    if (req.params.id == null && req.params.player == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/shotmap/player/" + req.params.player
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.shotmap ?? []);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getBestPlayersSummery = (req, res) => {

    if (req.params.id == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/event/" + req.params.id + "/best-players/summary"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};