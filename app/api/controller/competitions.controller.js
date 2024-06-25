const axios = require('axios')

exports.getTournamentsDetails = async (req, res) => {

    if (req.params.tid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid
    };

    let configSeasons = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/seasons"
    };

    let configFeaturedEvent = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/featured-events"
    };

    let configOtherInfos = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/meta"
    };

    let seasonsList = {};
    let featuredEvent = [];
    let otherInfo = {};

    await axios.request(configSeasons)
        .then((response) => {
            seasonsList = response.data.seasons ?? null;
        }).catch((e) => {});

    await axios.request(configOtherInfos)
        .then((response) => {

            otherInfo = {
                firstSeasonWinnerName: response.data.meta.firstSeasonWinnerName,
                largestStadium: response.data.meta.largestStadium,
                lastSeasonTopScorers: response.data.meta.lastSeasonTopScorers,
                allTimeTopScorers: response.data.meta.allTimeTopScorers,
                gender: response.data.meta.gender,
                firstSeasonYear: response.data.meta.firstSeasonYear,
                mostTitlesNames: response.data.meta.mostTitlesNames,
            }

        }).catch((e) => {});

    await axios.request(configFeaturedEvent)
        .then((response) => {

            let data = response.data.featuredEvents;

            data.forEach(item => {

                let res = {
                    tournamentId: item.tournament.id,
                    id: item.id,
                    slug: item.slug,
                    startTimestamp: item.startTimestamp,
                    detailId: item.detailId,
                    season: item.season,
                    roundInfo: item.roundInfo,
                    status: item.status,
                    statusTime: item.statusTime,
                    homeTeam: item.homeTeam,
                    homeScore: item.homeScore,
                    awayTeam: item.awayTeam,
                    awayScore: item.awayScore,
                    time: item.time,
                    winnerCode: item.winnerCode,
                    tournament: {
                        id: item.tournament.id,
                        name: item.tournament.name,
                        slug: item.tournament.slug,
                        category: item.tournament.category,
                        priority: item.tournament.priority,
                        competitionType: item.tournament.competitionType,
                        details: item.tournament.uniqueTournament,
                    },
                };
                featuredEvent.push(res);
            });

        }).catch((e) => {});

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }
            let uniqueTournament = response.data.uniqueTournament;

            uniqueTournament["otherInfo"] = otherInfo;
            uniqueTournament["seasons"] = seasonsList;
            uniqueTournament["featuredMatch"] = featuredEvent;

            return res.status(200).json(uniqueTournament ?? {});

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getMatches = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let configRounds = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/rounds"
    };

    let matchesByRounds = [];

    axios.request(configRounds)
        .then(async (response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }


            let results = [];

            for (let i = 0; i < response.data.rounds.length; i++) {

                let round = response.data.rounds[i];
                let res = {};

                let url = "";

                if (round.prefix != null ) {
                    url = "https://api.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/events/round/" + round.round + "/slug/" + round.slug + "/prefix/" + round.prefix;
                } else if (round.slug != null) {
                    url = "https://api.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/events/round/" + round.round + "/slug/" + round.slug;
                } else {
                    url = "https://api.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/events/round/" + round.round;
                }

                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: url
                };

                if (round.prefix !== "Preliminary") {
                    await axios.request(config)
                        .then((response) => {
                            //   console.log(response.data)
                            let events = [];
                            response.data.events.forEach(item => {

                                let res = {
                                    tournamentId: item.tournament.id,
                                    id: item.id,
                                    slug: item.slug,
                                    startTimestamp: item.startTimestamp,
                                    detailId: item.detailId,
                                    season: item.season,
                                    roundInfo: item.roundInfo,
                                    status: item.status,
                                    statusTime: item.statusTime,
                                    homeTeam: item.homeTeam,
                                    homeScore: item.homeScore,
                                    awayTeam: item.awayTeam,
                                    awayScore: item.awayScore,
                                    time: item.time,
                                    tournament: {
                                        id: item.tournament.id,
                                        name: item.tournament.name,
                                        slug: item.tournament.slug,
                                        category: item.tournament.category,
                                        priority: item.tournament.priority,
                                        competitionType: item.tournament.competitionType,
                                        details: item.tournament.uniqueTournament,
                                    },
                                };
                                events.push(res);
                            });

                            res = {
                                round: round.round,
                                name: round.name,
                                slug: round.slug,
                                prefix: round.prefix,
                                matches: events

                            };

                        }).catch((e) => {});

                    results.push(res);

                }

            }
            return res.status(200).json(results.reverse() ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};


exports.getStandings = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/standings/total"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            let results = [];

            let data = response.data.standings;

            for (let i = 0; i < response.data.standings.length; i++) {

                let res = {
                    id: data[i].id,
                    type: data[i].type,
                    name: data[i].name,
                    standings: data[i].rows,
                    tournament: {
                        id: data[i].tournament.id,
                        name: data[i].tournament.name,
                        slug: data[i].tournament.slug,
                        category: data[i].tournament.category,
                        priority: data[i].tournament.priority,
                        competitionType: data[i].tournament.competitionType,
                        details: data[i].tournament.uniqueTournament,
                    },
                    updatedAtTimestamp: data[i].updatedAtTimestamp,
                };

                results.push(res);
            }

            return res.status(200).json(results ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getInfo = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/info"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.info ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getTopTournaments = (req, res) => {

    if (req.params.country == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/config/top-unique-tournaments/" + req.params.country + "/football"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.uniqueTournaments.slice(0, 5) ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getDefaultTournaments = (req, res) => {

    if (req.params.country == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/config/default-unique-tournaments/" + req.params.country + "/football"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.uniqueTournaments ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getTopPlayers = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/top-players/overall"
    };

    let result = {};


    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }



            return res.status(200).json(response.data.topPlayers ?? null);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getTopTeams = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/top-teams/overall"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.topTeams ?? null);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getRounds = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/rounds"
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

exports.getNextMatches = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/events/next/0"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            let results = [];

            let data = response.data.events;

            data.forEach(item => {
                if (!results[item.tournament.id]) {
                    results[item.tournament.id] = [];
                }
                let res = {
                    tournamentId: item.tournament.id,
                    id: item.id,
                    slug: item.slug,
                    startTimestamp: item.startTimestamp,
                    detailId: item.detailId,
                    season: item.season,
                    roundInfo: item.roundInfo,
                    status: item.status,
                    statusTime: item.statusTime,
                    homeTeam: item.homeTeam,
                    homeScore: item.homeScore,
                    awayTeam: item.awayTeam,
                    awayScore: item.awayScore,
                    time: item.time,
                    tournament: {
                        id: item.tournament.id,
                        name: item.tournament.name,
                        slug: item.tournament.slug,
                        category: item.tournament.category,
                        priority: item.tournament.priority,
                        competitionType: item.tournament.competitionType,
                        details: item.tournament.uniqueTournament,
                    },
                };
                results[item.tournament.id].push(res); // Change key from 'name' to 'full_name'
            });

            let newArray = Object.keys(results).map(tournamentId => {
                return {tournamentId: tournamentId, matches: results[tournamentId]};
            });

            return res.status(200).json(newArray ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getFeaturedMatches = (req, res) => {

    if (req.params.tid == null && req.params.sid == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/unique-tournament/" + req.params.tid + "/featured-events"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            let results = [];

            let data = response.data.featuredEvents;

            data.forEach(item => {
                if (!results[item.tournament.id]) {
                    results[item.tournament.id] = [];
                }
                let res = {
                    tournamentId: item.tournament.id,
                    id: item.id,
                    slug: item.slug,
                    startTimestamp: item.startTimestamp,
                    detailId: item.detailId,
                    season: item.season,
                    roundInfo: item.roundInfo,
                    status: item.status,
                    statusTime: item.statusTime,
                    homeTeam: item.homeTeam,
                    homeScore: item.homeScore,
                    awayTeam: item.awayTeam,
                    awayScore: item.awayScore,
                    time: item.time,
                    tournament: {
                        id: item.tournament.id,
                        name: item.tournament.name,
                        slug: item.tournament.slug,
                        category: item.tournament.category,
                        priority: item.tournament.priority,
                        competitionType: item.tournament.competitionType,
                        details: item.tournament.uniqueTournament,
                    },
                };
                results[item.tournament.id].push(res); // Change key from 'name' to 'full_name'
            });

            let newArray = Object.keys(results).map(tournamentId => {
                return {tournamentId: tournamentId, matches: results[tournamentId]};
            });

            return res.status(200).json(newArray ?? []);

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};