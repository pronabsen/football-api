const axios = require("axios");


exports.getPlayerInfo = async (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let about = '';
    axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/seo/content/player/" + req.params.id + "/en"
    })
        .then((response) => {
            if (response.status === 200) {
                about = response.data.content.about;
            }
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: "https://www.sofascore.com/api/v1/player/" + req.params.id
            };

            axios.request(config)
                .then((response) => {
                    if (response.status === 500) {
                        return res.status(404).json({status: false, message: "Something went wrong", response: []});
                    }
                    if (!response.data) {
                        return res.status(404).json({status: false, message: "Record not Found", response: []});
                    }

                    let data = response.data.player;

                    let results = {
                        id: data.id,
                        slug: data.slug,
                        name: data.name,
                        shortName: data.shortName,
                        gender: data.gender,
                        shirtNumber: data.shirtNumber,
                        dateOfBirthTimestamp: data.dateOfBirthTimestamp,
                        height: data.height,
                        jerseyNumber: data.jerseyNumber,
                        position: data.position,
                        preferredFoot: data.preferredFoot,
                        country: data.country,
                        contractUntilTimestamp: data.contractUntilTimestamp,
                        proposedMarketValue: data.proposedMarketValue,
                        team: data.team,
                        about: about,
                    };

                    return res.status(200).json(results ?? null);

                })
                .catch((error) => {
                    return res.status(404).json({status: false, message: error.message, response: []});
                });
        });


};

exports.getPlayerNationalTeamStatistics = (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/national-team-statistics"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.statistics[0] ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getAttributeOverViews = (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/attribute-overviews"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.averageAttributeOverviews[0] ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getPlayerRecentMatches = (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/events/last/0"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
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
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getPlayerRecentSummary = (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/last-year-summary"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getPlayerSeasonStatistics = (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/statistics/seasons"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.uniqueTournamentSeasons ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getPlayerSeasonStatisticsDetails = (req, res) => {

    if (req.params.id == null || req.params.tid == null || req.params.sid == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/unique-tournament/" + req.params.tid + "/season/" + req.params.sid + "/statistics/overall"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getPlayerCharacteristics = (req, res) => {

    if (req.params.id == null) {
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/player/" + req.params.id + "/characteristics"
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(404).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.uniqueTournamentSeasons ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};